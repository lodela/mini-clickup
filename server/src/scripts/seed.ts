/**
 * Seed Script — creates a super-admin user for development
 * Run: npx tsx src/scripts/seed.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mini-clickup";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB:", MONGODB_URI);

  // Dynamically import model after connection
  const { default: User } = await import("../models/User.js");

  const email = "admin@woorkroom.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(
      "🔄 Super-admin already exists, recreating with correct password...",
    );
    await existing.deleteOne();
  }

  const plainPassword = "Admin@1234!";

  await User.create({
    email,
    password: plainPassword,
    name: "Super Admin",
    role: "admin",
    isActive: true,
  });

  console.log("🎉 Super-admin created!");
  console.log("   Email:    admin@woorkroom.com");
  console.log("   Password: Admin@1234!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
