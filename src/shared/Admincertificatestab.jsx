// Add this as a new tab in AdminPanel.jsx
// 1. Add to tabs array: { key: "certificates", icon: "🏆", label: "Certificates" }
// 2. Add import: import CertificateView from "../components/CertificateView";
// 3. Add render: {tab === "certificates" && <CertificatesTab />}

function CertificatesTab() {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);
  const [msg, setMsg] = useState({});
  const [viewingCert, setViewingCert] = useState(null);
  const [view, setView] = useState("pending"); // "pending" | "issued"

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [eRes, cRes] = await Promise.all([
        api("/enrollments?limit=100"),
        api("/certificates"),
      ]);
      const eData = await eRes.json();
      const cData = await cRes.json();
      setEnrollments(eData.data?.enrollments || []);
      setCertificates(cData.data?.certificates || []);
      setLoading(false);
    };
    load();
  }, []);

  const issue = async (enrollmentId) => {
    setIssuing(enrollmentId);
    setMsg({});
    const res = await api(`/certificates/issue/${enrollmentId}`, {
      method: "POST",
    });
    const data = await res.json();
    setIssuing(null);
    if (res.ok) {
      setMsg({ [enrollmentId]: "✅ Certificate issued!" });
      // Refresh
      const [eRes, cRes] = await Promise.all([
        api("/enrollments?limit=100"),
        api("/certificates"),
      ]);
      const eData = await eRes.json();
      const cData = await cRes.json();
      setEnrollments(eData.data?.enrollments || []);
      setCertificates(cData.data?.certificates || []);
    } else {
      setMsg({ [enrollmentId]: "❌ " + (data.message || "Error") });
    }
  };

  const revoke = async (certId) => {
    if (!window.confirm("Revoke this certificate?")) return;
    await api(`/certificates/${certId}`, { method: "DELETE" });
    const [eRes, cRes] = await Promise.all([
      api("/enrollments?limit=100"),
      api("/certificates"),
    ]);
    const eData = await eRes.json();
    const cData = await cRes.json();
    setEnrollments(eData.data?.enrollments || []);
    setCertificates(cData.data?.certificates || []);
  };

  // Enrollments without a certificate yet
  const issuedEnrollmentIds = new Set(
    certificates.map((c) => c.enrollment?.toString()),
  );
  const pending = enrollments.filter(
    (e) => !issuedEnrollmentIds.has(e._id?.toString()),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>
          Certificates
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["pending", "issued"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                ...btnSmall,
                background: view === v ? "#2d6a4f" : "#f0ebe4",
                color: view === v ? "#fff" : "#555",
                textTransform: "capitalize",
              }}
            >
              {v}{" "}
              {v === "pending"
                ? `(${pending.length})`
                : `(${certificates.length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading…</p>
      ) : view === "pending" ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {["Student", "Course", "Progress", "Enrolled", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No pending certificates.
                  </td>
                </tr>
              ) : (
                pending.map((e, i) => (
                  <tr
                    key={e._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {e.student?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {e.course?.title || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "#f0ebe4",
                            borderRadius: 3,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${e.progressPercent || 0}%`,
                              background:
                                e.progressPercent === 100
                                  ? "#2d6a4f"
                                  : "#c9a84c",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, color: "#888" }}>
                          {e.progressPercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {msg[e._id] ? (
                        <span
                          style={{
                            fontSize: 12,
                            color: msg[e._id].startsWith("✅")
                              ? "#2e7d32"
                              : "#c62828",
                          }}
                        >
                          {msg[e._id]}
                        </span>
                      ) : (
                        <button
                          onClick={() => issue(e._id)}
                          disabled={issuing === e._id}
                          style={{
                            ...btnSmall,
                            background: "#e8f5e9",
                            color: "#2e7d32",
                          }}
                        >
                          {issuing === e._id ? "Issuing…" : "Issue Certificate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {[
                  "Certificate ID",
                  "Student",
                  "Course",
                  "Issued",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certificates.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No certificates issued yet.
                  </td>
                </tr>
              ) : (
                certificates.map((c, i) => (
                  <tr
                    key={c._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#8a6d2e",
                        fontWeight: 700,
                      }}
                    >
                      {c.certificateId}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {c.student?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {c.course?.title || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setViewingCert(c)}
                          style={{
                            ...btnSmall,
                            background: "#e8f5e9",
                            color: "#2e7d32",
                          }}
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => revoke(c._id)}
                          style={{
                            ...btnSmall,
                            background: "#fce4ec",
                            color: "#c62828",
                          }}
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewingCert && (
        <CertificateView
          certificate={viewingCert}
          onClose={() => setViewingCert(null)}
        />
      )}
    </div>
  );
}
