

import React from "react"



function StarRating({rating}) {
    return (
      <span style={{ color: "#e8a838", fontSize: 13 }}>
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
        <span
          style={{
            color: "var(--muted)",
            marginLeft: 4,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
          }}
        >
          {rating}
        </span>
      </span>
    );
}



export default StarRating;