import React from "react";
import "./login.css";

const Login = () => {
  const loginWithGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
     console.log("API URL:", apiUrl);
    window.open(`${apiUrl}/auth/google`, "_self");
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Sign In With Google</button>
    </div>
  );
};

export default Login;
