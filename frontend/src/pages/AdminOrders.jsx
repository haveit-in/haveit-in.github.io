import { useState, useEffect, useCallback } from "react";
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

  const fetchOrders = useCallback(async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response with all fields:', data); // Debug log
          
          // Map API response to frontend format with ALL database fields
          const mappedOrders = data.map(order => ({
            // Core order fields
            id: order.order_number || `#${order.id?.slice(-6) || 'Unknown'}`,
            order_id: order.id,
            user_id: order.user_id,
            restaurant_id: order.restaurant_id,
            
            // Customer information (all available fields)
            customer: order.user_name || order.user_email || 'Unknown Customer',
            customerEmail: order.user_email,
            customerPhone: order.user_phone,
            customerPhoto: order.user_photo,
            customerRole: order.user_role,
            customerImage: order.user_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.user_email || 'unknown'}`,
            
            // Restaurant information (all available fields)
            restaurant: order.restaurant_name || 'Unknown Restaurant',
            restaurantOwner: order.restaurant_owner,
            restaurantPhone: order.restaurant_phone,
            restaurantAddress: order.restaurant_address,
            restaurantCity: order.restaurant_city,
            restaurantCuisine: order.restaurant_cuisine,
            restaurantLogo: order.restaurant_logo,
            restaurantRating: order.restaurant_rating,
            restaurantDeliveryFee: order.restaurant_delivery_fee,
            restaurantDeliveryTime: order.restaurant_delivery_time,
            
            // Order financial details
            subtotal: order.subtotal,
            taxAmount: order.tax_amount,
            deliveryFee: order.delivery_fee,
            totalAmount: order.total_amount,
            amount: order.amount || `$${order.total_amount?.toFixed(2) || '0.00'}`,
            
            // Order status and payment
            status: order.order_status || order.status || 'pending',
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            
            // Delivery information
            address: order.delivery_address || 'No address',
            customerLat: order.customer_lat,
            customerLng: order.customer_lng,
            estimatedDeliveryTime: order.estimated_delivery_time,
            
            // Order items
            items: order.items_count || 0,
            orderItems: order.order_items || [],
            
            // Timestamps
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            time: order.time || formatRelativeTime(order.created_at),
            
            // Contact info (prefer user phone, fallback to restaurant)
            phone: order.user_phone || order.restaurant_phone || 'No phone',
            
            // Keep original data for debugging
            _original: order
          }));
          
          console.log('Mapped Orders with all fields:', mappedOrders); // Debug log
          setOrders(mappedOrders);
        } else {
          console.error('API request failed with status:', response.status);
          // Show error instead of using mock data
          setError('Failed to load orders from server');
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Network error while loading orders');
      } finally {
        setLoading(false);
      }
    }, [getAuthHeaders]);

    // Helper function to format relative time
    const formatRelativeTime = (dateString) => {
      if (!dateString) return 'Unknown time';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
        return `${Math.floor(diffMins / 1440)} days ago`;
      } catch (e) {
        return 'Unknown time';
      }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return 'Invalid date';
      }
    };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
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
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No orders found matching your criteria
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{order.id}</p>
                      <StatusBadge status={order.status} />
                      <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-lg">{order.amount}</p>
                      <p className="text-xs text-slate-500">{order.time}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={order.customerImage} 
                        alt={order.customer}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerEmail || 'unknown'}`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{order.customer}</p>
                        <p className="text-xs text-slate-500">{order.customerEmail}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>📱 {order.customerPhone || 'No phone'}</div>
                      <div>👤 {order.customerRole || 'user'}</div>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="bg-orange-50 rounded-lg p-3 space-y-2">
                    <p className="font-medium text-slate-900">{order.restaurant}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>📞 {order.restaurantPhone || 'No phone'}</div>
                      <div>📍 {order.restaurantCity || 'N/A'}</div>
                      <div>🍽️ {order.restaurantCuisine || 'N/A'}</div>
                      {order.restaurantRating && <div>⭐ {order.restaurantRating}</div>}
                    </div>
                    <p className="text-xs text-slate-600">Owner: {order.restaurantOwner || 'N/A'}</p>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2">
                    <div className="font-medium text-slate-900">Order Details</div>
                    <div className="space-y-1 text-sm">
                      <p><strong>Items:</strong> {order.items}</p>
                      <p><strong>Address:</strong> {order.address}</p>
                      <p><strong>Est. Delivery:</strong> {order.estimatedDeliveryTime || 'N/A'}</p>
                      {order.orderItems && order.orderItems.length > 0 && (
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800 text-sm">View Items ({order.orderItems.length})</summary>
                          <div className="mt-1 pl-2 border-l-2 border-gray-200">
                            {order.orderItems.map((item, idx) => (
                              <p key={idx} className="text-xs">• {item.item_name} x{item.quantity} (${item.total_price})</p>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="bg-green-50 rounded-lg p-3 space-y-1">
                    <div className="font-medium text-slate-900">Financial Details</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>Subtotal:</strong> ${order.subtotal?.toFixed(2) || '0.00'}</div>
                      <div><strong>Tax:</strong> ${order.taxAmount?.toFixed(2) || '0.00'}</div>
                      <div><strong>Delivery:</strong> ${order.deliveryFee?.toFixed(2) || '0.00'}</div>
                      <div><strong>Total:</strong> {order.amount}</div>
                      <div><strong>Payment:</strong> {order.paymentMethod || 'N/A'}</div>
                      <div><strong>Status:</strong> {order.paymentStatus || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Updated: {formatDate(order.updatedAt)}
                    </div>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-orange-200 text-xs font-medium rounded-lg text-orange-600 bg-white hover:bg-orange-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Restaurant Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Financials
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{order.id}</p>
                          <p className="text-xs text-slate-500">Created: {formatDate(order.createdAt)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <img 
                              src={order.customerImage} 
                              alt={order.customer}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerEmail || 'unknown'}`}
                            />
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{order.customer}</p>
                              <p className="text-xs text-slate-500">{order.customerEmail}</p>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">
                            <p>📱 {order.customerPhone || 'No phone'}</p>
                            <p>👤 {order.customerRole || 'user'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900 text-sm">{order.restaurant}</p>
                          <p className="text-xs text-slate-500">Owner: {order.restaurantOwner || 'N/A'}</p>
                          <div className="text-xs text-slate-600">
                            <p>📞 {order.restaurantPhone || 'No phone'}</p>
                            <p>📍 {order.restaurantCity || 'N/A'}</p>
                            <p>🍽️ {order.restaurantCuisine || 'N/A'}</p>
                            {order.restaurantRating && <p>⭐ {order.restaurantRating}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="space-y-1 text-xs">
                          <p><strong>Items:</strong> {order.items}</p>
                          <p><strong>Address:</strong> {order.address?.substring(0, 30)}{order.address?.length > 30 ? '...' : ''}</p>
                          <p><strong>Est. Delivery:</strong> {order.estimatedDeliveryTime || 'N/A'}</p>
                          {order.customerLat && order.customerLng && (
                            <p><strong>Location:</strong> {order.customerLat.toFixed(4)}, {order.customerLng.toFixed(4)}</p>
                          )}
                          {order.orderItems && order.orderItems.length > 0 && (
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:text-blue-800">View Items ({order.orderItems.length})</summary>
                              <div className="mt-1 pl-2 border-l-2 border-gray-200">
                                {order.orderItems.map((item, idx) => (
                                  <p key={idx} className="text-xs">• {item.item_name} x{item.quantity} (${item.total_price})</p>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="space-y-1 text-xs">
                          <p><strong>Subtotal:</strong> ${order.subtotal?.toFixed(2) || '0.00'}</p>
                          <p><strong>Tax:</strong> ${order.taxAmount?.toFixed(2) || '0.00'}</p>
                          <p><strong>Delivery:</strong> ${order.deliveryFee?.toFixed(2) || '0.00'}</p>
                          <p className="font-semibold text-slate-900"><strong>Total:</strong> {order.amount}</p>
                          <p><strong>Payment:</strong> {order.paymentMethod || 'N/A'}</p>
                          <p><strong>Status:</strong> {order.paymentStatus || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                        <p>{order.time}</p>
                        <p className="text-slate-400">{formatDate(order.updatedAt)}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
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
