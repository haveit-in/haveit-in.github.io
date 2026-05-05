import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Store,
  Users,
  Star,
  Clock,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const [kpiData, setKpiData] = useState([
    {
      title: "Total Orders",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Total Revenue",
      value: "$284,592",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Restaurants",
      value: "342",
      change: "+5.1%",
      trend: "up",
      icon: Store,
    },
    {
      title: "New Users",
      value: "1,429",
      change: "-2.4%",
      trend: "down",
      icon: Users,
    },
  ]);

  const [ordersChartData] = useState([
    { day: "Mon", orders: 145 },
    { day: "Tue", orders: 189 },
    { day: "Wed", orders: 167 },
    { day: "Thu", orders: 223 },
    { day: "Fri", orders: 298 },
    { day: "Sat", orders: 356 },
    { day: "Sun", orders: 312 },
  ]);

  const [revenueChartData] = useState([
    { day: "Mon", revenue: 12500 },
    { day: "Tue", revenue: 15600 },
    { day: "Wed", revenue: 14200 },
    { day: "Thu", revenue: 18900 },
    { day: "Fri", revenue: 24300 },
    { day: "Sat", revenue: 28900 },
    { day: "Sun", revenue: 26100 },
  ]);

  const [topRestaurants] = useState([
    {
      name: "Burger Palace",
      owner: "John Smith",
      rating: 4.8,
      orders: 1247,
      image: "https://api.dicebear.com/7.x/initials/svg?seed=BP",
    },
    {
      name: "Sushi Master",
      owner: "Yuki Tanaka",
      rating: 4.9,
      orders: 1089,
      image: "https://api.dicebear.com/7.x/initials/svg?seed=SM",
    },
    {
      name: "Pizza Heaven",
      owner: "Marco Rossi",
      rating: 4.7,
      orders: 967,
      image: "https://api.dicebear.com/7.x/initials/svg?seed=PH",
    },
    {
      name: "Taco Fiesta",
      owner: "Maria Garcia",
      rating: 4.6,
      orders: 845,
      image: "https://api.dicebear.com/7.x/initials/svg?seed=TF",
    },
  ]);

  const [recentOrders] = useState([
    {
      id: "#ORD-4829",
      customer: "Sarah Johnson",
      restaurant: "Burger Palace",
      amount: "$45.50",
      status: "delivered",
      time: "5 mins ago",
    },
    {
      id: "#ORD-4828",
      customer: "Mike Chen",
      restaurant: "Sushi Master",
      amount: "$78.20",
      status: "in-transit",
      time: "12 mins ago",
    },
    {
      id: "#ORD-4827",
      customer: "Emma Wilson",
      restaurant: "Pizza Heaven",
      amount: "$32.90",
      status: "preparing",
      time: "18 mins ago",
    },
    {
      id: "#ORD-4826",
      customer: "Alex Brown",
      restaurant: "Taco Fiesta",
      amount: "$24.75",
      status: "delivered",
      time: "25 mins ago",
    },
  ]);

  const { getAuthHeaders } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        // Update KPI data with real data
        if (data.kpi) {
          setKpiData(data.kpi);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statusColors = {
    delivered: "bg-green-100 text-green-700 border-green-200",
    "in-transit": "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-orange-100 text-orange-700 border-orange-200",
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={kpi.title}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1">{kpi.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{kpi.value}</p>
                    <div
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendIcon className="w-4 h-4" />
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                      kpi.trend === "up"
                        ? "bg-gradient-to-br from-orange-500 to-orange-600"
                        : "bg-gradient-to-br from-slate-400 to-slate-500"
                    } shadow-md`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={ordersChartData}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={revenueChartData}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Restaurants */}
        <Card>
          <CardHeader>
            <CardTitle>Top Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.name}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-bold text-slate-400 w-6">#{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                      <span className="text-white font-semibold text-sm">
                        {restaurant.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{restaurant.name}</p>
                      <p className="text-sm text-slate-500 truncate">{restaurant.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span className="font-semibold text-slate-900">{restaurant.rating}</span>
                    </div>
                    <p className="text-xs text-slate-500">{restaurant.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-slate-600 truncate">{order.customer}</p>
                    <p className="text-xs text-slate-500 truncate">{order.restaurant}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 mb-1">{order.amount}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{order.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
