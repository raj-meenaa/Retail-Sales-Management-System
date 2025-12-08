const csvImporter = require("../src/utils/csvImporter");
const path = require("path");

async function main() {
  const csvFilePath = process.argv[2];

  if (!csvFilePath) {
    console.error(" Please provide CSV file path");
    console.log("Usage: node scripts/importData.js <path-to-csv>");
    console.log("Example: node scripts/importData.js ./data/sales_data.csv");
    process.exit(1);
  }

  const fullPath = path.resolve(csvFilePath);

  if (!require("fs").existsSync(fullPath)) {
    console.error(` File not found: ${fullPath}`);
    process.exit(1);
  }

  console.log("\n Starting CSV import...");
  console.log(` File: ${fullPath}\n`);

  try {
    const count = await csvImporter.importSalesData(fullPath);
    console.log(`\n Import completed! Total records imported: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error("\n Import failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
