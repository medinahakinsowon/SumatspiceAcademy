import { useState, useEffect } from "react";

import HomePage from "./pages/HomePage";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import PaymentModal from "./components/modals/PaymentModal";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import CoursePlayer from "./pages/CoursePlayer";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./shared/Navbar";

import { css } from "./utils/MockData";

const API_URL = "http://localhost:4000/api";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // prevent flash of logged-out state
  const [page, setPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [activeEnrollment, setActiveEnrollment] = useState(null);

  // ─── On mount: restore session from token in localStorage ────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        // Fetch fresh user data from DB
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.data?.user) {
          // Also check enrollments so hasEnrollment is correct
          const enrollRes = await fetch(`${API_URL}/enrollments/my`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const enrollData = await enrollRes.json();
          const hasEnrollment =
            enrollRes.ok && enrollData.data.enrollments.length > 0;
          setUser({ ...data.data.user, hasEnrollment });
        } else {
          // Token is invalid or expired — clear it
          localStorage.removeItem("token");
        }
      } catch (_) {
        localStorage.removeItem("token");
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ─── Check enrollments after login/register ───────────────────────────────
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

  const login = async (u) => {
    const token = localStorage.getItem("token");
    const enrichedUser = await checkEnrollments(u, token);
    setUser(enrichedUser);
    setShowLogin(false);
    setShowRegister(false);

    const pending = sessionStorage.getItem("pendingCourse");
    if (pending) {
      setPaymentCourse(JSON.parse(pending));
      sessionStorage.removeItem("pendingCourse");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setPage("home");
  };

  const onEnroll = (course) => {
    console.log(course);
    if (!user) {
      sessionStorage.setItem("pendingCourse", JSON.stringify(course));
      setShowRegister(true);
      return;
    }
    setPaymentCourse(course);
  };

  // const onPaymentSuccess = () => {
  //   setUser((prev) => ({ ...prev, hasEnrollment: true }));
  //   setPaymentCourse(null);
  //   setPage("dashboard");
  // };
  // Replace onPaymentSuccess in App.jsx with this:

  const onPaymentSuccess = async () => {
    setPaymentCourse(null);

    // Re-fetch fresh user + enrollments from DB
    const token = localStorage.getItem("token");
    try {
      const [userRes, enrollRes] = await Promise.all([
        fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/enrollments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const userData = await userRes.json();
      const enrollData = await enrollRes.json();

      if (userRes.ok && userData.data?.user) {
        const hasEnrollment =
          enrollRes.ok && enrollData.data.enrollments.length > 0;
        setUser({ ...userData.data.user, hasEnrollment });
      }
    } catch (_) {
      // Fallback — just set flag manually
      setUser((prev) => ({ ...prev, hasEnrollment: true }));
    }

    setPage("dashboard");
  };

  const openPlayer = (enrollment) => {
    setActiveEnrollment(enrollment);
    setPage("player");
  };

  // ─── Don't render anything until we know if user is logged in ────────────
  if (authLoading) {
    return (
      <>
        <style>{css}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "var(--cream)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <p
              style={{
                color: "var(--muted)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Loading…
            </p>
          </div>
        </div>
      </>
    );
  }

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
      {page === "admin" && <AdminPanel user={user} setPage={setPage} />}
      {page === "player" && (
        <CoursePlayer
          enrollment={activeEnrollment}
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
          user={user}
          onClose={() => setPaymentCourse(null)}
          onSuccess={onPaymentSuccess}
        />
      )}
    </>
  );
}

export default App;
