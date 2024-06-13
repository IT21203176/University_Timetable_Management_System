const mongoose = require("mongoose");

// Define the schema for the Course model
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // Code of the course (unique identifier)
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    // Faculty teaching the course (array of user references)
    faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Faculty department offering the course (array of department references)
    facultyDepartment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to another model representing faculty departments
      },
    ]
  },
  // Add timestamps to track creation and modification times
  { timestamps: true }
);

// Create a Course model using the defined schema
const Course = mongoose.model("Course", courseSchema);

// Export the Course model
module.exports = Course;
