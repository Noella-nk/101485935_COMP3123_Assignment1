
const { body, validationResult } = require("express-validator");

const signupValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
}

module.exports = {
  signupValidation,
  loginValidation,
  validateRequest,
};
