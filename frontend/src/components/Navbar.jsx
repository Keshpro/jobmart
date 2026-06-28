import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-5 px-8 bg-white border-b border-[#EDE8DF] sticky top-0 z-10">
      <div className="text-2xl font-bold font-serif tracking-tighter">
        <Link to="/">Job<span className="text-[#4A7C59]">Mart</span></Link>
      </div>
      
      <div className="flex items-center gap-6">
        <Link to="/browse" className="text-sm text-[#6B7A8D] font-medium hover:text-[#1A2B4A]">Browse Jobs</Link>
        <Link to="/salary" className="text-sm text-[#6B7A8D] font-medium hover:text-[#1A2B4A]">Salary Insights</Link>
        <Link to="/employers" className="text-sm text-[#6B7A8D] font-medium hover:text-[#1A2B4A]">For Employers</Link>
        
        <button className="border-2 border-[#1A2B4A] text-[#1A2B4A] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1A2B4A] hover:text-white transition">
          Login
        </button>
        <button className="bg-[#1A2B4A] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#14213A] transition">
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;