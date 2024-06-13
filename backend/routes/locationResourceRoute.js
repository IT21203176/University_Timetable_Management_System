const express = require("express");
const locationResourceController = require("../controllers/locationResourceController");
const authenticateToken = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// Route to create a new location resource booking
router.post(
  "/",
  authenticateToken,
  locationResourceController.createLocationResourceBooking
);

// Route to get all location resource bookings
router.get("/", locationResourceController.getAllLocationResourceBookings);

// Route to get a location resource booking by ID
router.get("/:id", locationResourceController.getLocationResourceBookingById);

// Route to update a location resource booking
router.put(
  "/:id",
  authenticateToken,
  locationResourceController.updateLocationResourceBooking
);

// Route to delete a location resource booking
router.delete(
  "/:id",
  authenticateToken,
  locationResourceController.deleteLocationResourceBooking
);

// Export the router
module.exports = router;
