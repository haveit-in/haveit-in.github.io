import { Link, useNavigate } from "react-router";
import Store from "lucide-react/dist/esm/icons/store";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function PartnerLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // Step 1: Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("✅ Google Sign-In successful:", user.email);

      // Step 2: Get Firebase ID token
      const firebaseToken = await user.getIdToken();

      // Step 3: Send token to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: firebaseToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend login failed");
      }

      const data = await response.json();
      console.log("✅ Backend login response:", data);

      // Store user and token
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Step 4: Role-based redirect
      if (data.user.roles && data.user.roles.includes("restaurant_owner")) {
        console.log("✅ User is restaurant owner, redirecting to dashboard");
        navigate("/partner/dashboard");
      } else {
        console.log("✅ User is not restaurant owner, redirecting to register");
        navigate("/partner/register");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please try again.");
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
              <span className="text-orange-500">HaveIt</span>{" "}
              <span className="text-gray-900">Partner</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your restaurant dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Only Google login available
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            New here?{" "}
            <Link
              to="/partner/register"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Register your restaurant
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
