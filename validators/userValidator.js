
const { body, validationResult } = require("express-validator");

const signupValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ max: 50 })
    .withMessage("Username cannot exceed 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
];

const loginValidation = [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be a JSON object");
    }

    const hasUsername =
      typeof value.username === "string" && value.username.trim() !== "";

    const hasEmail =
      typeof value.email === "string" && value.email.trim() !== "";

    if (!hasUsername && !hasEmail) {
      throw new Error("Provide a username or email");
    }

    if (hasEmail && !require("validator").isEmail(value.email.trim())) {
      throw new Error("A valid email is required");
    }

    if (hasUsername && value.username.trim().length > 50) {
      throw new Error("Username cannot exceed 50 characters");
    }

    return true;
  }),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),
];

const validateRequest = (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

module.exports = {signupValidation, loginValidation, validateRequest}
