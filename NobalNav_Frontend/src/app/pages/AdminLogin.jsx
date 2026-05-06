import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, Shield, Users, ArrowRight, ShieldX, AlertTriangle } from "lucide-react";
import logo from "../components/logo.png";
import api from "../../api";

function AccessDenied() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center px-4">
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes fadeInScale { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes pulseDanger { 0%,100%{box-shadow:0 0 30px rgba(239,68,68,.3)} 50%{box-shadow:0 0 70px rgba(239,68,68,.6)} }
        .denied-card { animation: fadeInScale 0.5s cubic-bezier(.22,1,.36,1) both; }
        .denied-icon { animation: shake 0.6s 0.5s ease-in-out both, pulseDanger 3s 1.1s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-red-600 opacity-10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-red-800 opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 denied-card text-center">
        <div className="w-28 h-28 bg-red-500/20 border-2 border-red-500/40 rounded-3xl flex items-center justify-center mx-auto mb-6 denied-icon">
          <ShieldX className="w-14 h-14 text-red-400" />
        </div>

        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-300 text-sm font-medium">Access Denied</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-slate-400 text-lg mb-2">You do not have admin privileges.</p>
        <p className="text-slate-500 text-sm mb-8">
          This portal is restricted to authorized administrators only.
          Your login attempt has been blocked and recorded.
        </p>

        <Card className="border border-red-500/20 bg-white/5 backdrop-blur-xl mb-6">
          <CardContent className="p-5">
            <div className="flex items-start gap-3 text-left">
              <Lock className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-medium text-sm mb-1">Unauthorized Access Attempt</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Your credentials do not grant access to the Admin Dashboard.
                  If you believe this is an error, please contact your system administrator.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Link to="/" className="block w-full">
            <Button className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-semibold transition-all duration-300">
              Return to Website
            </Button>
          </Link>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
            <Users className="w-4 h-4" />
            Go to Student / User Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", credentials);

      if (!data.user.is_admin) {
        // Non-admin tried admin portal — logout + show full-screen denied page
        await api.post("/auth/logout");
        setAccessDenied(true);
        return;
      }

      localStorage.setItem("adminUser", JSON.stringify(data.user));
      setIsLoggedIn(true);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (accessDenied) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <style>{`
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px) scale(1.05)} }
        @keyframes floatOrb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-20px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px rgba(59,130,246,.3)} 50%{box-shadow:0 0 60px rgba(99,102,241,.5)} }
        @keyframes cardEntrance { from{opacity:0;transform:translateY(40px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .card-entrance { animation: cardEntrance 0.7s cubic-bezier(.22,1,.36,1) both; }
        .logo-pulse { animation: pulseGlow 3s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-blue-600 opacity-5 blur-3xl"
          style={{ animation: "floatOrb1 8s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-600 opacity-5 blur-3xl"
          style={{ animation: "floatOrb2 10s ease-in-out infinite" }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-400 opacity-5 blur-3xl"
          style={{ animation: "floatOrb3 6s ease-in-out infinite" }} />
      </div>

      <div className="w-full max-w-md relative z-10 card-entrance">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm">Restricted Access</span>
          </div>

          <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 border border-white/20 logo-pulse">
            <img src={logo} alt="Nobal Navigator" className="w-16 h-16 object-contain drop-shadow-lg"
              onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "flex"; }} />
            <div className="w-16 h-16 items-center justify-center hidden">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">Nobal Navigator Pvt Ltd</p>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-slate-300 font-medium text-sm">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="email" name="email" type="email" value={credentials.email}
                    onChange={handleChange} placeholder="admin@nobalnavigator.com"
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 transition-colors"
                    required />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-300 font-medium text-sm">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"}
                    value={credentials.password} onChange={handleChange}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 transition-colors"
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold mt-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/50">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Access Dashboard <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-3">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors block">
            ← Back to Website
          </Link>
          <div className="flex items-center gap-2 justify-center">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-slate-600">Not admin?</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
            <Users className="w-4 h-4" />
            Student / User Login
          </Link>
        </div>
      </div>
    </div>
  );
}