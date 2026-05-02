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

const PartnerEarnings = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Earnings</h1>
        <p className="text-gray-600">Track your revenue and payouts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              15%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">This Week</p>
          <p className="text-3xl font-bold">₹42,450</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">₹1,85,000</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Pending Payout</p>
          <p className="text-3xl font-bold">₹11,500</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-6">Weekly Earnings</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Weekly earnings chart would be displayed here</p>
            <p className="text-gray-500 text-sm mt-2">Integrate with chart library (recharts)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((txn) => (
            <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium">{txn.id}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      txn.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {txn.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{txn.type}</p>
                <p className="text-xs text-gray-500">{txn.date}</p>
              </div>
              <p className="text-xl font-bold text-green-600">{txn.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerEarnings;
