import { useState, useEffect, useCallback, useRef } from "react";
import { salesAPI } from "../services/api";

export const useSalesData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [statistics, setStatistics] = useState({
    total_units: 0,
    total_amount: 0,
    total_discount: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    regions: [],
    genders: [],
    ageMin: "",
    ageMax: "",
    categories: [],
    tags: [],
    paymentMethods: [],
    startDate: "",
    endDate: "",
    sortBy: "date",
    sortOrder: "DESC",
    page: 1,
  });

  const isFetchingRef = useRef(false);

  const buildQueryParams = useCallback(() => {
    const params = {
      page: filters.page,
      limit: 10,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.regions && filters.regions.length > 0) {
      params.regions = filters.regions.join(",");
    }
    if (filters.genders && filters.genders.length > 0) {
      params.genders = filters.genders.join(",");
    }
    if (filters.categories && filters.categories.length > 0) {
      params.categories = filters.categories.join(",");
    }
    if (filters.tags && filters.tags.length > 0) {
      params.tags = filters.tags.join(",");
    }
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      params.paymentMethods = filters.paymentMethods.join(",");
    }

    if (filters.ageMin && filters.ageMin !== "") {
      params.ageMin = filters.ageMin;
    }
    if (filters.ageMax && filters.ageMax !== "") {
      params.ageMax = filters.ageMax;
    }
    if (filters.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    return params;
  }, [filters]);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = buildQueryParams();

      const [salesData, stats] = await Promise.all([
        salesAPI.getSales(params),
        salesAPI.getStatistics(params),
      ]);

      setData(salesData.data);
      setPagination(salesData.pagination);
      setStatistics(stats);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to fetch data";
      setError(errorMessage);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const updatePage = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      regions: [],
      genders: [],
      ageMin: "",
      ageMax: "",
      categories: [],
      tags: [],
      paymentMethods: [],
      startDate: "",
      endDate: "",
      sortBy: "date",
      sortOrder: "DESC",
      page: 1,
    });
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    statistics,
    filters,
    updateFilters,
    updatePage,
    resetFilters,
  };
};
