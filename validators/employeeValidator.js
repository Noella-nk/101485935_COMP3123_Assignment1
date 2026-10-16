
const { body, validationResult } = require("express-validator");

const employeeValidation = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number"),

  body("position")
    .optional()
    .isString()
    .withMessage("Position must be text"),

  body("department")
    .optional()
    .isString()
    .withMessage("Department must be text"),
];

const employeeUpdateValidation = [
  body("first_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("last_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number"),

  body("position")
    .optional()
    .isString()
    .withMessage("Position must be text"),

  body("department")
    .optional()
    .isString()
    .withMessage("Department must be text"),
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
  employeeValidation,
  employeeUpdateValidation,
  validateRequest,
};
