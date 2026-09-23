import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, ArrowLeft, Wrench } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import PeriodicTable from '../components/PeriodicTable';
import ElementSidebar from '../components/ElementSidebar';
import { useAppContext } from '../context/AppContext';

export default function TablePage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        dispatch({ type: 'OPEN_DESKTOP_WARNING' });
      }
    };

    if (window.innerWidth < 1024) {
      dispatch({ type: 'OPEN_DESKTOP_WARNING' });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = state.selectedElement ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.selectedElement]);

  if (isMobile) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        background: '#fafafa',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: 24,
          padding: '40px 28px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.15)'
          }}>
            <Monitor size={32} strokeWidth={2.2} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 10, letterSpacing: '-0.02em' }}>
            Desktop Required
          </h2>

          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 28 }}>
            For the best visual experience and complete element inspection, the Interactive Periodic Table is optimized for desktop and tablet screens.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4f46e5'}
            >
              <ArrowLeft size={16} />
              <span>Return to Home</span>
            </button>

            <button
              onClick={() => navigate('/tools')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#334155',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <Wrench size={16} />
              <span>Explore Mobile Chemistry Tools</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 80% 60% at 10% 100%, #dbeafe44 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 90% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 1700, margin: '0 auto', padding: '24px 20px 80px' }}>
        <FilterBar />
        <PeriodicTable />
      </div>
      <ElementSidebar />
    </div>
  );
}
