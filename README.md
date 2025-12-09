# Retail Sales Management System

## Overview
A full-stack Retail Sales Management System built to efficiently manage and analyze large-scale sales data. The application features advanced search capabilities, multi-select filtering, dynamic sorting, and server-side pagination for optimal performance. Built with modern technologies including React, Node.js, Express, and PostgreSQL, the system provides a professional and responsive user interface with clean architecture and scalable backend design.

## Live Link :- 
[https://drive.google.com/file/d/1bZ4q-YCGLNpRfapovLbhl2W6-xUUGuHf/view?usp=sharing
](https://retail-sales-management-system-woad.vercel.app/)
## Video Demo :- 
https://drive.google.com/file/d/1bZ4q-YCGLNpRfapovLbhl2W6-xUUGuHf/view?usp=sharing

## Tech Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS 4
- Axios
- React Icons

**Backend:**
- Node.js with Express.js
- PostgreSQL
- CSV Parser
- Dotenv

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Railway PostgreSQL

## Search Implementation Summary

Debounced search with 500ms delay using PostgreSQL ILIKE operator for case-insensitive matching across customer_name and phone_number fields. Search terms combine with OR logic, allowing matches from either field while seamlessly integrating with active filters and sorting through dynamic query construction.

## Filter Implementation Summary

Multi-select filters use PostgreSQL's ANY operator for categorical fields (regions, gender, categories, payment methods). Tag filtering leverages array overlap operator (&&) for efficient array-based matching. Range filters for age and dates use comparison operators with NULL handling. All filters combine with AND logic via QueryBuilder utility for dynamic WHERE clause construction.

## Sorting Implementation Summary

Database-level sorting using ORDER BY clause with three options: Date (DESC/ASC), Quantity (DESC/ASC), and Customer Name (ASC/DESC). Indexed columns ensure fast sorting performance. All active filters and search terms are preserved during sort operations through query parameter management.

## Pagination Implementation Summary

Server-side pagination using PostgreSQL LIMIT/OFFSET with 10 items per page. Separate COUNT query calculates total records for pagination controls. Frontend displays current range, Next/Previous navigation, and direct page selection while preserving all filters, search terms, and sorting across page changes.

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Railway CLI (for deployment)

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# DATABASE_URL=your_postgresql_connection_string
# PORT=3001
# NODE_ENV=development

# Create database tables
npm run create-tables

# Import CSV data (optional)
npm run import path/to/sales_data.csv

# Start development server
npm run dev
```

Backend runs on http://localhost:3001

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# VITE_API_URL=http://localhost:3001/api

# Start development server
npm run dev
```

Frontend runs on http://localhost:5173
