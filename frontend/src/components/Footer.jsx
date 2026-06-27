import React from 'react';

const Footer = () => {
  const links = {
    candidates: ['Browse Jobs', 'Salary Insights', 'Career Advice', 'Resume Tips'],
    employers: ['Post a Job', 'Pricing Plans', 'Talent Search', 'Employer Blog'],
    legal: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Contact Us'],
  };

  const socials = [
    { label: 'LinkedIn', icon: '🔗' },
    { label: 'Twitter', icon: '✦' },
    { label: 'Instagram', icon: '◈' },
  ];

  return (
    <footer style={styles.root}>
      {/* Top divider accent */}
      <div style={styles.accentBar} />

      <div style={styles.inner}>
        {/* Brand column */}
        <div style={styles.brandCol}>
          <div style={styles.logo}>
            Job<span style={{ color: '#4A7C59' }}>Mart</span>
          </div>
          <p style={styles.tagline}>
            Helping people find careers they love. Modern recruitment for the modern world.
          </p>
          {/* Socials */}
          <div style={styles.socials}>
            {socials.map(s => (
              <button key={s.label} style={styles.socialBtn} aria-label={s.label}>
                {s.icon}
              </button>
            ))}
          </div>
          {/* Newsletter */}
          <div style={styles.newsletter}>
            <p style={styles.newsletterLabel}>Get job alerts weekly</p>
            <div style={styles.newsletterRow}>
              <input
                style={styles.newsletterInput}
                type="email"
                placeholder="you@example.com"
              />
              <button style={styles.newsletterBtn}>→</button>
            </div>
          </div>
        </div>

        {/* Links columns */}
        <div style={styles.linkCol}>
          <h4 style={styles.colTitle}>For Candidates</h4>
          <ul style={styles.linkList}>
            {links.candidates.map(l => (
              <li key={l} style={styles.linkItem}>
                <a href="#" style={styles.link}>{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.linkCol}>
          <h4 style={styles.colTitle}>For Employers</h4>
          <ul style={styles.linkList}>
            {links.employers.map(l => (
              <li key={l} style={styles.linkItem}>
                <a href="#" style={styles.link}>{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.linkCol}>
          <h4 style={styles.colTitle}>Legal</h4>
          <ul style={styles.linkList}>
            {links.legal.map(l => (
              <li key={l} style={styles.linkItem}>
                <a href="#" style={styles.link}>{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomInner}>
          <span style={styles.copyright}>
            © 2026 JobMart. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  root: {
    background: '#111D2E',
    color: '#9AAEC6',
    fontFamily: "'Inter', sans-serif",
    marginTop: 'auto',
    position: 'relative',
  },
  accentBar: {
    height: 3,
    background: 'linear-gradient(90deg, #4A7C59 0%, #1A2B4A 50%, #4A7C59 100%)',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '3.5rem 2rem 2rem',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '3rem',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '0.85rem',
    lineHeight: 1.7,
    color: '#7A90A8',
    margin: 0,
    maxWidth: 260,
  },
  socials: {
    display: 'flex',
    gap: '0.5rem',
  },
  socialBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: '1px solid #2D3E5A',
    background: 'transparent',
    color: '#9AAEC6',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletter: {
    marginTop: '0.25rem',
  },
  newsletterLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#7A90A8',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 0.5rem',
  },
  newsletterRow: {
    display: 'flex',
    gap: 0,
  },
  newsletterInput: {
    background: '#1A2B4A',
    border: '1px solid #2D3E5A',
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    color: '#fff',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    flex: 1,
    minWidth: 0,
  },
  newsletterBtn: {
    background: '#4A7C59',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    padding: '0.5rem 0.85rem',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: 700,
  },
  linkCol: {},
  colTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: '0 0 1.25rem',
  },
  linkList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  linkItem: {},
  link: {
    fontSize: '0.875rem',
    color: '#7A90A8',
    textDecoration: 'none',
    transition: 'color 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  bottomBar: {
    borderTop: '1px solid #1E2E44',
    marginTop: '1rem',
    padding: '1.25rem 2rem',
  },
  bottomInner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  copyright: {
    fontSize: '0.78rem',
    color: '#4A5E78',
  },
  credit: {
    fontSize: '0.78rem',
    color: '#4A5E78',
  },
};

export default Footer;