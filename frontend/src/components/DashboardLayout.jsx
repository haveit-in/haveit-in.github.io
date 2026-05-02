import { Outlet, Link, useLocation } from "react-router";
import { Store, LayoutDashboard, ShoppingBag, Menu as MenuIcon, DollarSign, Settings, LogOut } from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/partner/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/partner/dashboard/orders", icon: ShoppingBag },
  { name: "Menu", path: "/partner/dashboard/menu", icon: MenuIcon },
  { name: "Earnings", path: "/partner/dashboard/earnings", icon: DollarSign },
  { name: "Settings", path: "/partner/dashboard/settings", icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center gap-2">
              <img 
                src="/image/22.png" 
                alt="HaveIt Logo" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-semibold">
                <span className="text-orange-500">HaveIt</span>{' '}
                <span className="text-gray-900">Partner</span>
              </span>
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
            to="/"
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
