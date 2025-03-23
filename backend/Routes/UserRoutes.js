const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../Middlewares/Auth");
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require("../Controllers/UserController");

// ✅ Get User Profile (Logged-in users only)
router.get("/profile", ensureAuthenticated, getProfile);

// ✅ Update User Profile (Logged-in users only)
router.put("/profile", ensureAuthenticated, updateProfile);

// ✅ Update User Password (Logged-in users only)
router.put("/password", ensureAuthenticated, updatePassword);

module.exports = router;