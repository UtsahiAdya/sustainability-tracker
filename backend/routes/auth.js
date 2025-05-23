require('dotenv').config();
const express = require("express");
const passport = require("passport");
const Profile = require("../models/Profile"); // Import Profile model
const User = require("../models/User"); // ✅ Import User model
console.log("Frontend URL:", process.env.FRONTEND_URL); // Check if it's printed correctly
// console.log("All environment variables:", process.env);
const FRONTEND_URL = process.env.FRONTEND_URL;

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
  passport.authenticate("google", { failureRedirect:`${FRONTEND_URL}/login` }),
  async (req, res) => {
    try {
      // Fetch the user
      const user = await User.findById(req.user._id);

      // Redirect based on first login
      if (user.firstLogin) {
        // Update firstLogin to false
        user.firstLogin = false;
        await user.save();
        return res.redirect(`${FRONTEND_URL}/profile`);
      }

      // Check if profile exists
      const existingProfile = await Profile.findOne({ user: req.user._id });

      if (!existingProfile) {
        // Redirect to profile setup if no profile found
        return res.redirect(`${FRONTEND_URL}/profile`);
      }

      // Redirect to home if profile exists
      
      res.redirect(`${FRONTEND_URL}/auth/success`);
    } catch (err) {
      console.error("Error checking user profile:", err);
      res.redirect(`${FRONTEND_URL}/login`);
    }
  }
);

// 🔹 Check if user is logged in (Session Persistence)
router.get("/user", (req, res) => {
  console.log("=== /auth/user ===");
  console.log("Session ID:", req.sessionID);
  console.log("Session Object:", req.session);
  console.log("Is Authenticated:", req.isAuthenticated());
  console.log("User Object:", req.user);
  console.log('Session:', req.session); 
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












































































































 