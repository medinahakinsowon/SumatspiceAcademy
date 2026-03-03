import React from "react"


import Footer from "../shared/Footer";






function AboutPage({ setShowRegister }) {
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, var(--forest), #1a3429)",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 16,
          }}
        >
          About SumatspiceAcademy
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 18,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          We're on a mission to make the ancient wisdom of natural spices
          accessible to everyone — from Lagos to London.
        </p>
      </div>
      <div style={{ maxWidth: 1000, margin: "80px auto", padding: "0 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <div>
            <h2 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
              Our Story
            </h2>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.9,
                marginBottom: 16,
              }}
            >
              SumatspiceAcademy was born in 2019 from a shared frustration: despite
              Africa being the world's largest producer of many key spices,
              there was no structured institution dedicated to educating people
              about them.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.9 }}>
              A team of 7 — comprising botanists, chefs, wellness coaches, and
              market traders — pooled their knowledge and created the curriculum
              you see today. In six years, we've certified over 8,400 students
              across 62 countries.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=80"
            alt="Farm"
            style={{
              borderRadius: 14,
              width: "100%",
              height: 300,
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: 42, fontWeight: 700 }}>
            Meet Our Expert Instructors
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginBottom: 80,
          }}
        >
          {[
            {
              name: "Dr. Amara Osei",
              role: "Ethnobotanist",
              emoji: "🌿",
              bio: "20 years researching medicinal plants across West Africa.",
            },
            {
              name: "Prof. Nkechi Adaeze",
              role: "Phytochemist",
              emoji: "🔬",
              bio: "Published 40+ papers on spice bioactive compounds.",
            },
            {
              name: "Chef Kwame Asante",
              role: "Culinary Expert",
              emoji: "👨‍🍳",
              bio: "Trained under Michelin-star chefs, spice specialist.",
            },
          ].map((i) => (
            <div
              key={i.name}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "28px 24px",
                textAlign: "center",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{i.emoji}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{i.name}</h3>
              <div
                style={{
                  color: "var(--terracotta)",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {i.role}
              </div>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {i.bio}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "var(--ivory)",
            borderRadius: 16,
            padding: "48px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>
            Join Our Community
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 28 }}>
            Start your journey with the continent's most trusted spice education
            platform.
          </p>
          <button
            className="btn-primary"
            style={{ padding: "14px 44px", fontSize: 15 }}
            onClick={() => setShowRegister(true)}
          >
            Get Started Today →
          </button>
        </div>
      </div>

      <Footer/>
    </div>
  );
}



export default AboutPage;