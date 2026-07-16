import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Placeholder for Register
const Register = () => <div className="p-10 text-2xl font-bold text-center">Register Page (Create similar to Login)</div>;
const Unauthorized = () => <div className="p-10 text-2xl font-bold text-red-600 text-center mt-20">403 - Unauthorized Access</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route path="/candidate/*" element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/recruiter/*" element={
            <ProtectedRoute allowedRoles={['Recruiter', 'HiringManager']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;