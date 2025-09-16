// controllers/auth_controllers.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authModels from "../models/authModels.js";
import db from "../config/db.js";

// ===== signUp API (send OTP only) =====
export async function signUp(req, res) {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: "Email, password, and full name are required",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }
  // ----- Check if user already exists -----
  const existingUser = await authModels.findUserByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  try {
    const otp = await authModels.signUpOTP(email);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log("OTP Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP", error: error });
  }
}

// ===== createUser API (after OTP verification) =====
export async function createUser(req, res) {
  try {
    const { fullName, email, password, otp } = req.body;

    // ----- Check if fields are filled -----
    if (!fullName || !email || !password || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ----- Check if user already exists -----
    const existingUser = await authModels.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // ----- Hash the password -----
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----- Generate JWT token -----
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "fallbackSecret",
      { expiresIn: "1h" }
    );

    await authModels.createUser({
      fullName,
      email,
      password: hashedPassword,
      token,
    });
    const [user] = await db.query(
      "SELECT id, role FROM users WHERE email = ?",
      [email]
    );
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      id: user[0].id,
      role: user[0].role,
    });
  } catch (error) {
    console.error("CreateUser API error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ===== login API =====
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await authModels.loginUser(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      id: user.id,
      role: user.role,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ===== Forget-Password API =====
export async function forgetPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  // ----- Check if user exists -----
  const user = await authModels.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    const otp = await authModels.signUpOTP(email);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("OTP Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
}

// ===== Update-Password API =====
export async function updatePassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email and new password are required",
        });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    }

    // Check if user exists
    const user = await authModels.findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await authModels.updatePassword(email, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UpdatePassword API error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ----- Export -----
