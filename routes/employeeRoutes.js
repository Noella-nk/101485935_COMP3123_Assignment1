
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

router.post("/", auth, createEmployee);
router.get("/", auth, getAllEmployees);
router.get("/:id", auth, getEmployeeById);
router.put("/:id", auth, updateEmployee);
router.delete("/:id", auth, deleteEmployee);

module.exports = router;

