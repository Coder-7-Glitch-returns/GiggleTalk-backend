// ===== config/db.js =====

// ----- Imports -----
import sql2 from "mysql2";

// ----- Setup -----
const db = sql2
  .createPool({
    host: "mysql-sa-blogs.alwaysdata.net",
    user: "sa-blogs",
    password: "3104944Tony",
    database: "sa-blogs_giggle_talk_db",
  })
  .promise();

export default db;
