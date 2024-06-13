const TimetableSession = require("../models/TimetableSession");
const timetableController = require("../controllers/timetableController");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

jest.mock("../models/TimetableSession");
jest.mock("../models/User");

describe("courseController", () => {
  describe("createTimetableSession", () => {
    const req = {
      body: {
        year: 1,
        semester: 1,
        program:
          "BSc (Hons) in Information Technology Specialising in Cuber Security",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
        groupId: "Y1.S2.WE.CS.1",
        type: "Weekend",
        days: [
          {
            day: "Saturday",
            sessions: [
              {
                course: "65f9c7f5fd8a20e77fb1e90e",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "11:00 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F501",
              },
            ],
          },
          {
            day: "Sunday",
            sessions: [
              {
                course: "65f9c864fd8a20e77fb1e912",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "10:30 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F502",
              },
            ],
          },
        ],
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    TimetableSession.prototype.save = jest.fn();

    beforeEach(() => {
      TimetableSession.findOne.mockResolvedValue(null);
      TimetableSession.countDocuments.mockResolvedValue(0);
      TimetableSession.prototype.save.mockResolvedValue();
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await timetableController.createTimetableSession(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 403 if timetable already exists", async () => {
      TimetableSession.findOne.mockResolvedValue({});
      await timetableController.createTimetableSession(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should create new course and return 201", async () => {
      const req = {
        body: {
          year: 1,
          semester: 1,
          program:
            "BSc (Hons) in Information Technology Specialising in Cuber Security",
          facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
          groupId: "Y1.S2.WE.CS.1",
          type: "Weekend",
          days: [
            {
              day: "Saturday",
              sessions: [
                {
                  course: "65f9c7f5fd8a20e77fb1e90e",
                  courseType: "Lecture & Tutorial",
                  startTime: "08:30 AM",
                  endTime: "11:00 AM",
                  faculty: "65f96fc27b0c3964bee32fb5",
                  location: "F501",
                },
              ],
            },
            {
              day: "Sunday",
              sessions: [
                {
                  course: "65f9c864fd8a20e77fb1e912",
                  courseType: "Lecture & Tutorial",
                  startTime: "08:30 AM",
                  endTime: "10:30 AM",
                  faculty: "65f96fc27b0c3964bee32fb5",
                  location: "F502",
                },
              ],
            },
          ],
        },
        user: { role: "Admin" },
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      TimetableSession.prototype.save = jest.fn(); 
      await timetableController.createTimetableSession(req, res);

      expect(TimetableSession.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getAllTimetableSessions", () => {
    const req = {}; 
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("Should return all Timetables", async () => {
      TimetableSession.find.mockResolvedValue(["timetable1", "timetable2"]);
      await timetableController.getAllTimetableSessions(req, res); 
      expect(res.json).toHaveBeenCalledWith(["timetable1", "timetable2"]);
    });
  });

  describe("getTimetableSessionById", () => {
    const req = { params: { groupId: "Y1.S2.WE.CS.1" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return 404 if timetable session not found", async () => {
      TimetableSession.findById.mockResolvedValue(null);
      await timetableController.getTimetableSessionById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return timetable session by id", async () => {
      TimetableSession.findOne.mockResolvedValue("timetableSession");
      await timetableController.getTimetableSessionById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("timetableSession");
    });
  });

  describe("updateTimetable", () => {
    const req = {
      params: { id: "groupId" },
      body: {
        year: 1,
        semester: 1,
        program:
          "BSc (Hons) in Information Technology Specialising in Cuber Security",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
        groupId: "Y1.S2.WE.CS.1",
        type: "Weekend",
        days: [
          {
            day: "Saturday",
            sessions: [
              {
                course: "65f9c7f5fd8a20e77fb1e90e",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "11:00 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F501",
              },
            ],
          },
          {
            day: "Sunday",
            sessions: [
              {
                course: "65f9c864fd8a20e77fb1e912",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "10:30 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F502",
              },
            ],
          },
        ],
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks(); 
    });

    it("should return 404 if timetable session not found", async () => {
      TimetableSession.findOneAndUpdate.mockResolvedValue(null);
      await timetableController.updateTimetableSession(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Timetable not found" });
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await timetableController.updateTimetableSession(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      const updatedTimetable = {
        _id: "groupId",
        year: 1,
        semester: 1,
        program:
          "BSc (Hons) in Information Technology Specialising in Cuber Security",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
        groupId: "Y1.S2.WE.CS.1",
        type: "Weekend",
        days: [
          {
            day: "Saturday",
            sessions: [
              {
                course: "65f9c7f5fd8a20e77fb1e90e",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "11:00 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F501",
              },
            ],
          },
          {
            day: "Sunday",
            sessions: [
              {
                course: "65f9c864fd8a20e77fb1e912",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "10:30 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F502",
              },
            ],
          },
        ],
      };

      TimetableSession.findOneAndUpdate.mockResolvedValue(updatedTimetable);

      await timetableController.updateTimetableSession(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can update courses.",
      });
    });
  });

  describe("deleteTimetable", () => {
    const req = {
      params: { id: "groupId" },
      body: {
        year: 1,
        semester: 1,
        program:
          "BSc (Hons) in Information Technology Specialising in Cuber Security",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
        groupId: "Y1.S2.WE.CS.1",
        type: "Weekend",
        days: [
          {
            day: "Saturday",
            sessions: [
              {
                course: "65f9c7f5fd8a20e77fb1e90e",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "11:00 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F501",
              },
            ],
          },
          {
            day: "Sunday",
            sessions: [
              {
                course: "65f9c864fd8a20e77fb1e912",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "10:30 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F502",
              },
            ],
          },
        ],
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks(); 
    });

    it("should return 404 if timetable not found", async () => {
      TimetableSession.findOneAndDelete.mockResolvedValue(null);
      await timetableController.deleteTimetableSession(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Timetable not found" });
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await timetableController.deleteTimetableSession(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      const deletedTimetable = {
        _id: "courseId",
        year: 1,
        semester: 1,
        program:
          "BSc (Hons) in Information Technology Specialising in Cuber Security",
        facultyDepartment: ["65fbc62fe9e2b8f403d7dbd2"],
        groupId: "Y1.S2.WE.CS.1",
        type: "Weekend",
        days: [
          {
            day: "Saturday",
            sessions: [
              {
                course: "65f9c7f5fd8a20e77fb1e90e",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "11:00 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F501",
              },
            ],
          },
          {
            day: "Sunday",
            sessions: [
              {
                course: "65f9c864fd8a20e77fb1e912",
                courseType: "Lecture & Tutorial",
                startTime: "08:30 AM",
                endTime: "10:30 AM",
                faculty: "65f96fc27b0c3964bee32fb5",
                location: "F502",
              },
            ],
          },
        ],
      };

      TimetableSession.findOneAndDelete.mockResolvedValue(deletedTimetable);

      await timetableController.deleteTimetableSession(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can delete courses.",
      });
    });
  });

  describe("getTimetableSessionByStudentId", () => {

    const req = { params: { universityId: "IT21098479" } }; // Pass a valid universityId for testing
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks(); 
    });

    it("should return 403 if user is not a student", async () => {
      // Mocking the findOne function to return a non-student user
      User.findOne.mockResolvedValue({ role: "Admin" });
      await timetableController.getTimetableSessionByStudentId(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only students can access their timetable.",
      });
    });

    it("should return timetable sessions for the student", async () => {
      // Mocking a student user and timetable sessions
      const student = { role: "Student", groupName: "studentGroupName" };
      const timetableSessions = ["session1", "session2"];
      
      // Mocking the findOne function to return the student
      User.findOne.mockResolvedValue(student);
      
      // Mocking the find function to return timetable sessions
      TimetableSession.find.mockResolvedValue(timetableSessions);
      
      await timetableController.getTimetableSessionByStudentId(req, res);
      
      expect(res.json).toHaveBeenCalledWith(timetableSessions);
    });

  });
});
