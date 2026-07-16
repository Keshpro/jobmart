import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const GREEN = '#4A7C59';
const GOLD = '#C9A227';
const INK = '#0F172A';
const MIST = '#64748B';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5183/api/Auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);

      if (response.data.role === 'Admin') navigate('/admin');
      else if (response.data.role === 'Recruiter') navigate('/recruiter');
      else navigate('/candidate');
    } catch (err) {
      setError('Email or password is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAF9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .jm-display { font-family: 'Fraunces', serif; }
        @keyframes jm-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes jm-shake { 10%,90% { transform: translateX(-1px); } 20%,80% { transform: translateX(2px); } 30%,50%,70% { transform: translateX(-3px); } 40%,60% { transform: translateX(3px); } }
        .jm-error { animation: jm-shake 0.4s ease; }
        .jm-input:focus { outline: none; border-color: ${GREEN} !important; box-shadow: 0 0 0 3px rgba(74,124,89,0.12); }
      `}</style>

      <Navbar />

      <div className="flex justify-center items-center px-6" style={{ minHeight: '88vh' }}>
        <div
          className="grid md:grid-cols-2 w-full overflow-hidden"
          style={{ maxWidth: 920, borderRadius: 24, boxShadow: '0 30px 70px -30px rgba(15,23,42,0.3)' }}
        >
          {/* Brand panel */}
          <div
            className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${GREEN} 0%, #2F5B3F 100%)` }}
          >
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '18px 18px' }}
            />
            <div className="relative">
              <span className="jm-display" style={{ fontSize: 22, fontWeight: 600, color: '#fff' }}>
                Job<span style={{ color: GOLD }}>Mart</span>
              </span>
            </div>

            <div className="relative">
              <h2 className="jm-display" style={{ fontSize: 28, fontWeight: 600, color: '#fff', lineHeight: 1.25, marginBottom: 14 }}>
                Welcome back to your matches.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>
                Sign in to see the roles the AI has scored for you since your last visit.
              </p>
            </div>

            <div className="relative flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              <ShieldCheck size={15} color={GOLD} />
              Your data is encrypted end-to-end
            </div>
          </div>

          {/* Form panel */}
          <div className="p-8 md:p-10 flex flex-col justify-center" style={{ background: '#fff' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} color={GREEN} />
              <span style={{ fontSize: 12, fontWeight: 600, color: GREEN, letterSpacing: '0.02em' }}>Candidate & Recruiter Sign In</span>
            </div>
            <h1 className="jm-display" style={{ fontSize: 30, fontWeight: 600, color: INK, marginBottom: 8 }}>
              Sign in
            </h1>
            <p style={{ color: MIST, fontSize: 14, marginBottom: 28 }}>
              New to JobMart? <Link to="/register" style={{ color: GREEN, fontWeight: 600 }}>Create an account</Link>
            </p>

            {error && (
              <div
                className="jm-error"
                style={{
                  background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)',
                  color: '#B91C1C', fontSize: 13, borderRadius: 12, padding: '10px 14px', marginBottom: 18,
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: INK, display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="jm-input w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ border: '1px solid #E2E8F0', background: '#F8FAF9' }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label style={{ fontSize: 13, fontWeight: 600, color: INK }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: 12, color: MIST }}>Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="jm-input w-full px-4 py-3 pr-11 rounded-xl text-sm transition-all"
                    style={{ border: '1px solid #E2E8F0', background: '#F8FAF9' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 -translate-y-1/2 right-3.5"
                    style={{ color: MIST }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white mt-2 transition-all"
                style={{ background: loading ? '#8CA898' : GREEN }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: 15, height: 15, borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
                        animation: 'jm-spin 0.7s linear infinite',
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`@keyframes jm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
