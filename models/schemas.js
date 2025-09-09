// ===== models/schemas.js =====

// ----- Imports -----
import db from "./../config/db.js";

const usersTable = async () => {
  try {
    db.execute(`
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) NOT NULL DEFAULT 'users',
        token VARCHAR(255) NOT NULL
        )
        `);
  } catch (error) {
    console.log("Error in creating users Table: ", error);
  }
};

export default usersTable;
