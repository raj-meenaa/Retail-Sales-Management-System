# Sales Management System

## Overview
A full-stack Retail Sales Management System with advanced search, multi-select filtering, sorting, and pagination capabilities. Built with React, Node.js, Express, and PostgreSQL to efficiently handle large-scale sales data with clean architecture and professional execution.

## Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- Axios for HTTP requests
- React Icons

**Backend:**
- Node.js 18+
- Express.js
- PostgreSQL 14+
- CSV Parser

**Deployment:**
- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL

## Search Implementation Summary

Implements debounced full-text search with 500ms delay for optimal performance. Uses PostgreSQL ILIKE operator for case-insensitive matching on customer_name and phone_number fields. Search queries combine with OR logic to match either field and work seamlessly alongside all active filters and sorting options through dynamic query building.

## Filter Implementation Summary

Multi-select filters implemented using PostgreSQL's ANY operator for categorical fields including customer regions, gender, product categories, and payment methods. Tag filtering leverages PostgreSQL array overlap operator (&&) for efficient array-based matching. Range filters for age and dates use >= and <= operators with proper NULL handling. All filters combine with AND logic through a QueryBuilder utility that constructs dynamic WHERE clauses based on active filters.

## Sorting Implementation Summary

Database-level sorting implemented with ORDER BY clause for optimal performance. Three sorting options available: Date (DESC default for newest first, ASC for oldest), Quantity (DESC/ASC for high to low or low to high), and Customer Name (ASC/DESC for alphabetical sorting). Sorting maintains all active filters and search terms through query parameter preservation. Indexed columns ensure fast sorting even with large datasets.

## Pagination Implementation Summary

Server-side pagination using PostgreSQL LIMIT/OFFSET approach with 10 items per page. Separate COUNT query returns total records for calculating page numbers. Frontend displays current item range, provides Next/Previous navigation, and supports direct page number selection. All filters, search terms, and sort options are preserved across page changes through state management, ensuring consistent user experience.

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb sales_db

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Create database tables
npm run create-tables

# Import CSV data
npm run import path/to/sales_data.csv

# Start development server
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

### Access Application

Open your browser and navigate to http://localhost:5173 to use the application.

---

## Live Demo

- **Application URL:** [Your deployed Vercel URL]
- **GitHub Repository:** [Your GitHub repository URL]