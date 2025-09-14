// ===== routes/auth_routes.js =====

// ----- Imports -----
import express from "express";
import {
  createUser,
  forgetPassword,
  login,
  signUp,
  updatePassword,
} from "../controllers/auth_controllers.js";
const router = express.Router();

// ----- Routes -----

// Signup
// -----  Sign Up -----
router.post("/signup", signUp);
// -----  Sign Up OTP -----
router.post("/create-user", createUser);
// Login
router.post("/login", login);
// ----- Forget-Password -----
router.post("/forget-password", forgetPassword);
// ----- Update-Password -----
router.post("/update-password", updatePassword);

export default router;
