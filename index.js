// project/server/index.js

// ----- Imports -----
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersTable from './models/schemas.js';

// ----- dotenv -----
dotenv.config();

// ----- Tables -----
usersTable();

// ----- Setup -----
const app = express();
const PORT = process.env.PORT || "9000";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Routes -----
// AUTHENTICATION
// app.use('/api/auth',)

// ----- Debug -----
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
