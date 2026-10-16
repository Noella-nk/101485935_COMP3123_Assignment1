
const Employee = require("../models/Employee");

// Create an employee for the logged-in user
const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(201).json(employee);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// Get only the logged-in user's employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ user: req.user.id });

    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get one employee belonging to the logged-in user
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.eid,
      user: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json(employee);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// Update one employee belonging to the logged-in user
const updateEmployee = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Prevent clients from changing the employee owner
    delete updates.user;
    delete updates._id;

    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.eid,
        user: req.user.id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json(employee);
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an employee using ?eid=xxx
const deleteEmployee = async (req, res) => {
  try {
    const { eid } = req.query;

    if (!eid) {
      return res.status(400).json({ message: "Employee ID (eid) is required" });
    }

    if (!/^[a-fA-F0-9]{24}$/.test(eid)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findOneAndDelete({
      _id: eid,
      user: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
