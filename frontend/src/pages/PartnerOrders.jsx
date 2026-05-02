import { Search, Filter } from "lucide-react";

const allOrders = [
  { id: "#12345", customer: "Rajesh Kumar", items: ["Paneer Butter Masala", "Naan x2"], amount: "₹450", status: "Preparing", time: "5 min ago", address: "123 MG Road, Bangalore" },
  { id: "#12344", customer: "Priya Sharma", items: ["Biryani", "Raita", "Gulab Jamun"], amount: "₹680", status: "Accepted", time: "12 min ago", address: "45 Park Street, Kolkata" },
  { id: "#12343", customer: "Amit Patel", items: ["Masala Dosa"], amount: "₹250", status: "Delivered", time: "25 min ago", address: "78 SV Road, Mumbai" },
  { id: "#12342", customer: "Sneha Reddy", items: ["Dal Makhani", "Jeera Rice", "Roti x4", "Lassi"], amount: "₹920", status: "Delivered", time: "35 min ago", address: "12 Banjara Hills, Hyderabad" },
  { id: "#12341", customer: "Vikram Singh", items: ["Chicken Tikka", "Roomali Roti x2"], amount: "₹540", status: "Delivered", time: "48 min ago", address: "56 Connaught Place, Delhi" },
];

const PartnerOrders = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all your orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {allOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{order.id}</h3>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
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
                  <p className="text-gray-600">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{order.amount}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium mb-2">Items:</p>
                <ul className="space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <strong>Delivery:</strong> {order.address}
                </p>
                {order.status !== "Delivered" && (
                  <div className="flex gap-2">
                    {order.status === "Accepted" && (
                      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-sm">
                        Mark as Preparing
                      </button>
                    )}
                    {order.status === "Preparing" && (
                      <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-sm">
                        Mark as Ready
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerOrders;
