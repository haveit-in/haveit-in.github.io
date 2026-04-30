import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Users,
  BarChart3,
  Search,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Store, label: "Restaurants", path: "/admin/restaurants" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Protect admin route - only admins can access
  if (!isAuthenticated || !user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              HaveIt
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || "admin@haveit.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search restaurants, orders, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Admin Dropdown */}
            <div className="relative">
              <button className="flex items-center gap-2 p-1.5 pl-3 hover:bg-slate-100 rounded-xl transition-colors">
                <span className="text-sm font-medium text-slate-700">
                  {user?.name || "Admin"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
