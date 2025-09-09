// project/server/index.js

// ----- Imports -----
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersTable from "./models/schemas.js";
import authRouters from "./routes/auth_routes.js";

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
app.use("/api/auth", authRouters);

// ----- Debug -----
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
