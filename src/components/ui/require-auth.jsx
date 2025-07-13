import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { urlState } from "@/context";

function RequireAuth({ children }) {
  const navigate = useNavigate();

  const { isAuthenticated, loading } = urlState();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <BarLoader color="white" width={"100%"} />;
  }
  if (!isAuthenticated) {
    return children;
  }

  return children;
}

export default RequireAuth;
