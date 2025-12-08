import { FiSearch, FiFileText } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const TopBar = ({ onSearch, searchValue, sortBy, sortOrder, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  const sortOptions = [
    { value: "date|DESC", label: "Date (Newest First)" },
    { value: "date|ASC", label: "Date (Oldest First)" },
    { value: "quantity|DESC", label: "Quantity (High to Low)" },
    { value: "quantity|ASC", label: "Quantity (Low to High)" },
    { value: "customer_name|ASC", label: "Customer Name (A-Z)" },
    { value: "customer_name|DESC", label: "Customer Name (Z-A)" },
  ];

  const currentValue = `${sortBy}|${sortOrder}`;

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split("|");
    onSortChange({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiFileText className="text-gray-400" size={20} />
          <h1 className="text-lg font-semibold text-gray-900">
            Sales Management System
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Name, Phone no."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <select
            value={currentValue}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
