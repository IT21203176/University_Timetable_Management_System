const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authController = require("../controllers/authController");

// Mocking bcrypt and jsonwebtoken modules
jest.mock("bcrypt", () => ({
  hash: jest.fn((password, salt) => `hashed_${password}`),
  compare: jest.fn(
    (password, hashedPassword) => password === `hashed_${hashedPassword}`
  ),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

jest.mock("../models/User");

describe("authController", () => {
  describe("register", () => {
    // Mock request and response objects
    const req = {
      body: {
        name: "Janmi Janeesha",
        email: "janmiJ@gmail.com",
        mobileNo: "0701251047",
        universityId: "IT23098490",
        facultyDepartment: [{ fac: "Computing", department: "CS" }],
        program:
          "BSc (Hons) in Information Technology Specialising in Cyber Security",
        password: "Janmi123",
        role: "Student",
        year: 1,
        semester: 2,
        dayType: "WE",
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      // Reset mocks before each test
      User.findOne.mockResolvedValue(null);
      User.countDocuments.mockResolvedValue(0);
      User.prototype.save.mockResolvedValue();
    });

    it("should return 400 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if required fields are missing", async () => {
      const invalidReq = { ...req };
      delete invalidReq.body.name;
      await authController.register(invalidReq, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if user already exists", async () => {
      User.findOne.mockResolvedValue({});
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    /*it("should create new user and return 201", async () => {
      await authController.register(req, res);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });*/
  });

  describe("login", () => {
    // Mock request and response objects
    const req = {
      body: { email: "test@example.com", password: "password" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      // Mocking User.findOne to return a user object
      User.findOne.mockResolvedValue({ password: "hashed_password" });
    });

    it("should return 401 if user does not exist", async () => {
      User.findOne.mockResolvedValue(null);
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if password is incorrect", async () => {
      bcrypt.compare.mockResolvedValue(false);
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    /*it("should return token if login is successful", async () => {
      await authController.login(req, res);
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });*/
  });

  describe("getAllUsers", () => {
    const req = { user: { role: "Admin" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    beforeEach(() => {
      req.user.role = "Admin"; // Set the user role to Admin
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await authController.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return all users", async () => {
      User.find.mockResolvedValue(["user1", "user2"]);
      await authController.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(["user1", "user2"]);
    });
  });

  describe("getUsersByRole", () => {
    const req = { params: { role: "Student" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return users by role", async () => {
      User.find.mockResolvedValue(["student1", "student2"]);
      await authController.getUsersByRole(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(["student1", "student2"]);
    });
  });

  describe("getUserById", () => {
    const req = { params: { id: "1234567890" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
      await authController.getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return user by id", async () => {
      User.findById.mockResolvedValue("user");
      await authController.getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith("user");
    });
  });

  describe("getTimetableByGroupName", () => {
    const req = {
      user: {
        getTimetableSessions: jest
          .fn()
          .mockResolvedValue(["session1", "session2"]),
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return timetable sessions for the user", async () => {
      await authController.getTimetableByGroupName(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(["session1", "session2"]);
    });
  });

  describe("Validation Functions", () => {
    describe("validateEmail", () => {
      it("should return true for a valid email", () => {
        const validEmail = "test@example.com";
        const isValid = authController.validateEmail(validEmail);
        expect(isValid).toBe(true);
      });

      it("should return false for an invalid email", () => {
        const invalidEmail = "invalid_email.com";
        const isValid = authController.validateEmail(invalidEmail);
        expect(isValid).toBe(false);
      });
    });

    describe("validateMobileNo", () => {
      it("should return true for a valid mobile number", () => {
        const validMobileNo = "0701251047";
        const isValid = authController.validateMobileNo(validMobileNo);
        expect(isValid).toBe(true);
      });

      it("should return false for an invalid mobile number", () => {
        const invalidMobileNo = "123456789";
        const isValid = authController.validateMobileNo(invalidMobileNo);
        expect(isValid).toBe(false);
      });
    });

    describe("validatePassword", () => {
      it("should return true for a valid password", () => {
        const validPassword = "Janmi123";
        const isValid = authController.validatePassword(validPassword);
        expect(isValid).toBe(true);
      });

      it("should return false for a password less than 8 characters", () => {
        const invalidPassword = "short";
        const isValid = authController.validatePassword(invalidPassword);
        expect(isValid).toBe(false);
      });
    });
  });

});


