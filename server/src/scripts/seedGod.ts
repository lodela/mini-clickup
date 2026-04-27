import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User";

// Load env vars
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function seedGodUser() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mini-clickup";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    const godEmail = "nlodela@miniclickup.com";
    const existingUser = await User.findOne({ email: godEmail });

    if (existingUser) {
      console.log(`User ${godEmail} already exists. Updating role to GOD_MODE...`);
      existingUser.role = "GOD_MODE";
      existingUser.password = "H0l4@2026"; // Updated password
      await existingUser.save();
    } else {
      await User.create({
        name: "NLodela",
        email: godEmail,
        password: "H0l4@2026",
        role: "GOD_MODE",
        isActive: true,
      });
      console.log(`God Mode User created: ${godEmail}`);
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding God Mode user:", error);
    process.exit(1);
  }
}

seedGodUser();
