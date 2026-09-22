import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import EquationBalancer from '../components/EquationBalancer';

export default function BalancerPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
      paddingBottom: 80,
    }}>
      {/* Back nav */}
      <div style={{ padding: '20px 24px 0' }}>
        <NavLink to="/tools" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: '#6b7280', textDecoration: 'none',
          padding: '6px 14px', background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 999, transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#111827'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          ← All Tools
        </NavLink>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'flex', justifyContent: 'center',
          padding: '40px 24px 0',
        }}
      >
        <EquationBalancer />
      </motion.div>
    </div>
  );
}
