import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Atomic masses database
const ELEMENTS = {
  H:1.008, He:4.003, Li:6.941, Be:9.012, B:10.811, C:12.011, N:14.007,
  O:15.999, F:18.998, Ne:20.180, Na:22.990, Mg:24.305, Al:26.982, Si:28.086,
  P:30.974, S:32.065, Cl:35.453, Ar:39.948, K:39.098, Ca:40.078, Sc:44.956,
  Ti:47.867, V:50.942, Cr:51.996, Mn:54.938, Fe:55.845, Co:58.933, Ni:58.693,
  Cu:63.546, Zn:65.38, Ga:69.723, Ge:72.630, As:74.922, Se:78.971, Br:79.904,
  Kr:83.798, Rb:85.468, Sr:87.62, Y:88.906, Zr:91.224, Nb:92.906, Mo:95.96,
  Tc:98, Ru:101.07, Rh:102.906, Pd:106.42, Ag:107.868, Cd:112.411, In:114.818,
  Sn:118.710, Sb:121.760, Te:127.60, I:126.904, Xe:131.293, Cs:132.905,
  Ba:137.327, La:138.905, Ce:140.116, Pr:140.908, Nd:144.242, Pm:145, Sm:150.36,
  Eu:151.964, Gd:157.25, Tb:158.925, Dy:162.500, Ho:164.930, Er:167.259,
  Tm:168.934, Yb:173.054, Lu:174.967, Hf:178.49, Ta:180.948, W:183.84,
  Re:186.207, Os:190.23, Ir:192.217, Pt:195.084, Au:196.967, Hg:200.592,
  Tl:204.383, Pb:207.2, Bi:208.980, Po:209, At:210, Rn:222, Fr:223, Ra:226,
  Ac:227, Th:232.038, Pa:231.036, U:238.029, Np:237, Pu:244, Am:243, Cm:247,
  Bk:247, Cf:251, Es:252, Fm:257, Md:258, No:259, Lr:262
};

function parseFormula(formula) {
  // Parse chemical formula into {element: count} map
  const result = {};
  const tokens = [...formula.matchAll(/([A-Z][a-z]?)(\d*)/g)];
  for (const [, sym, num] of tokens) {
    if (!sym) continue;
    const count = num ? parseInt(num) : 1;
    const mass = ELEMENTS[sym];
    if (!mass) return { error: `Unknown element: ${sym}` };
    result[sym] = (result[sym] || 0) + count;
  }
  return result;
}

const EXAMPLES = ['H2O', 'CO2', 'NaCl', 'C6H12O6', 'H2SO4', 'NH3', 'Fe2O3', 'Ca(OH)2'];

