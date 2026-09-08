const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

const Subscriber = require("../models/Subscriber");
const authMiddleware = require("../middleware/authMiddleware");

const resend = new Resend(process.env.RESEND_API_KEY);

// Send bulk email
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        message: "Subject and message are required",
      });
    }

    const subscribers = await Subscriber.find();

    if (subscribers.length === 0) {
      return res.status(400).json({
        message: "No subscribers found",
      });
    }

    for (const subscriber of subscribers) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
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