import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, ShoppingBag, Menu as MenuIcon, DollarSign, Settings, Bell, User, Plus, LogOut } from "lucide-react";

const mainNavigation = [
  { name: "Dashboard", path: "/partner/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/partner/dashboard/orders", icon: ShoppingBag },
  { name: "Menu", path: "/partner/dashboard/menu", icon: MenuIcon },
  { name: "Earnings", path: "/partner/dashboard/earnings", icon: DollarSign },
  { name: "Settings", path: "/partner/dashboard/settings", icon: Settings },
];

const accountNavigation = [
  { name: "Logout", path: "/", icon: LogOut },
];

export function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    const currentNav = mainNavigation.find(item => item.path === location.pathname);
    return currentNav ? currentNav.name : "Dashboard";
  };

  const getPageContextualAction = () => {
    if (location.pathname === "/partner/dashboard/menu") {
      const ActionIcon = Plus;
      return { icon: ActionIcon, label: "Add Item", action: () => console.log("Add item") };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar - Compact */}
      <aside className="hidden lg:flex lg:flex-col lg:w-44 lg:bg-white lg:border-r lg:border-gray-200 lg:fixed lg:h-screen lg:left-0 lg:top-0 lg:z-10">
        {/* Logo Section - Aligned with Navbar */}
        <div className="lg:h-16 lg:border-b lg:border-gray-200 lg:flex lg:items-center lg:px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/image/22.png" 
              alt="HaveIt Logo" 
              className="h-6 w-auto"
            />
            <span className="text-sm font-semibold">
              <span className="text-orange-500">HaveIt</span>
              <span className="text-gray-900">Partner</span>
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="lg:flex-1 lg:p-2 lg:space-y-1 lg:overflow-y-auto">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive
                    ? "bg-orange-500 text-white border-l-4 border-l-orange-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="lg:border-t lg:border-gray-100 lg:mt-auto lg:pt-2 lg:px-2">
          <div className="lg:space-y-1">
            {accountNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 transition-colors text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-44">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-10">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/image/22.png" 
              alt="HaveIt Logo" 
              className="h-6 w-auto"
            />
            <span className="text-sm font-semibold">
              <span className="text-orange-500">HaveIt </span>
              <span className="text-gray-900">Partner</span>
            </span>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              to="/partner/dashboard/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
            </Link>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 px-6 items-center justify-between">
          <div className="flex items-center gap-4">
            {(() => {
              const action = getPageContextualAction();
              if (!action) return null;
              const ActionIcon = action.icon;
              return (
                <button 
                  onClick={action.action}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  <ActionIcon className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              );
            })()}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              to="/partner/dashboard/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="max-w-md mx-auto lg:max-w-6xl xl:px-6">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation - Mobile Only - Fixed at Bottom */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around py-2">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                      isActive
                        ? "text-orange-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Floating Action Button - Mobile Only */}
        {(() => {
          const action = getPageContextualAction();
          if (!action) return null;
          const ActionIcon = action.icon;
          return (
            <button className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-30">
              <ActionIcon className="w-6 h-6" />
            </button>
          );
        })()}
      </div>
    </div>
  );
}
