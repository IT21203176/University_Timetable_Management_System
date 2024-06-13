const Course = require("../models/Course");
const courseController = require("../controllers/courseController");
const jwt = require("jsonwebtoken");

// Mocking jsonwebtoken module
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

// Mocking Course model
jest.mock("../models/Course");

describe("courseController", () => {
  describe("createCourse", () => {
    // Mock request and response objects
    const req = {
      body: {
        name: "Computer Networks",
        code: "IT2050",
        description: "Computer Networks",
        program:
          "BSc (Hons) in Information Technology Specialising in Information Technology",
        year: 2,
        semester: "1",
        credits: 4,
        faculty: "65f96fc27b0c3964bee32fb5",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Course.prototype.save = jest.fn(); // Mocking save method

    beforeEach(() => {
      Course.findOne.mockResolvedValue(null);
      Course.countDocuments.mockResolvedValue(0);
      Course.prototype.save.mockResolvedValue();
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await courseController.createCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 403 if course already exists", async () => {
      Course.findOne.mockResolvedValue({});
      await courseController.createCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should create new course and return 201", async () => {
      const req = {
        body: {
          name: "Computer Networks",
          code: "IT2050",
          description: "Computer Networks",
          program:
            "BSc (Hons) in Information Technology Specialising in Information Technology",
          year: 2,
          semester: "1",
          credits: 4,
          faculty: "65f96fc27b0c3964bee32fb5",
          facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
        },
        user: { role: "Admin" },
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      Course.prototype.save = jest.fn(); // Mocking save method

      await courseController.createCourse(req, res);

      expect(Course.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getAllCourses", () => {
    const req = {}; 
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("Should return all Courses", async () => {
      Course.find.mockResolvedValue(["course1", "course2"]);
      await courseController.getAllCourses(req, res); // Pass req and res 
      expect(res.json).toHaveBeenCalledWith(["course1", "course2"]);
    });
  });

  describe("getCourseById", () => {
    const req = { params: { courseId: "65f9c7f5fd8a20e77fb1e90e" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return 404 if course not found", async () => {
      Course.findById.mockResolvedValue(null);
      await courseController.getCourseById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return course by id", async () => {
      Course.findById.mockResolvedValue("course");
      await courseController.getCourseById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("course");
    });
  });

  describe("updateCourse", () => {
    const req = {
      params: { id: "courseId" },
      body: {
        name: "Computer Networks",
        code: "IT2050",
        description: "Computer Networks",
        program:
          "BSc (Hons) in Information Technology Specialising in Information Technology",
        year: 2,
        semester: "1",
        credits: 4,
        faculty: "65f96fc27b0c3964bee32fb5",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls 
    });

    it("should return 404 if course not found", async () => {
      Course.findByIdAndUpdate.mockResolvedValue(null);
      await courseController.updateCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    });

    it("should return 403 if user is not an admin", async () => {
      // Mocking the findByIdAndUpdate function
      req.user.role = "Faculty";
      await courseController.updateCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      const updatedCourse = {
        _id: "courseId",
        name: "Computer Networks",
        code: "IT2050",
        description: "Computer Networks",
        program:
          "BSc (Hons) in Information Technology Specialising in Information Technology",
        year: 2,
        semester: "1",
        credits: 4,
        faculty: "65f96fc27b0c3964bee32fb5",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
      };

      Course.findByIdAndUpdate.mockResolvedValue(updatedCourse);

      await courseController.updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can update courses.",
      });
    });
  });

  describe("deleteCourse", () => {
    const req = {
      params: { id: "courseId" },
      body: {
        name: "Computer Networks",
        code: "IT2050",
        description: "Computer Networks",
        program:
          "BSc (Hons) in Information Technology Specialising in Information Technology",
        year: 2,
        semester: "1",
        credits: 4,
        faculty: "65f96fc27b0c3964bee32fb5",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls 
    });

    it("should return 404 if course not found", async () => {
      Course.findByIdAndDelete.mockResolvedValue(null);
      await courseController.deleteCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await courseController.deleteCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      const deletedCourse = {
        _id: "courseId",
        name: "Computer Networks",
        code: "IT2050",
        description: "Computer Networks",
        program:
          "BSc (Hons) in Information Technology Specialising in Information Technology",
        year: 2,
        semester: "1",
        credits: 4,
        faculty: "65f96fc27b0c3964bee32fb5",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
      };

      Course.findByIdAndUpdate.mockResolvedValue(deletedCourse);

      await courseController.deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can delete courses.",
      });
    });
  });

  describe("addFacultyToCourse", () => {
    const req = {
      params: { id: "courseId" },
      body: {
        facultyIds: ["facultyId1", "facultyId2"], // Array of faculty IDs
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls 
    });

    it("should return 404 if course not found", async () => {
      Course.findById.mockResolvedValue(null); // Mocking the findById function to return null
      await courseController.addFacultyToCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty"; // Changing user role to simulate non-admin user
      await courseController.addFacultyToCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can add faculty to courses.",
      });
    });

    it("should handle server error", async () => {
      Course.findById.mockRejectedValue(new Error("Database connection error")); // Mocking the findById function to throw an error
      await courseController.addFacultyToCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can add faculty to courses.",
      });
    });
  });
});
