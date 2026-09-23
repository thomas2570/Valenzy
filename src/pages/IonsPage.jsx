import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ION_CATEGORIES } from '../data/ions';

export default function IonsPage() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #fcfaf5 0%, transparent 60%), #fbfbfb',
      padding: isMobile ? '24px 16px 80px' : '40px 24px 100px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: isMobile ? 32 : 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', marginBottom: 8 }}>
            Common Ions
          </h1>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            A comprehensive reference for monatomic and polyatomic ions
          </p>
        </div>

        {/* Categories */}
        {ION_CATEGORIES.map((category, catIdx) => (
          <div key={catIdx} style={{ marginBottom: 64 }}>
            <h2 style={{ 
              fontSize: 18, 
              fontWeight: 800, 
              color: '#374151', 
              marginBottom: 24, 
              paddingBottom: 12, 
              borderBottom: '2px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              {category.title}
              <span style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 6 }}>
                {category.ions.length}
              </span>
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', // Reduced from 110px to fit on small mobile screens
              gap: 12 
            }}>
              {category.ions.map((ion, ionIdx) => (
                <motion.div
                  key={ionIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (catIdx * 0.1) + (ionIdx * 0.02) }}
                  whileHover={{ y: -4, boxShadow: '0 12px 20px rgba(0,0,0,0.06)' }}
                  style={{
                    background: ion.color || '#fff',
                    borderRadius: 16,
                    padding: '20px 12px',
                    textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>
                      {ion.symbol}
                    </span>
                    <span style={{ 
                      position: 'absolute', 
                      top: -6, 
                      right: -14, 
                      fontSize: 13, 
                      fontWeight: 800, 
                      color: '#111827' 
                    }}>
                      {ion.charge}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: 'rgba(17, 24, 39, 0.6)', 
                    marginTop: 6,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    {ion.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
