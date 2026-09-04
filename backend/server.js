const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const subscriberRoutes = require("./routes/subscriberRoutes");
const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Subscriber routes
app.use("/api/subscribers", subscriberRoutes);
// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);


// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Test route
app.get("/", (req, res) => {
    res.send("Bulk Mail Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});