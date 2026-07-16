import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  User, Mail, Lock, Eye, EyeOff, ShieldCheck, Zap,
  BriefcaseBusiness, CheckCircle2, ArrowRight, Sparkles,
} from 'lucide-react';

const GREEN = '#4A7C59';
const GOLD = '#C9A227';
const INK = '#0F172A';
const MIST = '#64748B';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: '', color: '#E2E8F0' },
    { label: 'Weak', color: '#DC6B6B' },
    { label: 'Fair', color: GOLD },
    { label: 'Good', color: GREEN },
    { label: 'Strong', color: GREEN },
  ];
  return { score, ...map[score] };
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5183/api/Auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setShowPopup(true);
    } catch (err) {
      setError('Registration failed. Please check your details and try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (showPopup && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (showPopup && countdown === 0) {
      navigate('/login');
    }
    return () => clearInterval(timer);
  }, [showPopup, countdown, navigate]);

  const isValid = formData.firstName && formData.lastName && formData.email && formData.password.length >= 6 && agreed;

  const fieldStyle = (field) => ({
    border: `1px solid ${focusedField === field ? GREEN : '#E2E8F0'}`,
    background: '#F8FAF9',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(74,124,89,0.12)' : 'none',
  });

  return (
    <div className="min-h-screen" style={{ background: '#F8FAF9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .jm-display { font-family: 'Fraunces', serif; }
        @keyframes jm-spin { to { transform: rotate(360deg); } }
        @keyframes jm-pop-in { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes jm-shake { 10%,90% { transform: translateX(-1px); } 20%,80% { transform: translateX(2px); } 30%,50%,70% { transform: translateX(-3px); } 40%,60% { transform: translateX(3px); } }
        .jm-error { animation: jm-shake 0.4s ease; }
        .jm-input:focus { outline: none; }
      `}</style>

      <Navbar />

      {/* Success overlay */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center px-6"
          style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 1000 }}
        >
          <div
            className="text-center"
            style={{
              background: '#fff', borderRadius: 24, padding: '3rem 2rem', maxWidth: 400, width: '100%',
              boxShadow: '0 30px 70px -20px rgba(0,0,0,0.4)', animation: 'jm-pop-in 0.35s ease-out forwards',
            }}
          >
            <div
              className="mx-auto flex items-center justify-center mb-5"
              style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,124,89,0.1)' }}
            >
              <CheckCircle2 size={30} color={GREEN} />
            </div>
            <h2 className="jm-display" style={{ fontSize: 24, fontWeight: 600, color: INK, marginBottom: 10 }}>
              Registration successful
            </h2>
            <p style={{ color: MIST, fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>
              Welcome to JobMart, {formData.firstName}. Your account has been created — you'll be redirected to sign in shortly.
            </p>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 34, fontWeight: 700, color: GREEN, margin: '4px 0 22px' }}>
              {countdown}
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl font-bold text-sm"
              style={{ background: GREEN, color: '#fff' }}
            >
              Sign in now
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center px-6 py-12" style={{ minHeight: '88vh' }}>
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
                Join 50,000+ professionals finding their next role.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24 }}>
                One profile, scored against every open role — no repeat applications.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: ShieldCheck, label: 'Secure' },
                  { icon: Zap, label: 'Free to join' },
                  { icon: BriefcaseBusiness, label: '10K+ jobs' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5"
                    style={{
                      fontSize: 11, color: '#fff', background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '4px 11px 4px 9px',
                    }}
                  >
                    <Icon size={12} color={GOLD} /> {label}
                  </span>
                ))}
              </div>
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
              <span style={{ fontSize: 12, fontWeight: 600, color: GREEN, letterSpacing: '0.02em' }}>Candidate Sign Up</span>
            </div>
            <h1 className="jm-display" style={{ fontSize: 30, fontWeight: 600, color: INK, marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ color: MIST, fontSize: 14, marginBottom: 24 }}>
              Already a member? <Link to="/login" style={{ color: GREEN, fontWeight: 600 }}>Sign in</Link>
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label style={{ fontSize: 13, fontWeight: 600, color: INK, display: 'block', marginBottom: 6 }}>First name</label>
                  <div className="relative flex items-center">
                    <User size={16} color={MIST} className="absolute left-3.5 pointer-events-none" />
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="jm-input w-full pl-10 pr-3 py-3 rounded-xl text-sm transition-all"
                      style={fieldStyle('firstName')}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label style={{ fontSize: 13, fontWeight: 600, color: INK, display: 'block', marginBottom: 6 }}>Last name</label>
                  <div className="relative flex items-center">
                    <User size={16} color={MIST} className="absolute left-3.5 pointer-events-none" />
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="jm-input w-full pl-10 pr-3 py-3 rounded-xl text-sm transition-all"
                      style={fieldStyle('lastName')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: INK, display: 'block', marginBottom: 6 }}>Email address</label>
                <div className="relative flex items-center">
                  <Mail size={16} color={MIST} className="absolute left-3.5 pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="jm-input w-full pl-10 pr-3 py-3 rounded-xl text-sm transition-all"
                    style={fieldStyle('email')}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: INK, display: 'block', marginBottom: 6 }}>Password</label>
                <div className="relative flex items-center">
                  <Lock size={16} color={MIST} className="absolute left-3.5 pointer-events-none" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="jm-input w-full pl-10 pr-11 py-3 rounded-xl text-sm transition-all"
                    style={fieldStyle('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5"
                    style={{ color: MIST }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {formData.password && (
                  <>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= strength.score ? strength.color : '#E2E8F0',
                            transition: 'background 0.3s',
                          }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p style={{ fontSize: 11, marginTop: 4, color: strength.color }}>{strength.label} password</p>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5"
                  style={{ width: 15, height: 15, accentColor: GREEN, flexShrink: 0 }}
                />
                <label htmlFor="terms" style={{ fontSize: 12, color: MIST, lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: INK, fontWeight: 600 }}>Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" style={{ color: INK, fontWeight: 600 }}>Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white mt-1 transition-all"
                style={{ background: !isValid || loading ? '#8CA898' : GREEN, cursor: !isValid || loading ? 'not-allowed' : 'pointer' }}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Register as candidate <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
