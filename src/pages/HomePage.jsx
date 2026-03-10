import React from "react"



import Footer from "../shared/Footer";

import CourseCard from "../components/CourseCard";


import Avatar from "../shared/Avatar";


import { STATS, TESTIMONIALS, COURSES } from "../utils/MockData";






function HomePage({ setPage, setShowRegister, onEnroll }) {
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          minHeight: "92vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #1a3429 0%, var(--forest) 40%, #2d3d1e 100%)",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1400&q=60')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(200,149,58,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 100,
            bottom: -200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(194,113,79,0.08)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div className="animate-fade-up">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(200,149,58,0.2)",
                border: "1px solid rgba(200,149,58,0.4)",
                borderRadius: 20,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 14 }}>🌶️</span>
              <span
                style={{
                  color: "var(--gold-light)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Africa's Premier Spice Institution
              </span>
            </div>
            <h1
              style={{
                fontSize: 68,
                color: "#fff",
                lineHeight: 1.05,
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              Unlock the
              <br />
              <span style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
                Ancient Power
              </span>
              <br />
              of Natural Spices
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 17,
                lineHeight: 1.8,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              Dive deep into the science, history, and practice of the world's
              most treasured natural spices. From curative properties to
              culinary artistry — master it all.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                className="btn-primary"
                style={{ padding: "14px 36px", fontSize: 15 }}
                onClick={() => setShowRegister(true)}
              >
                Start Learning Free
              </button>
              <button
                className="btn-outline"
                style={{
                  padding: "14px 36px",
                  fontSize: 15,
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "#fff",
                }}
                onClick={() => setPage("courses")}
              >
                Explore Courses
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[
                ["8,400+", "Students"],
                ["380+", "Video Lessons"],
                ["24", "Expert Tutors"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "var(--gold-light)",
                      fontSize: 32,
                      fontWeight: 700,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 12,
                      letterSpacing: 1,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }} className="animate-fade-in">
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
                transform: "rotate(2deg)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=700&q=85"
                alt="Spices"
                style={{ width: "100%", display: "block" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -24,
                left: -24,
                background: "#fff",
                borderRadius: 12,
                padding: "16px 20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                transform: "rotate(-2deg)",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>🏆</span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    Certified Training
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>
                    Industry-recognised certificates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "var(--terracotta)", padding: "28px 40px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 20,
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Spices Section */}
      <div style={{ maxWidth: 1200, margin: "80px auto", padding: "0 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80"
                alt=""
                style={{
                  borderRadius: 12,
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80"
                alt=""
                style={{
                  borderRadius: 12,
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  marginTop: 24,
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80"
                alt=""
                style={{
                  borderRadius: 12,
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"
                alt=""
                style={{
                  borderRadius: 12,
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  marginTop: 24,
                }}
              />
            </div>
          </div>
          <div>
            <div
              style={{
                color: "var(--terracotta)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Why Natural Spices Matter
            </div>
            <h2
              style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 20,
                color: "var(--charcoal)",
              }}
            >
              Thousands of Years of
              <br />
              <span style={{ color: "var(--forest)", fontStyle: "italic" }}>
                Healing & Flavour
              </span>
            </h2>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.9,
                fontSize: 15,
                marginBottom: 20,
              }}
            >
              Natural spices are far more than kitchen condiments. They are
              potent bioactive compounds shaped by millennia of evolution,
              carrying antimicrobial, anti-inflammatory, and antioxidant
              properties that modern medicine is only beginning to quantify.
            </p>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.9,
                fontSize: 15,
                marginBottom: 28,
              }}
            >
              From the curcumin in turmeric to the gingerol in ginger and
              eugenol in cloves — understanding these molecules changes how you
              cook, heal, and live. SpiceAcademy gives you that knowledge,
              structured and certified.
            </p>
            {[
              [
                "🌿 Bioactive Compounds",
                "Over 300 studied molecules with therapeutic roles",
              ],
              [
                "🧬 Traditional Medicine",
                "Grounded in 5,000 years of Ayurveda and African herbalism",
              ],
              [
                "💰 Global Spice Market",
                "$15B+ industry offering real career opportunities",
              ],
            ].map(([t, d]) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background: "var(--ivory)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {t.split(" ")[0]}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}
                  >
                    {t.slice(2)}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div style={{ background: "var(--ivory)", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
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
              Our Curriculum
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 700 }}>Featured Courses</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {COURSES.slice(0, 3).map((c) => (
              <CourseCard key={c._id} course={c} onEnroll={() => onEnroll(c)} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              className="btn-forest"
              style={{ padding: "13px 40px", fontSize: 15 }}
              onClick={() => setPage && setPage("courses")}
            >
              View All Courses →
            </button>
          </div>
        </div>
      </div>

      {/* About the Company */}
      <div style={{ maxWidth: 1200, margin: "80px auto", padding: "0 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "var(--terracotta)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              About SumatspiceAcademy
            </div>
            <h2
              style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Built by Practitioners,
              <br />
              <span style={{ color: "var(--terracotta)", fontStyle: "italic" }}>
                For Practitioners
              </span>
            </h2>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.9,
                fontSize: 15,
                marginBottom: 16,
              }}
            >
              SpiceAcademy was founded in 2019 by a collective of
              ethnobotanists, chefs, wellness practitioners, and agribusiness
              professionals across West Africa. Frustrated by the lack of
              structured, credible training in natural spice science, they built
              the institution they wished had existed.
            </p>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.9,
                fontSize: 15,
                marginBottom: 28,
              }}
            >
              Today, our 100% online platform delivers video-first courses
              designed to be immediately applicable — whether you're a
              healthcare professional, farmer, culinary artist, or entrepreneur
              looking to enter the $15B global spice market.
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                ["🌍", "Pan-African Mission"],
                ["🎓", "Certified Experts"],
                ["📱", "100% Online"],
              ].map(([ic, lb]) => (
                <div
                  key={lb}
                  style={{
                    background: "var(--ivory)",
                    borderRadius: 10,
                    padding: "16px 20px",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{ic}</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--forest)",
                    }}
                  >
                    {lb}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&q=85"
              alt="SumatspiceAcademy team"
              style={{
                borderRadius: 16,
                width: "100%",
                objectFit: "cover",
                height: 450,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 24,
                right: -20,
                background: "var(--forest)",
                borderRadius: 12,
                padding: "16px 20px",
                color: "#fff",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--gold-light)",
                }}
              >
                6+
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Years of Excellence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--forest), #1a3429)",
          padding: "80px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>
              What Our Students Say
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    color: "var(--gold-light)",
                    fontSize: 24,
                    marginBottom: 12,
                  }}
                >
                  ❝
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.8,
                    fontSize: 15,
                    marginBottom: 20,
                  }}
                >
                  {t.text}
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar name={t.name} size={40} />
                  <div>
                    <div
                      style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                    >
                      {t.name}
                    </div>
                    <div style={{ color: "var(--gold-light)", fontSize: 12 }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          background: "var(--terracotta)",
          padding: "72px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 16,
          }}
        >
          Ready to Begin?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 17,
            marginBottom: 32,
          }}
        >
          Join 8,400+ students already mastering the world of natural spices.
        </p>
        <button
          className="btn-forest"
          style={{ padding: "14px 48px", fontSize: 16 }}
          onClick={() => setShowRegister(true)}
        >
          Enroll Today →
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}




export default HomePage;