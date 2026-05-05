import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, Package, Plus, Eye } from "lucide-react";

const orders = [
  { id: "#12345", customer: "Rajesh Kumar", items: "2 items", amount: "₹450", status: "Preparing", time: "5 min ago" },
  { id: "#12344", customer: "Priya Sharma", items: "3 items", amount: "₹680", status: "Accepted", time: "12 min ago" },
  { id: "#12343", customer: "Amit Patel", items: "1 item", amount: "₹250", status: "Delivered", time: "25 min ago" },
  { id: "#12342", customer: "Sneha Reddy", items: "4 items", amount: "₹920", status: "Delivered", time: "35 min ago" },
  { id: "#12341", customer: "Vikram Singh", items: "2 items", amount: "₹540", status: "Delivered", time: "48 min ago" },
];

const StatsCard = ({ icon: Icon, title, value, trend, trendValue, color }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[160px] flex-shrink-0">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 ${color.bg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color.icon}`} />
      </div>
      {trend && (
        <span className={`text-xs flex items-center gap-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </span>
      )}
    </div>
    <p className="text-gray-600 text-xs mb-1">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const OrderCard = ({ order }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="font-semibold text-gray-900">{order.id}</p>
        <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
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
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-500">{order.items} • {order.time}</p>
      <p className="font-bold text-gray-900">{order.amount}</p>
    </div>
  </div>
);

const PerformanceChart = () => {
  const data = [
    { day: 'Mon', orders: 32 },
    { day: 'Tue', orders: 45 },
    { day: 'Wed', orders: 38 },
    { day: 'Thu', orders: 52 },
    { day: 'Fri', orders: 48 },
    { day: 'Sat', orders: 65 },
    { day: 'Sun', orders: 58 },
  ];

  const maxOrders = Math.max(...data.map(d => d.orders));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Weekly Performance</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">{item.orders}</span>
              <div 
                className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${(item.orders / maxOrders) * 100}px` }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PartnerDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards - Horizontal Scroll */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Overview</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <StatsCard
            icon={ShoppingBag}
            title="Today's Orders"
            value="45"
            trend="up"
            trendValue="12%"
            color={{ bg: 'bg-orange-100', icon: 'text-orange-600' }}
          />
          <StatsCard
            icon={DollarSign}
            title="Revenue"
            value="₹12,450"
            trend="up"
            trendValue="8%"
            color={{ bg: 'bg-green-100', icon: 'text-green-600' }}
          />
          <StatsCard
            icon={Clock}
            title="Pending"
            value="8"
            trend="down"
            trendValue="3%"
            color={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
          />
          <StatsCard
            icon={Package}
            title="Menu Items"
            value="42"
            color={{ bg: 'bg-purple-100', icon: 'text-purple-600' }}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <button className="text-orange-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Performance Summary</h2>
        <PerformanceChart />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-30">
        <Eye className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PartnerDashboard;
