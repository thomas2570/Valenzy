import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AtomicModel3D from './AtomicModel3D';
import realWorldFacts from '../data/realWorldFacts.json';
import elementHistory from '../data/elementHistory.json';
import { Volume2, VolumeX } from 'lucide-react';

const THEMES = [
  '#b3c1d0', // Slide 1 (Blue-grey)
  '#9fbed1', // Slide 2 (Light blue)
  '#a3d0c3', // Slide 3 (Mint green)
  '#d2bd98', // Slide 4 (Beige)
  '#c4b5fd', // Slide 5 (Purple)
];

const RowItem = ({ label, value, boldValue = true }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: boldValue ? 800 : 700, color: 'rgba(0,0,0,0.85)' }}>{value || <span style={{ opacity: 0.5 }}>—</span>}</div>
  </div>
);

const InnerCard = ({ title, children, isGreen, isRed, isBeige }) => {
  let bg = 'rgba(255,255,255,0.4)';
  if (isGreen) bg = 'rgba(134, 239, 172, 0.3)';
  if (isRed) bg = 'rgba(254, 205, 211, 0.4)';
  if (isBeige) bg = 'rgba(253, 230, 138, 0.4)';
  
  return (
    <div style={{ background: bg, borderRadius: 16, padding: '16px', marginBottom: 12, border: '1px solid rgba(255,255,255,0.2)' }}>
      {title && <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', color: isRed ? '#b91c1c' : (isGreen ? '#047857' : 'rgba(0,0,0,0.4)'), textTransform: 'uppercase', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <span>{title}</span>
      </div>}
      <div style={{ fontSize: 13, fontWeight: 700, color: isRed ? '#b91c1c' : (isGreen ? '#047857' : 'rgba(0,0,0,0.8)') }}>
        {children}
      </div>
    </div>
  );
};

const TTSButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeech = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // clear queue
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  React.useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <button 
      onClick={toggleSpeech}
      title="Listen"
      style={{ 
        background: 'none', border: 'none', cursor: 'pointer', 
        padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isPlaying ? '#6366f1' : 'rgba(0,0,0,0.4)',
        transition: 'color 0.2s',
        marginLeft: 8
      }}
    >
      {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
    </button>
  );
};

