
const Employee = require("../models/Employee");

// Create an employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    return res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An employee with this email already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid employee data",
      });
    }

    console.error("Create employee error:", error.message);
    return res.status(500).json({
      message: "Failed to create employee",
    });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    return res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve employees",
    });
  }
};

// Get one employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({ employee });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    console.error("Get employee error:", error.message);
    return res.status(500).json({
      message: "Failed to retrieve employee",
    });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid employee data or ID",
      });
    }

    console.error("Update employee error:", error.message);
    return res.status(500).json({
      message: "Failed to update employee",
    });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid employee ID",
      });
    }

    console.error("Delete employee error:", error.message);
    return res.status(500).json({
      message: "Failed to delete employee",
    });
  }
};
