const express = require("express");
const courseController = require("../controllers/courseController");
const authenticateToken = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// Route to create a new course, correctly importing authenticateToken middleware
router.post("/", authenticateToken, courseController.createCourse);

// Route to get all courses
router.get("/", courseController.getAllCourses);

// Route to get course by id
router.get("/:id", courseController.getCourseById);

// Route to update the course by id
router.put("/:id", authenticateToken, courseController.updateCourse);

// Route to delete the course by id
router.delete("/:id", authenticateToken, courseController.deleteCourse);

// Route to add Faculty(Lecturer) to the course by id
router.put(
  "/:id/add-faculty",
  authenticateToken,
  courseController.addFacultyToCourse
);

// Export the router
module.exports = router;
