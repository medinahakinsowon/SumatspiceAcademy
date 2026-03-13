import React, { useState, useEffect, useRef } from "react";
import Avatar from "../shared/Avatar";

const API_URL = "http://localhost:4000/api";

function Dashboard({ user, setPage, logout, openPlayer }) {
  const [active, setActive] = useState("overview");
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    course: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef();

  // ─── Fetch real enrollments + stats from backend ─────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoadingData(true);
      const token = localStorage.getItem("token");
      try {
        const [enrollRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/enrollments/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/users/my-stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const enrollData = await enrollRes.json();
        const statsData = await statsRes.json();
        if (enrollRes.ok) setEnrollments(enrollData.data.enrollments);
        if (statsRes.ok) setStats(statsData.data);
      } catch (_) {
      } finally {
        setLoadingData(false);
      }
    };
    fetchDashboard();
  }, []);

  const nav = [
    { key: "overview", icon: "🏠", label: "Overview" },
    { key: "my-courses", icon: "📚", label: "My Courses" },
    { key: "progress", icon: "📊", label: "My Progress" },
    { key: "certificate", icon: "🏆", label: "Certificates" },
    { key: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          width: 240,
          background: "linear-gradient(180deg, var(--forest) 0%, #1a3429 100%)",
          padding: "24px 16px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "0 8px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={user.name} size={42} />
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                {user.name}
              </div>
              <div style={{ color: "var(--gold-light)", fontSize: 11 }}>
                Student
              </div>
            </div>
          </div>
        </div>
        {nav.map((n) => (
          <div
            key={n.key}
            className={`sidebar-item ${active === n.key ? "active" : ""}`}
            onClick={() => setActive(n.key)}
          >
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span>{n.label}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: 24,
            paddingTop: 16,
          }}
        >
          <div className="sidebar-item" onClick={() => setPage("courses")}>
            <span style={{ fontSize: 18 }}>📚</span>
            <span>Browse Courses</span>
          </div>
          <div
            className="sidebar-item"
            onClick={() => {
              logout();
              setPage("home");
            }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, background: "var(--cream)", overflow: "auto" }}>
        <div style={{ padding: "32px 40px" }}>
          {loadingData && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--muted)",
              }}
            >
              Loading your dashboard…
            </div>
          )}

          {/* ─── OVERVIEW ──────────────────────────────────────────────── */}
          {!loadingData && active === "overview" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 36, fontWeight: 700 }}>
                  Good morning, {user.name.split(" ")[0]} 👋
                </h2>
                <p style={{ color: "var(--muted)", marginTop: 4 }}>
                  Continue your spice mastery journey.
                </p>
              </div>

              {/* Stats cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {[
                  ["📚", "Courses Enrolled", stats?.enrolledCourses ?? 0],
                  ["✅", "Lessons Completed", stats?.totalLessons ?? 0],
                  ["⏱️", "Hours Learned", `${stats?.totalHoursWatched ?? 0}h`],
                  ["🏆", "Certificates", stats?.certificates ?? 0],
                ].map(([ic, lb, vl]) => (
                  <div
                    key={lb}
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      padding: "20px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{ic}</div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: "var(--terracotta)",
                      }}
                    >
                      {vl}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {lb}
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue learning */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: "24px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h3
                    style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}
                  >
                    Continue Learning
                  </h3>
                  {enrollments.length === 0 && (
                    <p style={{ color: "var(--muted)" }}>
                      No courses yet. Enroll in a course to get started.
                    </p>
                  )}
                  {enrollments.map((e) => (
                    <div
                      key={e._id}
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      <img
                        src={e.course?.thumbnail}
                        alt=""
                        style={{
                          width: 80,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          {e.course?.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ color: "var(--muted)", fontSize: 12 }}>
                            {e.completedLessons}/{e.course?.totalLessons}{" "}
                            lessons
                          </span>
                          <span
                            style={{
                              color: "var(--terracotta)",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {e.progressPercent}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${e.progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: "7px 14px", fontSize: 12 }}
                        onClick={() => openPlayer(e)}
                      >
                        Resume
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))",
                    borderRadius: 10,
                    padding: "24px",
                    color: "#fff",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      marginBottom: 8,
                      color: "#fff",
                    }}
                  >
                    🌟 Explore More
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      opacity: 0.85,
                      marginBottom: 16,
                      lineHeight: 1.7,
                    }}
                  >
                    Unlock all courses and complete your spice mastery
                    certification.
                  </p>
                  <button
                    className="btn-forest"
                    style={{ padding: "10px 20px", fontSize: 13 }}
                    onClick={() => setPage("courses")}
                  >
                    Browse Courses
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ─── MY COURSES ────────────────────────────────────────────── */}
          {!loadingData && active === "my-courses" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>
                My Courses
              </h2>
              {enrollments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ color: "var(--muted)", marginBottom: 20 }}>
                    You haven't enrolled in any courses yet.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setPage("courses")}
                  >
                    Browse Courses
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
                  {enrollments.map((e) => (
                    <div key={e._id} className="card" style={{ padding: 0 }}>
                      <img
                        src={e.course?.thumbnail}
                        alt=""
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ padding: 20 }}>
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            marginBottom: 6,
                          }}
                        >
                          {e.course?.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <span style={{ color: "var(--muted)", fontSize: 13 }}>
                            {e.completedLessons} of {e.course?.totalLessons}{" "}
                            completed
                          </span>
                          <span
                            style={{
                              color: "var(--terracotta)",
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            {e.progressPercent}%
                          </span>
                        </div>
                        <div
                          className="progress-bar"
                          style={{ marginBottom: 16 }}
                        >
                          <div
                            className="progress-fill"
                            style={{ width: `${e.progressPercent}%` }}
                          />
                        </div>
                        <button
                          className="btn-primary"
                          style={{ width: "100%", padding: "10px" }}
                          onClick={() => openPlayer(e)}
                        >
                          Continue Learning →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ─── PROGRESS ──────────────────────────────────────────────── */}
          {!loadingData && active === "progress" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>
                My Progress
              </h2>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 32,
                  border: "1px solid var(--border)",
                }}
              >
                <h3 style={{ fontSize: 22, marginBottom: 24 }}>
                  Course Progress
                </h3>
                {enrollments.length === 0 && (
                  <p style={{ color: "var(--muted)" }}>No enrollments yet.</p>
                )}
                {enrollments.map((e) => (
                  <div key={e._id} style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{e.course?.title}</span>
                      <span
                        style={{ color: "var(--terracotta)", fontWeight: 700 }}
                      >
                        {e.progressPercent}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${e.progressPercent}%` }}
                      />
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 12,
                        marginTop: 6,
                      }}
                    >
                      {e.completedLessons} of {e.course?.totalLessons} lessons
                      completed
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── CERTIFICATES ──────────────────────────────────────────── */}
          {!loadingData && active === "certificate" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                My Certificates
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: 32 }}>
                Complete a course to earn your certificate.
              </p>
              {enrollments.filter((e) => e.certificateIssued).length === 0 ? (
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
                  <h3
                    style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}
                  >
                    No Certificates Yet
                  </h3>
                  <p style={{ color: "var(--muted)", marginBottom: 24 }}>
                    Finish your enrolled courses to unlock certificates.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setActive("my-courses")}
                  >
                    Go to My Courses →
                  </button>
                </div>
              ) : (
                enrollments
                  .filter((e) => e.certificateIssued)
                  .map((e) => (
                    <div
                      key={e._id}
                      style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: 24,
                        border: "1px solid var(--border)",
                        marginBottom: 16,
                      }}
                    >
                      <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                        🏆 {e.course?.title}
                      </h3>
                      <p style={{ color: "var(--muted)", marginTop: 4 }}>
                        Certificate earned on{" "}
                        {new Date(e.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
              )}
            </>
          )}

          {/* ─── SETTINGS ──────────────────────────────────────────────── */}
          {active === "settings" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>
                Account Settings
              </h2>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 32,
                  border: "1px solid var(--border)",
                  maxWidth: 560,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    alignItems: "center",
                    marginBottom: 28,
                    paddingBottom: 28,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <Avatar name={user.name} size={64} />
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                      {user.name}
                    </h3>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                {[
                  ["Full Name", user.name],
                  ["Email Address", user.email],
                ].map(([lb, vl]) => (
                  <div key={lb} style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {lb}
                    </label>
                    <input defaultValue={vl} />
                  </div>
                ))}
                <button
                  className="btn-primary"
                  style={{ marginTop: 8, padding: "11px 28px" }}
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
