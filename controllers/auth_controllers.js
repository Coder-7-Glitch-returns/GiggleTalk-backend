// controllers/auth_controllers.js
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ===== signUp API =====
async function signUp(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // ----- Check if user already exists -----
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
    }
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password length should be exactly 8 characters",
      });
    }

    //   ----- Hash the password -----
    const hashedPassword = await bcrypt.hash(password, 10);

    //   ----- Generate JWT token -----
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET || "fallbackSecret",
    );
    //   ----- Insert new user into the database -----
    await db.execute(
      "INSERT INTO users (fullName, email, password, token) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword, token],
    );
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log("SignUp API error:", error);
  }
}

// ----- Export the API Functions -----
export default { signUp };
