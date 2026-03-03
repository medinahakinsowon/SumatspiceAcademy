import { useState } from 'react'


import HomePage from './pages/HomePage'
import LoginModal from './components/modals/LoginModal'
import RegisterModal from './components/modals/RegisterModal'
import PaymentModal from './components/modals/PaymentMModal'
import AboutPage from './pages/AboutPage'
import Dashboard from './pages/Dashboard'
import CoursePage from './pages/CoursePage'
import Navbar from './shared/Navbar'

import { css } from './utils/MockData'




function App() {
   const [page, setPage] = useState("home");
   const [user, setUser] = useState(null);
   const [showLogin, setShowLogin] = useState(false);
   const [showRegister, setShowRegister] = useState(false);
   const [paymentCourse, setPaymentCourse] = useState(null);

   const login = (u) => {
     setUser(u);
     setShowLogin(false);
     setShowRegister(false);
   };
   const logout = () => {
     setUser(null);
     setPage("home");
   };
   const onEnroll = (course) => {
     if (!user) {
       setShowRegister(true);
       return;
     }
     setPaymentCourse(course);
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
        <HomePage setPage={setPage} setShowRegister={setShowRegister} />
      )}
      {page === "courses" && (
        <CoursePage
          setShowRegister={setShowRegister}
          user={user}
          setPage={setPage}
        />
      )}
      {page === "about" && <AboutPage setShowRegister={setShowRegister} />}
      {page === "dashboard" && user && (
        <Dashboard user={user} setPage={setPage} />
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
          onSuccess={() => {
            setPaymentCourse(null);
            setPage("dashboard");
          }}
        />
      )}
    </>
  );
}

export default App
