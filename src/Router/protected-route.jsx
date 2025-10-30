import React from "react";
import { useAuth } from "../contexts/auth-context";
import { Navigate } from "react-router-dom";
import { AppRoutes } from "./routes-metadata";

function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to={AppRoutes.Auth} replace />;
  }

  return children;
}

export default ProtectedRoute;
