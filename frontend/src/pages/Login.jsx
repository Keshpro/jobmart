import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justify: 'center',
    background: 'linear-gradient(135deg, #1F3B2C 0%, #2E5A3F 45%, #4A7C59 100%)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  glowTop: {
    position: 'absolute',
    top: '-100px',
    left: '-100px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-80px',
    right: '-80px',
    width: '320px',
    height: '320px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(15,42,25,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  title: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: '28px',
    fontWeight: '400',
    color: '#FFFFFF',
    margin: '0 0 4px',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '13.5px',
    color: 'rgba(255,255,255,0.7)',
    margin: '0 0 1.6rem',
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1.6rem',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '20px',
    padding: '3px 10px 3px 8px',
    fontSize: '11px',
    color: '#FFFFFF',
  },
  fieldGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: '6px',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '15px',
    color: 'rgba(255,255,255,0.5)',
    pointerEvents: 'none',
    lineHeight: 1,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    padding: '10px 12px 10px 36px',
    fontSize: '14px',
    color: '#FFFFFF',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
  },
  passwordToggle: {
    position: 'absolute',
    right: '11px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: 'rgba(255,255,255,0.5)',
    padding: '0',
    lineHeight: 1,
  },
  forgotRow: {
    textAlign: 'right',
    marginBottom: '1.4rem',
  },
  forgotLink: {
    fontSize: '12.5px',
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    textDecoration: 'none',
  },
  btn: {
    width: '100%',
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '11px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F3B2C',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 18px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justify: 'center',
    gap: '7px',
    transition: 'opacity 0.18s, transform 0.12s',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '1.4rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    fontSize: '11.5px',
    color: 'rgba(255,255,255,0.5)',
  },
  signupRow: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
  },
  signupLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecoration: 'underline',
  },
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
        const userRole = response.data.role;

        // 💡 CRITICAL SYNC FIX: Dashboard එකට අවශ්‍ය 'email' පැරාමීටර් එක මෙතනින් ගබඩා කරයි
        localStorage.setItem('token', token);
        localStorage.setItem('email', response.data.email || formData.email); 
        localStorage.setItem('firstName', response.data.firstName || '');
        localStorage.setItem('lastName', response.data.lastName || '');
        localStorage.setItem('role', userRole);

        alert(`Welcome back! Logged in as ${userRole}`);

        // Role-Based Navigation Routing Table
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
            alert("Unauthorized Role Type Framework!");
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

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
    background: focusedField === field ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(255,255,255,0.12)' : 'none',
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />

      <div style={styles.page}>
        <div style={styles.glowTop} />
        <div style={styles.glowBottom} />

        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Log in to your JobMart account.</p>

          <div style={styles.badgeRow}>
            <span style={styles.badge}>
              <i className="ti ti-shield-check" style={{ color: '#FFFFFF', fontSize: '12px' }} />
              Secure
            </span>
            <span style={styles.badge}>
              <i className="ti ti-bolt" style={{ color: '#FFFFFF', fontSize: '12px' }} />
              Fast sign in
            </span>
            <span style={styles.badge}>
              <i className="ti ti-briefcase" style={{ color: '#FFFFFF', fontSize: '12px' }} />
              10K+ jobs
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrap}>
                <i className="ti ti-mail" style={styles.inputIcon} />
                <input
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('email')}
                  required
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <i className="ti ti-lock" style={styles.inputIcon} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('password'), paddingRight: '36px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <i className={showPassword ? 'ti ti-eye-off' : 'ti ti-eye'} />
                </button>
              </div>
            </div>

            <div style={styles.forgotRow}>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                ...(loading ? styles.btnDisabled : {}),
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite', fontSize: '16px' }} />
                  Signing in…
                </>
              ) : (
                <>
                  <i className="ti ti-login-2" style={{ fontSize: '16px' }} />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>new to JobMart?</span>
            <div style={styles.dividerLine} />
          </div>

          <p style={styles.signupRow}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.signupLink}>Sign up</Link>
          </p>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          input::placeholder { color: rgba(255,255,255,0.4); }
        `}</style>
      </div>
    </>
  );
};

export default Login;