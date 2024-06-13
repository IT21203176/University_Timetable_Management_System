const CourseEnrollment = require("../models/Enrollment");

// Controller function to enroll a student in a course
const enrollStudent = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    // Create a new enrollment object
    const enrollment = new CourseEnrollment({
      student: studentId,
      course: courseId,
    });

    // Save the enrollment to the database
    await enrollment.save();
    res
      .status(201)
      .json({ message: "Student enrolled successfully", enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get enrollments of a student
const getStudentEnrollments = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Find enrollments of the specified student and populate course details
    const enrollments = await CourseEnrollment.find({
      student: studentId,
    }).populate("course");
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    // Find all enrollments and populate student and course details
    const enrollments = await CourseEnrollment.find()
      .populate("student")
      .populate("course");
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to unenroll a student from a course
const unenrollStudent = async (req, res) => {
  const enrollmentId = req.params.id;

  try {
    // Find and delete the enrollment
    const deletedEnrollment = await CourseEnrollment.findByIdAndDelete(
      enrollmentId
    );
    if (!deletedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json({ message: "Student unenrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  enrollStudent,
  getStudentEnrollments,
  getAllEnrollments,
  unenrollStudent,
};
