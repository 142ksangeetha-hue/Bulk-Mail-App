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

// Routes
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Bulk Mail Backend is running!");
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 30000
        });

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}

startServer();