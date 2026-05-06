import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";

const Home            = lazy(() => import("./pages/Home"));
const AboutUs         = lazy(() => import("./pages/AboutUs"));
const OurClients      = lazy(() => import("./pages/OurClients"));
const Portfolio       = lazy(() => import("./pages/Portfolio"));
const ContactUs       = lazy(() => import("./pages/ContactUs"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const Login           = lazy(() => import("./pages/Login"));
const AdminLogin      = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard  = lazy(() => import("./pages/AdminDashboard"));
const NotFound        = lazy(() => import("./pages/NotFound"));

export default function App() {

  // ── User auth state ────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("nn_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const handleSetUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem("nn_user", JSON.stringify(u));
    else    localStorage.removeItem("nn_user");
  };

  // ── Admin auth state ────────────────────────────────────────────────────────
  // Token lives in httpOnly cookie (invisible to JS).
  // We track logged-in state via adminUser in localStorage (non-sensitive).
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      return stored ? JSON.parse(stored)?.is_admin === true : false;
    } catch { return false; }
  });

  const handleSetAdminLoggedIn = (val) => {
    setIsAdminLoggedIn(val);
    if (!val) localStorage.removeItem("adminUser");
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen text-blue-600 text-lg">
            Loading...
          </div>
        }>
          <Routes>
            {/* ── Public pages inside Layout ── */}
            <Route element={<Layout user={user} setUser={handleSetUser} />}>
              <Route path="/"          element={<Home />} />
              <Route path="/about"     element={<AboutUs />} />
              <Route path="/clients"   element={<OurClients />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact"   element={<ContactUs />} />
              <Route
                path="/book"
                element={
                  user
                    ? <BookAppointment user={user} />
                    : <Login setUser={handleSetUser} setIsAdminLoggedIn={handleSetAdminLoggedIn} />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Auth pages (full-screen, no Layout) ── */}
            <Route
              path="/login"
              element={
                <Login
                  setUser={handleSetUser}
                  setIsAdminLoggedIn={handleSetAdminLoggedIn}
                />
              }
            />

            {/* ── Admin pages ── */}
            <Route
              path="/admin"
              element={<AdminLogin setIsLoggedIn={handleSetAdminLoggedIn} />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAuth={isAdminLoggedIn}>
                  <AdminDashboard setIsLoggedIn={handleSetAdminLoggedIn} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}