const mongoose = require("mongoose");

// Define the schema for the LocationResource model
const locationResourcesSchema = new mongoose.Schema(
  {
    detail: [
      {
        locationType: [
          {
            lType: {
              type: String,
              enum: [
                "Lecture Hall",
                "Computer Lab",
                "Science Lab",
                "Auditorium",
                "Board Room",
              ],
              required: true,
            },
          },
        ],
        resources: [
          {
            rType: {
              type: String,
              enum: ["LaptopsForLecturer", "Projector"],
              required: true,
            },
          },
        ],
      },
    ],
    // Indicating if the location is booked or not
    booked: {
      type: Boolean,
      default: false,
    },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Create a LocationResource model using the defined schema
const LocationResource = mongoose.model(
  "LocationResource",
  locationResourcesSchema
);

// Export the LocationResource model
module.exports = LocationResource;
