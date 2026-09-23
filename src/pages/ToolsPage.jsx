import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const TOOLS = [
  {
    path: '/balancer',
    number: '1',
    title: 'Equation Balancer',
    description: 'Balance complex chemical equations automatically with visual stoichiometry feedback.',
    iconBg: 'linear-gradient(135deg, #fecdd3, #fda4af)',
    iconColor: '#dc2626',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    path: '/molar-mass',
    number: '2',
    title: 'Molar Mass',
    description: 'Instantly compute molecular weights with a detailed element-by-element mass breakdown.',
    iconBg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    iconColor: '#b45309',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: '/solubility',
    number: '3',
    title: 'Solubility Table',
    description: 'Quickly reference interactive charts and rules for ionic compound solubilities.',
    iconBg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    iconColor: '#065f46',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
      </svg>
    ),
  },
  {
    path: '/gas-laws',
    number: '4',
    title: 'Gas Laws Simulator',
    description: 'Solve for pressure, volume, temperature, and moles using standard gas laws.',
    iconBg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    iconColor: '#5b21b6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    path: '/virtual-lab',
    number: '5',
    title: 'Virtual Lab',
    description: 'Interactive virtual environment to simulate various chemical experiments safely.',
    iconBg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    iconColor: '#0369a1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    path: '/worksheet',
    number: '6',
    title: 'Worksheet Studio',
    description: 'Auto-generate printable chemistry worksheets. Balance equations, practice problems.',
    iconBg: 'linear-gradient(135deg, #f3e8ff, #d8b4fe)',
    iconColor: '#9333ea',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe55 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff44 0%, transparent 60%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
      paddingBottom: 80,
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '48px 24px 40px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', marginBottom: 8 }}>
          Chemistry Tools
        </h1>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af' }}>
          Grade 9-12 Chemistry Tools &amp; Labs
        </p>
      </div>

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        {TOOLS.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <NavLink to={tool.path} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: '32px 32px 28px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Icon with number badge */}
                <div style={{ position: 'relative', width: 64, height: 64 }}>
                  <div style={{
                    width: 64, height: 64,
                    borderRadius: 16,
                    background: tool.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: tool.iconColor,
                  }}>
                    <div style={{ width: 28, height: 28 }}>{tool.icon}</div>
                  </div>
                  {/* Number badge top-left */}
                  <span style={{
                    position: 'absolute', top: -4, left: -4,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#fff', border: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800, color: '#6b7280',
                  }}>{tool.number}</span>
                  {/* NEW badge top-right */}
                  {tool.badge && (
                    <span style={{
                      position: 'absolute', top: -6, right: -6,
                      background: '#6366f1', color: '#fff',
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                      padding: '2px 6px', borderRadius: 999,
                    }}>{tool.badge}</span>
                  )}
                </div>

                {/* Text */}
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8, letterSpacing: '-0.015em' }}>
                    {tool.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                    {tool.description}
                  </p>
                </div>
              </motion.div>
            </NavLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
