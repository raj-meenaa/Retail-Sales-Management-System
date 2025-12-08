const pool = require("../src/config/database");

const createTablesSQL = `
-- Drop table if exists
DROP TABLE IF EXISTS sales_transactions CASCADE;

-- Create sales_transactions table
CREATE TABLE sales_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50),
    date DATE,
    
    -- Customer Fields
    customer_id VARCHAR(50),
    customer_name VARCHAR(255),
    phone_number VARCHAR(20),
    gender VARCHAR(20),
    age INTEGER,
    customer_region VARCHAR(100),
    customer_type VARCHAR(50),
    
    -- Product Fields
    product_id VARCHAR(50),
    product_name VARCHAR(255),
    brand VARCHAR(100),
    product_category VARCHAR(100),
    tags TEXT[],
    
    -- Sales Fields
    quantity INTEGER,
    price_per_unit DECIMAL(10,2),
    discount_percentage DECIMAL(5,2),
    total_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    
    -- Operational Fields
    payment_method VARCHAR(50),
    order_status VARCHAR(50),
    delivery_type VARCHAR(50),
    store_id VARCHAR(50),
    store_location VARCHAR(255),
    salesperson_id VARCHAR(50),
    employee_name VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_customer_name ON sales_transactions(customer_name);
CREATE INDEX idx_phone_number ON sales_transactions(phone_number);
CREATE INDEX idx_date ON sales_transactions(date);
CREATE INDEX idx_customer_region ON sales_transactions(customer_region);
CREATE INDEX idx_gender ON sales_transactions(gender);
CREATE INDEX idx_product_category ON sales_transactions(product_category);
CREATE INDEX idx_payment_method ON sales_transactions(payment_method);
CREATE INDEX idx_tags ON sales_transactions USING GIN(tags);
CREATE INDEX idx_age ON sales_transactions(age);

-- Create composite index for common queries
CREATE INDEX idx_date_region_category ON sales_transactions(date, customer_region, product_category);
`;

async function createTables() {
  console.log("Creating database tables...\n");

  try {
    await pool.query(createTablesSQL);
    console.log("Tables created successfully");
    console.log("Indexes created successfully");
    console.log("\n Database schema is ready!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating tables:", error.message);
    console.error(error);
    process.exit(1);
  }
}

createTables();
