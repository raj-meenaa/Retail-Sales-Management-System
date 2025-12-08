// const { Pool } = require("pg");
// require("dotenv").config();

// console.log("Database Configuration:");
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_HOST:", process.env.DB_HOST);

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,

//   ssl:
//     process.env.NODE_ENV === "production"
//       ? {
//           rejectUnauthorized: false,
//         }
//       : false,
// });

// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("Database connection error:", err);
//   } else {
//     console.log("Database connected successfully");
//   }
// });

// module.exports = pool;


const { Pool } = require("pg");
require("dotenv").config();

console.log("Database Configuration:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("DATABASE_PUBLIC_URL:", process.env.DATABASE_PUBLIC_URL ? "Set" : "Not set");
console.log("DB_HOST:", process.env.DB_HOST);

// Railway provides DATABASE_PUBLIC_URL for external access
// Use DATABASE_PUBLIC_URL first (for railway run locally), then DATABASE_URL (for deployed apps), then individual variables
const connectionConfig = process.env.DATABASE_PUBLIC_URL
  ? {
      connectionString: process.env.DATABASE_PUBLIC_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false,
            }
          : false,
    };

const pool = new Pool(connectionConfig);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully at:", res.rows[0].now);
  }
});

module.exports = pool;
