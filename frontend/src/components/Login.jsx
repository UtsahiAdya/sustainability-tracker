// require('dotenv').config();
import React from "react";
import "./login.css";
const apiUrl = import.meta.env.VITE_API_URL|| "API URL not found";
console.log("API URL:", apiUrl);


const Login = () => {
  const loginWithGoogle = () => {
    // window.open(`${apiUrl}`, "_self");
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Sign In With Google</button>
    </div>
  );
};

export default Login;
