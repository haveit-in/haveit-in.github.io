import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Store, LayoutDashboard, ShoppingBag, Menu as MenuIcon, DollarSign, Settings, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/dashboard/orders", icon: ShoppingBag },
  { name: "Menu", path: "/dashboard/menu", icon: MenuIcon },
  { name: "Earnings", path: "/dashboard/earnings", icon: DollarSign },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Protect dashboard route - only restaurant owners can access
    if (!isAuthenticated || !user || user.role !== "restaurant_owner") {
      navigate("/partner");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user || user.role !== "restaurant_owner") {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">HaveIt Partner</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/partner"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
