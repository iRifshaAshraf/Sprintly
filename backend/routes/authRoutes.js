const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  signup,
  login,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
