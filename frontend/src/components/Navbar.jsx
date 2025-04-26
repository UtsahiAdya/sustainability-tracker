// require('dotenv').config();
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import CyclingLogo from '../assets/img/logo.png';

const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
   
    axios
      .get(`${apiUrl}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios
      .get( `${apiUrl}/auth/logout`, { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.href = "/login"; // Redirect to login explicitly
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <nav className="navbar">
       {/* <img src={logo} alt="Logo" className="logo-img" /> */}
       <div className="logo-section" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={CyclingLogo}
        alt="Cycling Logo"
        className="logo-img"
        style={{ width: "65px", height: "65px", margin:"0px", padding:"0px" }}
      />
      <h2 className="logo">Travel towards Sustainability</h2>
      </div>
      <ul className="nav-links">
  <li>
    <NavLink to="/home" className={({ isActive }) => (isActive ? "nav-active" : "")}>Home</NavLink>
  </li>
  <li>
    <NavLink to="/trips" className={({ isActive }) => (isActive ? "nav-active" : "")}>Trips</NavLink>
  </li>
  <li>
    <NavLink to="/ranking" className={({ isActive }) => (isActive ? "nav-active" : "")}>Ranking</NavLink>
  </li>
  <li>
    <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-active" : "")}>MyCommute</NavLink>
  </li>
  <li>
    <NavLink to="/points" className={({ isActive }) => (isActive ? "nav-active" : "")}>PointsAllocation</NavLink>
  </li>
  {user ? (
    <li>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </li>
  ) : (
    <li>
      <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-active" : "")}>Login</NavLink>
    </li>
  )}
</ul>

        
        
    </nav>
  );
};

export default Navbar;











































































































 