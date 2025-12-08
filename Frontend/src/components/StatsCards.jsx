import { FiInfo } from "react-icons/fi";

const StatsCards = ({ statistics }) => {
  const formatCurrency = (amount) => {
    const value = Math.round(amount || 0);
    return `₹ (${(value / 1000).toFixed(0)} SRs)`;
  };

  const formatNumber = (num) => {
    return (num || 0).toLocaleString();
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Total units sold"
        value={formatNumber(statistics.total_units)}
      />
      <StatCard
        label="Total Amount"
        value={formatCurrency(statistics.total_amount)}
      />
      <StatCard
        label="Total Discount"
        value={formatCurrency(statistics.total_discount)}
      />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm text-gray-600">{label}</span>
      <FiInfo size={14} className="text-gray-400" />
    </div>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default StatsCards;
