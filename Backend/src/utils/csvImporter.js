const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/database");

class CSVImporter {
  async importSalesData(filePath) {
    const batchSize = 100;
    let batch = [];
    let totalInserted = 0;
    let totalErrors = 0;

    return new Promise((resolve, reject) => {
      console.log(`Reading CSV file: ${filePath}`);

      const stream = fs
        .createReadStream(filePath)
        .pipe(csv())
        .on("data", async (data) => {
          stream.pause();

          batch.push(data);

          if (batch.length >= batchSize) {
            try {
              const inserted = await this.insertBatch(batch);
              totalInserted += inserted;
              console.log(`Inserted ${totalInserted} records...`);
              batch = [];
            } catch (error) {
              console.error("Error inserting batch:", error.message);
              totalErrors += batch.length;
              batch = [];
            }
          }

          stream.resume();
        })
        .on("end", async () => {
          try {
            if (batch.length > 0) {
              const inserted = await this.insertBatch(batch);
              totalInserted += inserted;
            }

            console.log(`\n Import completed!`);
            console.log(`Successfully inserted: ${totalInserted} records`);
            if (totalErrors > 0) {
              console.log(`Failed to insert: ${totalErrors} records`);
            }

            resolve(totalInserted);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("Error reading CSV:", error);
          reject(error);
        });
    });
  }

  async insertBatch(batch) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const insertQuery = `
                INSERT INTO sales_transactions (
                    transaction_id, date,
                    customer_id, customer_name, phone_number, gender, age, 
                    customer_region, customer_type,
                    product_id, product_name, brand, product_category, tags,
                    quantity, price_per_unit, discount_percentage, 
                    total_amount, final_amount,
                    payment_method, order_status, delivery_type,
                    store_id, store_location, salesperson_id, employee_name
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                    $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
                )
            `;

      let insertedCount = 0;

      for (const row of batch) {
        try {
          let tags = [];
          if (row.Tags || row.tags) {
            const tagString = row.Tags || row.tags;
            if (typeof tagString === "string") {
              tags = tagString
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            }
          }

          const date = row.Date || row.date;

          await client.query(insertQuery, [
            row["Transaction ID"] || row.transaction_id || null,
            date || null,
            row["Customer ID"] || row.customer_id || null,
            row["Customer Name"] || row.customer_name || null,
            row["Phone Number"] || row.phone_number || null,
            row["Gender"] || row.gender || null,
            parseInt(row["Age"] || row.age) || null,
            row["Customer Region"] || row.customer_region || null,
            row["Customer Type"] || row.customer_type || null,
            row["Product ID"] || row.product_id || null,
            row["Product Name"] || row.product_name || null,
            row["Brand"] || row.brand || null,
            row["Product Category"] || row.product_category || null,
            tags.length > 0 ? tags : null,
            parseInt(row["Quantity"] || row.quantity) || 0,
            parseFloat(row["Price per Unit"] || row.price_per_unit) || 0,
            parseFloat(row["Discount Percentage"] || row.discount_percentage) ||
              0,
            parseFloat(row["Total Amount"] || row.total_amount) || 0,
            parseFloat(row["Final Amount"] || row.final_amount) || 0,
            row["Payment Method"] || row.payment_method || null,
            row["Order Status"] || row.order_status || null,
            row["Delivery Type"] || row.delivery_type || null,
            row["Store ID"] || row.store_id || null,
            row["Store Location"] || row.store_location || null,
            row["Salesperson ID"] || row.salesperson_id || null,
            row["Employee Name"] || row.employee_name || null,
          ]);

          insertedCount++;
        } catch (rowError) {
          console.error(`Error inserting row:`, rowError.message);
        }
      }

      await client.query("COMMIT");
      return insertedCount;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async clearTable() {
    try {
      await pool.query(
        "TRUNCATE TABLE sales_transactions RESTART IDENTITY CASCADE"
      );
      console.log("Table cleared successfully");
    } catch (error) {
      console.error("Error clearing table:", error);
      throw error;
    }
  }
}

module.exports = new CSVImporter();
