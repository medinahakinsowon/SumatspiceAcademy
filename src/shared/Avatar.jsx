import React from "react"




function Avatar({name, size = 40})  {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--terracotta), var(--gold))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: size * 0.38,
          fontFamily: "'Cormorant Garamond', serif",
          flexShrink: 0,
        }}
      >
        {name[0].toUpperCase()}
      </div>
    );
}




export default Avatar;