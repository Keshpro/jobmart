import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Candidate Dashboard
import RecruiterDashboard from './pages/RecruiterDashboard'; // recruiter dashboard
import AdminDashboard from './pages/AdminDashboard'; // admin dashboard

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Login />} /> 
      </Routes>
    </Router>
  );
}

export default App;