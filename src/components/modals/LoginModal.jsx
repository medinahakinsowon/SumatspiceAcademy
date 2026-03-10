import React, { useState } from "react";

const API_URL = "http://localhost:4000/api";

function LoginModal({ onClose, onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !pass) {
      setErr("Please fill in all fields.");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      // ─── POST /api/auth/login ───────────────────────────────────────────
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Login failed. Please try again.");
        return;
      }

      // ─── Success — store token and pass user up ─────────────────────────
      localStorage.setItem("token", data.token);
      onLogin(data.data.user);
    } catch (error) {
      setErr("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 36 }}>🌿</span>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 6 }}>
            Welcome Back
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            Sign in to your SpiceAcademy account
          </p>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                display: "block",
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                display: "block",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              disabled={loading}
            />
          </div>

          <button
            className="btn-primary"
            style={{
              marginTop: 6,
              padding: "13px",
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handle}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          Don't have an account?{" "}
          <span
            style={{
              color: "var(--terracotta)",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={switchToRegister}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