export default function ElementSidebar() {
  const { state, dispatch } = useAppContext();
  const [tab, setTab] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;
  const isSmallMobile = windowWidth < 640;
  const el = state.selectedElement;

  if (!el) return null;

  const numTabs = 5;
  const nextSlide = () => setTab(t => (t + 1) % numTabs);
  const prevSlide = () => setTab(t => (t === 0 ? numTabs - 1 : t - 1));

  const bgTheme = THEMES[tab];
  const protons = el.number;
  const neutrons = Math.round((el.atomic_mass || protons * 2)) - protons;

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 100, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', 
      padding: isMobile ? 0 : 24 
    }}>
      
      {/* Modal Container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%', 
        maxWidth: isMobile ? '100%' : 1100, 
        height: isMobile ? '100%' : 600, 
        maxHeight: isMobile ? '100%' : '90vh', 
        background: '#fff', 
        borderRadius: isMobile ? 0 : 32, 
        overflow: 'hidden', 
        boxShadow: isMobile ? 'none' : '0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        position: 'relative'
      }}>
        
        {/* === LEFT SIDEBAR / MAIN INFO === */}
        <div style={{ 
          width: isMobile ? '100%' : 380, 
          height: isMobile ? 'auto' : '100%',
          flexShrink: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          borderRight: isMobile ? 'none' : '1px solid #f1f5f9', 
          borderBottom: isMobile ? '1px solid #f1f5f9' : 'none',
          background: '#fff',
          overflowY: isMobile ? 'auto' : 'hidden'
        }}>
          
          {/* Header */}
          <div style={{ background: '#fcfaf5', padding: isSmallMobile ? '16px 20px' : '24px 32px 20px', display: 'flex', alignItems: 'center', gap: 16, sticky: isMobile ? 'top' : 'static', top: 0, zIndex: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: isSmallMobile ? 12 : 16, fontWeight: 800, lineHeight: 1, marginBottom: 2 }}>{Math.round(el.atomic_mass || 0)}</span>
              <span style={{ fontSize: isSmallMobile ? 12 : 16, fontWeight: 800, lineHeight: 1 }}>{el.number}</span>
            </div>
            <div style={{ fontSize: isSmallMobile ? 40 : 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', color: '#111827' }}>
              {el.symbol}
            </div>
            <div style={{ fontSize: isSmallMobile ? 16 : 20, fontWeight: 800, color: '#111827', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              {el.name}
              {el.summary && <TTSButton text={el.summary} />}
            </div>
          </div>          {/* Content Area based on Tab */}
          <div style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {/* Sliding Arrows */}
            <button onClick={prevSlide} style={{ position: 'absolute', left: 8, top: '45%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <button onClick={nextSlide} style={{ position: 'absolute', right: 8, top: '45%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div style={{ background: bgTheme, borderRadius: 24, padding: 24, flex: 1, display: 'flex', flexDirection: 'column', transition: 'background 0.3s', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
              {tab === 0 && (
                <motion.div key="t0" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 24 }}>
                    <RowItem label="Type" value={el.category} />
                    <RowItem label="Group / Period" value={el.xpos && el.ypos ? `${el.xpos} / ${el.ypos}` : null} />
                    <RowItem label="Phase @ STP" value={el.phase} />
                    <RowItem label="Electron Block" value={el.block} />
                  </div>
                  <InnerCard title="Common Ions">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '12px 16px', borderRadius: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 900 }}>{el.symbol}²⁺</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.6)' }}>{el.name}(II)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '12px 16px', borderRadius: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 900 }}>{el.symbol}³⁺</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.6)' }}>{el.name}(III)</span>
                    </div>
                  </InnerCard>
                </motion.div>
              )}

              {tab === 1 && (
                <motion.div key="t1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 20 }}>
                    <RowItem label="Avg. Atomic Mass" value={el.atomic_mass?.toFixed(3)} />
                    <RowItem label="Configuration" value={el.electron_configuration} />
                    <RowItem label="Valence e⁻" value="Variable (outer s + d)" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, padding: '0 4px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>{protons}</div>
                      <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(0,0,0,0.5)' }}>P⁺ PROTONS</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>{neutrons}</div>
                      <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(0,0,0,0.5)' }}>N⁰ NEUTRONS</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>{protons}</div>
                      <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(0,0,0,0.5)' }}>E⁻ ELECTRONS</div>
                    </div>
                  </div>
                  <InnerCard title="Key Isotopes">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '12px 16px', borderRadius: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 900 }}><sup>{Math.round(el.atomic_mass||0)}</sup>{el.symbol}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{neutrons} n⁰</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(0,0,0,0.5)' }}>STABLE</div>
                      </div>
                    </div>
                  </InnerCard>
                </motion.div>
              )}

              {tab === 2 && (
                <motion.div key="t2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <InnerCard title="Oxidation States">
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>+2</span>
                      <span style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>+4</span>
                      <span style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>+7</span>
                    </div>
                  </InnerCard>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px 20px', background: 'rgba(255,255,255,0.4)', padding: 16, borderRadius: 16, flex: 1 }}>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>1ST IONIZATION</div><div style={{ fontSize:13, fontWeight:800 }}>717 <span style={{fontSize:10,fontWeight:600}}>kJ/mol</span></div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>ELECTRON AFFINITY</div><div style={{ fontSize:13, fontWeight:800 }}>N/A <span style={{fontSize:10,fontWeight:600}}>kJ/mol</span></div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>ELECTRONEGATIVITY</div><div style={{ fontSize:13, fontWeight:800 }}>{el.electronegativity_pauling || 'N/A'}</div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>DENSITY</div><div style={{ fontSize:13, fontWeight:800 }}>{el.density || 'N/A'} <span style={{fontSize:10,fontWeight:600}}>g/cm³</span></div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>MELTING POINT</div><div style={{ fontSize:13, fontWeight:800 }}>{el.melt || 'N/A'} <span style={{fontSize:10,fontWeight:600}}>K</span></div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>BOILING POINT</div><div style={{ fontSize:13, fontWeight:800 }}>{el.boil || 'N/A'} <span style={{fontSize:10,fontWeight:600}}>K</span></div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>ATOMIC RADIUS</div><div style={{ fontSize:13, fontWeight:800 }}>161 <span style={{fontSize:10,fontWeight:600}}>pm</span></div></div>
                    <div><div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.5)' }}>SPECIFIC HEAT</div><div style={{ fontSize:13, fontWeight:800 }}>0.4790 <span style={{fontSize:10,fontWeight:600}}>J/(g·°C)</span></div></div>
                  </div>
                </motion.div>
              )}

              {tab === 3 && (
                <motion.div key="t3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 16 }}>
                    <RowItem label="Discovery Year" value={el.discovered_year || 'Ancient'} />
                    <RowItem label="Discovered By" value={el.discovered_by || 'Unknown'} boldValue={false} />
                    <RowItem label="Named By" value={el.named_by || 'Unknown'} boldValue={false} />
                  </div>
                  <InnerCard title="STSE Context" isGreen>
                    Metallurgy (Essential for steel strength)<br/>Batteries (Alkaline cells)
                  </InnerCard>
                  <InnerCard title="Common Uses" isBeige>
                    Steel alloys, Aluminum beverage cans, Dry cell batteries
                  </InnerCard>
                  <InnerCard title="Hazards" isRed>
                    Neurotoxicity from chronic dust inhalation
                  </InnerCard>
                </motion.div>
              )}

              {tab === 4 && (
                <motion.div key="t4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)' }}>
                      Did You Know?
                    </div>
                    {realWorldFacts[el.symbol] && (
                      <TTSButton text={realWorldFacts[el.symbol].join(' ')} />
                    )}
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 16, padding: '16px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.8)', lineHeight: 1.6 }}>
                      {realWorldFacts[el.symbol] ? (
                        realWorldFacts[el.symbol].map((fact, i) => (
                          <li key={i} style={{ marginBottom: 8 }}>{fact}</li>
                        ))
                      ) : (
                        <li>No facts available for this element yet.</li>
                      )}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)' }}>
                      Discovery Timeline
                    </div>
                    {elementHistory[el.symbol] && (
                      <TTSButton text={`Discovered in ${elementHistory[el.symbol].year} by ${elementHistory[el.symbol].discoverer}. ${elementHistory[el.symbol].story}`} />
                    )}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 16, padding: '16px', border: '1px solid rgba(255,255,255,0.2)', flex: 1 }}>
                    {elementHistory[el.symbol] ? (
                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#4f46e5', background: '#e0e7ff', padding: '2px 8px', borderRadius: 8 }}>
                            {elementHistory[el.symbol].year}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.6)', marginBottom: 8 }}>
                          By {elementHistory[el.symbol].discoverer}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.8)', lineHeight: 1.6 }}>
                          {elementHistory[el.symbol].story}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.8)' }}>
                        Detailed history not available yet.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
            
            {/* Pagination / Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  onClick={() => setTab(i)}
                  style={{ 
                    cursor: 'pointer', 
                    width: tab === i ? 6 : 5, 
                    height: tab === i ? 6 : 5, 
                    borderRadius: '50%', 
                    background: tab === i ? '#000' : 'rgba(0,0,0,0.15)',
                    transition: 'all 0.2s'
                  }} 
                />
              ))}
              <div 
                 style={{ 
                   cursor: 'pointer',
                   width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', 
                   display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4,
                 }}
              >
                {/* Lock icon */}
                <svg width="10" height="10" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDEBAR (3D MODEL) === */}
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          background: '#fff',
          height: isMobile ? 350 : '100%',
          borderTop: isMobile ? '1px solid #f1f5f9' : 'none'
        }}>
          {/* Close button */}
          <button 
            onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })}
            style={{ 
              position: 'absolute', 
              top: isMobile ? 16 : 24, 
              right: isMobile ? 16 : 24, 
              zIndex: 100, 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: '#f1f5f9', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#64748b' 
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <AtomicModel3D element={el} />

        </div>

      </div>
    </div>
  );
}
