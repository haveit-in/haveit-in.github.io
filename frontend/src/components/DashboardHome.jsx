import { TrendingUp, DollarSign, ShoppingBag, Clock, CheckCircle2, Package, Menu as MenuIcon } from "lucide-react";

const orders = [
  { id: "#12345", customer: "Rajesh Kumar", items: "2 items", amount: "₹450", status: "Preparing", time: "5 min ago" },
  { id: "#12344", customer: "Priya Sharma", items: "3 items", amount: "₹680", status: "Accepted", time: "12 min ago" },
  { id: "#12343", customer: "Amit Patel", items: "1 item", amount: "₹250", status: "Delivered", time: "25 min ago" },
  { id: "#12342", customer: "Sneha Reddy", items: "4 items", amount: "₹920", status: "Delivered", time: "35 min ago" },
  { id: "#12341", customer: "Vikram Singh", items: "2 items", amount: "₹540", status: "Delivered", time: "48 min ago" },
];

export function DashboardHome() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your restaurant overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              12%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Today's Orders</p>
          <p className="text-3xl font-bold">45</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              8%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Today's Revenue</p>
          <p className="text-3xl font-bold">₹12,450</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
          <p className="text-3xl font-bold">8</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Menu Items</p>
          <p className="text-3xl font-bold">42</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <button className="text-orange-600 hover:text-orange-700 text-sm">View All</button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium">{order.id}</p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Preparing"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.items} • {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              Add Menu Item
            </button>
            <button className="w-full py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <MenuIcon className="w-5 h-5" />
              Update Menu
            </button>
            <button className="w-full py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              View Earnings
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium mb-3">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">37</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">In Progress</span>
                <span className="font-medium text-orange-600">8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cancelled</span>
                <span className="font-medium text-red-600">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
