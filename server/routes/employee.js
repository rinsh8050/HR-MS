
import { Router } from "express";
import Employee from "../models/Employee.js";

const router = Router();

// GET: Fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new employee
router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    const populatedEmployee = await Employee.findById(employee._id)
      .populate("department", "name");

    res.status(201).json(populatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update an employee
router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("department", "name");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete an employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
