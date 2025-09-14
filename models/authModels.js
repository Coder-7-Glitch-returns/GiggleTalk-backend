// models/authModels.js
import db from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ===== Create User (Sign Up) =====
const createUser = async (userData) => {
  const { fullName, email, password, token } = userData;

  const query = `
    INSERT INTO users (fullName, email, password, token) 
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [fullName, email, password, token]);
  return result.insertId;
};

// ===== Find User by Email =====
const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  const [rows] = await db.execute(query, [email]);
  return rows[0]; // return single user or undefined
};

// ===== Validate Login (check email + password) =====
const loginUser = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await db.execute(query, [email]);
  return rows[0];
};

// ===== signUp OTP Model =====
const signUpOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account - Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw new Error("OTP sending failed");
  }
};

// ===== Update-Password Model =====
const updatePassword = async (email, newPassword) => {
  const query = `UPDATE users SET password = ? WHERE email = ?`;
  const [result] = await db.execute(query, [newPassword, email]);
  return result.affectedRows > 0;
};

export default {
  createUser,
  findUserByEmail,
  loginUser,
  signUpOTP,
  updatePassword,
};
