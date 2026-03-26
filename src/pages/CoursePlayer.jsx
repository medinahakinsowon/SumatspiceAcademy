import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:4000/api";

function CoursePlayer({ enrollment, user, setPage }) {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(new Set());
  const [progressPercent, setProgressPercent] = useState(0);
  const videoRef = useRef();

  const course = enrollment?.course;

  // ─── Fetch videos for this course ────────────────────────────────────────
  useEffect(() => {
    if (!course?._id) return;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/videos/course/${course._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const vids = data.data.videos;
        setVideos(vids);
        setActiveVideo(vids[0] || null);

        // Pre-mark already completed lessons from enrollment data
        if (enrollment?.lessonProgress?.length) {
          const doneIds = new Set(
            enrollment.lessonProgress
              .filter((p) => p.completed)
              .map((p) => p.video?.toString()),
          );
          setCompleted(doneIds);
          setProgressPercent(enrollment.progressPercent || 0);
        }
      } catch (err) {
        setError("Could not load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [course?._id]);

  // ─── Save progress to DB ──────────────────────────────────────────────────
  const markCompleteInDB = async (videoId) => {
    // Update local state immediately for instant UI feedback
    setCompleted((prev) => new Set([...prev, videoId]));

    try {
      const token = localStorage.getItem("token");
      const watchedSecs = videoRef.current
        ? Math.floor(videoRef.current.currentTime)
        : 0;

      const res = await fetch(`${API_URL}/videos/${videoId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ watchedSecs }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update progress percent from DB response
        setProgressPercent(data.data.progressPercent);
      }
    } catch (_) {
      // Silently fail — local state already updated
    }
  };

  // ─── When video ends: save to DB + auto-advance ───────────────────────────
  const handleVideoEnd = async () => {
    if (!activeVideo) return;
    await markCompleteInDB(activeVideo._id);
    const idx = videos.findIndex((v) => v._id === activeVideo._id);
    if (idx < videos.length - 1) setActiveVideo(videos[idx + 1]);
  };

  // ─── Next lesson button ───────────────────────────────────────────────────
  const handleNext = async () => {
    const idx = videos.findIndex((v) => v._id === activeVideo._id);
    await markCompleteInDB(activeVideo._id);
    setActiveVideo(videos[idx + 1]);
  };

  // ─── Complete course button ───────────────────────────────────────────────
  const handleComplete = async () => {
    await markCompleteInDB(activeVideo._id);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const displayProgress = videos.length
    ? Math.round((completed.size / videos.length) * 100)
    : progressPercent;

  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: "80px 40px" }}>
        <p style={{ color: "var(--muted)" }}>No course selected.</p>
        <button className="btn-primary" onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 64px)",
        background: "#0f1a14",
        color: "#fff",
      }}
    >
      {/* ─── Sidebar: lesson list ──────────────────────────────────────────── */}
      <div
        style={{
          width: 320,
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Course header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={() => setPage("dashboard")}
            style={{
              background: "none",
              border: "none",
              color: "var(--gold-light)",
              cursor: "pointer",
              fontSize: 13,
              marginBottom: 12,
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back to Dashboard
          </button>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.4,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            {course.title}
          </h2>
          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              {completed.size}/{videos.length} lessons
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--gold-light)",
                fontWeight: 600,
              }}
            >
              {displayProgress}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${displayProgress}%`,
                background:
                  "linear-gradient(90deg, var(--terracotta), var(--gold))",
                borderRadius: 2,
                transition: "width 0.4s",
              }}
            />
          </div>
        </div>

        {/* Lesson list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {loading && (
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                padding: "20px",
              }}
            >
              Loading lessons…
            </p>
          )}
          {error && (
            <p style={{ color: "#ef9a9a", fontSize: 13, padding: "20px" }}>
              {error}
            </p>
          )}
          {videos.map((v, idx) => {
            const isActive = activeVideo?._id === v._id;
            const isDone = completed.has(v._id);
            return (
              <div
                key={v._id}
                onClick={() => setActiveVideo(v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px",
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(255,255,255,0.07)"
                    : "transparent",
                  borderLeft: isActive
                    ? "3px solid var(--terracotta)"
                    : "3px solid transparent",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseOut={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: isDone
                      ? "var(--terracotta)"
                      : isActive
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDone ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 3,
                    }}
                  >
                    <span
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
                    >
                      {formatDuration(v.duration || 0)}
                    </span>
                    {v.isFree && (
                      <span
                        style={{
                          fontSize: 10,
                          background: "rgba(76,175,80,0.2)",
                          color: "#81c784",
                          padding: "1px 6px",
                          borderRadius: 3,
                          fontWeight: 600,
                        }}
                      >
                        FREE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Main: video player + info ────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {activeVideo ? (
          <>
            <div style={{ background: "#000", position: "relative" }}>
              <video
                ref={videoRef}
                key={activeVideo._id}
                src={activeVideo.filePath}
                poster={activeVideo.thumbnail}
                controls
                onEnded={handleVideoEnd}
                style={{ width: "100%", maxHeight: "62vh", display: "block" }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 6,
                    }}
                  >
                    {activeVideo.title}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 13,
                    }}
                  >
                    <span>⏱ {formatDuration(activeVideo.duration || 0)}</span>
                    <span>
                      📖 Lesson{" "}
                      {videos.findIndex((v) => v._id === activeVideo._id) + 1}{" "}
                      of {videos.length}
                    </span>
                  </div>
                </div>

                {/* Next lesson button */}
                {videos.findIndex((v) => v._id === activeVideo._id) <
                  videos.length - 1 && (
                  <button
                    className="btn-primary"
                    style={{ padding: "9px 20px", fontSize: 13, flexShrink: 0 }}
                    onClick={handleNext}
                  >
                    Next Lesson →
                  </button>
                )}

                {/* Complete course button */}
                {videos.findIndex((v) => v._id === activeVideo._id) ===
                  videos.length - 1 && (
                  <button
                    className="btn-primary"
                    style={{
                      padding: "9px 20px",
                      fontSize: 13,
                      background: "var(--forest)",
                      flexShrink: 0,
                    }}
                    onClick={handleComplete}
                  >
                    ✓ Complete Course
                  </button>
                )}
              </div>

              {activeVideo.description && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    maxWidth: 680,
                  }}
                >
                  {activeVideo.description}
                </p>
              )}

              {/* Completion celebration */}
              {displayProgress === 100 && (
                <div
                  style={{
                    marginTop: 28,
                    padding: "24px 28px",
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, rgba(196,92,58,0.15), rgba(212,175,55,0.1))",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    Course Complete!
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                    You've finished all lessons in {course.title}. An admin will
                    review and issue your certificate shortly.
                  </p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: 16, padding: "9px 20px", fontSize: 13 }}
                    onClick={() => setPage("dashboard")}
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          !loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.4)" }}>
                No lessons available yet.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CoursePlayer;
