import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, User, Phone, ArrowRight, Shield } from "lucide-react";
import logo from "../components/logo.png";
import api from "../../api";

export default function Login({ setUser, setIsAdminLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from || "/book";

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", loginData);
      // Token is now stored in httpOnly cookie by the server automatically
      localStorage.setItem("nn_user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.fullName}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        fullName: signupData.fullName,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
      });
      // Token is now stored in httpOnly cookie by the server automatically
      localStorage.setItem("nn_user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Account created! Welcome, ${data.user.fullName}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,25px) scale(1.05)} }
        @keyframes floatOrb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-18px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px rgba(96,165,250,.3)} 50%{box-shadow:0 0 60px rgba(99,102,241,.5)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .anim-left { animation: slideInLeft 0.7s cubic-bezier(.22,1,.36,1) both; }
        .anim-right { animation: slideInRight 0.7s 0.1s cubic-bezier(.22,1,.36,1) both; }
        .stat-card { animation: fadeInUp 0.6s both; }
        .stat-card:nth-child(1) { animation-delay: 0.4s; }
        .stat-card:nth-child(2) { animation-delay: 0.5s; }
        .stat-card:nth-child(3) { animation-delay: 0.6s; }
        .stat-card:nth-child(4) { animation-delay: 0.7s; }
      `}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 items-center justify-center p-12 anim-left">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full opacity-10 bg-blue-400"
            style={{ top: "-10%", left: "-10%", animation: "floatOrb1 8s ease-in-out infinite" }} />
          <div className="absolute w-72 h-72 rounded-full opacity-10 bg-indigo-400"
            style={{ bottom: "5%", right: "-5%", animation: "floatOrb2 10s ease-in-out infinite" }} />
          <div className="absolute w-48 h-48 rounded-full opacity-10 bg-blue-300"
            style={{ top: "40%", right: "20%", animation: "floatOrb3 6s ease-in-out infinite" }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="relative z-10 text-white text-center">
          <div
            className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20"
            style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
          >
            <img src={logo} alt="Nobal Navigator" className="w-20 h-20 object-contain drop-shadow-lg"
              onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "block"; }} />
            <span className="text-white text-3xl font-black hidden">NN</span>
          </div>

          <h2 className="text-4xl font-bold mb-3 leading-tight">
            Your Gateway to<br />
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #a5f3fc)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Global Education
            </span>
          </h2>
          <p className="text-blue-200 text-lg mb-10">Expert consultancy for study abroad programs and visa assistance worldwide</p>

          <div className="grid grid-cols-2 gap-4 text-center">
            {[{ num: "1000+", label: "Students Placed" }, { num: "98%", label: "Success Rate" }, { num: "50+", label: "Universities" }, { num: "9", label: "Countries" }]
              .map((s, i) => (
                <div key={i} className="stat-card bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors duration-300">
                  <div className="text-2xl font-bold text-blue-300">{s.num}</div>
                  <div className="text-blue-200 text-sm">{s.label}</div>
                </div>
              ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-blue-200 text-sm">
            <Shield className="w-4 h-4" />
            <span>Your data is safe and secure with us</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12 anim-right">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-5">
              <img src={logo} alt="Nobal Navigator" className="h-12 w-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div className="text-left">
                <div className="text-blue-900 font-bold text-lg leading-none">Nobal Navigator</div>
                <div className="text-gray-500 text-xs">Pvt Ltd</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-blue-900">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-gray-500 mt-2">
              {mode === "login" ? "Sign in to book your consultation" : "Join thousands of students studying abroad"}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-gray-200 rounded-xl p-1 mb-8">
            <button onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === "login" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              Sign In
            </button>
            <button onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === "signup" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              Create Account
            </button>
          </div>

          <Card className="border-0 shadow-xl shadow-blue-100/50">
            <CardContent className="p-8">
              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="login-email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="login-email" type="email" value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="pl-10 h-11 border-gray-200 focus:border-blue-400 transition-colors" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="login-password" type={showPassword ? "text" : "password"} value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-400 transition-colors" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-gray-700 font-medium">Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="signup-name" type="text" value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        placeholder="John Doe" className="pl-10 h-11 border-gray-200" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="signup-email" type="email" value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="you@example.com" className="pl-10 h-11 border-gray-200" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="signup-phone" type="tel" value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        placeholder="+1 (234) 567-8900" className="pl-10 h-11 border-gray-200" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="signup-password" type={showPassword ? "text" : "password"} value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="Min. 6 characters" className="pl-10 pr-10 h-11 border-gray-200" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="signup-confirm" type={showConfirmPassword ? "text" : "password"} value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password" className="pl-10 pr-10 h-11 border-gray-200" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 text-center space-y-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors block">
              ← Back to Website
            </Link>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400">Admin?</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-700 font-medium transition-colors">
              <Shield className="w-4 h-4" />
              Admin Login Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}