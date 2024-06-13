const TimetableSession = require("../models/TimetableSession");
const User = require("../models/User");

// Create a new timetable session
const createTimetableSession = async (req, res) => {
  const { year, semester, program, facultyDepartment, groupId, type, days } =
    req.body;
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can add new courses.",
      });
    }

    // Check if a timetable with the same groupId already exists
    const existingTimetable = await TimetableSession.findOne({ groupId });
    if (existingTimetable) {
      return res
        .status(400)
        .json({ message: "Timetable already exists for this group" });
    }

    // Create a new timetableSession object
    const newTimetableSession = new TimetableSession({
      year,
      semester,
      program,
      facultyDepartment,
      groupId,
      type,
      days,
    });

    // Save the timetableSession to the database
    await newTimetableSession.save();
    res.status(201).json({
      message: "Timetable session created successfully",
      timetable: newTimetableSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all timetable sessions
const getAllTimetableSessions = async (req, res) => {
  try {
    const timetableSessions = await TimetableSession.find();
    res.json(timetableSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get timetable session by ID
const getTimetableSessionById = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const timetableSession = await TimetableSession.findOne({ groupId });
    if (!timetableSession) {
      return res.status(404).json({ message: "Timetable session not found" });
    }
    res.json(timetableSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a timetable session by ID
const updateTimetableSession = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can update courses.",
      });
    }

    const groupId = req.params.groupId;
    const updatedTimetable = await TimetableSession.findOneAndUpdate(
      { groupId },
      req.body,
      { new: true }
    );
    if (!updatedTimetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }
    // Get all users with role 'Student' and groupName equal to the updated timetable's groupId
    const students = await User.find({ role: "Student", groupName: groupId });

    // Notify students about the timetable update
    const notificationMessage = "Timetable for your group has been updated. Please check the changes.";
    for (const student of students) {
      await student.addNotification(notificationMessage);
    }

    // Log the students array to the console
    console.log("Students:", students);


    res.json({
      message: "Timetable updated successfully",
      timetable: updatedTimetable,
      students: students 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a timetable session by ID
const deleteTimetableSession = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can delete courses.",
      });
    }

    const groupId = req.params.groupId;
    const deletedTimetable = await TimetableSession.findOneAndDelete({
      groupId,
    });
    if (!deletedTimetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }
    res.json({
      message: "Timetable deleted successfully",
      timetable: deletedTimetable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get timetable session by student's universityId
const getTimetableSessionByStudentId = async (req, res) => {
  try {
    const universityId = req.params.universityId;

    // Find the student by universityId
    const student = await User.findOne({ universityId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If the user is not a student, return an error
    if (student.role !== "Student") {
      return res
        .status(403)
        .json({
          message:
            "Permission denied. Only students can access their timetable.",
        });
    }

    // Get timetable sessions where groupId matches student's groupName
    const timetableSessions = await TimetableSession.find({
      groupId: student.groupName,
    });

    res.json(timetableSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTimetableSession,
  updateTimetableSession,
  deleteTimetableSession,
  getAllTimetableSessions,
  getTimetableSessionById,
  getTimetableSessionByStudentId,
};
