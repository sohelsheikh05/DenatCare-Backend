"use client";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Patients from "./components/Patients/Patients.jsx";
import Appointments from "./components/Appointments/Appointments.jsx";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { useEffect } from "react";

import Landing from "./Landing/Landing.jsx"
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/home" /> : children;
}

function PatientRoute({ children }) {
  const userType = localStorage.getItem("userType")
  const patientToken = localStorage.getItem("patientToken")

  if (userType === "patient" && patientToken) {
    return children
  }

  return <Navigate to="/login" />
}

function App() {
  const { Navigate } = useNavigate();
  

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
           <Route
            path="/"
            element={
              
                <Landing />
              
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
       
         
          </Routes>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
