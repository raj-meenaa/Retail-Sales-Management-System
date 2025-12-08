import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import FilterBar from "./components/FilterBar";
import StatsCards from "./components/StatsCards";
import TransactionTable from "./components/TransactionTable";
import { useSalesData } from "./hooks/useSalesData";

function App() {
  const {
    data,
    loading,
    error,
    pagination,
    statistics,
    filters,
    updateFilters,
    updatePage,
    resetFilters,
  } = useSalesData();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onSearch={(search) => updateFilters({ search })}
          searchValue={filters.search}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={updateFilters}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <FilterBar
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />

            <StatsCards statistics={statistics} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                Error: {error}
              </div>
            )}

            <TransactionTable
              data={data}
              loading={loading}
              pagination={pagination}
              onPageChange={updatePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
