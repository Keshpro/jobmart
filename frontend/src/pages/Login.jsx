import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect to your Backend Auth endpoint
      const response = await axios.post('http://localhost:5183/api/Auth/login', {
        email,
        password
      });

      // Save credentials to local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);

      // Redirect based on role
      if (response.data.role === 'Candidate') navigate('/candidate');
      else if (response.data.role === 'Recruiter' || response.data.role === 'HiringManager') navigate('/recruiter');
      else if (response.data.role === 'Admin') navigate('/admin');
      
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border-t-4 border-brand-green">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">Welcome Back</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-brand-green focus:border-brand-green outline-none"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required 
                className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-brand-green focus:border-brand-green outline-none"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-brand-dark transition-colors mt-4">
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="text-brand-green font-bold hover:underline">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;