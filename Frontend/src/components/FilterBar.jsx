import { FiRefreshCw, FiChevronDown, FiCalendar } from "react-icons/fi";
import { useState, useEffect } from "react";
import { salesAPI } from "../services/api";

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await salesAPI.getFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };
    fetchOptions();
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset Filters"
        >
          <FiRefreshCw size={20} className="text-gray-600" />
        </button>

        <FilterDropdown
          label="Customer Region"
          options={filterOptions.regions}
          selected={filters.regions || []}
          onChange={(values) => onFilterChange({ regions: values })}
          showAll
        />

        <FilterDropdown
          label="Gender"
          options={filterOptions.genders}
          selected={filters.genders || []}
          onChange={(values) => onFilterChange({ genders: values })}
          showAll
        />

        <AgeRangeFilter
          ageMin={filters.ageMin}
          ageMax={filters.ageMax}
          onChange={(ageMin, ageMax) => onFilterChange({ ageMin, ageMax })}
        />

        <FilterDropdown
          label="Product Category"
          options={filterOptions.categories}
          selected={filters.categories || []}
          onChange={(values) => onFilterChange({ categories: values })}
        />

        <FilterDropdown
          label="Tags"
          options={filterOptions.tags}
          selected={filters.tags || []}
          onChange={(values) => onFilterChange({ tags: values })}
          badge={filters.tags?.length || 0}
        />

        <FilterDropdown
          label="Payment Methods"
          options={filterOptions.paymentMethods}
          selected={filters.paymentMethods || []}
          onChange={(values) => onFilterChange({ paymentMethods: values })}
        />

        <DateRangeFilter
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={(startDate, endDate) =>
            onFilterChange({ startDate, endDate })
          }
        />
      </div>
    </div>
  );
};

const FilterDropdown = ({
  label,
  options,
  selected,
  onChange,
  showAll,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value) => {
    if (value === "all") {
      onChange([]);
    } else {
      const newSelected = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(newSelected);
    }
  };

  const displayLabel =
    selected.length === 0
      ? showAll
        ? "All Regions"
        : label
      : selected.length === 1
      ? selected[0]
      : `${label} (${selected.length})`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-700">{displayLabel}</span>
        {badge > 0 && (
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <FiChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {showAll && (
              <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.length === 0}
                  onChange={() => handleToggle("all")}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm">All</span>
              </label>
            )}
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => handleToggle(option)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AgeRangeFilter = ({ ageMin, ageMax, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState(ageMin || "");
  const [tempMax, setTempMax] = useState(ageMax || "");

  const handleApply = () => {
    onChange(tempMin, tempMax);
    setIsOpen(false);
  };

  const displayLabel =
    ageMin || ageMax
      ? `Age Range: ${ageMin || "0"} - ${ageMax || "∞"}`
      : "Age Range: 0 - ∞";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-700">{displayLabel}</span>
        <FiChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Min Age
                </label>
                <input
                  type="number"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Max Age
                </label>
                <input
                  type="number"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="100"
                />
              </div>
              <button
                onClick={handleApply}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DateRangeFilter = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayLabel = startDate || endDate ? "Date" : "Date";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FiCalendar size={16} className="text-gray-600" />
        <span className="text-sm text-gray-700">{displayLabel}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => onChange(e.target.value, endDate)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => onChange(startDate, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterBar;
