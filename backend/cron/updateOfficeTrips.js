// cron/updateOfficeTrips.js
const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Trip = require("../models/trip");

dotenv.config();

async function updateOfficeTrips() {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      fs.appendFileSync("cron.log", `[${today.toLocaleString()}] - Weekend: No trips added.\n`);
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find().populate("profile");

    for (const user of users) {
      const profile = user.profile;
      if (!profile || !profile.commuteModes || !profile.distanceFromOffice) continue;

      for (const commute of profile.commuteModes) {
        const { mode, percentage } = commute;

        if (percentage === 0) continue;

        const tripDistance = (profile.distanceFromOffice * percentage) / 100;

        const newTrip = new Trip({
        userId: user._id,
        date: today,
        distance: tripDistance,
        commuteMode: mode,
        type: "office",
        });

        await newTrip.save();

        fs.appendFileSync(
            "cron.log",
            `[${new Date().toLocaleString()}] - ${user.name} (${user._id}) - Mode: ${mode}, Distance: ${tripDistance.toFixed(
              2
            )}km (${percentage}% of ${profile.distanceFromOffice}km)\n`
          );
          
      }
    }

    console.log("✅ Office trips added successfully!");
  } catch (error) {
    console.error("❌ Error running cron job:", error);
    fs.appendFileSync(
      "cron.log",
      `[${new Date().toLocaleString()}] - ERROR: ${error.message}\n`
    );
  } finally {
    await mongoose.disconnect();
  }
}
if (require.main === module) {
  updateOfficeTrips()
    .then(() => {
      console.log("Office trips updated successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error updating office trips:", err);
      process.exit(1);
    });
}


module.exports = updateOfficeTrips;























































































 












































































































 

