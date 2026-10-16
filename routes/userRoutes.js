
const express = require("express")
const router = express.Router()

const authRateLimit = require("../middleware/authRateLimit")

const { signup, login } 
= require("../controllers/userController")

const {
  signupValidation,
  loginValidation,
  validateRequest,
} = require("../validators/userValidator");

router.post(
    "/signup", 
    authRateLimit, 
    signupValidation, 
    validateRequest, 
    signup)


router.post(
    "/login", 
    authRateLimit, 
    loginValidation, 
    validateRequest, 
    login)

module.exports = router;
