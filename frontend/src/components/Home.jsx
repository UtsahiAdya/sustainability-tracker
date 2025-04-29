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
import welcomeBg from '../assets/img/img-9091d1ae-a786-4375-bb3e-55c2460c389f.png';





// Color palette
const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0", "#607D8B", "#FF9800", "#00BCD4"];
const BG_COLOR = "#F0FFF0"; // Background color   "#070F2B"
const TEXT_COLOR ="#013220" ; // Light text for dark mode  "#EDEDED"
const GLASSMORPHISM_STYLE = {
  background: "#F0FFF0",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  padding: "20px",
  color: TEXT_COLOR,
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
      {/* <Typography variant="h4" gutterBottom align="center" style={{ color: TEXT_COLOR }}>
        Welcome, {name} 👋
      </Typography> */}
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
  {/* Background Layer */}
  <div
    style={{
      backgroundImage: `url(${welcomeBg})`,
      backgroundSize: "150px",
      backgroundRepeat: "repeat",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.5, // Slightly lower for more subtlety
      zIndex: 1,
    }}
  />

  {/* Darker Overlay with Blur */}
  <div
    style={{
      backgroundColor: "rgba(60, 59, 59, 0)",
      backdropFilter: "blur(1px)", // Adds a blur to background for readability
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
    }}
  />

  {/* Text Content */}
  <div
    style={{
      position: "relative",
      zIndex: 3,
      color: "#013220",
      background:"white",
      width:"30%",
      margin:"auto",
      backgroundColor:"#F0FFF0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "80%",
      fontSize: "28px",
      fontWeight: "800",
      textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)", // Adds shadow for more contrast
    }}
  >
    Welcome, {name} 👋
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
          {/* <Typography align="center" style={{ marginTop: '10px' }}>
  Total Points: {pieData.reduce((sum, mode) => sum + mode.value, 0)}
</Typography> */}

        </ResponsiveContainer>
      </Paper>
{/* 
      <Typography variant="h5" gutterBottom align="center" style={{ marginTop: "40px" }}>
        🏆 Sustainability Leaderboard
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {
        leaderboard.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card elevation={3} style={{ ...GLASSMORPHISM_STYLE, border: index === 0 ? "3px solid gold" : "none" }}>
              <CardContent>
                <Typography variant="h6">
                  {index + 1}. {user.user?.name || "Anonymous"}{" "}
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
                </Typography>
                <Typography variant="body1">Points: {user.sustainabilityPoints}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )
        )}
      </Grid> */}

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




{/* 






       
<div id="leaderboard">
<Typography variant="h5" gutterBottom align="center" style={{ marginTop: "40px" }} >
  🏆 Sustainability Leadership
</Typography>

<TableContainer
  component={Paper}
  elevation={3}
  className="leaderboard-container"
  style={{...GLASSMORPHISM_STYLE, marginTop: "20px", borderRadius: "12px"  }}
>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontWeight: "bold", color: "#013220" }}>Rank</TableCell>
        <TableCell style={{ fontWeight: "bold", color: "#013220" }}>Name</TableCell>
        <TableCell style={{ fontWeight: "bold", color: "#013220" }}>Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {leaderboard.slice(0, 3).map((user, index) => (
        <TableRow
          className="leaderboard-row"
          key={user._id}
          style={{
            
          }}
        >
          <TableCell style={{ color: "#013220" }}>
            {index + 1}{" "}
            
          </TableCell>
          <TableCell style={{ color: "#013220" }}>{user.user?.name || "Anonymous"}{" "}
          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
          </TableCell>
          <TableCell style={{ color: "#013220" }}>{user.sustainabilityPoints.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</div>
 */}












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




















































































 