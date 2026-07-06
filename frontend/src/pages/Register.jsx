import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  strengthBar: {
    display: 'flex',
    gap: '4px',
    marginTop: '6px',
  },
  strengthSegment: (active, color) => ({
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    background: active ? color : 'rgba(255,255,255,0.2)',
    transition: 'background 0.3s',
  }),
  strengthLabel: {
    fontSize: '11px',
    marginTop: '4px',
    color: 'rgba(255,255,255,0.65)',
  },
  terms: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    margin: '1rem 0',
  },
  checkbox: {
    marginTop: '2px',
    width: '15px',
    height: '15px',
    accentColor: '#FFFFFF',
    cursor: 'pointer',
    flexShrink: 0,
  },
  termsText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: '1.5',
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '500',
    textDecoration: 'underline',
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
    justifyContent: 'center',
    gap: '7px',
    transition: 'opacity 0.18s, transform 0.12s',
    marginTop: '0.25rem',
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
  signinRow: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
  },
  signinLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecoration: 'underline',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(15, 42, 25, 0.55)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popupBox: {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '20px',
    padding: '3rem 2rem',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
    animation: 'popupFadeIn 0.4s ease-out forwards',
  },
  popupIcon: {
    fontSize: '48px',
    color: '#FFFFFF',
    marginBottom: '1rem',
  },
  popupTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '24px',
    color: '#FFFFFF',
    marginBottom: '10px',
  },
  popupText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  popupCountdown: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    margin: '20px 0',
  },
};

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Weak', color: '#F09595' },
    { label: 'Fair', color: '#FAC775' },
    { label: 'Good', color: '#FFFFFF' },
    { label: 'Strong', color: '#FFFFFF' },
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

  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5183/api/Auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      setShowPopup(true);
    } catch (error) {
      alert("Registration failed. Please check your data.");
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (showPopup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showPopup && countdown === 0) {
      navigate('/login');
    }
    return () => clearInterval(timer);
  }, [showPopup, countdown, navigate]);

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
    background: focusedField === field ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(255,255,255,0.12)' : 'none',
  });

  const isValid = formData.firstName && formData.lastName && formData.email && formData.password.length >= 6 && agreed;

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

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <i className="ti ti-circle-check-filled" style={styles.popupIcon}></i>
            <h2 style={styles.popupTitle}>Registration successful</h2>
            <p style={styles.popupText}>
              Welcome to JobMart, {formData.firstName}. Your account has been created. You'll be redirected to the login page shortly.
            </p>
            <div style={styles.popupCountdown}>{countdown}</div>
            <button
              onClick={() => navigate('/login')}
              style={{ ...styles.btn, marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.6)', color: '#FFFFFF', boxShadow: 'none' }}
            >
              Login now
            </button>
          </div>
        </div>
      )}

      <div style={styles.page}>
        <div style={styles.glowTop} />
        <div style={styles.glowBottom} />

        <div style={styles.card}>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Join 50,000+ professionals finding their dream job.</p>

          <div style={styles.badgeRow}>
            <span style={styles.badge}>
              <i className="ti ti-shield-check" style={{ color: '#FFFFFF', fontSize: '12px' }} />
              Secure
            </span>
            <span style={styles.badge}>
              <i className="ti ti-bolt" style={{ color: '#FFFFFF', fontSize: '12px' }} />
              Free to join
            </span>
            <span style={styles.badge}>
              <i className="ti ti-briefcase" style={{ color: '#FFFFFF', fontSize: '12px' }} />
              10K+ jobs
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>First name</label>
                <div style={styles.inputWrap}>
                  <i className="ti ti-user" style={styles.inputIcon} />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('firstName')}
                    required
                  />
                </div>
              </div>

              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Last name</label>
                <div style={styles.inputWrap}>
                  <i className="ti ti-user" style={styles.inputIcon} />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('lastName')}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
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
                  placeholder="Min. 6 characters"
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

              {formData.password && (
                <>
                  <div style={styles.strengthBar}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={styles.strengthSegment(i <= strength.score, strength.color)}
                      />
                    ))}
                  </div>
                  <p style={{ ...styles.strengthLabel, color: strength.color || 'rgba(255,255,255,0.65)' }}>
                    {strength.label && `${strength.label} password`}
                  </p>
                </>
              )}
            </div>

            <div style={styles.terms}>
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="terms" style={styles.termsText}>
                I agree to the{' '}
                <a href="#" style={styles.termsLink}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={styles.termsLink}>Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              style={{
                ...styles.btn,
                ...(!isValid || loading ? styles.btnDisabled : {}),
              }}
              onMouseEnter={(e) => { if (isValid && !loading) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite', fontSize: '16px' }} />
                  Creating account…
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus" style={{ fontSize: '16px' }} />
                  Register as candidate
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>already a member?</span>
            <div style={styles.dividerLine} />
          </div>

          <p style={styles.signinRow}>
            <Link to="/login" style={styles.signinLink}>Sign in to your account</Link>
          </p>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes popupFadeIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          input::placeholder { color: rgba(255,255,255,0.4); }
        `}</style>
      </div>
    </>
  );
};

export default Register;