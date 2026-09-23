import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    if (document.documentElement.classList.contains('dark-theme')) {
      setIsDark(true);
    }
    
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
    }
    setIsDark(!isDark);
  };

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About', end: false },
    { to: '/table', label: 'Table', end: false },
    { to: '/tools', label: 'Tools', end: false },
    { to: '/ions', label: 'Ions', end: false },
    { to: '/quiz', label: 'Quiz', end: false, badge: true },
    { to: '/settings', label: 'Settings', end: false },
  ];

  const handleNavClick = (e, to) => {
    if (to === '/table' && windowWidth < 1024) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      dispatch({ type: 'OPEN_DESKTOP_WARNING' });
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header ref={menuRef} style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #f1f5f9',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'auto',
        minHeight: 60,
        padding: '12px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: 16,
      }}>

        {/* ── Logo ── */}
        <NavLink to="/" onClick={() => { setIsMobileMenuOpen(false); dispatch({ type: 'SELECT_ELEMENT', payload: null }); }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6366f1 0%, #84cc16 50%, #f59e0b 100%)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#fff', fontFamily: 'Inter, sans-serif' }}>V</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#111827', letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif' }}>
            Valenzy
          </span>
        </NavLink>

        {/* ── Desktop Center Nav ── */}
        <div className="hidden md:block">
          <nav style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            background: '#f1f5f9',
            borderRadius: 999,
            padding: '4px 6px',
            border: '1px solid #e2e8f0',
            overflowX: 'auto',
            maxWidth: '100vw',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }} className="hide-scrollbar">
            {navItems.map(({ to, label, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={(e) => handleNavClick(e, to)}
                style={({ isActive }) => ({
                  padding: '6px 18px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.15s ease',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#111827' : '#6b7280',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  position: 'relative',
                })}
              >
                {label}
                {badge && (
                  <span style={{
                    position: 'absolute', top: 2, right: 6,
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#6366f1', display: 'inline-block',
                  }} />
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* ── Dark Mode Toggle ── */}
          <button
            onClick={toggleDarkMode}
            className="keep-color"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: 10,
              background: isDark ? '#1e293b' : '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer', flexShrink: 0,
              color: isDark ? '#f8fafc' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            {isDark ? (
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            )}
          </button>

          {/* ── Mobile Menu Toggle (3 dots / X) ── */}
          <div className="md:hidden flex">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                color: '#475569',
                transition: 'all 0.2s',
              }}
            >
              {isMobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="12" cy="5" r="1.5"></circle>
                  <circle cx="12" cy="19" r="1.5"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ── Mobile Dropdown Overlay (Gohyred Style) ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fadeIn" style={{
          position: 'absolute', top: '100%', left: 0, right: 0, width: '100%',
          height: 'calc(100dvh - 60px)',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid #f1f5f9',
          zIndex: 40,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 16px 40px', gap: 8 }}>
            {navItems.map(({ to, label, badge }) => {
              const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={(e) => handleNavClick(e, to)}
                  style={({ isActive }) => ({
                    position: 'relative', width: '100%', textAlign: 'left',
                    padding: '16px 20px',
                    fontSize: 16, fontWeight: 500,
                    borderRadius: 12,
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    color: isActive ? '#4f46e5' : '#334155'
                  })}
                >
                  <span>{label}</span>
                  {badge && (
                    <span style={{
                      marginLeft: 8, width: 8, height: 8, borderRadius: '50%',
                      background: '#6366f1', display: 'inline-block', flexShrink: 0,
                      boxShadow: '0 0 8px rgba(99,102,241,0.5)'
                    }} />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
