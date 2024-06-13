const User = require("../models/User");

// Controller function to send timetable notifications to a user
const sendTimetableNotification = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.userId;
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve notifications from the user object
    const notifications = user.notifications;
    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendTimetableNotification,
};
