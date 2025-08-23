// frontend/src/App.jsx
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PublicStorePage from "./pages/PublicStorePage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import useAuthStore from "./store/auth";

function App() {
  const { getCurrentUser, isAuthenticated } = useAuthStore();

  // Call hooks before any conditional logic
  const bgColor = useColorModeValue("gray.100", "gray.900");

  useEffect(() => {
    // Check if user is already logged in on app start
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <Box minH={"100vh"} bg={bgColor}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/store/:username" element={<PublicStorePage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <PrivateRoute>
              <CreatePage />
            </PrivateRoute>
          } 
        />

        {/* Default Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />
          } 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
          } 
        />
      </Routes>
    </Box>
  );
}

export default App;