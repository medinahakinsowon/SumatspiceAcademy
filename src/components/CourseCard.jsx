import React from "react"
import StarRating from "../shared/StarRating";





function CourseCard({ course, onEnroll }) {
  return (
    <div className="card" style={{ cursor: "pointer" }}>
      <div style={{ position: "relative", overflow: "hidden", height: 180 }}>
        <img
          src={course.thumb}
          alt={course.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span className={`badge badge-${course.level.toLowerCase()}`}>
            {course.level}
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            borderRadius: 4,
            padding: "3px 8px",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ${course.price}
        </div>
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 10,
          }}
        >
          {course.tags.map((t) => (
            <span
              key={t}
              style={{
                background: "var(--ivory)",
                color: "var(--forest)",
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 3,
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 6,
            lineHeight: 1.3,
            color: "var(--charcoal)",
          }}
        >
          {course.title}
        </h3>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 12,
          }}
        >
          {course.desc}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
          }}
        >
          <StarRating rating={course.rating} />
          <div style={{ color: "var(--muted)", fontSize: 12 }}>
            {course.lessons} lessons · {course.duration}
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: 14, padding: "10px" }}
          onClick={() => onEnroll && onEnroll(course)}
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}



export default CourseCard;