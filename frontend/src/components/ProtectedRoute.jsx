import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // In a real app, this would come from a Context or Redux store
  // For now, we simulate pulling it from localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to a generic unauthorized page or home if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;