export default function MolarMassCalculator() {
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = (f = formula) => {
    const input = f.trim();
    if (!input) return;
    const parsed = parseFormula(input);
    if (parsed.error) { setError(parsed.error); setResult(null); return; }
    const breakdown = Object.entries(parsed).map(([sym, count]) => ({
      symbol: sym,
      count,
      massEach: ELEMENTS[sym],
      massTotal: ELEMENTS[sym] * count,
    }));
    const total = breakdown.reduce((s, e) => s + e.massTotal, 0);
    setResult({ formula: input, total: total.toFixed(4), breakdown });
    setError('');
  };

  const tryExample = (ex) => {
    setFormula(ex);
    setResult(null);
    setError('');
    const parsed = parseFormula(ex);
    if (!parsed.error) {
      const breakdown = Object.entries(parsed).map(([sym, count]) => ({
        symbol: sym, count, massEach: ELEMENTS[sym], massTotal: ELEMENTS[sym] * count,
      }));
      const total = breakdown.reduce((s, e) => s + e.massTotal, 0);
      setResult({ formula: ex, total: total.toFixed(4), breakdown });
    }
  };

  return (
    <div style={{ width:'100%', maxWidth:680, background:'#fff', borderRadius:24, border:'1px solid #e5e7eb', boxShadow:'0 8px 40px rgba(0,0,0,0.08)', overflow:'hidden', fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ padding:'36px 40px 28px', borderBottom:'1px solid #f1f5f9', background:'linear-gradient(135deg,#fffbeb,#fffdf8)', textAlign:'center' }}>
        <div style={{ width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#fef3c7,#fde68a)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 24px rgba(251,191,36,0.25)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#111827', letterSpacing:'-0.025em', margin:'0 0 8px' }}>Molar Mass Calculator</h1>
        <p style={{ fontSize:14, color:'#6b7280', margin:0, lineHeight:1.6 }}>Enter a chemical formula to compute its molecular weight.</p>
      </div>

      {/* Body */}
      <div style={{ padding:'28px 40px 36px' }}>
        <form onSubmit={e => { e.preventDefault(); calculate(); }}>
          <div style={{ display:'flex', flexWrap: 'wrap', gap:10, marginBottom:16 }}>
            <input
              value={formula}
              onChange={e => { setFormula(e.target.value); setResult(null); setError(''); }}
              placeholder="e.g. H2O, C6H12O6, H2SO4"
              style={{ flex:'1 1 200px', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'12px 16px', fontSize:15, color:'#111827', fontFamily:"'JetBrains Mono',monospace", outline:'none', background:'#fafafa' }}
              onFocus={e => e.target.style.borderColor='#f59e0b'}
              onBlur={e => e.target.style.borderColor='#e5e7eb'}
            />
            <button type="submit" style={{ background:'#f59e0b', color:'#fff', border:'none', borderRadius:12, padding:'12px 24px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Inter',sans-serif", whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.target.style.background='#d97706'} onMouseLeave={e=>e.target.style.background='#f59e0b'}>
              Calculate
            </button>
          </div>
        </form>

        {/* Examples */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:24, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#9ca3af', fontWeight:600 }}>Try:</span>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => tryExample(ex)} style={{ background:'#fef3c7', border:'1px solid #fde68a', borderRadius:8, padding:'4px 10px', fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:'#b45309', cursor:'pointer', fontWeight:600 }}>
              {ex}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <div style={{ background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:14, padding:'16px 20px', color:'#be123c', fontSize:14, fontWeight:600 }}>{error}</div>}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div key="result" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}>
              {/* Total */}
              <div style={{ background:'linear-gradient(135deg,#fffbeb,#fef9e7)', border:'1px solid #fde68a', borderRadius:16, padding:'20px 24px', textAlign:'center', marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:'#d97706', marginBottom:6 }}>Molar Mass of {result.formula}</div>
                <div style={{ fontSize:36, fontWeight:900, color:'#111827', letterSpacing:'-0.03em' }}>{result.total}</div>
                <div style={{ fontSize:13, color:'#6b7280', fontWeight:600, marginTop:4 }}>g/mol</div>
              </div>

              {/* Breakdown table */}
              <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', overflowX: 'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                  <thead>
                    <tr style={{ background:'#f3f4f6' }}>
                      {['Element','Count','Mass (g/mol)','Contribution'].map(h => (
                        <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:800, color:'#6b7280', letterSpacing:'0.05em', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((row, i) => (
                      <tr key={row.symbol} style={{ borderTop:'1px solid #e5e7eb', background: i%2===0?'#fff':'#f9fafb' }}>
                        <td style={{ padding:'10px 16px', fontWeight:700, color:'#111827', fontFamily:"'JetBrains Mono',monospace" }}>{row.symbol}</td>
                        <td style={{ padding:'10px 16px', color:'#6b7280' }}>×{row.count}</td>
                        <td style={{ padding:'10px 16px', color:'#6b7280', fontFamily:"'JetBrains Mono',monospace" }}>{row.massEach.toFixed(3)}</td>
                        <td style={{ padding:'10px 16px', fontWeight:700, color:'#b45309', fontFamily:"'JetBrains Mono',monospace" }}>{row.massTotal.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
