const LocationResource = require("../models/LocationResource");

// Create a new location resource booking

const createLocationResourceBooking = async (req, res) => {
  const { detail, booked, venue, date, startTime, endTime, faculty } = req.body;
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can add new courses.",
      });
    }

    // Check if there is an existing booking for the same venue, date, and overlapping time slot
    const existingBooking = await LocationResource.findOne({
      venue,
      date,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "A booking already exists for this venue during the specified time slot. Please choose another time slot.",
      });
    }

    // Create a new locationResource object
    const newLocationResource = new LocationResource({
      detail,
      booked,
      venue,
      date,
      startTime,
      endTime,
      faculty,
    });

    // Save the timetableSession to the database
    await newLocationResource.save();

    res.status(201).json({
      message: "Location resource booking created successfully",
      locationResource: newLocationResource,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all location resource bookings
const getAllLocationResourceBookings = async (req, res) => {
  try {
    const locationResourceBookings = await LocationResource.find();
    res.json(locationResourceBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single location resource booking by ID
const getLocationResourceBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const locationResourceBooking = await LocationResource.findById(bookingId);

    if (!locationResourceBooking) {
      return res
        .status(404)
        .json({ message: "Location resource booking not found" });
    }

    res.json(locationResourceBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a location resource booking by ID
const updateLocationResourceBooking = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can update courses.",
      });
    }

    const bookingId = req.params.id;
    const { detail, booked, venue, date, startTime, endTime, faculty } =
      req.body;

    const updatedLocationResourceBooking =
      await LocationResource.findByIdAndUpdate(
        bookingId,
        { detail, booked, venue, date, startTime, endTime, faculty },
        { new: true }
      );

    if (!updatedLocationResourceBooking) {
      return res
        .status(404)
        .json({ message: "Location resource booking not found" });
    }

    res.json({
      message: "Location resource booking updated successfully",
      locationResource: updatedLocationResourceBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a location resource booking by ID
const deleteLocationResourceBooking = async (req, res) => {
  const tokenRole = req.user.role; // Assuming user role is passed through the token

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can delete.",
      });
    }

    const bookingId = req.params.id;
    const deletedLocationResourceBooking =
      await LocationResource.findByIdAndDelete(bookingId);
    if (!deletedLocationResourceBooking) {
      return res
        .status(404)
        .json({ message: "Location resource booking not found" });
    }

    res.json({
      message: "Location resource booking deleted successfully",
      locationResource: deletedLocationResourceBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createLocationResourceBooking,
  getAllLocationResourceBookings,
  getLocationResourceBookingById,
  updateLocationResourceBooking,
  deleteLocationResourceBooking
};
