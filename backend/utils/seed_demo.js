require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const crypto = require("crypto");

const Organization = require("../models/Organization");
const User = require("../models/User");
const Department = require("../models/Department");
const Location = require("../models/Location");
const Category = require("../models/Category");
const Asset = require("../models/Asset");
const Employee = require("../models/Employee"); // The existing Employee profile if it exists

const seedDemo = async () => {
    await connectDB();
    console.log("Seeding Demo Data...");

    // 1. Create Demo Organization
    const orgName = "SyncFlow Demo Corp";
    let org = await Organization.findOne({ name: orgName });
    if (!org) {
        org = await Organization.create({
            name: orgName,
            description: "Default environment for demonstration purposes.",
            organizationCode: "DEMO123",
            admin: new mongoose.Types.ObjectId(), // Will update below
        });
        console.log("Created Demo Organization (Code: DEMO123).");
    }

    // 2. Departments
    const depts = ["IT", "HR", "Finance", "Operations", "Sales"];
    const createdDepts = [];
    for (const d of depts) {
        const doc = await Department.findOneAndUpdate(
            { name: d },
            { name: d, code: d.substring(0, 3).toUpperCase() },
            { upsert: true, new: true }
        );
        createdDepts.push(doc);
    }
    const itDeptId = createdDepts.find(d => d.name === "IT")._id;
    const hrDeptId = createdDepts.find(d => d.name === "HR")._id;

    // 3. Locations
    const hq = await Location.findOneAndUpdate(
        { name: "Global HQ" },
        { name: "Global HQ", type: "headquarters" },
        { upsert: true, new: true }
    );

    // 4. Categories
    const catLaptop = await Category.findOneAndUpdate(
        { name: "Laptops" },
        { name: "Laptops", code: "LAP", depreciationRate: 20 },
        { upsert: true, new: true }
    );

    // 5. Demo Users
    const userDefs = [
        { email: "admin@syncflow.app", name: "System Admin", role: "administrator", pass: "Admin@123", dept: itDeptId },
        { email: "manager@syncflow.app", name: "HR Head", role: "department_manager", pass: "Manager@123", dept: hrDeptId },
        { email: "am@syncflow.app", name: "Asset Manager", role: "asset_manager", pass: "Manager@123", dept: itDeptId },
        { email: "employee@syncflow.app", name: "John Employee", role: "employee", pass: "Employee@123", dept: itDeptId },
    ];

    const createdUsers = {};
    for (const u of userDefs) {
        let user = await User.findOne({ email: u.email });
        if (!user) {
            user = await User.create({
                name: u.name,
                email: u.email,
                password: u.pass,
                role: u.role,
                department: u.dept,
                organization: org._id,
                joinStatus: "approved",
            });
            console.log(`Created ${u.role}: ${u.email} / ${u.pass}`);
        } else {
            user.organization = org._id;
            user.joinStatus = "approved";
            user.role = u.role;
            await user.save();
        }
        createdUsers[u.role] = user;
        if (u.role === "administrator") {
            org.admin = user._id;
            await org.save();
        }

        // Attempt to upsert their Employee profile to link them up
        // Check if Employee model has an email field
        try {
            await Employee.findOneAndUpdate(
                { email: u.email },
                { name: u.name, email: u.email, department: u.dept, role: u.role, userRef: user._id },
                { upsert: true, new: true }
            );
        } catch (err) {
            // Safe fail if schema mismatch
        }
    }

    // 6. Demo Assets
    const assetsToCreate = [
        {
            name: "MacBook Pro M3",
            assetId: "AST-00001",
            brand: "Apple",
            model: "16-inch 2024",
            status: "allocated",
            category: catLaptop._id,
            department: itDeptId,
            location: hq._id,
            assignedEmployee: createdUsers["employee"]._id,
            purchaseCost: 2500,
            currentValue: 2500,
        },
        {
            name: "Dell XPS 15",
            assetId: "AST-00002",
            brand: "Dell",
            model: "XPS 9520",
            status: "in_maintenance",
            category: catLaptop._id,
            department: hrDeptId,
            location: hq._id,
            purchaseCost: 1800,
            currentValue: 1200,
        },
        {
            name: "ThinkPad X1 Carbon",
            assetId: "AST-00003",
            brand: "Lenovo",
            model: "Gen 11",
            status: "available",
            category: catLaptop._id,
            department: itDeptId,
            location: hq._id,
            purchaseCost: 1600,
            currentValue: 1500,
        }
    ];

    const qrUtils = require("./qrBarcode");
    for (const a of assetsToCreate) {
        const existing = await Asset.findOne({ assetId: a.assetId });
        if (!existing) {
            a.qrCode = await qrUtils.generateAssetQRCode(a.assetId, a.name);
            await Asset.create(a);
        }
    }

    console.log("Demo Assets created.");
    console.log("Seed Demo complete!");
    await mongoose.connection.close();
    process.exit(0);
};

seedDemo().catch((err) => {
    console.error("Error during Demo Seed:", err);
    process.exit(1);
});
