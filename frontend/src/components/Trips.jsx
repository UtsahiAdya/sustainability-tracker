// require('dotenv').config();
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Fab,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const apiUrl = import.meta.env.VITE_API_URL;
import tripsBg from '../assets/img/img-fd41a3c9-b372-4ef5-848f-b5aa34605f3f.png';


const commuteOptions = [
  "Walk",
  "Cycle",
  "Metro",
  "Bus",
  "Car",
  "EV",
  "MotorBike",
  "Train",
  "Airplane",
];
const tripTypes = ["Office", "Errands", "Business"];

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    date: "",
    distance: "",
    commuteMode: "Walk",
    type: "Office",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    tripId: null,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editTrip, setEditTrip] = useState(null);
  const sortTrips = (tripsArray) => {
    return tripsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/trips`, { withCredentials: true })
      // .then((res) => setTrips(res.data))
      .then((res) => setTrips(sortTrips(res.data)))
      .catch(() => showSnackbar("Error fetching trips", "error"))
      .finally(() => setLoading(false));
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setNewTrip({ ...newTrip, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = () => {
    const selectedDate = new Date(newTrip.date);
    const today = new Date();
    selectedDate.setHours(0,0,0,0);
    today.setHours(0, 0, 0, 0);  

    if (!newTrip.date || isNaN(selectedDate)) {
      showSnackbar("Date is required and must be valid", "error");
      return;
    }
    if (selectedDate > today) {
      showSnackbar("Future dates are not allowed", "error");
      return;
    }
    if (!newTrip.distance || newTrip.distance <= 0) {
      showSnackbar("Distance must be a positive number", "error");
      return;
    }

    const formattedTrip = { ...newTrip, date: selectedDate.toISOString() };

    axios
      .post(`${apiUrl}/api/trips`, formattedTrip, {
        withCredentials: true,
      })
      .then((res) => {
        setTrips(sortTrips([res.data.trip, ...trips]));
        setOpen(false);
        setNewTrip({
          date: "",
          distance: "",
          commuteMode: "Walk",
          type: "Office",
        });
        showSnackbar("Trip added successfully!");
      })
      .catch(() => showSnackbar("Error adding trip", "error"));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/api/trips/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setTrips(sortTrips(trips.filter((trip) => trip._id !== id)));
        showSnackbar("Trip deleted successfully");
      })
      .catch(() => showSnackbar("Error deleting trip", "error"));
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ open: true, tripId: id });
  };

  const handleDeleteConfirm = () => {
    handleDelete(deleteConfirm.tripId);
    setDeleteConfirm({ open: false, tripId: null });
  };

  const handleEditClick = (trip) => {
    setEditTrip(trip);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditTrip({ ...editTrip, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    const selectedDate = new Date(editTrip.date);
    const today = new Date();
    selectedDate.setHours(0,0,0,0);
    today.setHours(0, 0, 0, 0);

    if (!editTrip.date || isNaN(selectedDate)) {
      showSnackbar("Date is required and must be valid", "error");
      return;
    }
    if (selectedDate > today) {
      showSnackbar("Future dates are not allowed", "error");
      return;
    }
    if (!editTrip.distance || editTrip.distance <= 0) {
      showSnackbar("Distance must be a positive number", "error");
      return;
    }

    const formattedTrip = { ...editTrip, date: selectedDate.toISOString() };

    axios
      .put(`${apiUrl}/api/trips/${editTrip._id}`, formattedTrip, {
        withCredentials: true,
      })
      .then((res) => {
        setTrips(sortTrips(trips.map((trip) => trip._id === editTrip._id ? res.data.updatedTrip : trip)));
        setEditOpen(false);
        showSnackbar("Trip updated successfully!");
      })
      .catch(() => showSnackbar("Error updating trip", "error"));
  };

  return (
    <div
      style={{
        background: "#F0FFF0",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* <h2 style={{ color: "#006400", fontSize: "2rem", marginBottom: "20px" }}>
        Your Trips
      </h2> */}
        <div style={{ 
        position: "relative", 
        textAlign: "center", 
        marginBottom: "40px", 
        borderRadius: "20px", 
        overflow: "hidden",
        height: "200px"  // Make sure there’s enough height
      }}>
        {/* Background Layer */}
        <div
          style={{
            backgroundImage: `url(${tripsBg})`,
            backgroundSize: "150px",
            backgroundRepeat: "repeat",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            zIndex: 1,
          }}
        />
      
        {/* Overlay */}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width:"30%",
            margin:"auto",
            backgroundColor:"#F0FFF0",
            height: "80%",
            fontSize: "24px",
            fontWeight: "bold",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)", // Adds shadow for more contrast

          }}
        >
          <h2>Your Trips</h2>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#013220" , fontWeight:"bold", fontSize:"1.3rem"}}>Date</TableCell>
                <TableCell sx={{ color: "#013220",  fontWeight:"bold", fontSize:"1.3rem"}}>Type</TableCell>
                <TableCell sx={{ color: "#013220",  fontWeight:"bold", fontSize:"1.3rem" }}>Distance (km)</TableCell>
                <TableCell sx={{ color: "#013220" ,  fontWeight:"bold", fontSize:"1.3rem"}}>Commute Mode</TableCell>
                <TableCell sx={{ color: "#013220",  fontWeight:"bold" , fontSize:"1.3rem"}}>Points</TableCell>
                <TableCell sx={{ color: "#013220",  fontWeight:"bold" , fontSize:"1.3rem"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip._id}>
                  <TableCell sx={{ color: "#013220" }}>
                    {new Date(trip.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: "#013220" }}>{trip.type}</TableCell>
                  <TableCell sx={{ color: "#013220" }}>{trip.distance.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: "#013220" }}>
                    {trip.commuteMode}
                  </TableCell>
                  <TableCell sx={{ color: "#013220" }}>{trip.points.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(trip)}>
                      <EditIcon sx={{ color: "#006400" }} />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(trip._id)}>
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Fab
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#006400",
          color: "#F0FFF0",
          fontWeight: "bold",
          paddingX: 3, // Increased horizontal padding
          minWidth: "120px", // Ensures enough space for text
          height: "56px", // Adjusted height for better oval shape
          borderRadius: "28px", // Keeps it oval
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          '&:hover': {
        backgroundColor: "#228B22", // lighter green
        color: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 100, 0, 0.4)",
        transform: "translateY(-2px)",
      },
        }}
        onClick={() => {
          const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
          setNewTrip((prev) => ({ ...prev, date: today }));
          setOpen(true)
        }}
      >
        <AddIcon />
        <span
          style={{ marginLeft: "8px", whiteSpace: "nowrap", fontSize: "14px" }}
        >
          Add Trip
        </span>
      </Fab>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            background: "#F0FFF0", // Slightly more visible glassmorphism effect
            backdropFilter: "blur(20px)", // Stronger blur for contrast
            color: "#013220", // Ensuring text is visible
            borderRadius: "12px",
            border: "2px solid #006400", // Orange highlight
            boxShadow: "0px 0px 15px #006400", // Glowing effect
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>Add New Trip</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="date"
            type="date"
            value={newTrip.date}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            InputProps={{
              onClick: (e) => e.target.showPicker && e.target.showPicker(), // Open calendar on click
            }}
            sx={{
              color: "#ffffff",
              "& .MuiInputBase-input": { color: "#013220" },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="distance"
            type="number"
            label="Distance (km)"
            value={newTrip.distance}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#013220" } }}
            sx={{
              color: "#ffffff",
              "& .MuiInputBase-input": { color: "#013220" },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            select
            name="commuteMode"
            label="Commute Mode"
            value={newTrip.commuteMode}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#013220" } }}
            sx={{
              color: "#ffffff",
              "& .MuiInputBase-input": { color: "#013220" },
            }}
          >
            {commuteOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            select
            name="type"
            label="Trip Type"
            value={newTrip.type}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#013220" } }}
            sx={{
              color: "#ffffff",
              "& .MuiInputBase-input": { color: "#013220" },
            }}
          >
            {tripTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "#006400", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{ color: "#006400", fontWeight: "bold" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, tripId: null })}
        sx={{
          "& .MuiPaper-root": {
            background: "#F0FFF0",
            backdropFilter: "blur(15px)",
            color: "white",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#006400", fontWeight: "bold" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ color: "#013220", fontSize: "1rem" }}>
          Are you sure you want to delete this trip?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirm({ open: false, tripId: null })}
            sx={{ color: "#013220" }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} sx={{ color: "#FF4C4C" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
  open={editOpen}
  onClose={() => setEditOpen(false)}
  sx={{
    "& .MuiPaper-root": {
      background: "#F0FFF0",
      backdropFilter: "blur(20px)",
      color: "#013220",
      borderRadius: "12px",
      border: "2px solid #006400",
      boxShadow: "0px 0px 15px #006400",
    },
  }}
>
  <DialogTitle sx={{ color: "#06400" }}>Edit Trip</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="normal"
      name="date"
      type="date"
      value={
          editTrip?.date
      ? new Date(editTrip.date).toISOString().split("T")[0]
      : ""
      }
      onChange={handleEditChange}
      InputLabelProps={{ style: { color: "#013220" } }}
      inputProps={{
        max: new Date().toISOString().split("T")[0] 
      }}
      InputProps={{
        onClick: (e) => e.target.showPicker && e.target.showPicker(),
      }}
      sx={{
        color: "#013220",
        "& .MuiInputBase-input": { color: "#013220" },
      }}
    />
    <TextField
      fullWidth
      margin="normal"
      name="distance"
      type="number"
      label="Distance (km)"
      value={editTrip?.distance || ""}
      onChange={handleEditChange}
      InputLabelProps={{ style: { color: "#013220" } }}
      sx={{
        color: "#ffffff",
        "& .MuiInputBase-input": { color: "#013220" },
      }}
    />
    <TextField
      fullWidth
      margin="normal"
      select
      name="commuteMode"
      label="Commute Mode"
      value={editTrip?.commuteMode || ""}
      onChange={handleEditChange}
      InputLabelProps={{ style: { color: "#013220" } }}
      sx={{
        color: "#ffffff",
        "& .MuiInputBase-input": { color: "#013220" },
      }}
    >
      {commuteOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
    <TextField
      fullWidth
      margin="normal"
      select
      name="type"
      label="Trip Type"
      value={editTrip?.type || ""}
      onChange={handleEditChange}
      InputLabelProps={{ style: { color: "#013220" } }}
      sx={{
        color: "#ffffff",
        "& .MuiInputBase-input": { color: "#013220" },
      }}
    >
      {tripTypes.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setEditOpen(false)}
      sx={{ color: "#006400", fontWeight: "bold" }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleEditSubmit}
      sx={{ color: "#006400", fontWeight: "bold" }}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Trips;

















 