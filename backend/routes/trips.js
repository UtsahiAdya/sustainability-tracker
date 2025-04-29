require('dotenv').config();
const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const Profile = require("../models/Profile");
const Leaderboard = require("../models/Leaderboard");
const ensureAuthenticated = require("../middleware/authMiddleware");

//Points Calculation Function
const calculatePoints = (commuteMode, distance) => {
  const pointsMap = {
    Walk: 20,
    Cycle:20,
    Metro: 12,
    Bus: 8,
    Car: 0.5,
    EV: 10,
    MotorBike: 2,
    Train: 9,
    Airplane: 0.01,
  };
  const points = pointsMap[commuteMode] * distance;
  return Math.round(points);
};

//Get all trips for the logged-in user
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

//Add a new trip and update Profile & Leaderboard
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { date, distance, commuteMode, type } = req.body;

    // Input Validation
    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: "Invalid or missing date" });
    }
    if (!distance || distance <= 0) {
      return res.status(400).json({ error: "Distance must be a positive number" });
    }
    if (!commuteMode || !["Walk","Cycle" ,"Metro", "Bus", "Car", "EV", "MotorBike", "Train", "Airplane"].includes(commuteMode)) {
      return res.status(400).json({ error: "Invalid commute mode" });
    }
    if (!type || !["Office", "Errands", "Business"].includes(type)) {
      return res.status(400).json({ error: "Invalid trip type" });
    }

    //Calculate sustainability points
    const points = calculatePoints(commuteMode, distance);

    //Save the new trip
    const newTrip = new Trip({
      userId: req.user._id,
      date: new Date(date),
      distance,
      commuteMode,
      type,
      points,
    });

    await newTrip.save();

    //Update Profile points and pointsByMode
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: {
          sustainabilityPoints: points,
          [`pointsByMode.${commuteMode}`]: points,
        },
      }
    );

    //Sync Leaderboard with updated Profile
    const updatedProfile = await Profile.findOne({ user: req.user._id });

    await Leaderboard.findOneAndUpdate(
      { user: req.user._id },
      {
        totalPoints: updatedProfile.sustainabilityPoints,
        pointsByMode: updatedProfile.pointsByMode,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Trip added successfully!", trip: newTrip });
  } catch (error) {
    console.error("Error adding trip:", error);
    res.status(500).json({ error: "Failed to add trip" });
  }
});

//Delete a trip and update Profile & Leaderboard
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Subtract trip points from Profile
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: {
          sustainabilityPoints: -trip.points,
          [`pointsByMode.${trip.commuteMode}`]: -trip.points,
        },
      }
    );

    // Update Leaderboard after trip deletion
    const updatedProfile = await Profile.findOne({ user: req.user._id });

    await Leaderboard.findOneAndUpdate(
      { user: req.user._id },
      {
        totalPoints: updatedProfile.sustainabilityPoints,
        pointsByMode: updatedProfile.pointsByMode,
      },
      { new: true }
    );

    // Remove the trip from the database
    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

// Update an existing trip
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { date, distance, commuteMode, type } = req.body;

    // Validate input
    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: "Invalid or missing date" });
    }
    if (!distance ) {
      return res.status(400).json({ error: "Distance must be a positive number" });
    }
    if( distance <= 0){
      return res.status(400).json({error:"Distance must be positive and greater than 0"})
    }
    if (!commuteMode || !["Walk","Cycle" ,"Metro", "Bus", "Car", "EV", "MotorBike", "Train", "Airplane"].includes(commuteMode)) {
      return res.status(400).json({ error: "Invalid commute mode" });
    }
    if (!type || !["Office", "Errands", "Business"].includes(type)) {
      return res.status(400).json({ error: "Invalid trip type" });
    }

    // Find the trip before updating to adjust points
    const oldTrip = await Trip.findById(req.params.id);
    if (!oldTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Calculate new points
    const newPoints = calculatePoints(commuteMode, distance);
    const pointsDifference = newPoints - oldTrip.points; // Adjust points

    // Update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { date: new Date(date), distance, commuteMode, type, points: newPoints },
      { new: true }
    );

    // Update Profile and Leaderboard
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: {
          sustainabilityPoints: pointsDifference,
          [`pointsByMode.${oldTrip.commuteMode}`]: -oldTrip.points, // Remove old points
          [`pointsByMode.${commuteMode}`]: newPoints, // Add new points
        },
      }
    );

    const updatedProfile = await Profile.findOne({ user: req.user._id });

    await Leaderboard.findOneAndUpdate(
      { user: req.user._id },
      {
        totalPoints: updatedProfile.sustainabilityPoints,
        pointsByMode: updatedProfile.pointsByMode,
      },
      { new: true }
    );

    res.json({ message: "Trip updated successfully!", updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Failed to update trip" });
  }
});


module.exports = router;
















































































































  