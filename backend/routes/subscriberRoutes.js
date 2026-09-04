const express = require("express");
const Subscriber = require("../models/Subscriber");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add subscriber
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("================================");
        console.log("REQ.BODY:", req.body);
        console.log("NAME:", req.body.name);
        console.log("EMAIL:", req.body.email);
        console.log("================================");

        const { name, email } = req.body;

        const subscriber = new Subscriber({ name, email });
        const savedSubscriber = await subscriber.save();

        res.status(201).json(savedSubscriber);
    } catch (error) {
        console.log("ERROR:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

// Get subscribers
router.get("/", authMiddleware, async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Delete subscriber
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedSubscriber =
            await Subscriber.findByIdAndDelete(req.params.id);

        if (!deletedSubscriber) {
            return res.status(404).json({
                message: "Subscriber not found"
            });
        }

        res.json({
            message: "Subscriber deleted successfully",
            subscriber: deletedSubscriber
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Update subscriber
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedSubscriber =
            await Subscriber.findByIdAndUpdate(
                req.params.id,
                { name, email },
                { new: true, runValidators: true }
            );

        if (!updatedSubscriber) {
            return res.status(404).json({
                message: "Subscriber not found"
            });
        }

        res.json(updatedSubscriber);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;