import React, { useRef, useState, } from "react"

import { VIDEOS } from "../utils/MockData";







function Dashboard({ user, setPage }) {
  const [active, setActive] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [videos, setVideos] = useState(VIDEOS);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    course: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef();

   const myProgress = [
     {
       course: "Foundations of Natural Spices",
       progress: 68,
       lessons: 8,
       total: 12,
       thumb: COURSES[0].thumb,
     },
     {
       course: "Medicinal Properties & Health Benefits",
       progress: 35,
       lessons: 5,
       total: 16,
       thumb: COURSES[1].thumb,
     },
   ];

   const doUpload = () => {
     if (!uploadForm.title || !uploadForm.course) return;
     setUploading(true);
     setTimeout(() => {
       setVideos((prev) => [
         {
           id: prev.length + 1,
           title: uploadForm.title,
           course: uploadForm.course,
           duration: "—",
           views: 0,
           date: new Date().toISOString().split("T")[0],
           thumb: COURSES[0].thumb,
         },
         ...prev,
       ]);
       setUploading(false);
       setUploaded(true);
       setTimeout(() => {
         setShowUpload(false);
         setUploaded(false);
         setUploadForm({ title: "", course: "", file: null });
       }, 2000);
     }, 2500);
   };

   const nav = [
     { key: "overview", icon: "🏠", label: "Overview" },
     { key: "my-courses", icon: "📚", label: "My Courses" },
     { key: "videos", icon: "🎬", label: "Video Library" },
     { key: "upload", icon: "⬆️", label: "Upload Video" },
     { key: "progress", icon: "📊", label: "My Progress" },
     { key: "certificate", icon: "🏆", label: "Certificates" },
     { key: "settings", icon: "⚙️", label: "Settings" },
   ];
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
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
                Student · Pro Plan
              </div>
            </div>
          </div>
        </div>
        {nav.map((n) => (
          <div
            key={n.key}
            className={`sidebar-item ${active === n.key ? "active" : ""}`}
            onClick={() => {
              setActive(n.key);
              if (n.key === "upload") setShowUpload(true);
            }}
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
          <div className="sidebar-item" onClick={() => setPage("home")}>
            <span style={{ fontSize: 18 }}>🏡</span>
            <span>Back to Home</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "var(--cream)", overflow: "auto" }}>
        <div style={{ padding: "32px 40px" }}>
          {/* OVERVIEW */}
          {active === "overview" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 36, fontWeight: 700 }}>
                  Good morning, {user.name.split(" ")[0]} 👋
                </h2>
                <p style={{ color: "var(--muted)", marginTop: 4 }}>
                  Continue your spice mastery journey.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {[
                  ["📚", "Courses Enrolled", "2"],
                  ["✅", "Lessons Completed", "13"],
                  ["⏱️", "Hours Learned", "9.5h"],
                  ["🏆", "Certificates", "0"],
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
                  {myProgress.map((p) => (
                    <div
                      key={p.course}
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      <img
                        src={p.thumb}
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
                          {p.course}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ color: "var(--muted)", fontSize: 12 }}>
                            {p.lessons}/{p.total} lessons
                          </span>
                          <span
                            style={{
                              color: "var(--terracotta)",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {p.progress}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: "7px 14px", fontSize: 12 }}
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
                    Unlock all 6 courses and complete your spice mastery
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

          {/* VIDEO LIBRARY */}
          {active === "videos" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 32,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 36, fontWeight: 700 }}>
                    Video Library
                  </h2>
                  <p style={{ color: "var(--muted)", marginTop: 4 }}>
                    {videos.length} videos across all your courses
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => setActive("upload")}
                >
                  + Upload Video
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}
              >
                {videos.map((v) => (
                  <div key={v.id} className="card">
                    <div style={{ position: "relative", height: 160 }}>
                      <img
                        src={v.thumb}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            background: "rgba(255,255,255,0.9)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                          }}
                        >
                          ▶
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 10,
                          background: "rgba(0,0,0,0.7)",
                          color: "#fff",
                          borderRadius: 3,
                          padding: "2px 7px",
                          fontSize: 12,
                        }}
                      >
                        {v.duration}
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        {v.title}
                      </div>
                      <div
                        style={{
                          color: "var(--terracotta)",
                          fontSize: 11,
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        {v.course}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "var(--muted)",
                          fontSize: 12,
                        }}
                      >
                        <span>👁 {v.views} views</span>
                        <span>{v.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* UPLOAD */}
          {active === "upload" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                Upload Video Lesson
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: 32 }}>
                Add new video content to your enrolled courses.
              </p>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 36,
                  border: "1px solid var(--border)",
                  maxWidth: 600,
                }}
              >
                {!uploaded ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Video Title *
                        </label>
                        <input
                          placeholder="e.g. The Chemistry of Capsaicin"
                          value={uploadForm.title}
                          onChange={(e) =>
                            setUploadForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
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
                          Select Course *
                        </label>
                        <select
                          value={uploadForm.course}
                          onChange={(e) =>
                            setUploadForm((p) => ({
                              ...p,
                              course: e.target.value,
                            }))
                          }
                        >
                          <option value="">-- Choose a course --</option>
                          {COURSES.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                        </select>
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
                          Video File *
                        </label>
                        <div
                          onClick={() => fileRef.current.click()}
                          style={{
                            border: "2px dashed var(--border)",
                            borderRadius: 8,
                            padding: "36px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "border-color 0.2s",
                            background: uploadForm.file ? "#f0f9f4" : "#fff",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.borderColor =
                              "var(--terracotta)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.borderColor =
                              "var(--border)")
                          }
                        >
                          <div style={{ fontSize: 40, marginBottom: 10 }}>
                            🎬
                          </div>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            {uploadForm.file
                              ? uploadForm.file.name
                              : "Click to select video"}
                          </div>
                          <div style={{ color: "var(--muted)", fontSize: 12 }}>
                            MP4, MOV, AVI up to 2GB
                          </div>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="video/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              setUploadForm((p) => ({
                                ...p,
                                file: e.target.files[0],
                              }))
                            }
                          />
                        </div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: "13px", fontSize: 15 }}
                        onClick={doUpload}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading… ⏳" : "Upload Video →"}
                      </button>
                      {uploading && (
                        <div
                          style={{
                            height: 6,
                            background: "var(--border)",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: "60%",
                              background:
                                "linear-gradient(90deg, var(--terracotta), var(--gold))",
                              animation: "load 2s ease forwards",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: 60, marginBottom: 12 }}>✅</div>
                    <h3 style={{ fontSize: 26, fontWeight: 700 }}>
                      Video Uploaded!
                    </h3>
                    <p style={{ color: "var(--muted)", marginTop: 6 }}>
                      Your lesson is now live in the Video Library.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MY COURSES */}
          {active === "my-courses" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>
                My Courses
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 24,
                }}
              >
                {myProgress.map((p) => {
                  const c = COURSES.find((co) => co.title === p.course);
                  return (
                    <div key={p.course} className="card" style={{ padding: 0 }}>
                      <img
                        src={p.thumb}
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
                          {p.course}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <span style={{ color: "var(--muted)", fontSize: 13 }}>
                            {p.lessons} of {p.total} completed
                          </span>
                          <span
                            style={{
                              color: "var(--terracotta)",
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            {p.progress}%
                          </span>
                        </div>
                        <div
                          className="progress-bar"
                          style={{ marginBottom: 16 }}
                        >
                          <div
                            className="progress-fill"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <button
                          className="btn-primary"
                          style={{ width: "100%", padding: "10px" }}
                        >
                          Continue Learning →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* PROGRESS */}
          {active === "progress" && (
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
                  marginBottom: 24,
                }}
              >
                <h3 style={{ fontSize: 22, marginBottom: 24 }}>
                  Course Progress
                </h3>
                {myProgress.map((p) => (
                  <div key={p.course} style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{p.course}</span>
                      <span
                        style={{ color: "var(--terracotta)", fontWeight: 700 }}
                      >
                        {p.progress}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 12,
                        marginTop: 6,
                      }}
                    >
                      {p.lessons} of {p.total} lessons completed
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CERTIFICATES */}
          {active === "certificate" && (
            <>
              <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                My Certificates
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: 32 }}>
                Complete a course to earn your certificate.
              </p>
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
                  Finish your enrolled courses to unlock your certificates.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setActive("my-courses")}
                >
                  Go to My Courses →
                </button>
              </div>
            </>
          )}

          {/* SETTINGS */}
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
                    <button
                      className="btn-outline"
                      style={{
                        padding: "5px 14px",
                        fontSize: 12,
                        marginTop: 8,
                      }}
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
                {[
                  ["Full Name", user.name],
                  ["Email Address", user.email],
                  ["Phone Number", "+234 800 000 0000"],
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

      {/* Upload Modal */}
      {showUpload && active !== "upload" && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div
            className="modal-box"
            style={{ maxWidth: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUpload(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
              Quick Upload
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                placeholder="Video Title"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm((p) => ({ ...p, title: e.target.value }))
                }
              />
              <select
                value={uploadForm.course}
                onChange={(e) =>
                  setUploadForm((p) => ({ ...p, course: e.target.value }))
                }
              >
                <option value="">-- Select Course --</option>
                {COURSES.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowUpload(false);
                  setActive("upload");
                }}
              >
                Continue Upload →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export default Dashboard;