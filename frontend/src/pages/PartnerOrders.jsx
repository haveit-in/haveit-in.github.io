import { Search, Filter } from "lucide-react";

const allOrders = [
  { id: "#12345", customer: "Rajesh Kumar", items: ["Paneer Butter Masala", "Naan x2"], amount: "₹450", status: "Preparing", time: "5 min ago", address: "123 MG Road, Bangalore" },
  { id: "#12344", customer: "Priya Sharma", items: ["Biryani", "Raita", "Gulab Jamun"], amount: "₹680", status: "Accepted", time: "12 min ago", address: "45 Park Street, Kolkata" },
  { id: "#12343", customer: "Amit Patel", items: ["Masala Dosa"], amount: "₹250", status: "Delivered", time: "25 min ago", address: "78 SV Road, Mumbai" },
  { id: "#12342", customer: "Sneha Reddy", items: ["Dal Makhani", "Jeera Rice", "Roti x4", "Lassi"], amount: "₹920", status: "Delivered", time: "35 min ago", address: "12 Banjara Hills, Hyderabad" },
  { id: "#12341", customer: "Vikram Singh", items: ["Chicken Tikka", "Roomali Roti x2"], amount: "₹540", status: "Delivered", time: "48 min ago", address: "56 Connaught Place, Delhi" },
];

const OrderCard = ({ order }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-semibold text-gray-900">{order.id}</p>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
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
        <p className="text-sm text-gray-600 mb-1">{order.customer}</p>
        <p className="text-xs text-gray-500">{order.time}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-orange-600">{order.amount}</p>
      </div>
    </div>

    <div className="bg-gray-50 rounded-xl p-3 mb-3">
      <p className="text-xs font-medium text-gray-700 mb-2">Items:</p>
      <div className="space-y-1">
        {order.items.map((item, index) => (
          <p key={index} className="text-xs text-gray-600">• {item}</p>
        ))}
      </div>
    </div>

    <div className="mb-3">
      <p className="text-xs text-gray-600 mb-1">
        <strong>Delivery:</strong> {order.address}
      </p>
    </div>

    {order.status !== "Delivered" && (
      <div className="flex gap-2">
        {order.status === "Accepted" && (
          <button className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-xs font-medium hover:shadow-lg transition-all">
            Mark as Preparing
          </button>
        )}
        {order.status === "Preparing" && (
          <button className="flex-1 py-2 px-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-xs font-medium hover:shadow-lg transition-all">
            Mark as Ready
          </button>
        )}
      </div>
    )}
  </div>
);

const PartnerOrders = () => {
  return (
    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          <button className="py-3 lg:py-3 px-4 lg:px-6 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 text-sm lg:text-base font-medium">
            <Filter className="w-4 h-4 lg:w-5 lg:h-5" />
            Filter Orders
          </button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Pending', 'Preparing', 'Completed'].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-xl text-sm lg:text-base font-medium whitespace-nowrap transition-colors ${
              status === 'All'
                ? 'bg-orange-500 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List - Responsive Layout */}
      <div className="space-y-3 lg:space-y-4">
        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {allOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
        
        {/* Mobile: List Layout */}
        <div className="lg:hidden space-y-3">
          {allOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerOrders;
