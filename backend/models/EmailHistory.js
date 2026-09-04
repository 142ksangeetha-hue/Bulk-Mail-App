const mongoose = require("mongoose");

const emailHistorySchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    recipients: {
      type: [String],
      required: true,
    },

    recipientCount: {
      type: Number,
      required: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmailHistory",
  emailHistorySchema
);