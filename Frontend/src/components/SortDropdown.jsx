const SortDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const sortOptions = [
    { value: "date|DESC", label: "Date (Newest First)" },
    { value: "date|ASC", label: "Date (Oldest First)" },
    { value: "quantity|DESC", label: "Quantity (High to Low)" },
    { value: "quantity|ASC", label: "Quantity (Low to High)" },
    { value: "customer_name|ASC", label: "Customer Name (A-Z)" },
    { value: "customer_name|DESC", label: "Customer Name (Z-A)" },
  ];

  const currentValue = `${sortBy}|${sortOrder}`;

  const handleChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split("|");
    onSortChange({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        value={currentValue}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
