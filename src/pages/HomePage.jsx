import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const FEATURES = [
  {
    title: 'Interactive Periodic Table',
    desc: 'Explore the elements with a powerful, dynamic table designed for desktop power users.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    color: '#3b82f6',
    bg: '#eff6ff',
    to: '/table',
  },
  {
    title: 'Virtual Chemistry Lab',
    desc: 'Simulate experiments and visualize atomic structures in a safe virtual environment.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m16-6h2m-2 6h2" />
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: '#8b5cf6',
    bg: '#f5f3ff',
    to: '/virtual-lab',
  },
  {
    title: 'Worksheet Studio',
    desc: 'Generate custom practice worksheets for balancing equations and identifying reactions.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    color: '#10b981',
    bg: '#ecfdf5',
    to: '/worksheet',
  },
  {
    title: 'Intelligent Quiz Engine',
    desc: 'Test your knowledge with timed quizzes, detailed reviews, and performance tracking.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
    ),
    color: '#f59e0b',
    bg: '#fffbeb',
    to: '/quiz',
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

  const handleNavigation = (to) => {
    if (to === '/table' && isMobile) {
      dispatch({ type: 'OPEN_DESKTOP_WARNING' });
    } else {
      navigate(to);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Decorators */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '60px 24px 80px' : '100px 32px 120px', position: 'relative', zIndex: 10 }}>
        
        {/* === HERO SECTION === */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 80 : 120 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: 999,
              background: 'rgba(99,102,241,0.1)', color: '#4f46e5',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              marginBottom: 24, boxShadow: '0 0 12px rgba(99,102,241,0.1)'
            }}>
              Welcome to Valenzy
            </div>
            
            <h1 style={{
              fontSize: isMobile ? 42 : 72,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 24,
              textWrap: 'balance'
            }}>
              The Next-Generation <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Chemistry Platform
              </span>
            </h1>
            
            <p style={{
              fontSize: isMobile ? 18 : 22,
              color: '#64748b',
              maxWidth: 700,
              margin: '0 auto 40px',
              lineHeight: 1.6,
              textWrap: 'balance'
            }}>
              Master chemistry with interactive periodic tables, virtual experiments, dynamic worksheets, and powerful calculation tools.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleNavigation('/tools')}
                style={{
                  background: '#0f172a', color: '#fff',
                  padding: isMobile ? '14px 28px' : '16px 36px',
                  borderRadius: 999, fontSize: 16, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(15, 23, 42, 0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.3)'; }}
              >
                Explore Tools
              </button>
              
              <button
                onClick={() => handleNavigation('/table')}
                style={{
                  background: '#fff', color: '#0f172a',
                  padding: isMobile ? '14px 28px' : '16px 36px',
                  borderRadius: 999, fontSize: 16, fontWeight: 600,
                  border: '1px solid #e2e8f0', cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                Periodic Table
              </button>
            </div>
          </motion.div>
        </div>

        {/* === FEATURES SECTION === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Everything you need in one place
            </h2>
            <p style={{ fontSize: 16, color: '#64748b' }}>Powerful features designed for students, teachers, and professionals.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                whileHover={{ y: -6 }}
                onClick={() => handleNavigation(feat.to)}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  padding: 32,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: feat.bg, color: feat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{feat.title}</h3>
                <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>{feat.desc}</p>
                <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', alignItems: 'center', gap: 6, color: feat.color, fontWeight: 600, fontSize: 14 }}>
                  Open Tool
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
