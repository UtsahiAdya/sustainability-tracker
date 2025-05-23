// src/components/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay to ensure cookie is stored
    const timer = setTimeout(() => {
      navigate("/home");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <div>Logging you in...</div>;
}

export default AuthSuccess;
