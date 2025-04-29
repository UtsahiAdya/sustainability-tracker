// require('dotenv').config();
import React from "react";
import "./login.css";
const apiUrl = import.meta.env.VITE_API_URL|| "API URL not found";
import loginBg from '../assets/img/login.png';

console.log("API URL:", apiUrl);


const Login = () => {
  const loginWithGoogle = () => {
    // window.open(`${apiUrl}`, "_self");
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="login-page">
          <div className="login-card">
      <h1 className="login-text">Login</h1>
      <button onClick={loginWithGoogle} className="login-btn">Sign In With Google</button>
    </div>
    </div>
  );
};

export default Login;
