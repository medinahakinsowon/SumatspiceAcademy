


import React, { useState } from "react"




function RegisterModal({ onClose, onRegister, switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handle = () => {
    if (!form.name || !form.email || !form.pass) {
      setErr("Please fill in all fields.");
      return;
    }
    onRegister(form);
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
              placeholder="Min. 8 characters"
              value={form.pass}
              onChange={set("pass")}
              onKeyDown={(e) => e.key === "Enter" && handle()}
            />
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: 6, padding: "13px" }}
            onClick={handle}
          >
            Create Account →
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