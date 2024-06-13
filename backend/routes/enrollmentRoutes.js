const express = require("express");
const enrollmentController = require("../controllers/enrollementController");
const router = express.Router();

router.post("/", enrollmentController.enrollStudent);
router.get("/student/:studentId", enrollmentController.getStudentEnrollments);
router.get("/", enrollmentController.getAllEnrollments);
router.delete("/:id", enrollmentController.unenrollStudent);

module.exports = router;