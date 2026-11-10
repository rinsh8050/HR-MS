// models/LeaveRequest.js
import mongoose from "mongoose";
export default mongoose.model("LeaveRequest", new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  type: { type: String, default: "Annual leave" },
  days: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true }));