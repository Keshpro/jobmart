import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, LogOut, Menu, X } from 'lucide-react';

const GREEN = '#4A7C59';
const GOLD = '#C9A227';
const INK = '#0F172A';
const MIST = '#64748B';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    fontWeight: 500,
    fontSize: 15,
    color: isActive(path) ? GREEN : MIST,
    transition: 'color 0.15s ease',
  });

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg"
      style={{ background: 'rgba(255,255,255,0.75)', borderBottom: '1px solid #E2E8F0' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo — mark + editorial wordmark, not a generic icon-in-a-box */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
          <div
            className="flex items-center justify-center transition-transform group-hover:-rotate-6"
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${GREEN}, #2F5B3F)`,
            }}
          >
            <Briefcase className="h-4 w-4" color="#fff" strokeWidth={2.25} />
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: INK, letterSpacing: '-0.01em' }}>
            Job<span style={{ color: GREEN }}>Mart</span>
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" style={navLinkStyle('/')}>Home</Link>

          {token ? (
            <>
              <Link to={`/${role.toLowerCase()}`} style={navLinkStyle(`/${role?.toLowerCase()}`)}>Dashboard</Link>

              {/* Role is always visible — recognition over recall */}
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                  color: GOLD, background: 'rgba(201,162,39,0.12)',
                  border: '1px solid rgba(201,162,39,0.3)', borderRadius: 999,
                  padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                {role}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-all"
                style={{ background: INK }}
                onMouseEnter={(e) => (e.currentTarget.style.background = GREEN)}
                onMouseLeave={(e) => (e.currentTarget.style.background = INK)}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle('/login')}>Login</Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all"
                style={{ background: GREEN, boxShadow: '0 8px 20px -8px rgba(74,124,89,0.6)' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle — the icon was imported but unused before; wired it up */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ background: mobileOpen ? '#F1F5F9' : 'transparent' }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} color={INK} /> : <Menu size={22} color={INK} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-1"
          style={{ borderTop: '1px solid #E2E8F0', background: 'rgba(255,255,255,0.97)' }}
        >
          <Link to="/" className="py-3" style={navLinkStyle('/')} onClick={() => setMobileOpen(false)}>Home</Link>

          {token ? (
            <>
              <Link
                to={`/${role.toLowerCase()}`}
                className="py-3 flex items-center justify-between"
                style={navLinkStyle(`/${role?.toLowerCase()}`)}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                  color: GOLD, background: 'rgba(201,162,39,0.12)', borderRadius: 999,
                  padding: '3px 9px', textTransform: 'uppercase',
                }}>
                  {role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 mt-3 px-5 py-3 rounded-xl font-bold text-sm text-white justify-center"
                style={{ background: INK }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-3" style={navLinkStyle('/login')} onClick={() => setMobileOpen(false)}>Login</Link>
              <Link
                to="/register"
                className="mt-3 text-center px-6 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: GREEN }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
