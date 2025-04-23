import React from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from "@mui/material";
import "./Points.css";

import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TrainIcon from "@mui/icons-material/Train";
import FlightIcon from "@mui/icons-material/Flight";

const commuteOptions = [
  { name: "Walk", points: 10, icon: <DirectionsWalkIcon color="success" /> },
  { name: "Cycle", points: 10, icon: <DirectionsBikeIcon color="success" /> },
  { name: "Metro", points: 9, icon: <DirectionsSubwayIcon color="primary" /> },
  { name: "Bus", points: 8, icon: <DirectionsBusIcon color="primary" /> },
  { name: "MotorBike", points: 5, icon: <DirectionsBikeIcon color="action" /> },
  { name: "EV", points: 9, icon: <ElectricCarIcon color="success" /> },
  { name: "Car", points: 2, icon: <DirectionsCarIcon color="warning" /> },
  { name: "Train", points: 8, icon: <TrainIcon color="info" /> },
  { name: "Airplane", points: 0.01, icon: <FlightIcon color="error" /> }
];

const Points = () => {
  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      className="points-container"
      sx={{ backgroundColor: "#f0fff0" }}
    >
      <Paper elevation={4} sx={{ maxWidth: 600, width: "100%", p: 4, backgroundColor: "#f0fff0" }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" sx={{color:"#013220"}}>
          Sustainability Points Allocation
        </Typography>

        <Divider sx={{ my: 2 }} />

        <List>
          {commuteOptions.map((option, index) => (
            <ListItem key={index}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText 
                primary={option.name} 
                secondary={`Earn ${option.points} point${option.points !== 1 ? "s" : ""} per km`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Points;


