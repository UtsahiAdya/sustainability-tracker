import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Trips from "./components/Trips";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Points from "./components/Points";
import Ranking from "./components/Ranking";
import AuthSuccess from "./components/AuthSuccess"; // Add this import


import axios from "axios";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiUrl}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>; // Prevents flicker

  return (
    <Router>
      {/*Show Navbar ONLY if user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/*Redirect `/` to `/home` */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Protected Routes - Redirect to Login if not authenticated */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/trips" element={user ? <Trips /> : <Navigate to="/login" />} />
        <Route path="/points" element={user ? <Points /> : <Navigate to="/login" />} />
        <Route path="/ranking" element={user ? <Ranking /> : <Navigate to="/login" />} />
        <Route path="/auth/success" element={<AuthSuccess />} />




        {/*Auth Route */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
      </Routes>
    </Router>
     
  );
}

export default App;
















































































































// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./components/Home";
// import Trips from "./components/Trips";
// import Profile from "./components/Profile";
// import Login from "./components/Login";
// import Navbar from "./components/Navbar"; // Import Navbar
// import axios from "axios";
// import { useEffect, useState } from "react";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://localhost:6005/auth/user", { withCredentials: true })
//       .then((res) => setUser(res.data))
//       .catch(() => setUser(null));
//   }, []);

//   return (
//     <Router>
//       <Navbar /> {/* Add Navbar here */}
//       <Routes>
//         <Route path="/home" element={user? <Home />:<Login/>} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={user ? <Profile /> : <Login />} />
//         <Route path="/trips" element={user ? <Trips /> : <Login />} />


//       </Routes>
//     </Router>
//   );
// }

// export default App;
