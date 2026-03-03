import React, { useState} from"react"








function PaymentModal({ course, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "" });
  const set = (k) => (e) => setCard((p) => ({ ...p, [k]: e.target.value }));

  const pay = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
    }, 2000);
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

        {step === 1 && (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              Complete Enrollment
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 14,
                marginBottom: 20,
              }}
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

        {step === 2 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
                animation: "spin 1s linear infinite",
              }}
            >
              ⏳
            </div>
            <h3 style={{ fontSize: 24 }}>Processing Payment…</h3>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              Please wait while we confirm your transaction.
            </p>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Payment Successful!
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 15,
                marginBottom: 28,
              }}
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



export default PaymentModal