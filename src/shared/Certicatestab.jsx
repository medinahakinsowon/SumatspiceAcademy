// Replace the "CERTIFICATES" section in Dashboard.jsx with this

// Add to Dashboard imports:
// import CertificateView from "../components/CertificateView";
// Add to Dashboard state:
// const [viewingCert, setViewingCert] = useState(null);
// const [certificates, setCertificates] = useState([]);

// Add this fetch inside the fetchDashboard useEffect alongside enrollments:
// const certRes = await fetch(`${API_URL}/certificates/my`, { headers: { Authorization: `Bearer ${token}` } });
// const certData = await certRes.json();
// if (certRes.ok) setCertificates(certData.data.certificates);

{
  /* ─── CERTIFICATES TAB ──────────────────────────────────────────────── */
}
{
  !loadingData && active === "certificate" && (
    <>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
        My Certificates
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>
        Certificates are issued by the admin after course review.
      </p>

      {certificates.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "60px",
            textAlign: "center",
            border: "2px dashed var(--border)",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            No Certificates Yet
          </h3>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>
            Complete your enrolled courses and an admin will review and issue
            your certificate.
          </p>
          <button
            className="btn-primary"
            onClick={() => setActive("my-courses")}
          >
            Go to My Courses →
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {certificates.map((cert) => (
            <div
              key={cert._id}
              style={{
                background: "linear-gradient(135deg, #fffdf4, #fdf8ee)",
                border: "2px solid #c9a84c",
                borderRadius: 12,
                padding: 28,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gold accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background:
                    "linear-gradient(90deg, #c9a84c, #e8d5a0, #c9a84c)",
                }}
              />
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#8a6d2e",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                Certificate of Completion
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                  color: "#1a1a1a",
                }}
              >
                {cert.course?.title}
              </h3>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                Issued:{" "}
                {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#8a6d2e",
                  background: "rgba(201,168,76,0.1)",
                  padding: "4px 10px",
                  borderRadius: 4,
                  display: "inline-block",
                  marginBottom: 20,
                  letterSpacing: 1,
                }}
              >
                {cert.certificateId}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: "10px" }}
                  onClick={() => setViewingCert(cert)}
                >
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate modal */}
      {viewingCert && (
        <CertificateView
          certificate={viewingCert}
          onClose={() => setViewingCert(null)}
        />
      )}
    </>
  );
}




// Add this as a new tab in AdminPanel.jsx
// 1. Add to tabs array: { key: "certificates", icon: "🏆", label: "Certificates" }
// 2. Add import: import CertificateView from "../components/CertificateView";
// 3. Add render: {tab === "certificates" && <CertificatesTab />}


