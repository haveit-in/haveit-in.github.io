import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Users, ArrowUpRight } from "lucide-react";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("12months");
  const { getAuthHeaders } = useAuth();

  const revenueData = [
    { month: "Jan", revenue: 45000, orders: 320 },
    { month: "Feb", revenue: 52000, orders: 380 },
    { month: "Mar", revenue: 48000, orders: 350 },
    { month: "Apr", revenue: 61000, orders: 430 },
    { month: "May", revenue: 55000, orders: 390 },
    { month: "Jun", revenue: 67000, orders: 470 },
    { month: "Jul", revenue: 72000, orders: 510 },
    { month: "Aug", revenue: 68000, orders: 480 },
    { month: "Sep", revenue: 75000, orders: 530 },
    { month: "Oct", revenue: 82000, orders: 580 },
    { month: "Nov", revenue: 78000, orders: 550 },
    { month: "Dec", revenue: 89000, orders: 620 },
  ];

  const categoryData = [
    { name: "Burgers", value: 4200, color: "#f97316" },
    { name: "Pizza", value: 3800, color: "#fb923c" },
    { name: "Sushi", value: 3200, color: "#fdba74" },
    { name: "Mexican", value: 2500, color: "#fed7aa" },
    { name: "Indian", value: 2100, color: "#ffedd5" },
    { name: "Others", value: 1800, color: "#e2e8f0" },
  ];

  const performanceData = [
    { day: "Mon", avgDelivery: 28, satisfaction: 4.5 },
    { day: "Tue", avgDelivery: 32, satisfaction: 4.3 },
    { day: "Wed", avgDelivery: 25, satisfaction: 4.6 },
    { day: "Thu", avgDelivery: 30, satisfaction: 4.4 },
    { day: "Fri", avgDelivery: 35, satisfaction: 4.2 },
    { day: "Sat", avgDelivery: 40, satisfaction: 4.0 },
    { day: "Sun", avgDelivery: 38, satisfaction: 4.1 },
  ];

  const [kpiData, setKpiData] = useState([
    {
      title: "Total Revenue",
      value: "$824,592",
      change: "+15.3%",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Orders",
      value: "5,490",
      change: "+12.8%",
      icon: ShoppingBag,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8.2%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Growth Rate",
      value: "24.5%",
      change: "+3.1%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
  ]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/analytics`, {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.kpi) {
            setKpiData(data.kpi);
          }
        }
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [getAuthHeaders]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">
            Track performance metrics and business insights
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="12months">Last 12 Months</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mb-2">{kpi.value}</p>
                    <div className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue & Orders Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Orders Trend (12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={revenueData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <defs>
                <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
                formatter={(value, name) => {
                  if (name === "revenue") return `$${value.toLocaleString()}`;
                  return value;
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={3}
                fill="url(#revenueAreaGradient)"
                name="Revenue ($)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance & Delivery Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`category-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [`${value} orders`, "Total"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Average Delivery Time (minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={performanceData}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <defs>
                  <linearGradient id="deliveryBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [`${value} min`, "Avg Time"]}
                />
                <Bar
                  dataKey="avgDelivery"
                  fill="url(#deliveryBarGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Satisfaction Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Satisfaction Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-700">4.3</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Average Rating</h4>
              <p className="text-sm text-slate-500">Based on 2,847 reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-700">32</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Avg Delivery Time</h4>
              <p className="text-sm text-slate-500">Minutes per order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-700">94%</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">On-Time Delivery</h4>
              <p className="text-sm text-slate-500">Orders delivered on time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
