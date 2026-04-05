require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./db");

// Import User model
const User = require("../models/User");

const seedUsers = [
  {
    name: "Owner Admin",
    email: "owner@furniture.com",
    password: "Owner@123",
    role: "owner",
  },
  {
    name: "Staff One",
    email: "staff1@furniture.com",
    password: "Staff@123",
    role: "staff",
  },
  {
    name: "Staff Two",
    email: "staff2@furniture.com",
    password: "Staff@456",
    role: "staff",
  },
];

const seed = async () => {
  await connectDB();

  try {
    // Clear existing users
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    // Hash passwords and create users
    for (const userData of seedUsers) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    console.log("\n🎉 Seeding complete!");
    console.log("\n📋 Login Credentials:");
    console.log("─────────────────────────────────────");
    seedUsers.forEach((u) => {
      console.log(`  ${u.role.toUpperCase()}: ${u.email} / ${u.password}`);
    });
    console.log("─────────────────────────────────────");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

seed();
