const express = require("express");
const timetableController = require("../controllers/timetableController");
const authenticateToken = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// Route to create a new timetable session
router.post("/", authenticateToken, timetableController.createTimetableSession);

// Route to get all timetable sessions
router.get("/", timetableController.getAllTimetableSessions);

// Route to get a timetable session by group ID
router.get("/:groupId", timetableController.getTimetableSessionById);

// Route to update a timetable session by group ID
router.put(
  "/:groupId",
  authenticateToken,
  timetableController.updateTimetableSession
);

// Route to delete a timetable session by group ID
router.delete(
  "/:groupId",
  authenticateToken,
  timetableController.deleteTimetableSession
);

// Route to get timetable sessions by student ID
router.get(
  "/student/:universityId",
  timetableController.getTimetableSessionByStudentId
);

// Export the router
module.exports = router;
