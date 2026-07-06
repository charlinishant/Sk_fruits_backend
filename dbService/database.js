const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mysql = require("mysql");

const dbConfig = {
  host: process.env.MYSQL_HOST || "94.136.190.129",
  user: process.env.MYSQL_USER || "skfruit",
  password: process.env.MYSQL_PASSWORD || "skfruit@24",
  database: process.env.MYSQL_DATABASE || "skfruit",
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 50,
  waitForConnections: true,
  queueLimit: 0,
  dateStrings: true,
};

const pool = mysql.createPool(dbConfig);

function testConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.ping((pingError) => {
        connection.release();

        if (pingError) {
          reject(pingError);
          return;
        }

        resolve({
          host: dbConfig.host,
          database: dbConfig.database,
        });
      });
    });
  });
}

function query(queryString, values = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(queryString, values, (queryError, results) => {
        connection.release(); // Release the connection back to the pool

        if (queryError) {
          reject(queryError);
          return;
        }

        resolve(results);
      });
    });
  });
}

module.exports = { query, testConnection };
