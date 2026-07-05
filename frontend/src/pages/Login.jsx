import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 1. JWT Decode  Import 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5183/api/Auth/login', formData);

      if (response.data.token) {
        const token = response.data.token;

        // Backend එකෙන් කෙලින්ම එවන Role එක ගන්නවා (හෝ Decode කරලා ගන්නවා)
        const userRole = response.data.role;

        localStorage.setItem('token', token);
        localStorage.setItem('firstName', response.data.firstName || '');
        localStorage.setItem('lastName', response.data.lastName || '');
        localStorage.setItem('role', userRole);

        alert(`Welcome back! Logged in as ${userRole}`);

        // Role එක අනුව නිවැරදි Dashboard එකට යොමු කිරීම
        switch (userRole) {
          case 'Admin':
            navigate('/admin-dashboard');
            break;
          case 'Recruiter':
            navigate('/recruiter-dashboard');
            break;
          case 'Hiring Manager':
          case 'HiringManager':
            navigate('/manager-dashboard');
            break;
          case 'Candidate':
            navigate('/dashboard');
            break;
          default:
            alert("Unauthorized Role Type!");
            navigate('/login');
            break;
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-blue-100 w-full max-w-sm">
        <h2 className="text-3xl font-serif font-bold text-[#1A2B4A] mb-2">Welcome Back</h2>
        <p className="text-[#6B7A8D] mb-8">Login to your JobMart account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A2B4A] mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-blue-100 focus:border-[#4A7C59] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A2B4A] mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-blue-100 focus:border-[#4A7C59] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A2B4A] text-white py-3 rounded-xl font-semibold hover:bg-[#14213A] transition mt-4"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B7A8D] mt-6">
          Don't have an account? <Link to="/register" className="text-[#4A7C59] font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;