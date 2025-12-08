const pool = require("../config/database");
const QueryBuilder = require("../utils/queryBuilder");

class SalesService {
  async getSalesData(filters) {
    const {
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      categories,
      tags,
      paymentMethods,
      startDate,
      endDate,
      sortBy = "date",
      sortOrder = "DESC",
      page = 1,
      limit = 10,
    } = filters;

    const qb = new QueryBuilder();

    if (search && search.trim()) {
      qb.addSearchCondition(search.trim());
    }

    if (regions && regions.length > 0) {
      qb.addMultiSelectFilter("customer_region", regions);
    }

    if (genders && genders.length > 0) {
      qb.addMultiSelectFilter("gender", genders);
    }

    if (categories && categories.length > 0) {
      qb.addMultiSelectFilter("product_category", categories);
    }

    if (paymentMethods && paymentMethods.length > 0) {
      qb.addMultiSelectFilter("payment_method", paymentMethods);
    }

    if (tags && tags.length > 0) {
      qb.addTagsFilter(tags);
    }

    if (ageMin !== null || ageMax !== null) {
      qb.addRangeFilter("age", ageMin, ageMax);
    }

    if (startDate || endDate) {
      qb.addDateRangeFilter(startDate, endDate);
    }

    const whereClause = qb.buildWhereClause();
    const params = qb.getParams();

    const sortMapping = {
      date: "date",
      quantity: "quantity",
      customer_name: "customer_name",
    };
    const sortField = sortMapping[sortBy] || "date";
    const sortDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    try {
      const countQuery = `SELECT COUNT(*) as total FROM sales_transactions ${whereClause}`;
      const countResult = await pool.query(countQuery, params);
      const totalCount = parseInt(countResult.rows[0].total);

      const offset = (page - 1) * limit;
      const dataQuery = `
                SELECT 
                    id,
                    transaction_id,
                    date,
                    customer_id,
                    customer_name,
                    phone_number,
                    gender,
                    age,
                    customer_region,
                    customer_type,
                    product_id,
                    product_name,
                    brand,
                    product_category,
                    tags,
                    quantity,
                    price_per_unit,
                    discount_percentage,
                    total_amount,
                    final_amount,
                    payment_method,
                    order_status,
                    delivery_type,
                    store_id,
                    store_location,
                    salesperson_id,
                    employee_name
                FROM sales_transactions 
                ${whereClause}
                ORDER BY ${sortField} ${sortDirection}
                LIMIT $${qb.getParamCounter()} OFFSET $${
        qb.getParamCounter() + 1
      }
            `;

      const dataParams = [...params, limit, offset];
      const dataResult = await pool.query(dataQuery, dataParams);

      return {
        data: dataResult.rows,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      console.error("Error in getSalesData:", error);
      throw error;
    }
  }

  async getFilterOptions() {
    try {
      const queries = {
        regions:
          "SELECT DISTINCT customer_region FROM sales_transactions WHERE customer_region IS NOT NULL ORDER BY customer_region",
        genders:
          "SELECT DISTINCT gender FROM sales_transactions WHERE gender IS NOT NULL ORDER BY gender",
        categories:
          "SELECT DISTINCT product_category FROM sales_transactions WHERE product_category IS NOT NULL ORDER BY product_category",
        paymentMethods:
          "SELECT DISTINCT payment_method FROM sales_transactions WHERE payment_method IS NOT NULL ORDER BY payment_method",
        tags: "SELECT DISTINCT UNNEST(tags) as tag FROM sales_transactions WHERE tags IS NOT NULL ORDER BY tag",
      };

      const results = {};

      for (const [key, query] of Object.entries(queries)) {
        const result = await pool.query(query);
        results[key] = result.rows
          .map((row) => row[Object.keys(row)[0]])
          .filter(Boolean);
      }

      return results;
    } catch (error) {
      console.error("Error in getFilterOptions:", error);
      throw error;
    }
  }

  async getStatistics(filters) {
    const {
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      categories,
      tags,
      paymentMethods,
      startDate,
      endDate,
    } = filters;

    const qb = new QueryBuilder();

    if (search && search.trim()) {
      qb.addSearchCondition(search.trim());
    }

    if (regions && regions.length > 0) {
      qb.addMultiSelectFilter("customer_region", regions);
    }

    if (genders && genders.length > 0) {
      qb.addMultiSelectFilter("gender", genders);
    }

    if (categories && categories.length > 0) {
      qb.addMultiSelectFilter("product_category", categories);
    }

    if (paymentMethods && paymentMethods.length > 0) {
      qb.addMultiSelectFilter("payment_method", paymentMethods);
    }

    if (tags && tags.length > 0) {
      qb.addTagsFilter(tags);
    }

    if (ageMin !== null || ageMax !== null) {
      qb.addRangeFilter("age", ageMin, ageMax);
    }

    if (startDate || endDate) {
      qb.addDateRangeFilter(startDate, endDate);
    }

    const whereClause = qb.buildWhereClause();
    const params = qb.getParams();

    try {
      const query = `
                SELECT 
                    COALESCE(SUM(quantity), 0) as total_units,
                    COALESCE(SUM(total_amount), 0) as total_amount,
                    COALESCE(SUM(total_amount - final_amount), 0) as total_discount
                FROM sales_transactions 
                ${whereClause}
            `;

      const result = await pool.query(query, params);
      return {
        total_units: parseInt(result.rows[0].total_units) || 0,
        total_amount: parseFloat(result.rows[0].total_amount) || 0,
        total_discount: parseFloat(result.rows[0].total_discount) || 0,
      };
    } catch (error) {
      console.error("Error in getStatistics:", error);
      throw error;
    }
  }
}

module.exports = new SalesService();
