require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Department = require("../models/Department");
const Location = require("../models/Location");
const Category = require("../models/Category");

const seed = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: "admin@syncflow.app" });
  if (!adminExists) {
    await User.create({
      name: "System Administrator",
      email: "admin@syncflow.app",
      password: "Admin@123",
      role: "administrator",
    });
    console.log("Created default administrator: admin@syncflow.app / Admin@123");
  }

  const dept = await Department.findOneAndUpdate(
    { name: "General" },
    { name: "General", code: "GEN" },
    { upsert: true, new: true }
  );

  await Location.findOneAndUpdate(
    { name: "Head Office" },
    { name: "Head Office", type: "branch" },
    { upsert: true, new: true }
  );

  await Location.findOneAndUpdate(
    { name: "Scrap" },
    { name: "Scrap", type: "scrap", isScrapLocation: true },
    { upsert: true, new: true }
  );

  await Category.findOneAndUpdate(
    { name: "IT Equipment" },
    { name: "IT Equipment", code: "IT", depreciationRate: 20 },
    { upsert: true, new: true }
  );

  console.log("Seed complete. Default department:", dept.name);
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
