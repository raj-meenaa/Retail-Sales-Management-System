import { FiCopy, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TransactionTable = ({ data, loading, pagination, onPageChange }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-CA");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Customer ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Customer name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Age
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Product Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Customer region
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Product ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Employee name
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((transaction, index) => (
              <tr key={transaction.id || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.transaction_id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.customer_id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.customer_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {transaction.phone_number}
                    <button
                      onClick={() => copyToClipboard(transaction.phone_number)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.gender}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.age}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.product_category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {String(transaction.quantity).padStart(2, "0")}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  ₹ {transaction.total_amount?.toLocaleString("en-IN") || 0}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.customer_region}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.product_id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.employee_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <FiChevronLeft size={20} />
          </button>

          <span className="text-sm text-gray-700">
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
