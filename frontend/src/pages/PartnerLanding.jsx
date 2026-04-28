import { Link } from "react-router";
import Store from "lucide-react/dist/esm/icons/store";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";
import Clock from "lucide-react/dist/esm/icons/clock";

export default function PartnerLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
          <Link
            to="/partner/login"
            className="px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Grow your restaurant with{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                HaveIt
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Reach more customers, increase orders, and manage everything in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/partner/login"
                className="px-8 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-center"
              >
                Login
              </Link>
              <Link
                to="/partner/register"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
              >
                Register Your Restaurant
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">More Orders</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">Analytics</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600">Easy Management</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg" />
                    <div>
                      <p className="font-medium">Dashboard Preview</p>
                      <p className="text-sm text-gray-600">Restaurant Analytics</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Today's Orders</p>
                    <p className="text-2xl font-bold text-orange-600">45</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-orange-600">₹12,450</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
