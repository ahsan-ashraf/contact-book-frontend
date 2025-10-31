import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthForm from "../components/auth-form";
import ProtectedRoute from "./protected-route";
import ContactBook from "../contactBook";
import { AppRoutes } from "./routes-metadata";

function AppRouter() {
  return (
    <Routes>
      <Route path={AppRoutes.Auth} element={<AuthForm />} />
      <Route
        path={AppRoutes.ContactBook}
        element={
          <ProtectedRoute>
            <ContactBook />
          </ProtectedRoute>
        }
      />
      <Route
        path={AppRoutes.InValid}
        element={<Navigate to={AppRoutes.Auth} replace />}
      />
    </Routes>
  );
}

export default AppRouter;
