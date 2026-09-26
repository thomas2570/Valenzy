import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function SettingsPage() {
  const { state, dispatch } = useAppContext();
  const { units, animation, liteMode, language } = state.settings;
  const [suggestion, setSuggestion] = useState('');
  const [suggestionTopic, setSuggestionTopic] = useState('New Tool');
  const [showAbout, setShowAbout] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const updateUnit = (key, value) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });
  };

  const togglePlayback = () => {
    dispatch({ type: 'TOGGLE_PLAYBACK' });
  };

  const updateSpeed = (e) => {
    dispatch({ type: 'SET_ANIMATION_SPEED', payload: parseFloat(e.target.value) });
  };

  const handleSendSuggestion = async () => {
    if (!suggestion.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mnjoogrd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          topic: suggestionTopic,
          suggestion: suggestion,
          _subject: `Valenzy Suggestion: ${suggestionTopic}`
        })
      });

      if (response.ok) {
        setIsSent(true);
        setSuggestion('');
        // Reset "Sent" state after 3 seconds
        setTimeout(() => setIsSent(false), 3000);
      } else {
        alert("Failed to send suggestion. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #fcfaf5 0%, transparent 60%), #fbfbfb',
      padding: isMobile ? '24px 16px 80px' : '40px 24px 100px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', 
        gap: isMobile ? 24 : 32 
      }}>
        
        {/* === LEFT COLUMN === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* GitHub Card */}
          <motion.div 
            onClick={() => window.open('https://github.com/thomas2570/-Zperiod', '_blank')}
            whileHover={{ y: -2 }} 
            style={cardStyle}
          >
            <div style={iconBoxStyle('#f1f5f9', '#334155')}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#111827' }}>GitHub</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Give me a star</div>
            </div>
          </motion.div>

          {/* Portfolio Card */}
          <motion.div 
            onClick={() => window.open('https://thomasramesh.vercel.app/', '_blank')}
            whileHover={{ y: -2 }} 
            style={cardStyle}
          >
            <div style={iconBoxStyle('#fef3c7', '#d97706')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#111827' }}>Portfolio</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>My professional work</div>
            </div>
            <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          </motion.div>

          {/* Help / About */}
          <motion.div 
            onClick={() => setShowAbout(true)}
            whileHover={{ y: -2 }} 
            style={cardStyle}
          >
            <div style={iconBoxStyle('#eff6ff', '#2563eb')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#111827' }}>Help / About</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Introduction & Contact Me</div>
            </div>
            <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          </motion.div>

          {/* Electron Animation Controller */}
          <div style={{ ...sectionBoxStyle, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={iconCircleStyle}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Electron Animation</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 15 }}>Playback</span>
              <button 
                onClick={togglePlayback}
                style={{ 
                  width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb', 
                  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#111827', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {animation.playback === 'running' ? (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 15, minWidth: 50 }}>Speed</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#9ca3af', minWidth: 40 }}>{animation.speed.toFixed(1)}x</span>
              <input 
                type="range" min="0" max="2" step="0.1" 
                value={animation.speed} 
                onChange={updateSpeed}
                style={{ flex: 1, accentColor: '#111827' }} 
              />
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Accessibility & Reach */}
          <div style={sectionBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isMobile ? 24 : 40 }}>
              <div style={iconBoxStyle('#f3e8ff', '#9333ea', isMobile ? 32 : 40)}>
                <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#111827' }}>Accessibility & Reach</h3>
            </div>

            <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 }}>
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 15 }}>Language (UI)</span>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 999, padding: 4, gap: 4, width: isMobile ? '100%' : 'auto' }}>
                {['en', 'hi'].map((lang) => {
                  const isActive = language === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
                      style={{
                        flex: isMobile ? 1 : 'none',
                        padding: '6px 16px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', transition: '0.2s',
                        background: isActive ? '#fff' : 'transparent',
                        color: isActive ? '#111827' : '#94a3b8',
                        boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {lang === 'en' ? 'English' : 'हिंदी'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <span style={{ fontWeight: 600, color: '#374151', fontSize: 15, display: 'block' }}>Graphics Mode</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Use Lite mode for older devices.</span>
              </div>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 999, padding: 4, gap: 4, width: isMobile ? '100%' : 'auto' }}>
                <button
                  onClick={() => !liteMode && dispatch({ type: 'TOGGLE_LITE_MODE' })}
                  style={{
                    flex: isMobile ? 1 : 'none',
                    padding: '6px 16px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', transition: '0.2s',
                    background: !liteMode ? '#fff' : 'transparent',
                    color: !liteMode ? '#111827' : '#94a3b8',
                    boxShadow: !liteMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  3D WebGL
                </button>
                <button
                  onClick={() => liteMode && dispatch({ type: 'TOGGLE_LITE_MODE' })}
                  style={{
                    flex: isMobile ? 1 : 'none',
                    padding: '6px 16px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', transition: '0.2s',
                    background: liteMode ? '#fff' : 'transparent',
                    color: liteMode ? '#111827' : '#94a3b8',
                    boxShadow: liteMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Lite (2D)
                </button>
              </div>
            </div>
          </div>

          {/* Global Units */}
          <div style={sectionBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isMobile ? 24 : 48 }}>
              <div style={iconBoxStyle('#ecfdf5', '#059669', isMobile ? 32 : 40)}>
                <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: '#111827' }}>Global Units</h3>
            </div>

            {[
              { label: 'Temp.', key: 'temp', options: ['°C', '°F', 'K'] },
              { label: 'Density', key: 'density', options: ['g/cm³', 'kg/m³', 'lb/ft³'] },
              { label: 'Energy', key: 'energy', options: ['kJ/mol', 'eV'] },
            ].map((row) => (
              <div key={row.key} style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 }}>
                <span style={{ fontWeight: 600, color: '#374151', fontSize: 15 }}>{row.label}</span>
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 999, padding: 4, gap: 4, width: isMobile ? '100%' : 'auto', overflowX: 'auto' }}>
                  {row.options.map((opt) => {
                    const isActive = units[row.key] === opt.replace('³', '3'); // normalized
                    return (
                      <button
                        key={opt}
                        onClick={() => updateUnit(row.key, opt.replace('³', '3'))}
                        style={{
                          flex: isMobile ? 1 : 'none',
                          padding: '6px 16px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 700,
                          cursor: 'pointer', transition: '0.2s',
                          background: isActive ? '#fff' : 'transparent',
                          color: isActive ? '#111827' : '#94a3b8',
                          boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Send a Suggestion */}
          <div style={sectionBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={iconBoxStyle('#eff6ff', '#2563eb', 40)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Send a Suggestion</h3>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Help us improve Valenzy — pick a topic or write your own.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {['More Data', 'Bug Report', 'New Tool', 'Interface / Design', 'Other'].map(topic => (
                <button
                  key={topic}
                  onClick={() => setSuggestionTopic(topic)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, border: '1px solid #e5e7eb', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: '0.2s',
                    background: suggestionTopic === topic ? '#111827' : '#fff',
                    color: suggestionTopic === topic ? '#fff' : '#4b5563'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative' }}>
              <textarea 
                placeholder="Type your suggestion..." 
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                style={{
                  width: '100%', height: 160, borderRadius: 16, border: '1px solid #e5e7eb',
                  padding: 16, fontSize: 15, outline: 'none', resize: 'none', fontFamily: 'inherit'
                }}
              />
              <button 
                onClick={handleSendSuggestion}
                disabled={isSending || !suggestion.trim()}
                style={{
                  position: 'absolute', bottom: 12, right: 12,
                  background: isSent ? '#10b981' : '#111827', 
                  color: '#fff', border: 'none', padding: '10px 20px',
                  borderRadius: 12, fontWeight: 700, fontSize: 14, 
                  cursor: (isSending || !suggestion.trim()) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: (!suggestion.trim() && !isSending && !isSent) ? 0.5 : 1
                }}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Sending...
                  </>
                ) : isSent ? (
                  <>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    Sent!
                  </>
                ) : (
                  <>
                    Send
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', width: '100%', maxWidth: 450,
              borderRadius: isMobile ? 24 : 32, padding: isMobile ? '32px 24px' : 40, position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              textAlign: 'center',
              maxHeight: '90vh', overflowY: 'auto'
            }}
          >
            <button 
              onClick={() => setShowAbout(false)}
              style={{
                position: 'absolute', top: isMobile ? 12 : 20, right: isMobile ? 12 : 20,
                background: '#f1f5f9', border: 'none', width: 32, height: 32,
                borderRadius: '50%', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#64748b'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, color: '#1e1b4b', marginBottom: 16 }}>Thomas Ramesh</h2>
            
            <div style={{ 
              display: 'inline-block', background: '#eef2ff', color: '#4338ca',
              padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700,
              marginBottom: 32
            }}>
              Creator & Full Stack Developer
            </div>

            <div style={{ 
              background: '#f8fafc', borderRadius: 24, padding: 24, 
              display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left',
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: '#6366f1' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#334155' }}>KCCITM · B.TECH CSE</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>(2027)</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: '#6366f1' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#334155' }}>New Delhi</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ 
                background: '#fff', border: '1px solid #f1f5f9', 
                borderRadius: 16, padding: '14px 20px', 
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: '#475569', wordBreak: 'break-all' }}>thomasramesh449@gmail.com</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </div>
  );
}

// --- Styles ---

const cardStyle = {
  background: '#ffffff',
  borderRadius: 20,
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  cursor: 'pointer',
  border: '1px solid #f1f5f9',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
};

const sectionBoxStyle = {
  background: '#ffffff',
  borderRadius: 28,
  padding: '32px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
};

const iconBoxStyle = (bg, color, size = 44) => ({
  width: size, height: size, borderRadius: 12, background: bg, color: color,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
});

const iconCircleStyle = {
  width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #f1f5f9',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827', boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
};
