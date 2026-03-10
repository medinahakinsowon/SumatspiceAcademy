import React, { useState } from "react";

const API_URL = "http://localhost:4000/api";

function RegisterModal({ onClose, onRegister, switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handle = async () => {
    // ─── Client-side validation ───────────────────────────────────────────
    if (!form.name || !form.email || !form.pass) {
      setErr("Please fill in all fields.");
      return;
    }
    if (form.pass.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      // ─── POST /api/auth/register ────────────────────────────────────────
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Server returned a validation or conflict error
        setErr(data.message || "Registration failed. Please try again.");
        return;
      }

      // ─── Success — store token and pass user up ─────────────────────────
      localStorage.setItem("token", data.token);
      onRegister(data.data.user);
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
            Create Account
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            Join 8,400+ spice learners
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
              Full Name
            </label>
            <input
              placeholder="Adaeze Okonkwo"
              value={form.name}
              onChange={set("name")}
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
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set("email")}
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
              placeholder="Min. 6 characters"
              value={form.pass}
              onChange={set("pass")}
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
            {loading ? "Creating Account..." : "Create Account →"}
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
          Already have an account?{" "}
          <span
            style={{
              color: "var(--terracotta)",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={switchToLogin}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
