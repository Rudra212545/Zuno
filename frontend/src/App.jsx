import React from 'react';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Homepage from './pages/Homepage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* <Navbar/> */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/home" element={
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
      } />

    </Routes>
  </Router>
  );
}

export default App;
