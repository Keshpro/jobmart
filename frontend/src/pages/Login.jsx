import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      // calling Backend login endpoint 
      const response = await axios.post('http://localhost:5183/api/Auth/login', formData);
      
      
      localStorage.setItem('token', response.data.token);
      
      alert("Login Successful!");
      navigate('/dashboard'); // Logined user will be redirected to dashboard page
    } catch (error) {
      alert("Invalid email or password!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-blue-100 w-full max-w-sm">
        <h2 className="text-3xl font-serif font-bold text-[#1A2B4A] mb-2">Welcome Back</h2>
        <p className="text-[#6B7A8D] mb-8">Login to your candidate account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A2B4A] mb-1">Email</label>
            <input name="email" type="email" onChange={handleChange} required className="w-full p-3 rounded-xl border border-blue-100 focus:border-[#4A7C59] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A2B4A] mb-1">Password</label>
            <input name="password" type="password" onChange={handleChange} required className="w-full p-3 rounded-xl border border-blue-100 focus:border-[#4A7C59] outline-none transition" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1A2B4A] text-white py-3 rounded-xl font-semibold hover:bg-[#14213A] transition mt-4">
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