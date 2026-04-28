import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Store from "lucide-react/dist/esm/icons/store";
import LogOut from "lucide-react/dist/esm/icons/log-out";
import Settings from "lucide-react/dist/esm/icons/settings";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";

export default function PartnerDashboard() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Check authorization and fetch user data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("access_token");

        if (!token || !storedUser) {
          navigate("/partner/login");
          return;
        }

        // Verify user is restaurant owner
        if (!storedUser.roles || !storedUser.roles.includes("restaurant_owner")) {
          console.log("❌ User is not a restaurant owner");
          navigate("/partner/register");
          return;
        }

        setUser(storedUser);

        // Fetch user's restaurants
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/restaurants/owner/me`,
          {
            method: "GET",
            headers: getAuthHeader(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();
        setRestaurants(data.restaurants || []);
        console.log("✅ Restaurants loaded:", data.restaurants);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/partner/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/partner/login")}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HaveIt Partner</h1>
              <p className="text-xs text-gray-500">Restaurant Dashboard</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">
            Manage your restaurant and track your performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Restaurants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {restaurants.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Restaurants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {restaurants.filter((r) => r.status === "approved").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {restaurants.filter((r) => r.status === "pending" || r.status === "submitted").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Restaurants Section */}
        <div className="bg-white rounded-2xl shadow border border-gray-100">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">Your Restaurants</h3>
          </div>

          {restaurants.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No restaurants registered yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start by registering your first restaurant
              </p>
              <Link
                to="/partner/register"
                className="mt-4 inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Register Restaurant
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {restaurant.city}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            restaurant.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : restaurant.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {restaurant.status.charAt(0).toUpperCase() +
                            restaurant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(restaurant.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          to={`/partner/restaurants/${restaurant.id}`}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Restaurant Button */}
        {restaurants.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/partner/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Store className="w-5 h-5" />
              Register Another Restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
