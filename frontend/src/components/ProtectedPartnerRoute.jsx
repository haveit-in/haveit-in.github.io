import { Navigate } from "react-router";
import { useEffect, useState } from "react";

export function ProtectedPartnerRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const token = localStorage.getItem("access_token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token) {
          console.log("❌ No token found");
          setIsAuthorized(false);
          return;
        }

        if (!user.roles || !user.roles.includes("restaurant_owner")) {
          console.log("❌ User does not have restaurant_owner role");
          setIsAuthorized(false);
          return;
        }

        console.log("✅ User is authorized as restaurant owner");
        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization check error:", error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/partner/login" replace />;
  }

  return children;
}
