const mongoose = require("mongoose");

// Define the Schema for the Notification Model
const notificationSchema = new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: {
        type: String,
        required: true,
      }
    }, { timestamps: true }
);

// Create a Notification model using the defined schema
const Notification = mongoose.model("Notification", notificationSchema);

// Export the Notification model
module.exports = Notification;