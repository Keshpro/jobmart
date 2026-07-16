import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5183/api/Auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);

      if (response.data.role === 'Admin') navigate('/admin');
      else if (response.data.role === 'Recruiter') navigate('/recruiter');
      else navigate('/candidate');
    } catch (err) { alert('Invalid Login'); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex justify-center items-center h-[80vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input type="email" placeholder="Email" className="w-full border p-2 mb-4" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full border p-2 mb-4" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;