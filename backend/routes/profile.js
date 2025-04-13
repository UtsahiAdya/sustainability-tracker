const express = require("express");
const Profile = require("../models/Profile");
const User = require("../models/User");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create or update user profile
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { phoneNumber, distanceFromOffice, commuteModes } = req.body;

    // Automatically set defaultCommuteMode based on the highest percentage
    const defaultCommuteMode = commuteModes.reduce((max, mode) =>
      mode.percentage > max.percentage ? mode : max, commuteModes[0]
    ).mode;

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile.phoneNumber = phoneNumber;
      profile.distanceFromOffice = distanceFromOffice;
      profile.commuteModes = commuteModes;
      profile.defaultCommuteMode = defaultCommuteMode;
      await profile.save();
      return res.json({ message: "Profile updated", profile });
    } else {
      // Create new profile
      profile = new Profile({
        user: req.user._id,
        phoneNumber,
        distanceFromOffice,
        commuteModes,
        defaultCommuteMode, // Set defaultCommuteMode on creation
      });
      await profile.save();
      await User.findByIdAndUpdate(req.user._id, { profile: profile._id });
      return res.status(201).json({ message: "Profile created", profile });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get authenticated user's profile
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Reset sustainability points
router.post("/reset-points", ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    profile.sustainabilityPoints = 0;
    await profile.save();
    res.json({ message: "Sustainability points reset successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update default commute mode
router.put("/update-commute", ensureAuthenticated, async (req, res) => {
  try {
    const { commuteModes } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Automatically update defaultCommuteMode based on highest percentage
    const defaultCommuteMode = commuteModes.reduce((max, mode) =>
      mode.percentage > max.percentage ? mode : max, commuteModes[0]
    ).mode;

    profile.commuteModes = commuteModes;
    profile.defaultCommuteMode = defaultCommuteMode;
    await profile.save();
    res.json({ message: "Commute modes updated successfully.", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
























































































 