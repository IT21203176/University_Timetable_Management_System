const LocationResource = require("../models/LocationResource");
const locationResourceController = require("../controllers/locationResourceController");

jest.mock("../models/LocationResource");

describe("locationResourceController", () => {
  describe("createLocationResourceBooking", () => {
    const req = {
      body: {
        detail: [
          {
            locationType: [{ lType: "Lecture Hall" }],
            resources: [{ rType: "Projector" }],
          },
        ],
        booked: false,
        venue: "B502",
        date: "2024-02-25",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        faculty: "65f96fc27b0c3964bee32fb5",
      },
      user: { role: "Admin" },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    LocationResource.prototype.save = jest.fn();

    beforeEach(() => {
      LocationResource.findOne.mockResolvedValue(null);
      LocationResource.countDocuments.mockResolvedValue(0);
      LocationResource.prototype.save.mockResolvedValue();
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await locationResourceController.createLocationResourceBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 403 if location or resource already exists", async () => {
      LocationResource.findOne.mockResolvedValue({});
      await locationResourceController.createLocationResourceBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should create new course and return 201", async () => {
      const req = {
        body: {
          detail: [
            {
              locationType: [{ lType: "Lecture Hall" }],
              resources: [{ rType: "Projector" }],
            },
          ],
          booked: false,
          venue: "B502",
          date: "2024-02-25",
          startTime: "09:00 AM",
          endTime: "11:00 AM",
          faculty: "65f96fc27b0c3964bee32fb5",
        },
        user: { role: "Admin" },
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      LocationResource.prototype.save = jest.fn(); // Mocking save method

      await locationResourceController.createLocationResourceBooking(req, res);

      expect(LocationResource.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getAllLocationResourceBookings", () => {
    const req = {}; 
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("Should return all location resource bookings", async () => {
      LocationResource.find.mockResolvedValue(["locRes1", "locRes2"]);
      await locationResourceController.getAllLocationResourceBookings(req, res); // Pass req and res
      expect(res.json).toHaveBeenCalledWith(["locRes1", "locRes2"]);
    });
  });

  describe("getLocationResourceBookingById", () => {
    const req = { params: { bookingId: "65fba4d61192274999ed5552" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    it("should return 404 if Location resource booking not found", async () => {
      LocationResource.findById.mockResolvedValue(null);
      await locationResourceController.getLocationResourceBookingById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return single location resource booking by ID", async () => {
      LocationResource.findById.mockResolvedValue("locationResourceBooking");
      await locationResourceController.getLocationResourceBookingById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith("locationResourceBooking");
    });
  });

  describe("updateLocationResourceBooking", () => {
    const req = {
      params: { id: "bookingId" },
      body: {
        detail: [
          {
            locationType: [{ lType: "Lecture Hall" }],
            resources: [{ rType: "Projector" }],
          },
        ],
        booked: false,
        venue: "B502",
        date: "2024-02-25",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        faculty: "65f96fc27b0c3964bee32fb5",
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

    it("should return 404 if course not found", async () => {
      LocationResource.findByIdAndUpdate.mockResolvedValue(null);
      await locationResourceController.updateLocationResourceBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Location resource booking not found",
      });
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await locationResourceController.updateLocationResourceBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      const updatedLocationResourceBooking = {
        _id: "bookingId",
        detail: [
          {
            locationType: [{ lType: "Lecture Hall" }],
            resources: [{ rType: "Projector" }],
          },
        ],
        booked: false,
        venue: "B502",
        date: "2024-02-25",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        faculty: "65f96fc27b0c3964bee32fb5",
      };

      LocationResource.findByIdAndUpdate.mockResolvedValue(
        updatedLocationResourceBooking
      );

      await locationResourceController.updateLocationResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can update courses.",
      });
    });
  });

  describe("deleteLocationResourceBooking", () => {
    const req = {
      params: { id: "bookingId" },
      body: {
        detail: [
          {
            locationType: [{ lType: "Lecture Hall" }],
            resources: [{ rType: "Projector" }],
          },
        ],
        booked: false,
        venue: "B502",
        date: "2024-02-25",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        faculty: "65f96fc27b0c3964bee32fb5",
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

    it("should return 404 if course not found", async () => {
      LocationResource.findByIdAndDelete.mockResolvedValue(null);
      await locationResourceController.deleteLocationResourceBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Location resource booking not found",
      });
    });

    it("should return 403 if user is not an admin", async () => {
      req.user.role = "Faculty";
      await locationResourceController.deleteLocationResourceBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(403);

      const deletedLocationResourceBooking = {
        _id: "bookingId",
        detail: [
          {
            locationType: [{ lType: "Lecture Hall" }],
            resources: [{ rType: "Projector" }],
          },
        ],
        booked: false,
        venue: "B502",
        date: "2024-02-25",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        faculty: "65f96fc27b0c3964bee32fb5",
      };

      LocationResource.findByIdAndDelete.mockResolvedValue(deletedLocationResourceBooking);

      await locationResourceController.deleteLocationResourceBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Permission denied. Only Admins can delete.",
      });
    });
  });
});
