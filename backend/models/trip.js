const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  distance: { type: Number, required: true },
  commuteMode: {
    type: String,
    enum: ["Walk", "Metro", "Bus", "Car", "EV", "Bike", "Train", "Airplane"],
    required: true
  },
  type: {
    type: String,
    enum: ["office", "errands", "business"],
    required: true
  },
  points: { type: Number, default: 0 }
});
  ``
// Points Calculation based on sustainability
tripSchema.pre("save", function (next) {
  const ecoPoints = {
    Walk: 10, Metro: 9, Bus: 8, Bike: 5, EV: 9, Car: 2, Train: 8, Airplane: 0.01
  };
  this.points = ecoPoints[this.commuteMode] * this.distance; // Formula
  next();
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports =Trip;




































































































 