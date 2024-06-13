const Course = require("../models/Course");
const User = require("../models/User");

// Create a new course
const createCourse = async (req, res) => {
  const {
    name,
    code,
    description,
    program,
    year,
    semester,
    credits,
    faculty,
    facultyDepartment,
  } = req.body;

  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can add new courses.",
      });
    }

    // Check if a course with the same code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({
        message: "A course with this code already exists.",
      });
    }

    // Create a new course object
    const newCourse = new Course({
      name,
      code,
      description,
      program,
      year,
      semester,
      credits,
      faculty,
      facultyDepartment,
    });

    // Save the course to the database
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update a course by ID
const updateCourse = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can update courses.",
      });
    }

    const courseId = req.params.id;
    const {
      name,
      code,
      description,
      program,
      year,
      semester,
      credits,
      faculty,
      facultyDepartment,
    } = req.body;

    // Update the course by ID
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        name,
        code,
        description,
        program,
        year,
        semester,
        credits,
        faculty,
        facultyDepartment,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course updated successfully", course: updatedCourse });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete a course by ID
const deleteCourse = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can delete courses.",
      });
    }

    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Controller function to add faculty to a course
const addFacultyToCourse = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can add faculty to courses.",
      });
    }

    const courseId = req.params.id;
    const { facultyIds } = req.body; // Assuming facultyIds is an array of faculty IDs

    // Find the course by its ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Add the new faculty IDs to the course
    course.faculty.push(...facultyIds);

    // Save the updated course
    await course.save();

    res
      .status(200)
      .json({ message: "Faculty added to course successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Export all controller functions
module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addFacultyToCourse
};
