const express = require("express");
const passport = require("passport");
const Profile = require("../models/profile"); // Import Profile model
const User = require("../models/User"); // ✅ Import User model

const router = express.Router();

// 🔹 Google OAuth Login Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// 🔹 Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  async (req, res) => {
    try {
      // Fetch the user
      const user = await User.findById(req.user._id);

      // Redirect based on first login
      if (user.firstLogin) {
        // Update firstLogin to false
        user.firstLogin = false;
        await user.save();
        return res.redirect("http://localhost:3000/profile");
      }

      // Check if profile exists
      const existingProfile = await Profile.findOne({ user: req.user._id });

      if (!existingProfile) {
        // Redirect to profile setup if no profile found
        return res.redirect("http://localhost:3000/profile");
      }

      // Redirect to home if profile exists
      res.redirect("http://localhost:3000/home");
    } catch (err) {
      console.error("Error checking user profile:", err);
      res.redirect("http://localhost:3000/login");
    }
  }
);

// 🔹 Check if user is logged in (Session Persistence)
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// 🔹 Logout Route
 router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }

      res.clearCookie("connect.sid", { path: "/" }); // Clear the session cookie
      res.status(200).json({ message: "Logged out successfully" }); // No redirect here
    });
  });
});


module.exports = router;












































































































 