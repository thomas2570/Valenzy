import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext, useTranslation } from '../context/AppContext';
import { 
  Atom, 
  FlaskConical, 
  BookOpen, 
  FileSpreadsheet, 
  CheckCircle2, 
  Mail, 
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale,
  Cookie,
  Info,
  User
} from 'lucide-react';

export default function Footer() {
  const { dispatch } = useAppContext();
  const t = useTranslation();

  const navLinkStyle = {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.15s ease',
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(248,250,252,0.8) 0%, #ffffff 100%)',
      borderTop: '1px solid #e2e8f0',
      fontFamily: "'Inter', sans-serif",
      marginTop: 'auto',
      position: 'relative',
      zIndex: 20,
    }}>
      {/* Subtle top ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        width: '60%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), rgba(16, 185, 129, 0.4), transparent)',
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '64px 24px 32px',
      }}>
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 48,
          marginBottom: 56,
        }}>
          {/* Brand Info & Slogan (Left Column) */}
          <div style={{ gridColumn: 'span 1', minWidth: 260 }}>
            <NavLink 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 16 
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #6366f1 0%, #84cc16 50%, #f59e0b 100%)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              }}>
                <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>V</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 22, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Valenzy
              </span>
            </NavLink>

            {/* Slogan */}
            <p style={{
              fontSize: 14,
              color: '#64748b',
              lineHeight: 1.65,
              marginBottom: 24,
              maxWidth: 320,
            }}>
              Interactive chemistry platform empowering students, educators, and curious minds to visualize atomic structures, explore reactions, and master chemical sciences.
            </p>

            {/* Contact & Social actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => dispatch({ type: 'OPEN_CONTACT' })}
                title="Send us a message"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#0f172a';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 3px 6px -1px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.04)';
                }}
              >
                <MessageSquare size={14} color="#6366f1" />
                <span>Contact Us</span>
              </button>

              <a
                href="https://github.com/thomas2570/-Zperiod"
                target="_blank"
                rel="noreferrer"
                title="GitHub Repository"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Explore & Tools */}
          <div>
            <h4 style={{
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#0f172a',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <Atom size={16} color="#6366f1" />
              <span>{t('footer_explore')}</span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li>
                <NavLink 
                  to="/table" 
                  style={navLinkStyle}
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      e.preventDefault();
                      dispatch({ type: 'OPEN_DESKTOP_WARNING' });
                    }
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Periodic Table</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/ions" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Polyatomic Ions</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/balancer" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Equation Balancer</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/molar-mass" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Molar Mass Calculator</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/solubility" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Solubility Chart</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/gas-laws" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Gas Laws Simulator</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Learning & Practice */}
          <div>
            <h4 style={{
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#0f172a',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FlaskConical size={16} color="#10b981" />
              <span>{t('footer_practice')}</span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li>
                <NavLink 
                  to="/virtual-lab" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Virtual Lab</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/worksheet" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Worksheet Studio</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/quiz" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Interactive Quizzes</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/leaderboard" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Leaderboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/gallery" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Molecule Gallery</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/mnemonics" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Mnemonic Generator</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/formulas" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Formula Sheet Generator</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/tools" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>All Chemistry Tools</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Legal */}
          <div>
            <h4 style={{
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#0f172a',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ShieldCheck size={16} color="#f59e0b" />
              <span>{t('footer_legal')}</span>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li>
                <NavLink 
                  to="/about" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <Info size={14} style={{ opacity: 0.7 }} />
                  <span>About Us</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/terms" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <Scale size={14} style={{ opacity: 0.7 }} />
                  <span>Terms & Conditions</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/privacy" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ShieldCheck size={14} style={{ opacity: 0.7 }} />
                  <span>Privacy Policy</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/cookies" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <Cookie size={14} style={{ opacity: 0.7 }} />
                  <span>Cookie Policy</span>
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => dispatch({ type: 'OPEN_CONTACT' })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    ...navLinkStyle
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <MessageSquare size={14} style={{ opacity: 0.7 }} />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <NavLink 
                  to="/settings" 
                  style={navLinkStyle}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                  <span>Settings & Preferences</span>
                </NavLink>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: 24,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Copyright & Slogan / Dedication */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              &copy; {new Date().getFullYear()} Valenzy. All rights reserved.
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              Crafted with <span style={{ color: '#6366f1' }}>⚛️</span> for students, educators &amp; chemistry aspirants worldwide.
            </div>
          </div>

          {/* Quick Legal Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 12,
            color: '#94a3b8',
          }}>
            <NavLink to="/about" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              About Us
            </NavLink>
            <span>&bull;</span>
            <button
              onClick={() => dispatch({ type: 'OPEN_CONTACT' })}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: 12,
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              Contact Us
            </button>
            <span>&bull;</span>
            <NavLink to="/terms" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              Terms
            </NavLink>
            <span>&bull;</span>
            <NavLink to="/privacy" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              Privacy
            </NavLink>
            <span>&bull;</span>
            <NavLink to="/cookies" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              Cookies
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
