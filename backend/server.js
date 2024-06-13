// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");

// Import route handlers
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoute");
const timetableRoutes = require("./routes/timetableRoutes");
const locationResourceRoutes = require("./routes/locationResourceRoute");
const enrollmentRoutes = require('./routes/enrollmentRoutes')

// // Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for request
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & Listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });

// Define routes for different parts of the API
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/timetableSessions", timetableRoutes);
app.use("/api/locationResources", locationResourceRoutes);
app.use('/api/enroll', enrollmentRoutes)