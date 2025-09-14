// ===== config/db.js =====

// ----- Imports -----
import mysql from "mysql2";
import dbConfig from "./db.config.js";

// ----- Setup -----
const db = mysql
  .createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
  })
  .promise();

export default db;
