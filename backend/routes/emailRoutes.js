const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Subscriber = require("../models/Subscriber");
const authMiddleware = require("../middleware/authMiddleware");

// Send bulk email
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required",
      });
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Get all subscribers
    const subscribers = await Subscriber.find();

    if (subscribers.length === 0) {
      return res.status(400).json({
        message: "No subscribers found",
      });
    }

    // Send email to each subscriber
    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: subject,
        text: message,
      });
    }

    res.json({
      message: `Email sent successfully to ${subscribers.length} subscribers`,
    });

  } catch (error) {
    console.error("Email sending error:", error);

    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
});

module.exports = router;