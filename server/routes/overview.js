// routes/overview.js
import { Router } from "express";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import LeaveRequest from "../models/LeaveRequest.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [totalEmployees, activeEmployees, departments, pendingLeave, recentLeave] =
      await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ status: "active" }),
        Department.countDocuments(),
        LeaveRequest.countDocuments({ status: "pending" }),
        LeaveRequest.find().sort({ createdAt: -1 }).limit(3).populate("employee", "name"),
      ]);

    res.json({ totalEmployees, activeEmployees, departments, pendingLeave, recentLeave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;