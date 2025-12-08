# System Architecture

## Backend Architecture

### Overview
The backend follows a **layered MVC architecture** with clear separation of concerns, built on Node.js with Express.js framework and PostgreSQL database.

### Architecture Layers

**1. Routes Layer** (`/routes`)
- Defines API endpoints and HTTP method mappings
- Routes requests to appropriate controllers
- Example: `salesRoutes.js` handles `/api/sales/*` endpoints

**2. Controller Layer** (`/controllers`)
- Handles HTTP request/response logic
- Parses and validates query parameters
- Delegates business logic to service layer
- Returns formatted JSON responses
- Example: `salesController.js` processes filter parameters and pagination

**3. Service Layer** (`/services`)
- Contains core business logic
- Interacts with database through connection pool
- Orchestrates complex operations
- Example: `salesService.js` builds dynamic queries using QueryBuilder

**4. Utility Layer** (`/utils`)
- Reusable helper classes and functions
- `QueryBuilder`: Dynamic SQL WHERE clause construction
- `csvImporter`: Data import functionality

**5. Configuration Layer** (`/config`)
- Database connection configuration
- Environment-specific settings
- Connection pool management with SSL support

### Database Design
- **PostgreSQL** with optimized indexing strategy
- Single `sales_transactions` table with 30+ fields
- Indexes on: customer_name, phone_number, date, region, gender, category, payment_method, tags (GIN), age
- Composite index for common query patterns: (date, customer_region, product_category)

### Key Features
- **Dynamic Query Building**: QueryBuilder utility constructs parameterized queries to prevent SQL injection
- **Connection Pooling**: Efficient database connection management
- **Environment Configuration**: Supports DATABASE_PUBLIC_URL (local with Railway CLI) and DATABASE_URL (deployed)
- **Error Handling**: Centralized error middleware with environment-aware messages

---

## Frontend Architecture

### Overview
The frontend is built with **React 19** using **component-based architecture** with custom hooks for state management and Vite as the build tool.

### Architecture Pattern

**Component Hierarchy:**
```
App.jsx (Root Component)
├── Sidebar (Navigation)
├── TopBar (Search + Sort)
├── FilterBar (Multi-select filters)
├── StatsCards (Statistics display)
└── TransactionTable (Data display + Pagination)
```

### Architecture Layers

**1. Components** (`/components`)
- **Presentation Components**: Pure UI components with props
  - `TransactionTable.jsx`: Displays sales data in tabular format
  - `StatsCards.jsx`: Shows aggregated statistics
  - `FilterPanel.jsx`: Multi-select filter interface
  - `SearchBar.jsx`: Debounced search input
  - `Pagination.jsx`: Page navigation controls
  - `SortDropdown.jsx`: Sorting options
  - `Sidebar.jsx`, `TopBar.jsx`: Layout components

**2. Hooks** (`/hooks`)
- **Custom Hooks**: Encapsulate stateful logic and side effects
  - `useSalesData.js`: Main data management hook
    - Manages filters, pagination, and statistics state
    - Handles API calls with loading/error states
    - Provides update functions for filters and pagination
    - Implements debouncing and caching logic

**3. Services** (`/services`)
- **API Layer**: Handles all HTTP communications
  - `api.js`: Axios instance with base URL configuration
  - Centralized API methods: `getSales()`, `getStatistics()`, `getFilterOptions()`
  - Query parameter serialization

**4. Utils** (`/utils`)
- **Helper Functions**: Reusable utility functions
  - `helpers.js`: Date formatting, number formatting, data transformations

**5. Assets** (`/assets`)
- Static resources (images, icons, fonts)

### State Management
- **Local Component State**: UI-specific state (expanded sections, modals)
- **Custom Hook State**: Shared application state via `useSalesData` hook
- **Props Drilling**: Parent-to-child data flow for component communication

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- Responsive design with mobile-first approach
- Custom color palette and spacing

---

## Data Flow

### Request-Response Cycle

**1. User Interaction → Component**
```
User clicks filter → FilterPanel component → onFilterChange callback
```

**2. Component → Custom Hook**
```
FilterPanel.onFilterChange() → useSalesData.updateFilters() → Updates filters state
```

**3. Hook → API Service**
```
useEffect detects filters change → buildQueryParams() → salesAPI.getSales(params)
```

