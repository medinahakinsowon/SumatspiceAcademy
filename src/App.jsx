import { useState } from "react";

import HomePage from "./pages/HomePage";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import PaymentModal from "./components/modals/PaymentMModal";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import Navbar from "./shared/Navbar";
import CoursePlayer from "./pages/CoursePlayer";

import { css } from "./utils/MockData";

const API_URL = "http://localhost:4000/api";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [activeEnroll, setActiveEnroll] = useState(null)

  // ─── Check if user already has enrollments (called after login/register) ──
  const checkEnrollments = async (u, token) => {
    try {
      const res = await fetch(`${API_URL}/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.data.enrollments.length > 0) {
        return { ...u, hasEnrollment: true };
      }
    } catch (_) {}
    return { ...u, hasEnrollment: false };
  };

  // ─── Called after both login AND register ────────────────────────────────
  const login = async (u) => {
    const token = localStorage.getItem("token");
    const enrichedUser = await checkEnrollments(u, token);
    setUser(enrichedUser);
    setShowLogin(false);
    setShowRegister(false);

    // If they were mid-enroll before auth, resume payment
    const pending = sessionStorage.getItem("pendingCourse");
    if (pending) {
      setPaymentCourse(JSON.parse(pending));
      sessionStorage.removeItem("pendingCourse");
    }
    // No auto-redirect to dashboard
  };

    const openPlayer = (enrollment) => {
      setActiveEnroll(enrollment);
      setPage("player");
    };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setPage("home");
  };

  // ─── Enroll: require auth first, then open payment ───────────────────────
  const onEnroll = (course) => {
    if (!user) {
      sessionStorage.setItem("pendingCourse", JSON.stringify(course));
      setShowRegister(true);
      return;
    }
    setPaymentCourse(course);
  };

  // ─── After successful payment, mark user as having enrollment ────────────
  const onPaymentSuccess = () => {
    setUser((prev) => ({ ...prev, hasEnrollment: true }));
    setPaymentCourse(null);
    setPage("dashboard");
  };

  return (
    <>
      <style>{css}</style>
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
        logout={logout}
      />

      {page === "home" && (
        <HomePage
          setPage={setPage}
          setShowRegister={setShowRegister}
          onEnroll={onEnroll}
        />
      )}
      {page === "courses" && (
        <CoursePage
          setShowRegister={setShowRegister}
          user={user}
          setPage={setPage}
          onEnroll={onEnroll}
        />
      )}
      {page === "about" && <AboutPage setShowRegister={setShowRegister} />}
      {page === "dashboard" && user && user.hasEnrollment && (
        <Dashboard
          user={user}
          setPage={setPage}
          logout={logout}
          openPlayer={openPlayer}
        />
      )}
      {page === "dashboard" && user && !user.hasEnrollment && (
        <div style={{ textAlign: "center", padding: "80px 40px" }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>
            You have no enrollments yet
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>
            Enroll in a course to access your dashboard.
          </p>
          <button className="btn-primary" onClick={() => setPage("courses")}>
            Browse Courses
          </button>
        </div>
      )}
      {page === "dashboard" && !user && (
        <div style={{ textAlign: "center", padding: "80px 40px" }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>
            Please log in to access your dashboard
          </h2>
          <button className="btn-primary" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        </div>
      )}

      {page === "player" && (
        <CoursePlayer
          enrollment={activeEnroll}
          user={user}
          setPage={setPage}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={login}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onRegister={login}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
      {paymentCourse && (
        <PaymentModal
          course={paymentCourse}
          onClose={() => setPaymentCourse(null)}
          onSuccess={onPaymentSuccess}
        />
      )}
    </>
  );
}

export default App;
