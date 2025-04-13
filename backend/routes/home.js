const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/authMiddleware");
const Profile = require("../models/profile");
const Trip = require("../models/trip");
const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");

// Get user dashboard data
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Fetch user with name
    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Fetch profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
     
    // ✅ Fetch trips and ensure they belong to the user
    const trips = await Trip.find({ userId });
    if (!trips) {
      return res.status(404).json({ error: "Trips not found" });
    }

    // ✅ Calculate total trips and distance
    const totalTrips = trips.length;
    const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);

    // ✅ Calculate points by commute mode
    const pointsByMode = {};
    trips.forEach((trip) => {
      if (!pointsByMode[trip.commuteMode]) {
        pointsByMode[trip.commuteMode] = 0;
      }
      pointsByMode[trip.commuteMode] += trip.points || 0;
    });

    // ✅ Find most frequent commute mode
    const commuteFrequency = {};
    trips.forEach((trip) => {
      commuteFrequency[trip.commuteMode] = (commuteFrequency[trip.commuteMode] || 0) + 1;
    });

    let mostFrequentCommute = "N/A";
    let maxFrequency = 0;
    for (const mode in commuteFrequency) {
      if (commuteFrequency[mode] > maxFrequency) {
        maxFrequency = commuteFrequency[mode];
        mostFrequentCommute = mode;
      }
    }

    // ✅ Update Profile's sustainability points and pointsByMode
    profile.sustainabilityPoints = Object.values(pointsByMode).reduce((sum, points) => sum + points, 0);
    profile.pointsByMode = pointsByMode;
    await profile.save();

    // ✅ Update Leaderboard
    let leaderboardEntry = await Leaderboard.findOne({ user: userId });
    if (!leaderboardEntry) {
      leaderboardEntry = new Leaderboard({
        user: userId,
        totalPoints: profile.sustainabilityPoints,
        pointsByMode: pointsByMode,
      });
    } else {
      leaderboardEntry.totalPoints = profile.sustainabilityPoints;
      leaderboardEntry.pointsByMode = pointsByMode;
      leaderboardEntry.lastUpdated = Date.now();
    }
    await leaderboardEntry.save();

    // ✅ Send response with user details
    res.json({
      name: user.name || "Unknown User",
      defaultCommuteMode: profile.defaultCommuteMode || "N/A",
      totalTrips,
      totalDistance,
      sustainabilityPoints: profile.sustainabilityPoints,
      mostFrequentCommute,
      pointsByMode,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;







































































































































 












































































 