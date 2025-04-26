require('dotenv').config();
const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const ensureAuthenticated = require("../middleware/authMiddleware");

// 🏆 Get global leaderboard (Top 10 users)
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const topProfiles = await Profile.find()
      .sort({ sustainabilityPoints: -1 })// Adjust the limit as needed
      .select("user sustainabilityPoints pointsByMode") // Select necessary fields
      .populate("user", "name"); // Populate the user field to get the name

    res.json(topProfiles);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🥇 Get user's rank on the leaderboard
router.get("/rank", ensureAuthenticated, async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user._id });

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Count users with more points to calculate rank
    const higherRankedUsers = await Profile.countDocuments({
      sustainabilityPoints: { $gt: userProfile.sustainabilityPoints },
    });

    const rank = higherRankedUsers + 1;

    res.json({
      rank,
      sustainabilityPoints: userProfile.sustainabilityPoints,
      pointsByMode: userProfile.pointsByMode,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
});

module.exports = router;

 
