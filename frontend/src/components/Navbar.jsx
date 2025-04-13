import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:6005/auth/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:6005/auth/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.href = "/login"; // Redirect to login explicitly
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Travel towards Sustainability</h2>
      <ul className="nav-links">
        
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/trips">Trips</Link>
        </li>
        <li>
          <Link to="/profile">MyCommute</Link>
        </li>
        <li>
          <a href="#leaderboard">Leaderboard</a>
        </li>
        {user ? (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;











































































































 