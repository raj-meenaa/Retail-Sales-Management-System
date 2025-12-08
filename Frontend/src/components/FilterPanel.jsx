import { useState, useEffect } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { salesAPI } from "../services/api";

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: [],
  });
  const [expandedSections, setExpandedSections] = useState({
    region: true,
    gender: true,
    age: true,
    category: true,
    tags: true,
    payment: true,
    date: true,
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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange({ [field]: newValues });
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium"
      >
        <span>{title}</span>
        <FiChevronDown
          className={`transition-transform ${
            expandedSections[section] ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">{children}</div>
      )}
    </div>
  );

  const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FiX size={16} />
          Reset
        </button>
      </div>

      <FilterSection title="Customer Region" section="region">
        {filterOptions.regions.map((region) => (
          <Checkbox
            key={region}
            label={region}
            checked={filters.regions?.includes(region)}
            onChange={() => handleMultiSelect("regions", region)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Gender" section="gender">
        {filterOptions.genders.map((gender) => (
          <Checkbox
            key={gender}
            label={gender}
            checked={filters.genders?.includes(gender)}
            onChange={() => handleMultiSelect("genders", gender)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Age Range" section="age">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.ageMin || ""}
            onChange={(e) => onFilterChange({ ageMin: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.ageMax || ""}
            onChange={(e) => onFilterChange({ ageMax: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </FilterSection>

      <FilterSection title="Product Category" section="category">
        {filterOptions.categories.map((category) => (
          <Checkbox
            key={category}
            label={category}
            checked={filters.categories?.includes(category)}
            onChange={() => handleMultiSelect("categories", category)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Tags" section="tags">
        <div className="max-h-40 overflow-y-auto">
          {filterOptions.tags.map((tag) => (
            <Checkbox
              key={tag}
              label={tag}
              checked={filters.tags?.includes(tag)}
              onChange={() => handleMultiSelect("tags", tag)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Payment Method" section="payment">
        {filterOptions.paymentMethods.map((method) => (
          <Checkbox
            key={method}
            label={method}
            checked={filters.paymentMethods?.includes(method)}
            onChange={() => handleMultiSelect("paymentMethods", method)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Date Range" section="date">
        <div className="space-y-2">
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterPanel;
