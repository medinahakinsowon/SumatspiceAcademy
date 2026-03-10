import React, { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import Footer from "../shared/Footer";

const API_URL = "http://localhost:4000/api";

function CoursePage({ setShowRegister, user, setPage, onEnroll }) {
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // ─── Fetch real courses from backend ─────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const params = filter !== "All" ? `?level=${filter}` : "";
        const res = await fetch(`${API_URL}/courses${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load courses.");

        // Map backend field names → what CourseCard expects
        const mapped = data.data.courses.map((c) => ({
          _id: c._id,
          title: c.title,
          desc: c.shortDesc || c.description,
          thumb: c.thumbnail,
          price: c.price,
          level: c.level,
          tags: c.tags || [],
          lessons: c.totalLessons,
          duration: c.totalDuration
            ? `${Math.round(c.totalDuration / 3600)}h`
            : "Self-paced",
          rating: c.rating?.average || 0,
        }));

        setCourses(mapped);
      } catch (err) {
        setError("Could not load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [filter]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px" }}>
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            color: "var(--terracotta)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          All Courses
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, marginBottom: 12 }}>
          Master Natural Spice Science
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 560 }}>
          Structured, expert-led video courses for every stage of your spice
          journey.
        </p>
      </div>

      {/* ─── Level Filter ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: "1.5px solid var(--border)",
              background: filter === l ? "var(--forest)" : "#fff",
              color: filter === l ? "#fff" : "var(--charcoal)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ─── Loading ─────────────────────────────────────────────────────── */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--muted)",
            fontSize: 16,
          }}
        >
          Loading courses…
        </div>
      )}

      {/* ─── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#c62828",
            fontSize: 15,
          }}
        >
          {error}
        </div>
      )}

      {/* ─── Course Grid ─────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {courses.length === 0 ? (
            <p style={{ color: "var(--muted)", gridColumn: "1 / -1" }}>
              No courses found for this level.
            </p>
          ) : (
            courses.map((c) => (
              <CourseCard key={c._id} course={c} onEnroll={() => onEnroll(c)} />
            ))
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default CoursePage;
