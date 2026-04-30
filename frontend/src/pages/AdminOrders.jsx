import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Search, Clock, MapPin, Phone, DollarSign, Package, Calendar } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { getAuthHeaders } = useAuth();

  const statusConfig = {
    pending: {
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      label: "Pending",
    },
    preparing: {
      className: "bg-orange-100 text-orange-700 border-orange-200",
      label: "Preparing",
    },
    "in-transit": {
      className: "bg-blue-100 text-blue-700 border-blue-200",
      label: "In Transit",
    },
    delivered: {
      className: "bg-green-100 text-green-700 border-green-200",
      label: "Delivered",
    },
    cancelled: {
      className: "bg-red-100 text-red-700 border-red-200",
      label: "Cancelled",
    },
  };

  const mockOrders = [
    {
      id: "#ORD-4829",
      customer: "Sarah Johnson",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      restaurant: "Burger Palace",
      items: 3,
      amount: "$45.50",
      status: "delivered",
      time: "5 mins ago",
      address: "123 Main St, Apt 4B",
      phone: "+1 234 567 8900",
      created_at: new Date().toISOString(),
    },
    {
      id: "#ORD-4828",
      customer: "Mike Chen",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      restaurant: "Sushi Master",
      items: 5,
      amount: "$78.20",
      status: "in-transit",
      time: "12 mins ago",
      address: "456 Oak Ave, Suite 12",
      phone: "+1 234 567 8901",
      created_at: new Date().toISOString(),
    },
    {
      id: "#ORD-4827",
      customer: "Emma Wilson",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      restaurant: "Pizza Heaven",
      items: 2,
      amount: "$32.90",
      status: "preparing",
      time: "18 mins ago",
      address: "789 Pine Rd",
      phone: "+1 234 567 8902",
      created_at: new Date().toISOString(),
    },
    {
      id: "#ORD-4826",
      customer: "Alex Brown",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      restaurant: "Taco Fiesta",
      items: 4,
      amount: "$24.75",
      status: "delivered",
      time: "25 mins ago",
      address: "321 Elm St",
      phone: "+1 234 567 8903",
      created_at: new Date().toISOString(),
    },
    {
      id: "#ORD-4825",
      customer: "Lisa Garcia",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      restaurant: "Curry House",
      items: 6,
      amount: "$92.40",
      status: "preparing",
      time: "32 mins ago",
      address: "555 Maple Dr",
      phone: "+1 234 567 8904",
      created_at: new Date().toISOString(),
    },
    {
      id: "#ORD-4824",
      customer: "David Kim",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      restaurant: "Burger Palace",
      items: 2,
      amount: "$28.50",
      status: "pending",
      time: "45 mins ago",
      address: "999 Cedar Ln",
      phone: "+1 234 567 8905",
      created_at: new Date().toISOString(),
    },
    {
      id: "#ORD-4823",
      customer: "Sophie Martin",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      restaurant: "Pizza Heaven",
      items: 3,
      amount: "$54.30",
      status: "cancelled",
      time: "1 hour ago",
      address: "777 Birch Blvd",
      phone: "+1 234 567 8906",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          // Use mock data if API fails
          setOrders(mockOrders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        // Use mock data as fallback
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getAuthHeaders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateFilter) {
        case "today":
          matchesDate = orderDate >= today;
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: Package,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Active Orders",
      value: orders.filter((o) => o.status === "preparing" || o.status === "in-transit")
        .length,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Delivered Today",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
  ];

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[status]?.className || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {statusConfig[status]?.label || status}
    </span>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="p-6 pb-4">
      {children}
    </div>
  );

  const CardContent = ({ children }) => (
    <div className="p-6 pt-0">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-900">
      {children}
    </h3>
  );

  const CardDescription = ({ children }) => (
    <p className="text-sm text-slate-500 mt-1">
      {children}
    </p>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 mt-1">Manage and track all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                            <span className="text-white font-semibold text-sm">
                              {order.customer?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{order.customer}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Phone className="w-3 h-3" />
                              {order.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {order.restaurant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {order.items} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {order.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-orange-200 text-xs font-medium rounded-lg text-orange-600 bg-white hover:bg-orange-50"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
