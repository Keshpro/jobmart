import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0f2647 70%, #0a1628 100%)',
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
    background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-80px',
    right: '-80px',
    width: '320px',
    height: '320px',
    background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(147, 197, 253, 0.2)',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  logoDot: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'rgba(147, 197, 253, 0.85)',
    letterSpacing: '0.02em',
  },
  title: {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: '28px',
    fontWeight: '400',
    color: '#e8f4ff',
    margin: '0 0 4px',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '13.5px',
    color: 'rgba(147, 197, 253, 0.65)',
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
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(96,165,250,0.18)',
    borderRadius: '20px',
    padding: '3px 10px 3px 8px',
    fontSize: '11px',
    color: 'rgba(147, 197, 253, 0.75)',
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
    color: 'rgba(147, 197, 253, 0.6)',
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
    color: 'rgba(96, 165, 250, 0.5)',
    pointerEvents: 'none',
    lineHeight: 1,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(147, 197, 253, 0.18)',
    borderRadius: '10px',
    padding: '10px 12px 10px 36px',
    fontSize: '14px',
    color: '#e8f4ff',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s, background 0.2s',
  },
  passwordToggle: {
    position: 'absolute',
    right: '11px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: 'rgba(96, 165, 250, 0.45)',
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
    background: active ? color : 'rgba(147,197,253,0.12)',
    transition: 'background 0.3s',
  }),
  strengthLabel: {
    fontSize: '11px',
    marginTop: '4px',
    color: 'rgba(147,197,253,0.5)',
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
    accentColor: '#2563eb',
    cursor: 'pointer',
    flexShrink: 0,
  },
  termsText: {
    fontSize: '12px',
    color: 'rgba(147, 197, 253, 0.55)',
    lineHeight: '1.5',
  },
  termsLink: {
    color: '#60a5fa',
    textDecoration: 'none',
  },
  btn: {
    width: '100%',
    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
    border: 'none',
    borderRadius: '11px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 18px rgba(37,99,235,0.45)',
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
    background: 'rgba(147, 197, 253, 0.1)',
  },
  dividerText: {
    fontSize: '11.5px',
    color: 'rgba(147, 197, 253, 0.35)',
  },
  signinRow: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(147, 197, 253, 0.5)',
  },
  signinLink: {
    color: '#60a5fa',
    fontWeight: '600',
    textDecoration: 'none',
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
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...map[score] };
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

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

      alert("Registration successful! Redirecting to login...");
      navigate('/login'); // Redirect to login page after successful registration

    } catch (error) {
      alert("Registration failed. Please check your data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field
      ? 'rgba(96,165,250,0.55)'
      : 'rgba(147,197,253,0.18)',
    background: focusedField === field
      ? 'rgba(59,130,246,0.06)'
      : 'rgba(255,255,255,0.04)',
  });

  const isValid = formData.name && formData.email && formData.password.length >= 6 && agreed;

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

          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join 50,000+ professionals finding their dream job.</p>

          {/* Trust badges */}
          <div style={styles.badgeRow}>
            <span style={styles.badge}>
              <i className="ti ti-shield-check" style={{ color: '#60a5fa', fontSize: '12px' }} />
              Secure
            </span>
            <span style={styles.badge}>
              <i className="ti ti-bolt" style={{ color: '#60a5fa', fontSize: '12px' }} />
              Free to join
            </span>
            <span style={styles.badge}>
              <i className="ti ti-briefcase" style={{ color: '#60a5fa', fontSize: '12px' }} />
              10K+ jobs
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>First Name</label>
              <div style={styles.inputWrap}>
                <i className="ti ti-user" style={styles.inputIcon} />
                <input
                  name="firstName"
                  type="text"
                  placeholder="Jane "
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('firstName')}
                  required
                />
              </div>
            </div>

            {/* last Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Last Name</label>
              <div style={styles.inputWrap}>
                <i className="ti ti-user" style={styles.inputIcon} />
                <input
                  name="lastName"
                  type="text"
                  placeholder=" Smith"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('lastName')}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
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

            {/* Password */}
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

              {/* Strength bar */}
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
                  <p style={{ ...styles.strengthLabel, color: strength.color || 'rgba(147,197,253,0.5)' }}>
                    {strength.label && `${strength.label} password`}
                  </p>
                </>
              )}
            </div>

            {/* Terms */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              style={{
                ...styles.btn,
                ...(!isValid || loading ? styles.btnDisabled : {}),
              }}
              onMouseEnter={(e) => { if (isValid && !loading) e.currentTarget.style.opacity = '0.88'; }}
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
                  Register as Candidate
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
          input::placeholder { color: rgba(147,197,253,0.28); }
        `}</style>
      </div>
    </>
  );
};

export default Register;