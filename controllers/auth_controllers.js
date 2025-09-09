// controllers/auth_controllers.js
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ===== signUp API =====
async function signUp(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // ----- Check if fields are filled -----
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ----- Check if user already exists -----
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // ----- Validate password length -----
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password length should be at least 8 characters",
      });
    }

    // ----- Hash the password -----
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----- Generate JWT token -----
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET || "fallbackSecret",
      { expiresIn: "1h" },
    );

    // ----- Insert new user into the database -----
    await db.query(
      "INSERT INTO users (fullName, email, password, token) VALUES (?, ?, ?, ?)",
      [fullName, email, hashedPassword, token],
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("SignUp API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// ===== login API =====
async function login(req, res) {
  try {
    const { email, password } = req.body;
    // ----- Check if fields are filled -----
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // ----- Check if user exists -----
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    // ----- Compare password -----
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// ----- Export the API Functions -----
export default { signUp, login };
