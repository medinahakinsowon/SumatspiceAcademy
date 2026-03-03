import React, { useState } from "react"

import { COURSES } from "../utils/MockData";


import CourseCard from "../components/CourseCard";

import Footer from "../shared/Footer";



function CoursePage({ setShowRegister, user, setPage }) {
  const [filter, setFilter] = useState("All");
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const filtered =
    filter === "All" ? COURSES : COURSES.filter((c) => c.level === filter);
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {filtered.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            onEnroll={() =>
              user ? setPage("dashboard") : setShowRegister(true)
            }
          />
        ))}
      </div>

      <Footer/>
    </div>
  );
}




export default CoursePage;