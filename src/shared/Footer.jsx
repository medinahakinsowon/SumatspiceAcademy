import React from "react"





function Footer() {
    return (
      <div style={{ background: "#111", padding: "40px", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>🌿</span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            SumatspiceAcademy
          </span>
        </div>
        <p style={{ color: "#666", fontSize: 13 }}>
          © 2026 SumatspiceAcademy. Empowering Africa's Spice Knowledge Economy.
        </p>
      </div>
    );
}




export default Footer;