
const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/userController");

const {
  signupValidation,
  loginValidation,
  validateRequest,
} = require("../validators/userValidator");

router.post("/signup", signupValidation, validateRequest, signup);
router.post("/login", loginValidation, validateRequest, login);

module.exports = router;
