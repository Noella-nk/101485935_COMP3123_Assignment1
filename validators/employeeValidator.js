
const { body, validationResult } = require("express-validator");

const employeeValidation = [
  body("first_name")
    .isString()
    .withMessage("First name must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("last_name")
    .isString()
    .withMessage("Last name must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .isString()
    .withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("position")
    .isString()
    .withMessage("Position must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Position is required"),

  body("salary")
    .exists()
    .withMessage("Salary is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number")
    .toFloat(),

  body("date_of_joining")
    .isISO8601({ strict: true })
    .withMessage("Date of joining must be a valid date in YYYY-MM-DD format")
    .bail()
    .custom((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime()) ||
          date.toISOString().slice(0, 10) !== value) {
        throw new Error("Date of joining must be a real calendar date");
      }
      return true;
    }),

  body("department")
    .isString()
    .withMessage("Department must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  // The owner is assigned from the JWT, not the request body.
  body("user").not().exists()
    .withMessage("User ownership is assigned by the server"),
];

const employeeUpdateValidation = [
  body("first_name")
    .optional()
    .isString()
    .withMessage("First name must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("last_name")
    .optional()
    .isString()
    .withMessage("Last name must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),

  body("email")
    .optional()
    .isString()
    .withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("position")
    .optional()
    .isString()
    .withMessage("Position must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Position cannot be empty"),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a non-negative number")
    .toFloat(),

  body("date_of_joining")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("Date of joining must be a valid date in YYYY-MM-DD format")
    .bail()
    .custom((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime()) ||
          date.toISOString().slice(0, 10) !== value) {
        throw new Error("Date of joining must be a real calendar date");
      }
      return true;
    }),

  body("department")
    .optional()
    .isString()
    .withMessage("Department must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Department cannot be empty"),

  body("user").not().exists()
    .withMessage("Employee ownership cannot be changed"),

  body("_id").not().exists()
    .withMessage("Employee ID cannot be changed"),
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
