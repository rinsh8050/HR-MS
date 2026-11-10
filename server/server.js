import authRoutes from "./routes/auth.js";
import auth from "./middleware/auth.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import overviewRoutes from "./routes/overview.js";
import departmentRoutes from "./routes/department.js";
import employeeRoutes from "./routes/employee.js";
import leavesRoutes from "./routes/leaves.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/overview", auth, overviewRoutes);
app.use("/api/departments", auth, departmentRoutes);
app.use("/api/employees", auth, employeeRoutes);
app.use("/api/leaves", auth, leavesRoutes);
// Start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
