import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const EarningsCard = ({ icon: Icon, title, value, trend, trendValue, color }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[160px] flex-shrink-0">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 ${color.bg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color.icon}`} />
      </div>
      {trend && (
        <span className={`text-xs flex items-center gap-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className="w-3 h-3" />
          {trendValue}
        </span>
      )}
    </div>
    <p className="text-gray-600 text-xs mb-1">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const TransactionCard = ({ txn }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 text-sm">{txn.order_number || txn.payment_id}</p>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                txn.payment_status === "PAID" || txn.payment_status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : txn.payment_status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {txn.payment_status || txn.status}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-1">Payment ID: {txn.payment_id || 'N/A'}</p>
          <p className="text-xs text-gray-500">{formatDate(txn.created_at || txn.date)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">₹{txn.amount?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </div>
  );
};

const WeeklyChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Weekly Earnings</h3>
        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
          No earnings data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...chartData.map(d => d.amount || 0));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Weekly Earnings</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">₹{((item.amount || 0)/1000).toFixed(1)}k</span>
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${maxValue > 0 ? ((item.amount || 0) / maxValue) * 100 : 0}px` }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PartnerEarnings = () => {
  const { fetchWithAuth } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/partner/dashboard/earnings`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch earnings data');
        }
        
        const data = await response.json();
        setEarnings(data);
      } catch (err) {
        console.error('Error fetching earnings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [fetchWithAuth]);

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '₹0';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error loading earnings</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const weeklyEarnings = earnings?.weekly_earnings || 0;
  const monthlyEarnings = earnings?.monthly_earnings || 0;
  const pendingAmount = earnings?.pending_amount || 0;
  const weeklyChart = earnings?.weekly_chart || [];
  const transactions = earnings?.transactions || [];

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Stats Cards - Responsive Layout */}
      <div>
        <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3 lg:mb-6">Earnings Overview</h2>
        {/* Mobile: Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
          <EarningsCard
            icon={DollarSign}
            title="This Week"
            value={formatCurrency(weeklyEarnings)}
            trend="up"
            trendValue="15%"
            color={{ bg: 'bg-green-100', icon: 'text-green-600' }}
          />
          <EarningsCard
            icon={Calendar}
            title="This Month"
            value={formatCurrency(monthlyEarnings)}
            color={{ bg: 'bg-orange-100', icon: 'text-orange-600' }}
          />
          <EarningsCard
            icon={DollarSign}
            title="Pending"
            value={formatCurrency(pendingAmount)}
            color={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
          />
        </div>
        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <EarningsCard
            icon={DollarSign}
            title="This Week"
            value={formatCurrency(weeklyEarnings)}
            trend="up"
            trendValue="15%"
            color={{ bg: 'bg-green-100', icon: 'text-green-600' }}
          />
          <EarningsCard
            icon={Calendar}
            title="This Month"
            value={formatCurrency(monthlyEarnings)}
            color={{ bg: 'bg-orange-100', icon: 'text-orange-600' }}
          />
          <EarningsCard
            icon={DollarSign}
            title="Pending"
            value={formatCurrency(pendingAmount)}
            color={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
          />
        </div>
      </div>

      {/* Weekly Chart - Responsive */}
      <div>
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Weekly Earnings</h3>
        <WeeklyChart chartData={weeklyChart} />
      </div>

      {/* Transaction History - Responsive */}
      <div>
        <div className="flex items-center justify-between mb-3 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Transactions</h2>
          <button className="text-orange-600 text-sm lg:text-base font-medium">View All</button>
        </div>
        <div className="space-y-3 lg:space-y-4">
          {transactions.length > 0 ? (
            transactions.map((txn, index) => (
              <TransactionCard key={txn.payment_id || txn.id || index} txn={txn} />
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartnerEarnings;
