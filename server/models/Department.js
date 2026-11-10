// models/Department.js
import mongoose from "mongoose";
export default mongoose.model("Department", new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
}, { timestamps: true }));