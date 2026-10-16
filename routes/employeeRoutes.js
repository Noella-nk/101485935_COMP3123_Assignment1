
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  employeeValidation,
  employeeUpdateValidation,
  validateRequest,
} = require("../validators/employeeValidator")

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController")

// GET all employees belonging to the logged-in user
router.get("/employees", auth, getAllEmployees);

router.post("/employees", auth, employeeValidation, validateRequest, createEmployee)
router.get("/employees/:eid", auth, getEmployeeById)
router.put("/employees/:eid", auth, employeeUpdateValidation, validateRequest, updateEmployee)
router.delete("/employees", auth, deleteEmployee)

module.exports = router;

