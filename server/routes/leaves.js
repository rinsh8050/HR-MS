import { Router } from "express";
import LeaveRequest from "../models/LeaveRequest.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const leave = await LeaveRequest.create(req.body);
    await leave.populate("employee", "name email");
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("employee", "name email");
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;