import { Link, useNavigate } from "react-router";
import Store from "lucide-react/dist/esm/icons/store";
import Mail from "lucide-react/dist/esm/icons/mail";
import Lock from "lucide-react/dist/esm/icons/lock";
import { useState } from "react";
import { loginWithGooglePartner } from "../utils/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginWithGooglePartner(login);
      
      console.log("RESPONSE:", response);
      
      if (response.requiresOnboarding) {
        navigate("/partner/register");
        return;
      }
      
      // existing partner with completed profile
      navigate("/dashboard");
    } catch (error) {
      console.error("Partner login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img 
                src="/image/22.png" 
                alt="HaveIt Logo" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-semibold">
                <span className="text-orange-500">HaveIt</span>{' '}
                <span className="text-gray-900">Partner</span>
              </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your restaurant dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="restaurant@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-orange-600 hover:text-orange-700">
                Forgot password?
              </a>
            </div>

            <Link
              to="/dashboard"
              className="block w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
            >
              Sign In
            </Link>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New here?{" "}
            <Link to="/partner/register" className="text-orange-600 hover:text-orange-700 font-medium">
              Register your restaurant
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
