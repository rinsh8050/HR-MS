// models/Employee.js
import mongoose from "mongoose";
export default mongoose.model("Employee", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  role: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true }));