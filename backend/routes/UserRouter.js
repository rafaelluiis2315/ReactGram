const express = require("express");
const router = express.Router();

// Controller
const { register, login, getCurrentUser } = require("../controllers/UserController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { userCreateValidation, loginValidation } = require("../middlewares/userValidations");

// Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);

module.exports = router;