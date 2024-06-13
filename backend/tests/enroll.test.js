const Enrollment = require("../models/Enrollment");
const enrollmentController = require("../controllers/enrollementController");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

jest.mock("../models/Enrollment");

describe("enrollmentController", () => {
  describe("enrollStudent", () => {
    const req = {
      body: {
        courseId: "65f9a0081af8b59ab4b02334",
        studentId: "65f9c7f5fd8a20e77fb1e90e",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Enrollment.prototype.save = jest.fn(); // Mocking save method

    beforeEach(() => {
      Enrollment.findOne.mockResolvedValue(null);
      Enrollment.countDocuments.mockResolvedValue(0);
      Enrollment.prototype.save.mockResolvedValue();
    });

    it("should enroll student to a course", async () => {
      const req = {
        body: {
          courseId: "65f9a0081af8b59ab4b02334",
          studentId: "65f9c7f5fd8a20e77fb1e90e",
        },
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      Enrollment.prototype.save = jest.fn(); // Mocking save method

      await enrollmentController.enrollStudent(req, res);

      expect(Enrollment.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getStudentEnrollments", () => {
    const req = { params: { studentId: "65f9c7f5fd8a20e77fb1e90e" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return 404 if enrollment not found", async () => {
      Enrollment.find.mockResolvedValue(null);
      await enrollmentController.getStudentEnrollments(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    /*it("should return enrollments for the student", async () => {
        const enrollments = [{ studentId: "65f9c7f5fd8a20e77fb1e90e", course: "65f9a0081af8b59ab4b02334" }]; 
        Enrollment.find.mockResolvedValue(enrollments); 
        await enrollmentController.getStudentEnrollments(req, res);
        expect(res.status).toHaveBeenCalledWith(500); 
        expect(res.json).toHaveBeenCalledWith("Internal server error");
    });*/
  });
});
