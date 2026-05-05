import { DollarSign, TrendingUp, Calendar } from "lucide-react";

const data = [
  { name: "Mon", earnings: 4000 },
  { name: "Tue", earnings: 3000 },
  { name: "Wed", earnings: 5000 },
  { name: "Thu", earnings: 4500 },
  { name: "Fri", earnings: 6000 },
  { name: "Sat", earnings: 7500 },
  { name: "Sun", earnings: 7000 },
];

const transactions = [
  { id: "TXN001", date: "Apr 27, 2026", amount: "₹12,450", status: "Completed", type: "Daily Settlement" },
  { id: "TXN002", date: "Apr 26, 2026", amount: "₹10,200", status: "Completed", type: "Daily Settlement" },
  { id: "TXN003", date: "Apr 25, 2026", amount: "₹15,800", status: "Completed", type: "Daily Settlement" },
  { id: "TXN004", date: "Apr 24, 2026", amount: "₹11,500", status: "Pending", type: "Daily Settlement" },
];

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

const TransactionCard = ({ txn }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-900 text-sm">{txn.id}</p>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              txn.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {txn.status}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-1">{txn.type}</p>
        <p className="text-xs text-gray-500">{txn.date}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-green-600">{txn.amount}</p>
      </div>
    </div>
  </div>
);

const WeeklyChart = () => {
  const chartData = [
    { day: 'Mon', value: 4000 },
    { day: 'Tue', value: 3000 },
    { day: 'Wed', value: 5000 },
    { day: 'Thu', value: 4500 },
    { day: 'Fri', value: 6000 },
    { day: 'Sat', value: 7500 },
    { day: 'Sun', value: 7000 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Weekly Earnings</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">₹{(item.value/1000).toFixed(1)}k</span>
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${(item.value / maxValue) * 100}px` }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const chartData = [
  { day: 'Mon', value: 4000 },
  { day: 'Tue', value: 3000 },
  { day: 'Wed', value: 5000 },
  { day: 'Thu', value: 4500 },
  { day: 'Fri', value: 6000 },
  { day: 'Sat', value: 7500 },
  { day: 'Sun', value: 7000 },
];

const PartnerEarnings = () => {
  const maxValue = Math.max(...chartData.map(d => d.value));

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
            value="₹42,450"
            trend="up"
            trendValue="15%"
            color={{ bg: 'bg-green-100', icon: 'text-green-600' }}
          />
          <EarningsCard
            icon={Calendar}
            title="This Month"
            value="₹1.85L"
            color={{ bg: 'bg-orange-100', icon: 'text-orange-600' }}
          />
          <EarningsCard
            icon={DollarSign}
            title="Pending"
            value="₹11,500"
            color={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
          />
        </div>
        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <EarningsCard
            icon={DollarSign}
            title="This Week"
            value="₹42,450"
            trend="up"
            trendValue="15%"
            color={{ bg: 'bg-green-100', icon: 'text-green-600' }}
          />
          <EarningsCard
            icon={Calendar}
            title="This Month"
            value="₹1.85L"
            color={{ bg: 'bg-orange-100', icon: 'text-orange-600' }}
          />
          <EarningsCard
            icon={DollarSign}
            title="Pending"
            value="₹11,500"
            color={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
          />
        </div>
      </div>

      {/* Weekly Chart - Responsive */}
      <div>
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Weekly Earnings</h3>
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="h-32 lg:h-64 flex items-end justify-between gap-2 lg:gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs lg:text-sm text-gray-600 mb-1 lg:mb-2">₹{(item.value/1000).toFixed(1)}k</span>
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(item.value / maxValue) * 100}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History - Responsive */}
      <div>
        <div className="flex items-center justify-between mb-3 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Transactions</h2>
          <button className="text-orange-600 text-sm lg:text-base font-medium">View All</button>
        </div>
        <div className="space-y-3 lg:space-y-4">
          {transactions.map((txn) => (
            <TransactionCard key={txn.id} txn={txn} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerEarnings;
