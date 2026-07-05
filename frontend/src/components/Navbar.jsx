import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // localStorage auth check
  const token = localStorage.getItem('token');
  const firstName = localStorage.getItem('firstName');

  // Logout (Function)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    navigate('/login'); 
  };

  return (
    <nav className="flex justify-between items-center py-5 px-8 bg-white border-b border-[#EDE8DF] sticky top-0 z-10">
      {/* Brand Logo */}
      <div className="text-2xl font-bold font-serif tracking-tighter">
        <Link to="/">Job<span className="text-[#4A7C59]">Mart</span></Link>
      </div>
      
      {/* Navigation Links & Buttons */}
      <div className="flex items-center gap-6">
        <Link to="/browse" className="text-sm text-[#6B7A8D] font-medium hover:text-[#1A2B4A]">Browse Jobs</Link>
        <Link to="/salary" className="text-sm text-[#6B7A8D] font-medium hover:text-[#1A2B4A]">Salary Insights</Link>
        <Link to="/employers" className="text-sm text-[#6B7A8D] font-medium hover:text-[#1A2B4A]">For Employers</Link>
        
        {token ? (
          //  (User is Authenticated)
          <>
            <Link 
              to="/dashboard" 
              className="text-sm text-[#1A2B4A] font-semibold border-b-2 border-transparent hover:border-[#4A7C59] transition py-1"
            >
              Hi, {firstName || 'Candidate'}
            </Link>
            <button 
              onClick={handleLogout}
              className="border-2 border-[#dc3545] text-[#dc3545] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#dc3545] hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          //  (Guest Mode)
          <>
            <Link 
              to="/login" 
              className="border-2 border-[#1A2B4A] text-[#1A2B4A] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1A2B4A] hover:text-white transition text-center inline-block"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-[#1A2B4A] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#14213A] transition text-center inline-block"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;