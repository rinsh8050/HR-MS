import { Router } from "express";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).lean();
    const withCounts = await Promise.all(
      departments.map(async (d) => ({
        ...d,
        employeeCount: await Employee.countDocuments({ department: d._id }),
      }))
    );
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await Department.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const dep = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dep) return res.status(404).json({ message: "Department not found" });
    res.json(dep);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const inUse = await Employee.countDocuments({ department: req.params.id });
    if (inUse > 0) {
      return res
        .status(400)
        .json({ message: `Cannot delete: ${inUse} employee(s) are in this department` });
    }
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;