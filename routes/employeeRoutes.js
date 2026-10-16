
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController")

const {
  employeeValidation,
  employeeUpdateValidation,
  validateRequest,
} = require("../validators/employeeValidator")

router.post("/", auth, employeeValidation, validateRequest, createEmployee)
router.get("/", auth, getAllEmployees)
router.get("/:id", auth, getEmployeeById)
router.put("/:id", auth, employeeUpdateValidation, validateRequest, updateEmployee)
router.delete("/:id", auth, deleteEmployee)

module.exports = router;

