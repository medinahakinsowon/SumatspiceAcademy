import React, { useRef } from "react";

// ─── Beautiful in-app certificate + print-to-PDF ─────────────────────────────
function CertificateView({ certificate, onClose }) {
  const certRef = useRef();

  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificate.course?.title}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${certRef.current.outerHTML}
          <script>setTimeout(() => window.print(), 500);<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div style={{ maxWidth: 860, width: "100%" }}>
        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <button
            onClick={handleDownload}
            style={{
              background: "linear-gradient(135deg, #2d6a4f, #1a3a2a)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ⬇ Download PDF
          </button>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              padding: "10px 20px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Certificate */}
        <div
          ref={certRef}
          style={{
            background: "#fffdf8",
            border: "2px solid #c9a84c",
            borderRadius: 4,
            padding: "60px 72px",
            textAlign: "center",
            position: "relative",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Decorative corner borders */}
          {[
            { top: 12, left: 12 },
            { top: 12, right: 12 },
            { bottom: 12, left: 12 },
            { bottom: 12, right: 12 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: 40,
                height: 40,
                borderTop: i < 2 ? "3px solid #c9a84c" : "none",
                borderBottom: i >= 2 ? "3px solid #c9a84c" : "none",
                borderLeft: i % 2 === 0 ? "3px solid #c9a84c" : "none",
                borderRight: i % 2 === 1 ? "3px solid #c9a84c" : "none",
              }}
            />
          ))}

          {/* Header */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>🌿</span>
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a6d2e",
              marginBottom: 4,
            }}
          >
            SumatspiceAcademy
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 42,
              fontWeight: 700,
              color: "#1a1a1a",
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            Certificate of Completion
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "20px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(to right, transparent, #c9a84c)",
              }}
            />
            <span style={{ color: "#c9a84c", fontSize: 18 }}>✦</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(to left, transparent, #c9a84c)",
              }}
            />
          </div>

          <div
            style={{
              color: "#555",
              fontSize: 15,
              marginBottom: 24,
              letterSpacing: 0.5,
            }}
          >
            This is to certify that
          </div>

          {/* Student name */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 52,
              fontWeight: 700,
              color: "#2d6a4f",
              lineHeight: 1,
              marginBottom: 20,
              borderBottom: "2px solid #e8d5a0",
              paddingBottom: 16,
              display: "inline-block",
              minWidth: 400,
            }}
          >
            {certificate.student?.name}
          </div>

          <div
            style={{
              color: "#555",
              fontSize: 15,
              margin: "20px 0 12px",
              letterSpacing: 0.5,
            }}
          >
            has successfully completed the course
          </div>

          {/* Course name */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 30,
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: 32,
              lineHeight: 1.3,
              padding: "12px 32px",
              background: "linear-gradient(135deg, #f9f3e3, #fdf8ee)",
              border: "1px solid #e8d5a0",
              borderRadius: 4,
              display: "inline-block",
            }}
          >
            {certificate.course?.title}
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "8px 0 28px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(to right, transparent, #c9a84c)",
              }}
            />
            <span style={{ color: "#c9a84c", fontSize: 14 }}>✦</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(to left, transparent, #c9a84c)",
              }}
            />
          </div>

          {/* Footer info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Date of Completion
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                {issuedDate}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d6a4f, #1a3a2a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 6px",
                }}
              >
                <span style={{ fontSize: 32 }}>🌿</span>
              </div>
              <div style={{ fontSize: 10, color: "#999", letterSpacing: 1 }}>
                OFFICIAL SEAL
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Certificate ID
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#333",
                  letterSpacing: 2,
                }}
              >
                {certificate.certificateId}
              </div>
            </div>
          </div>
        </div>

        {/* Verify link */}
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
          }}
        >
          Verify at: spiceacademy.com/verify/{certificate.certificateId}
        </div>
      </div>
    </div>
  );
}

export default CertificateView;
