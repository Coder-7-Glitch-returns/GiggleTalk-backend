// ===== routes/auth_routes.js =====

// ----- Imports -----
import express from "express";
import authController from "../controllers/auth_controllers.js";
const router = express.Router();

// ----- Routes -----

// Signup
// -----  Sign Up -----
router.post("/signup", authController.signUp);
// -----  Sign Up OTP -----
router.post("/create-user", authController.createUser);
// Login
router.post("/login", authController.login);
// ----- Forget-Password -----
router.post("/forget-password", authController.forgetPassword);
// ----- Update-Password -----
router.post("/update-password", authController.updatePassword);

export default router;
