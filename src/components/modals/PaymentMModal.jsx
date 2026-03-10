import React, { useState } from "react";

const API_URL = "http://localhost:4000/api";

function PaymentModal({ course, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setCard((p) => ({ ...p, [k]: e.target.value }));

  const pay = async () => {
    // ─── Basic client-side validation ────────────────────────────────────
    if (!card.name || !card.num || !card.exp || !card.cvv) {
      setErr("Please fill in all card details.");
      return;
    }

    setErr("");
    setStep(2); // show processing screen
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErr("You must be logged in to enroll.");
        setStep(1);
        return;
      }

      // ─── POST /api/payments/mock ──────────────────────────────────────
      // Uses the mock endpoint which creates the payment + enrollment in one go
      const res = await fetch(`${API_URL}/payments/mock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: course._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Payment failed. Please try again.");
        setStep(1);
        return;
      }

      // ─── Success ──────────────────────────────────────────────────────
      setStep(3);
    } catch (error) {
      setErr("Network error. Please check your connection and try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 20,
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: "var(--muted)",
          }}
        >
          ×
        </button>

        {/* ─── Step 1: Card Form ─────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              Complete Enrollment
            </h2>
            <p
              style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}
            >
              Secure checkout — 256-bit SSL encrypted
            </p>

            <div
              style={{
                background: "var(--ivory)",
                borderRadius: 8,
                padding: "14px 16px",
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {course.title}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>
                  {course.lessons} lessons · {course.duration}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "var(--terracotta)",
                }}
              >
                ${course.price}
              </div>
            </div>

            {err && (
              <div
                style={{
                  background: "#fff0ee",
                  border: "1px solid #ffccbc",
                  borderRadius: 6,
                  padding: "10px 14px",
                  marginBottom: 16,
                  color: "#c62828",
                  fontSize: 13,
                }}
              >
                {err}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                placeholder="Cardholder Name"
                value={card.name}
                onChange={set("name")}
              />
              <input
                placeholder="Card Number (16 digits)"
                value={card.num}
                onChange={set("num")}
                maxLength={19}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <input
                  placeholder="MM / YY"
                  value={card.exp}
                  onChange={set("exp")}
                  maxLength={7}
                />
                <input
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={set("cvv")}
                  maxLength={4}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              style={{
                width: "100%",
                marginTop: 20,
                padding: "13px",
                fontSize: 15,
              }}
              onClick={pay}
            >
              Pay ${course.price} Securely 🔒
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginTop: 16,
              }}
            >
              {["Visa", "Mastercard", "PayPal", "Stripe"].map((b) => (
                <span
                  key={b}
                  style={{
                    background: "var(--ivory)",
                    borderRadius: 4,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </>
        )}

        {/* ─── Step 2: Processing ───────────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h3 style={{ fontSize: 24 }}>Processing Payment…</h3>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              Please wait while we confirm your transaction.
            </p>
          </div>
        )}

        {/* ─── Step 3: Success ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Payment Successful!
            </h3>
            <p
              style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}
            >
              You're now enrolled in <strong>{course.title}</strong>. Let's
              start learning!
            </p>
            <button
              className="btn-primary"
              style={{ padding: "12px 36px", fontSize: 15 }}
              onClick={onSuccess}
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
