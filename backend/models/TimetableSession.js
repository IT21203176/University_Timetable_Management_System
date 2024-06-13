const mongoose = require("mongoose");

// Define the schema for the TimetableSession model
const timeTableSessionSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    facultyDepartment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to another model representing faculty departments
      },
    ],
    groupId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Weekday", "Weekend"],
      required: true,
    },
    days: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        sessions: [
          {
            course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            courseType: {
              type: String,
              enum: ["Lecture & Tutorial", "Lab"],
              required: true,
            },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            location: { type: String, required: true },
          },
        ],
      },
    ],
  },
  // Add timestamps to track creation and modification times
  { timestamps: true }
);

// Create a TimetableSession model using the defined schema
const TimetableSession = mongoose.model(
  "TimetableSession",
  timeTableSessionSchema
);

// Export the TimetableSession model
module.exports = TimetableSession;
