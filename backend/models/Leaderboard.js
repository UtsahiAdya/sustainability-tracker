const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPoints: { type: Number, default: 0 },
  pointsByMode: {
    Walk: { type: Number, default: 0 },
    Metro: { type: Number, default: 0 },
    Bus: { type: Number, default: 0 },
    Car: { type: Number, default: 0 },
    EV: { type: Number, default: 0 },
    MotorBike: { type: Number, default: 0 },
    Train: { type: Number, default: 0 },
    Airplane: { type: Number, default: 0 },
  },
  lastUpdated: { type: Date, default: Date.now },
});

// Automatically update the last updated timestamp
leaderboardSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
module.exports = Leaderboard;
