const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile"); // ✅ Profile route
const tripRoutes=require("./routes/trips");
const homeRoutes = require("./routes/home");
const leaderboardRoutes = require("./routes/leaderboard");
const cron = require("node-cron");
const updateOfficeTrips = require("./cron/updateOfficeTrips");

cron.schedule("0 7 * * 1-5", () => {
  updateOfficeTrips();
});       


require("dotenv").config();
require("./config/passport");

const app = express();
app.set('trust proxy', 1);


app.use(express.json()); // ✅ Middleware to parse JSON

// ✅ Enable CORS for frontend requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Middleware for sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection URL
      collectionName: 'sessions', // Optional: specify the session collection name
      ttl: 14 * 24 * 60 * 60, // Optional: set session expiry time (TTL in seconds)
    }),
    cookie: { secure: process.env.NODE_ENV === 'production',  
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 }, // Set `true` in production with HTTPS
  })
);

// ✅ Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/api/profile", profileRoutes); // ✅ Add Profile Routes
app.use("/api/trips", tripRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);



app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ✅ Connect to MongoDB


const PORT = process.env.PORT || 6005;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
