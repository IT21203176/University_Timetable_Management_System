const mongoose = require("mongoose");
const TimetableSession = require("../models/TimetableSession");

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    mobileNo: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid mobile number"],
    },
    universityId: {
      type: String,
      required: true,
      unique: true,
    },
    facultyDepartment: [
      {
        fac: {
          type: String,
          enum: [
            "Computing",
            "Engineering",
            "Business School",
            "Humanities & Sciences",
            "School of Architecture",
            "Administration",
          ],
          default: "Administration",
        },
        department: {
          type: String,
          enum: [
            "IT",
            "SE",
            "Com.Sc.",
            "CS",
            "ME",
            "CE",
            "EEE",
            "SBS",
            "HS",
            "SOA",
            "Administration",
          ],
          required: true,
        },
      },
    ],
    program: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["Admin", "Faculty", "Student"],
      default: "Student",
    },
    // New field to store the group name (autogenerate according to the year, semester, dayType if the role == 'Student')
    groupName: {
      type: String,
    },
    // Conditionally include year, semester, and dayType for students
    year: {
      type: Number,
      required: function () {
        return this.role === "Student";
      },
    },
    semester: {
      type: Number,
      required: function () {
        return this.role === "Student";
      },
    },
    dayType: {
      type: String,
      enum: ["WD", "WE"],
      required: function () {
        return this.role === "Student";
      },
    },
    notifications: [
      {
        message: String,
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  // Add timestamps to track creation and modification times
  { timestamps: true }
);

// Method to fetch timetable sessions for the user's group
userSchema.methods.getTimetableSessions = async function () {
  try {
    const timetableSessions = await TimetableSession.find({
      groupId: this.groupName,
    });
    return timetableSessions;
  } catch (error) {
    throw error;
  }
};

// Define method to add notification
userSchema.methods.addNotification = async function (message) {
  this.notifications.push({ message });
  await this.save();
};

// Create a User model using the defined schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
