const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

// Route to register a new user, correctly importing authenticateToken middleware
router.post("/register", authenticateToken, authController.register);

// Route for user login
router.post("/login", authController.login);

// Route to get all users
router.get("/", authenticateToken, authController.getAllUsers);

// Route to get users by role
router.get("/role/:role", authenticateToken, authController.getUsersByRole);

// Route to get user by ID
router.get("/:id", authenticateToken, authController.getUserById);

module.exports = router;
