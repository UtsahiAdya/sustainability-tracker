import React from "react";
import "./login.css";

const Login = () => {
  const loginWithGoogle = () => {
    window.open("http://localhost:6005/auth/google", "_self");
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Sign In With Google</button>
    </div>
  );
};

export default Login;