**4. API Service → Backend**
```
Axios GET request → Backend Express server → salesRoutes → salesController
```

**5. Backend Processing**
```
Controller parses params → Service builds query → QueryBuilder constructs SQL
→ PostgreSQL executes query → Returns results
```

**6. Backend → Frontend Response**
```
Controller formats response → JSON {success, data, pagination}
→ API service receives → Hook updates state
```

**7. State Update → UI Re-render**
```
setState triggers re-render → React updates Virtual DOM → Browser updates UI
```

### Search Flow (with Debouncing)
```
User types in SearchBar
→ onChange updates local state
→ useEffect with 500ms debounce
→ After delay, calls onSearch callback
→ Triggers useSalesData.updateFilters()
→ Resets page to 1
→ Fetches new data with search term
```

### Filter Flow
```
User selects filter option
→ FilterPanel updates local state (checkbox array)
→ Calls onFilterChange with new filter values
→ useSalesData merges new filters with existing
→ Resets page to 1
→ Builds query params with all active filters
→ Fetches filtered data
```

### Pagination Flow
```
User clicks page number
→ Pagination component calls onPageChange
→ useSalesData.updatePage() updates page state
→ Preserves all existing filters and sort
→ Fetches data for new page with offset calculation (page - 1) * limit
```

---

## Folder Structure

### Backend Structure
```
Backend/
├── src/
│   ├── index.js                 # Express app setup, middleware, server start
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool config
│   ├── controllers/
│   │   └── salesController.js   # HTTP request handlers
│   ├── routes/
│   │   └── salesRoutes.js       # API route definitions
│   ├── services/
│   │   └── salesService.js      # Business logic, database queries
│   └── utils/
│       ├── queryBuilder.js      # Dynamic SQL query builder
│       └── csvImporter.js       # CSV data import utility
├── scripts/
│   ├── createTables.js          # Database schema creation
│   └── importData.js            # CSV data import script
├── package.json                 # Dependencies and scripts
└── .env                         # Environment variables
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── main.jsx                 # React app entry point
│   ├── App.jsx                  # Root component, layout structure
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── TopBar.jsx           # Search and sort controls
│   │   ├── FilterBar.jsx        # Filter controls container
│   │   ├── FilterPanel.jsx      # Multi-select filter UI
│   │   ├── SearchBar.jsx        # Debounced search input
│   │   ├── SortDropdown.jsx     # Sort options dropdown
│   │   ├── StatsCards.jsx       # Statistics cards display
│   │   ├── TransactionTable.jsx # Data table with rows
│   │   └── Pagination.jsx       # Page navigation controls
│   ├── hooks/
│   │   └── useSalesData.js      # Data fetching and state management
│   ├── services/
│   │   └── api.js               # Axios API client
│   ├── utils/
│   │   └── helpers.js           # Utility functions
│   ├── assets/                  # Images, icons, fonts
│   ├── App.css                  # Component-specific styles
│   └── index.css                # Global styles, Tailwind imports
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite build configuration
└── tailwind.config.js           # Tailwind CSS configuration
```

### Documentation Structure
```
docs/
└── architecture.md              # System architecture documentation
```

---

## Module Responsibilities

### Backend Modules

**index.js** (Entry Point)
- Initialize Express application
- Configure middleware (CORS, Morgan, JSON parser)
- Register routes
- Define health check endpoint
- Global error handling
- Start server on configured port

**database.js** (Database Configuration)
- Create PostgreSQL connection pool
- Handle DATABASE_PUBLIC_URL vs DATABASE_URL
- Configure SSL for production
- Manage connection lifecycle
- Export pool instance for queries

**salesRoutes.js** (Route Definitions)
- Define REST API endpoints:
  - `GET /sales` - Fetch sales with filters
  - `GET /statistics` - Get aggregated stats
  - `GET /filter-options` - Get available filter values
- Map routes to controller methods

**salesController.js** (Request Handling)
- Parse and validate query parameters
- Convert comma-separated strings to arrays
- Type conversion (strings to integers)
- Call service layer with structured filters
- Format successful responses
- Handle errors with appropriate status codes

**salesService.js** (Business Logic)
- Build dynamic SQL queries using QueryBuilder
- Execute count query for pagination
- Execute data query with filters and sorting
- Calculate aggregated statistics
- Transform database results for API response
- Return structured data with pagination info

