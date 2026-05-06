import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Menu, X, Phone, Mail, MapPin, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import logo from "./logo.png";

export default function Layout({ user, setUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Clients", href: "/clients" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    setUser(null);
    setDropdownOpen(false);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo || "logo.png"}
                alt="Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 font-medium"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth area */}
              {user ? (
                <>
                  <Link to="/book">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4">
                      Book Appointment
                    </Button>
                  </Link>
                  {/* User dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="max-w-[100px] truncate">{user.fullName?.split(" ")[0]}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-sm px-4 h-9">
                      <User className="w-3.5 h-3.5 mr-1.5" />
                      Log In
                    </Button>
                  </Link>
                  <Link to="/login?mode=signup">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 h-9">
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/book">
                    <Button className="bg-blue-900 hover:bg-blue-800 text-white text-sm px-4 h-9">
                      Book FREE
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t pt-3 mt-1 space-y-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                          Book Appointment
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 text-sm"
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 text-sm">
                          <User className="w-4 h-4 mr-2" /> Log In
                        </Button>
                      </Link>
                      <Link to="/login?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                          Sign Up
                        </Button>
                      </Link>
                      <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white text-sm">
                          Book FREE Appointment
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Nobal Navigator Logo" className="h-12 w-auto" />
                <div className="flex flex-col">
                  <span className="text-white text-xl">Nobal Navigator</span>
                  <span className="text-white text-xs">Pvt Ltd</span>
                </div>
              </div>
              <p className="text-white mb-6">
                Your trusted partner for study abroad consultancy. We help
                students achieve their dreams of international education.
              </p>
              <div className="space-y-3 mb-6">
                <a href="tel:+1234567890" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /><span>+123 456 7890</span>
                </a>
                <a href="mailto:info@nobalnavigator.com" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" /><span>info@nobalnavigator.com</span>
                </a>
                <div className="flex items-center gap-2 text-blue-100">
                  <MapPin className="w-4 h-4" /><span>Serving students worldwide</span>
                </div>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                ].map((social) => (
                  <a key={social.label} href="#"
                    className="w-8 h-8 bg-blue-700/50 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="sr-only">{social.label}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-blue-100 hover:text-white transition-colors text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white mb-4">Services</h3>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>Study Abroad Consultancy</li>
                <li>University Selection</li>
                <li>Visa Assistance</li>
                <li>Application Support</li>
                <li>Pre-departure Guidance</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-700/50 mt-8 pt-8 text-center text-blue-100 text-sm">
            <p>&copy; 2026 Nobal Navigator Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
