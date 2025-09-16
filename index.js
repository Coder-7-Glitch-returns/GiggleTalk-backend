// project/server/index.js

// ----- Imports -----
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouters from "./routes/auth_routes.js";
import usersTable from "./database/UserTable.js";
import nodemailer from "nodemailer";

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

// ----- Nodemailer Transporter -----
const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com", // 👈 simpler than host/port
  auth: {
    user: process.env.EMAIL_USER, // must exist in .env
    pass: process.env.EMAIL_PASS, // must exist in .env (App Password)
  },
});

// ----- Routes -----
// AUTHENTICATION
app.use("/api/auth", authRouters);

// ----- Debug -----
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