**queryBuilder.js** (Query Construction)
- Maintain parameterized query parts
- Add search conditions (ILIKE with OR logic)
- Add multi-select filters (ANY operator)
- Add tag filters (array overlap &&)
- Add range filters (>= and <=)
- Add date range filters
- Build WHERE clause with AND logic
- Prevent SQL injection through parameterization

**csvImporter.js** (Data Import)
- Read CSV files with streaming
- Parse CSV rows into objects
- Transform data types
- Batch insert into database
- Handle import errors
- Log progress and results

**createTables.js** (Schema Management)
- Drop existing tables if present
- Create sales_transactions table with proper types
- Create performance indexes
- Create composite indexes
- Execute schema SQL

**importData.js** (Import Script)
- Accept file path as command-line argument
- Use csvImporter to load data
- Validate file exists
- Report success/failure

### Frontend Modules

**main.jsx** (Entry Point)
- Import React and ReactDOM
- Import global CSS (Tailwind)
- Render root App component
- Mount to DOM element

**App.jsx** (Root Component)
- Import and compose all major components
- Initialize useSalesData hook
- Pass state and callbacks to child components
- Define overall layout structure
- Handle error display

**useSalesData.js** (State Management Hook)
- Manage filters state (search, regions, genders, etc.)
- Manage pagination state (page, total, totalPages)
- Manage data state (sales transactions array)
- Manage loading and error states
- Manage statistics state
- Fetch data on filter changes (useEffect)
- Build query parameters from filters
- Provide updateFilters function
- Provide updatePage function
- Provide resetFilters function
- Implement debouncing for API calls
- Handle API errors

**api.js** (HTTP Client)
- Create Axios instance with baseURL
- Define getSales method (GET /sales)
- Define getStatistics method (GET /statistics)
- Define getFilterOptions method (GET /filter-options)
- Serialize query parameters
- Return promises for async handling
- Export salesAPI object

**SearchBar.jsx**
- Accept onSearch callback and initialValue
- Maintain local search term state
- Implement 500ms debounce with useEffect and setTimeout
- Clear timeout on unmount
- Render input with search icon
- Call onSearch after debounce delay

**FilterPanel.jsx**
- Fetch available filter options from API
- Manage expanded/collapsed sections state
- Render multi-select checkboxes for categories
- Render age range inputs
- Render date range inputs
- Call onFilterChange when selections change
- Provide reset button to clear all filters

**FilterBar.jsx**
- Compose FilterPanel and filter controls
- Display active filter count
- Toggle filter visibility

**SortDropdown.jsx**
- Accept sortBy, sortOrder, and onSortChange props
- Render dropdown with sort options
- Options: Date (DESC/ASC), Quantity (DESC/ASC), Name (ASC/DESC)
- Call onSortChange when selection changes

**TransactionTable.jsx**
- Accept data array and loading state
- Render table header
- Map data to table rows
- Display loading spinner
- Display "no results" message
- Include Pagination component

**Pagination.jsx**
- Accept pagination object (page, total, totalPages)
- Accept onPageChange callback
- Display current range (e.g., "1-10 of 500")
- Render Previous/Next buttons
- Render page number buttons
- Disable buttons appropriately
- Call onPageChange with new page number

**StatsCards.jsx**
- Accept statistics object
- Display total units sold
- Display total amount
- Display total discount
- Format numbers with proper separators

**Sidebar.jsx**
- Render navigation menu
- Display application logo/title
- Provide links (if applicable)

**TopBar.jsx**
- Compose SearchBar and SortDropdown
- Accept search and sort props
- Pass callbacks to child components

**helpers.js**
- Format dates (YYYY-MM-DD to readable format)
- Format currency (add $ and commas)
- Format numbers (add thousand separators)
- Parse query strings
- Other utility transformations

---

## Summary

This architecture provides:
- **Scalability**: Layered backend, component-based frontend
- **Maintainability**: Clear separation of concerns, single responsibility
- **Performance**: Database indexing, connection pooling, debouncing, server-side pagination
- **Security**: Parameterized queries, environment-based configuration
- **Flexibility**: Dynamic query building, modular components
- **Developer Experience**: Clear folder structure, consistent patterns