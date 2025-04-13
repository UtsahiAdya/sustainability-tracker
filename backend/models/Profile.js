const mongoose = require("mongoose");

const commuteSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ["Walk", "Metro", "Bus", "Car", "EV", "Bike", "Train", "Airplane"],
    required: true,
  },
  percentage: { type: Number, min: 0, max: 100, required: true },
});

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  distanceFromOffice: { type: Number, required: true },
  defaultCommuteMode: {
    type: String,
    enum: ["Walk", "Metro", "Bus", "Car", "EV", "Bike", "Train", "Airplane"],
    required: true,
  },
  commuteModes: {
    type: [commuteSchema],
    validate: {
      validator: function (modes) {
        return modes.reduce((sum, mode) => sum + mode.percentage, 0) === 100;
      },
      message: "Total commute percentage must be exactly 100%",
    },
  },
  sustainabilityPoints: { type: Number, default: 0 }, // Tracks total points

  // 🔥 Add this new field to track points by each mode
  pointsByMode: {
    Walk: { type: Number, default: 0 },
    Metro: { type: Number, default: 0 },
    Bus: { type: Number, default: 0 },
    Car: { type: Number, default: 0 },
    EV: { type: Number, default: 0 },
    Bike: { type: Number, default: 0 },
    Train: { type: Number, default: 0 },
    Airplane: { type: Number, default: 0 },
  },

  lastUpdated: { type: Date, default: Date.now }, // Automatically update timestamps
});

// Automatically update the timestamp before saving
profileSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
module.exports = Profile;










































































































 