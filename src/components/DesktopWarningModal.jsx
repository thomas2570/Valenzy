import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DesktopWarningModal() {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isOpen = state.isDesktopWarningOpen;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_DESKTOP_WARNING' });
    if (location.pathname === '/table') {
      navigate('/');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, location.pathname]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: '32px 28px',
              maxWidth: 380,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              position: 'relative',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close warning"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={16} />
            </button>

            {/* Desktop Monitor Icon */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.15)'
              }}
            >
              <Monitor size={30} strokeWidth={2.2} />
            </div>

            <h3 style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: 10,
              letterSpacing: '-0.02em'
            }}>
              Desktop Required
            </h3>

            <p style={{
              fontSize: 14,
              color: '#64748b',
              lineHeight: 1.6,
              marginBottom: 26
            }}>
              For the best visual experience and usability, the Interactive Periodic Table should be opened in desktop mode.
            </p>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 14,
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4338ca';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4f46e5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
