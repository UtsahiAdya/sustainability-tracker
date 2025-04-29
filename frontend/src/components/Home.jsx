// require('dotenv').config();
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  List,
  ListItem,
  Fab,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer
} from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate, useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';
import "../App.css"
import welcomeBg from '../assets/img/WelcomeBg1.png';
import "./Home.css"; // For CSS styling






// Color palette
const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0", "#607D8B", "#FF9800", "#00BCD4"];
const BG_COLOR = "#F0FFF0"; // Background color   "#070F2B"
const TEXT_COLOR ="#013220" ; // Light text for dark mode  "#EDEDED"
const GLASSMORPHISM_STYLE = {
  // background: "#F0FFF0",
  // backdropFilter: "blur(10px)",
  // borderRadius: "12px",
  // padding: "20px",
  // color: TEXT_COLOR,
 

  background: "rgba(240, 255, 240, 0.3)",  // More transparent background (lower opacity)
  backdropFilter: "blur(15px)",            // Moderate blur effect for transparency
  borderRadius: "12px",                    // Rounded corners
  padding: "20px",                         // Padding for content spacing
  color: TEXT_COLOR,                       // Text color
  border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border for slight definition
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Soft shadow to maintain a subtle effect
};

// Commute colors mapping
const COMMUTE_COLORS = {
  Walk: "#4CAF50", Cycle: "#81C784", Metro: "#2196F3", Bus: "#FF9800",
  Car: "#F44336", EV: "#9C27B0", MotorBike: "#FFEB3B",
  Train: "#795548", Airplane: "#03A9F4",
};

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const authRes = await axios.get(`${apiUrl}/auth/user`, {
        withCredentials: true,
      });
      console.log("Authenticated user:", authRes.data);
      console.log(apiUrl);
      const [userRes, leaderboardRes, userRankRes] = await Promise.all([
        axios.get(`${apiUrl}/api/home`, { withCredentials: true }),
        axios.get(`${apiUrl}/api/leaderboard`, { withCredentials: true }),
        axios.get(`${apiUrl}/api/leaderboard/rank`, { withCredentials: true }),
      ]);

      setUserInfo(userRes.data);
      setLeaderboard(leaderboardRes.data);
      setUserRank(userRankRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      if (location.hash === "#leaderboard") {
        setTimeout(() => {
          const el = document.getElementById("leaderboard");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100); // Slight delay to ensure DOM is ready
      }
    }
  };

  if (loading) {
    return <CircularProgress style={{ display: "block", margin: "100px auto" }} />;
  }

  if (!userInfo) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to load user information.
      </Typography>
    );
  }

  const {
    name = "User",
    totalTrips = 0,
    totalDistance = 0,
    sustainabilityPoints = 0,
    mostFrequentCommute = "N/A",
    pointsByMode = { Walk: 0, Cycle:0, Metro: 0, Bus: 0, Car: 0, EV: 0, MotorBike: 0, Train: 0, Airplane: 0 },
  } = userInfo;

  const pieData = Object.keys(pointsByMode)
    .filter((mode) => pointsByMode[mode] > 0)
    .map((mode) => ({ name: mode, value: pointsByMode[mode], color: COMMUTE_COLORS[mode] || "#888888" }));
    
  // console.log("Pie Data:", pieData);
  return (
    <div style={{ backgroundColor: BG_COLOR, minHeight: "100vh", padding: "20px", color: TEXT_COLOR }}>
     <div className="home-bg-section">
       <div
  style={{
    position: "relative",
    textAlign: "center",
    marginBottom: "40px",
    borderRadius: "20px",
    overflow: "hidden",
    height: "200px",
  }}
> 
<div className="welcome-section" >
  <div className="welcome-text" style={GLASSMORPHISM_STYLE}>
    Welcome, {name} 👋
  </div>
</div>
</div>
     



      {/* Stats Section */}
      <Grid container spacing={3} justifyContent="center">
        {[
          { label: "Total Trips", value: totalTrips },
          { label: "Total Distance (km)", value: totalDistance.toFixed(2) },
          { label: "Sustainability Points", value: sustainabilityPoints.toFixed(2) },
          { label: "Most Used Commute", value: mostFrequentCommute },
          { label: "Your Rank", value: `#${userRank ? userRank.rank : "N/A"}` },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card elevation={4} style={GLASSMORPHISM_STYLE}>
              <CardContent>
                <Typography variant="h6" color="inherit">{stat.label}</Typography>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pie Chart */}
      <Paper elevation={3} style={{ ...GLASSMORPHISM_STYLE, marginTop: "40px" }}>
        <Typography variant="h6" align="center" style={{ marginBottom: "15px" }}>
          Commute Points Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={3}
              // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              label={({ name, percent }) => {
                const percentage = (percent * 100);
                return `${name} (${percentage < 0.1 ? "< 0.1" : percentage.toFixed(1)}%)`;
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
 </Paper>
 </div>

<div id="leaderboard">
  <Typography variant="h5" gutterBottom align="center" style={{ marginTop: "40px" }}>
    🏆 Sustainability Leadership
  </Typography>

  <Paper
    elevation={4}
    className="leaderboard-container"
    style={{
      ...GLASSMORPHISM_STYLE,
      marginTop: "20px",
      borderRadius: "16px",
      padding: "20px",
    }}
  >
    {/* Single Paper: all Top 3 inside */}
    {leaderboard.slice(0, 3).map((user, index) => {
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
      const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // gold, silver, bronze
      return (
        <div
          key={user._id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            marginBottom: index !== 2 ? "12px" : "0", // no margin after last
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {/* Left: Medal + Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                marginRight: 2,
                bgcolor: medalColors[index],
              }}
            >
              {medal}
            </Avatar>
            <Typography variant="subtitle1" style={{ color: "#013220", fontWeight: "bold" }}>
              {user.user?.name || "Anonymous"}
            </Typography>
          </div>

          {/* Right: Points */}
          <Typography variant="subtitle1" style={{ color: "#013220", fontWeight: "bold" }}>
            {user.sustainabilityPoints.toFixed(2)}
          </Typography>
        </div>
      );
    })}
  </Paper>
</div>

      {/* Floating Add Trip Button */}
      <Fab
  variant="extended"
  sx={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#006400",
    color: "#F0FFF0",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "#228B22", // lighter green
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(0, 100, 0, 0.4)",
      transform: "translateY(-2px)",
    },
  }}
  onClick={() => navigate("/trips")}
>
  Add Trip
</Fab>
</div>

  );
};

export default Home;





//bg-FOFFFO
//TEXT-013220
//BORDER-006400




















































































 



































































































































 




















































































 