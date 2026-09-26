import React, { useState } from 'react';
import mnemonicsData from '../data/mnemonics.json';

const C = {
  indigo: '#6366f1', indigoDark: '#4f46e5', indigoLight: '#e0e7ff',
  green: '#10b981', greenLight: '#d1fae5',
  text: '#111827', sub: '#6b7280', border: '#e5e7eb', white: '#ffffff',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

export default function MnemonicPage() {
  const [search, setSearch] = useState('');

  const filteredData = mnemonicsData.filter(item => 
    item.topic.toLowerCase().includes(search.toLowerCase()) || 
    item.meaning.toLowerCase().includes(search.toLowerCase()) ||
    item.mnemonic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80 }}>
      
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            Chemistry <span style={{ color: C.indigo }}>Mnemonics</span>
          </h1>
          <p style={{ fontSize: 16, color: C.sub, margin: '0 auto', maxWidth: 500, lineHeight: 1.6 }}>
            Never forget the activity series or first 20 elements again! Browse our curated library of memory tricks.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Search by topic, element, or trick..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '16px 20px 16px 48px', borderRadius: 999,
                border: `2px solid ${C.border}`, fontSize: 15, outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'border-color 0.2s',
                color: C.text, fontWeight: 500
              }}
              onFocus={(e) => e.target.style.borderColor = C.indigo}
              onBlur={(e) => e.target.style.borderColor = C.border}
            />
            <svg style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} width="18" height="18" fill="none" stroke={C.sub} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => (
              <div key={i} style={{ 
                background: C.white, borderRadius: 20, padding: 24, 
                border: `1px solid ${C.border}`, boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.indigo, marginBottom: 12 }}>
                  {item.topic}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1.5, marginBottom: 16 }}>
                  "{item.mnemonic}"
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ padding: '12px 16px', background: C.greenLight, borderRadius: 12, border: `1px solid #a7f3d0` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.green, marginBottom: 4 }}>
                    Meaning
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#065f46', lineHeight: 1.5 }}>
                    {item.meaning}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: C.sub }}>
              No mnemonics found for "{search}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
