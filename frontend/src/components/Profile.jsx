// require('dotenv').config();
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import "./Profile.css";


const commuteOptions = ["Walk", "Metro", "Bus", "Car", "EV", "Bike", "Train", "Airplane"];

const Profile = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [distance, setDistance] = useState("");
  const [selectedCommutes, setSelectedCommutes] = useState([]);
  const [commutePercentages, setCommutePercentages] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

const ecoPoints = {
  Walk: 10,
  Metro: 9,
  Bus: 8,
  Bike: 5,
  EV: 9,
  Car: 2,
  Train: 8,
  Airplane: 0.01
};
  //Fetch user's existing profile
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/profile`, { withCredentials: true })
      .then((response) => {
        const profile = response.data;
        if (profile) {
          setPhoneNumber(profile.phoneNumber || "");
          setDistance(profile.distanceFromOffice || "");
          setSelectedCommutes(profile.commuteModes.map((m) => m.mode) || []);
          setCommutePercentages(
            profile.commuteModes.reduce(
              (acc, curr) => ({ ...acc, [curr.mode]: curr.percentage }),
              {}
            )
          );
        }
      })
      .catch(() => console.log("No existing profile found."));
  }, []);

  //Handle checkbox selection
  const handleCheckboxChange = (mode) => {
    if (selectedCommutes.includes(mode)) {
      setSelectedCommutes(selectedCommutes.filter((m) => m !== mode));
      setCommutePercentages((prev) => {
        const updated = { ...prev };
        delete updated[mode];
        return updated;
      });
    } else {
      setSelectedCommutes([...selectedCommutes, mode]);
      setCommutePercentages((prev) => ({ ...prev, [mode]: 0 }));
    }
  };

  //Handle percentage input change
  const handlePercentageChange = (mode, value) => {
    const percentage = Number(value);
    if (percentage < 0 || percentage > 100) {
      setError("Each commute mode percentage must be between 0 and 100.");
      return;
    }
    setCommutePercentages((prev) => ({ ...prev, [mode]: percentage }));
  };

  //Submit profile data
  const handleSubmit = (e) => {
    e.preventDefault();

    const totalPercentage = Object.values(commutePercentages).reduce(
      (sum, value) => sum + value,
      0
    );

    if (totalPercentage !== 100) {
      setError("Total commute percentage must be exactly 100%.");
      setSuccess(null);
      return;
    }

    const defaultCommuteMode = Object.keys(commutePercentages).reduce((a, b) =>
      commutePercentages[a] > commutePercentages[b] ? a : b
    );

    const profileData = {
      phoneNumber,
      distanceFromOffice: Number(distance),
      commuteModes: selectedCommutes.map((mode) => ({
        mode,
        percentage: commutePercentages[mode],
      })),
      defaultCommuteMode,
    };

    axios
      .post(`${apiUrl}/api/profile`, profileData, {
        withCredentials: true,
      })
      .then(() => {
        setSuccess("Profile saved successfully!");
        setError(null);
        setTimeout(() => navigate("/home"), 2000);
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Failed to save profile.");
        setSuccess(null);
      });
  };

  return (
    <>
    <Box   
      // sx={{
      //   minHeight: "100vh",
      //   display: "flex",
      //   justifyContent: "center",
      //   alignItems: "center",
      //   background: "#F0FFF0",
      //   padding: 3,
      // }}
      className="profile-container"
    >
      <Paper
        elevation={12}
        sx={{
          maxWidth: 500,
          width: "100%",
          padding: 4,
          borderRadius: 3,
          // background: "rgba(255, 255, 255, 0.1)",
          background:"#F0FFF0",
          // backdropFilter: "blur(8px)",
          // color: "#013220",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#013220" }}>
          Profile Information
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            inputProps={{ maxLength: 10 }}
            required
            sx={{
              "& label": { color: "#013220" },
              "& input": { color: "#013220" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#535C91" },
                "&:hover fieldset": { borderColor: "#9290C3" },
                "&.Mui-focused fieldset": { borderColor: "#006400" },
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              },
            }}
          />

          <TextField
            label="Distance from Office (in km)"
            fullWidth
            margin="normal"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
            sx={{
              "& label": { color: "#013220" },
              "& input": { color: "#013220" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#535C91" },
                "&:hover fieldset": { borderColor: "#9290C3" },
                "&.Mui-focused fieldset": { borderColor: "#006400" },
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              },
            }}
          />

          <Typography variant="h6" sx={{ mt: 2, color: "#013220" }}>
            Commute Modes
          </Typography>

          {commuteOptions.map((mode) => (
            <Grid container key={mode} alignItems="center" spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCommutes.includes(mode)}
                      onChange={() => handleCheckboxChange(mode)}
                      sx={{ color: "#013220",
                        backgroundColor: "rgba(255, 255, 255, 0.05)"
                       }}
                    />
                  }
                  label={<Typography sx={{ color: "#013220" }}
                  >{mode}</Typography>}
                />
              </Grid>
              {selectedCommutes.includes(mode) && (
                <Grid item xs={6}>
                  <TextField
                    label="Percentage"
                    type="number"
                    fullWidth
                    value={commutePercentages[mode] || ""}
                    onChange={(e) => handlePercentageChange(mode, e.target.value)}
                    required
                    sx={{
                      "& label": { color: "#013220" },
                      "& input": { color: "#013220" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#535C91" },
                        "&:hover fieldset": { borderColor: "#9290C3" },
                        "&.Mui-focused fieldset": { borderColor: "#006400" },
                        backgroundColor: "rgba(255, 255, 255, 0.05)"
                      },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          ))}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: "#006400", color: "#F0FFF0", fontWeight: "bold" ,'&:hover': {
      backgroundColor: "#228B22", // lighter green
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(0, 100, 0, 0.4)",
      transform: "translateY(-2px)"}}}
          >
            Save Profile
          </Button>
        </form>
      </Paper>
    </Box>
    
</>


  );
};

export default Profile;
