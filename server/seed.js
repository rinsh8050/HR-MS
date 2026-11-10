import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

await mongoose.connect(process.env.MONGO_URI);
await User.deleteOne({ email: "admin@northstar.com" });
await User.create({
  name: "Alex Rivera",
  email: "admin@northstar.com",
  password: await bcrypt.hash("admin123", 10),
});
console.log("Admin user created");
process.exit();