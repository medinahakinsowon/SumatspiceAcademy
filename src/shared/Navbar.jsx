import React from "react";
import Avatar from "../shared/Avatar";

function Navbar({
  page,
  setPage,
  user,
  setShowLogin,
  setShowRegister,
  logout,
  onEnroll,
}) {
  return (
    <nav
      style={{
        background: "linear-gradient(135deg, var(--forest) 0%, #1a3429 100%)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setPage("home")}
      >
        <span style={{ fontSize: 26 }}>🌿</span>
        <div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            SumatspiceAcademy
          </div>
          <div
            style={{
              color: "var(--gold-light)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Natural Spice Training
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {["home", "courses", "about"].map((p) => (
          <span
            key={p}
            className="nav-link"
            onClick={() => setPage(p)}
            style={{
              color: page === p ? "var(--gold-light)" : undefined,
              textTransform: "capitalize",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {user ? (
          <>
            <Avatar name={user.name} size={34} />
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
              {user.name.split(" ")[0]}
            </span>
            {/* Only show Dashboard if user has enrollments */}
            {user.hasEnrollment && (
              <button
                className="btn-primary"
                style={{ padding: "7px 16px", fontSize: 13 }}
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>
            )}
            <button
              className="btn-outline"
              style={{
                padding: "5px 14px",
                fontSize: 13,
                borderColor: "rgba(255,255,255,0.4)",
                color: "rgba(255,255,255,0.8)",
              }}
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-outline"
              style={{
                padding: "7px 20px",
                fontSize: 13,
                borderColor: "rgba(255,255,255,0.5)",
                color: "rgba(255,255,255,0.9)",
              }}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className="btn-primary"
              style={{ padding: "7px 20px", fontSize: 13 }}
              onClick={() => setShowRegister(true)}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
