require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "SyncFlow API is running" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/assets", require("./routes/assetRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/locations", require("./routes/locationRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SyncFlow API running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

module.exports = app;
