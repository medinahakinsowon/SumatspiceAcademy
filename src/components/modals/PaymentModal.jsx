import React, { useState, useEffect, useRef } from "react";

const API_URL = "https://academy-db.vercel.app/api";

const loadPaystackScript = () =>
  new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });

function PaymentModal({ course, onClose, onSuccess, user }) {
  const [step, setStep] = useState("confirm");
  const [errorMsg, setErrorMsg] = useState("");
  const [useMock, setUseMock] = useState(false);
  const [reference, setReference] = useState(null);
  const pollRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  useEffect(() => {
    loadPaystackScript();
  }, []);

  // ─── Poll backend every 2s to check if enrollment was created ────────────
  const startPolling = (ref) => {
    const token = localStorage.getItem("token");
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${API_URL}/payments/verify/${ref}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          stopPolling();
          setStep("success");
          setTimeout(() => onSuccessRef.current(), 2000);
        }
      } catch (_) {}
      // Stop polling after 30 seconds
      if (attempts >= 15) {
        stopPolling();
        setStep("success");
        setTimeout(() => onSuccessRef.current(), 1000);
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // Clean up polling on unmount
  useEffect(() => () => stopPolling(), []);

  const handlePay = async () => {
    setErrorMsg("");
    const token = localStorage.getItem("token");

    try {
      // ── Mock payment ────────────────────────────────────────────────
      if (useMock) {
        setStep("processing");
        const res = await fetch(`${API_URL}/payments/mock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId: course._id || course.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Mock payment failed.");
        setStep("success");
        setTimeout(() => onSuccessRef.current(), 1800);
        return;
      }

      // ── Step 1: Initiate ────────────────────────────────────────────
      const initRes = await fetch(`${API_URL}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: course._id || course.id }),
      });
      const initData = await initRes.json();
      if (!initRes.ok)
        throw new Error(initData.message || "Could not initiate payment.");

      const { reference: ref, accessCode } = initData;
      setReference(ref);

      // ── Step 2: Open Paystack popup ─────────────────────────────────
      await loadPaystackScript();
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user?.email,
        amount: Math.round(course.price * 100),
        currency: "NGN",
        ref,
        access_code: accessCode,
        onSuccess: () => {
          // Start polling — don't rely on this callback for UI updates
          startPolling(ref);
        },
        onCancel: () => {
          stopPolling();
          setStep("confirm");
        },
      });

      setStep("processing");
      handler.openIframe();
    } catch (err) {
      setStep("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  // Manual verify button on processing screen
  const handleManualVerify = async () => {
    if (!reference) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/payments/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        stopPolling();
        setStep("success");
        setTimeout(() => onSuccessRef.current(), 1500);
      } else {
        setErrorMsg("Payment not confirmed yet. Please wait a moment.");
      }
    } catch (_) {
      setErrorMsg("Could not verify. Please try again.");
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={step === "confirm" ? onClose : undefined}
    >
      <div
        className="modal-box"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Confirm ─────────────────────────────────────────────────── */}
        {step === "confirm" && (
          <>
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
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 40 }}>🌿</span>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>
                Enroll in Course
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                background: "var(--cream)",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 24,
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={course.thumb || course.thumbnail}
                alt=""
                style={{
                  width: 72,
                  height: 52,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--charcoal)",
                    marginBottom: 4,
                  }}
                >
                  {course.title}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>
                    {course.level}
                  </span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--terracotta)",
                    }}
                  >
                    ₦{(course.price * 1500).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              {[
                "Lifetime access to all lessons",
                "Progress tracking & completion certificate",
                "Watch on any device, anytime",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "var(--forest)", fontWeight: 700 }}>
                    ✓
                  </span>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
            {window.location.hostname === "localhost" && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                <input
                  type="checkbox"
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                />
                Use mock payment (dev mode)
              </label>
            )}
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: 16 }}
              onClick={handlePay}
            >
              {useMock
                ? "Pay (Mock)"
                : `Pay ₦${(course.price * 1500).toLocaleString()} with Paystack`}
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 10,
              }}
            >
              🔒 Secured by Paystack · SSL encrypted
            </p>
          </>
        )}

        {/* ── Processing ──────────────────────────────────────────────── */}
        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Confirming Payment…
            </h3>
            <p
              style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}
            >
              Complete the payment in the Paystack window.
            </p>
            {reference && (
              <button
                className="btn-primary"
                style={{ padding: "10px 24px", fontSize: 14 }}
                onClick={handleManualVerify}
              >
                I've Paid — Confirm Now
              </button>
            )}
            {errorMsg && (
              <p style={{ color: "#c62828", fontSize: 13, marginTop: 12 }}>
                {errorMsg}
              </p>
            )}
            <button
              style={{
                display: "block",
                margin: "16px auto 0",
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: 12,
                textDecoration: "underline",
              }}
              onClick={() => {
                stopPolling();
                setStep("confirm");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Success ─────────────────────────────────────────────────── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              Enrollment Confirmed!
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 4 }}>
              You now have access to
            </p>
            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "var(--forest)",
                marginBottom: 24,
              }}
            >
              {course.title}
            </p>
            <button
              className="btn-primary"
              style={{ padding: "12px 32px", fontSize: 15 }}
              onClick={() => onSuccessRef.current()}
            >
              Go to Dashboard →
            </button>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {step === "error" && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Payment Failed
            </h3>
            <p style={{ color: "#c62828", fontSize: 14, marginBottom: 24 }}>
              {errorMsg}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                className="btn-primary"
                onClick={() => setStep("confirm")}
              >
                Try Again
              </button>
              <button className="btn-outline" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
