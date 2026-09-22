import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Ideal Gas Law: PV = nRT   R = 0.08314 L·bar/mol·K
const R = 0.08314;

const LAWS = [
  { id: 'ideal',    label: "Ideal Gas Law",    formula: "PV = nRT", desc: "Solve for any variable given the others." },
  { id: 'boyle',    label: "Boyle's Law",       formula: "P₁V₁ = P₂V₂", desc: "At constant temperature: pressure × volume is constant." },
  { id: 'charles',  label: "Charles's Law",     formula: "V₁/T₁ = V₂/T₂", desc: "At constant pressure: volume is proportional to temperature." },
  { id: 'gayLussac',label: "Gay-Lussac's Law",  formula: "P₁/T₁ = P₂/T₂", desc: "At constant volume: pressure is proportional to temperature." },
];

function Field({ label, value, onChange, unit, hint, color = '#6366f1' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:11, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#6b7280' }}>{label}</label>
      <div style={{ display:'flex', alignItems:'center', gap:0, border:'1.5px solid #e5e7eb', borderRadius:10, overflow:'hidden', background:'#fafafa' }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={hint}
          style={{ flex:1, border:'none', outline:'none', background:'transparent', padding:'10px 14px', fontSize:15, color:'#111827', fontFamily:"'JetBrains Mono',monospace" }}
          onFocus={e => e.target.parentElement.style.borderColor = color}
          onBlur={e => e.target.parentElement.style.borderColor = '#e5e7eb'}
        />
        <span style={{ background:'#f1f5f9', borderLeft:'1px solid #e5e7eb', padding:'10px 12px', fontSize:12, fontWeight:700, color:'#6b7280', whiteSpace:'nowrap' }}>{unit}</span>
      </div>
    </div>
  );
}

export default function GasLawsSimulator() {
  const [law, setLaw] = useState('ideal');
  // Ideal
  const [P, setP] = useState(''); const [V, setV] = useState('');
  const [n, setN] = useState(''); const [T, setT] = useState('');
  // Combined
  const [P1, setP1] = useState(''); const [V1, setV1] = useState('');
  const [T1, setT1] = useState(''); const [P2, setP2] = useState('');
  const [V2, setV2] = useState(''); const [T2, setT2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = useCallback(() => {
    setError(''); setResult(null);
    try {
      if (law === 'ideal') {
        const vals = { P: parseFloat(P), V: parseFloat(V), n: parseFloat(n), T: parseFloat(T) };
        const missing = Object.entries(vals).filter(([,v]) => isNaN(v));
        if (missing.length !== 1) { setError('Fill in exactly 3 values to solve for the 4th.'); return; }
        const [solve] = missing[0];
        const { P: p, V: v, n: nn, T: t } = vals;
        let ans;
        if (solve === 'P') ans = (nn * R * t) / v;
        if (solve === 'V') ans = (nn * R * t) / p;
        if (solve === 'n') ans = (p * v) / (R * t);
        if (solve === 'T') ans = (p * v) / (nn * R);
        const units = { P:'bar', V:'L', n:'mol', T:'K' };
        setResult({ variable: solve, value: ans.toFixed(4), unit: units[solve], law: 'Ideal Gas Law (PV = nRT)' });
      } else if (law === 'boyle') {
        const [p1, v1, p2, v2] = [P1,V1,P2,V2].map(parseFloat);
        const missing = [isNaN(p1),isNaN(v1),isNaN(p2),isNaN(v2)];
        if (missing.filter(Boolean).length !== 1) { setError("Fill in exactly 3 values."); return; }
        let ans, label, unit;
        if (isNaN(p1)) { ans = (p2*v2)/v1; label='P₁'; unit='bar'; }
        else if (isNaN(v1)) { ans = (p2*v2)/p1; label='V₁'; unit='L'; }
        else if (isNaN(p2)) { ans = (p1*v1)/v2; label='P₂'; unit='bar'; }
        else { ans = (p1*v1)/p2; label='V₂'; unit='L'; }
        setResult({ variable: label, value: ans.toFixed(4), unit, law: "Boyle's Law (P₁V₁ = P₂V₂)" });
      } else if (law === 'charles') {
        const [v1, t1, v2, t2] = [V1,T1,V2,T2].map(parseFloat);
        const missing = [isNaN(v1),isNaN(t1),isNaN(v2),isNaN(t2)];
        if (missing.filter(Boolean).length !== 1) { setError("Fill in exactly 3 values."); return; }
        let ans, label, unit;
        if (isNaN(v1)) { ans = (v2*t1)/t2; label='V₁'; unit='L'; }
        else if (isNaN(t1)) { ans = (v1*t2)/v2; label='T₁'; unit='K'; }
        else if (isNaN(v2)) { ans = (v1*t2)/t1; label='V₂'; unit='L'; }
        else { ans = (v2*t1)/v1; label='T₂'; unit='K'; }
        setResult({ variable: label, value: ans.toFixed(4), unit, law: "Charles's Law (V₁/T₁ = V₂/T₂)" });
      } else if (law === 'gayLussac') {
        const [p1, t1, p2, t2] = [P1,T1,P2,T2].map(parseFloat);
        const missing = [isNaN(p1),isNaN(t1),isNaN(p2),isNaN(t2)];
        if (missing.filter(Boolean).length !== 1) { setError("Fill in exactly 3 values."); return; }
        let ans, label, unit;
        if (isNaN(p1)) { ans = (p2*t1)/t2; label='P₁'; unit='bar'; }
        else if (isNaN(t1)) { ans = (p1*t2)/p2; label='T₁'; unit='K'; }
        else if (isNaN(p2)) { ans = (p1*t2)/t1; label='P₂'; unit='bar'; }
        else { ans = (t2*p1)/p2; label='T₂'; unit='K'; }
        setResult({ variable: label, value: ans.toFixed(4), unit, law: "Gay-Lussac's Law (P₁/T₁ = P₂/T₂)" });
      }
    } catch { setError('Calculation error. Check your inputs.'); }
  }, [law, P,V,n,T,P1,V1,T1,P2,V2,T2]);

  const reset = () => { setP('');setV('');setN('');setT('');setP1('');setV1('');setT1('');setP2('');setV2('');setT2('');setResult(null);setError(''); };

  return (
    <div style={{ width:'100%', maxWidth:720, background:'#fff', borderRadius:24, border:'1px solid #e5e7eb', boxShadow:'0 8px 40px rgba(0,0,0,0.08)', overflow:'hidden', fontFamily:"'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ padding:'32px 40px 24px', borderBottom:'1px solid #f1f5f9', background:'linear-gradient(135deg,#f5f3ff,#f0f0ff)', textAlign:'center' }}>
        <div style={{ width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#ede9fe,#ddd6fe)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 24px rgba(139,92,246,0.2)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#111827', letterSpacing:'-0.025em', margin:'0 0 8px' }}>Gas Laws Simulator</h1>
        <p style={{ fontSize:14, color:'#6b7280', margin:0 }}>Select a law, fill in 3 values, and solve for the unknown.</p>
      </div>

      <div style={{ padding:'28px 40px 36px' }}>
        {/* Law selector */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:8, marginBottom:24 }}>
          {LAWS.map(l => (
            <button key={l.id} onClick={() => { setLaw(l.id); reset(); }} style={{
              padding:'12px 14px', borderRadius:12, border: law===l.id ? '2px solid #8b5cf6' : '1.5px solid #e5e7eb',
              background: law===l.id ? '#f5f3ff' : '#fafafa', cursor:'pointer', textAlign:'left', transition:'all 0.15s',
            }}>
              <div style={{ fontSize:13, fontWeight:700, color: law===l.id ? '#5b21b6' : '#111827', marginBottom:2 }}>{l.label}</div>
              <div style={{ fontSize:11, color:'#9ca3af', fontFamily:"'JetBrains Mono',monospace" }}>{l.formula}</div>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14, marginBottom:20 }}>
          {law === 'ideal' && <>
            <Field label="Pressure (P)" value={P} onChange={setP} unit="bar" hint="Leave blank to solve" />
            <Field label="Volume (V)" value={V} onChange={setV} unit="L" hint="Leave blank to solve" />
            <Field label="Moles (n)" value={n} onChange={setN} unit="mol" hint="Leave blank to solve" />
            <Field label="Temperature (T)" value={T} onChange={setT} unit="K" hint="Leave blank to solve" />
          </>}
          {law === 'boyle' && <>
            <Field label="P₁" value={P1} onChange={setP1} unit="bar" hint="?" color="#8b5cf6" />
            <Field label="V₁" value={V1} onChange={setV1} unit="L" hint="?" color="#8b5cf6" />
            <Field label="P₂" value={P2} onChange={setP2} unit="bar" hint="?" color="#8b5cf6" />
            <Field label="V₂" value={V2} onChange={setV2} unit="L" hint="?" color="#8b5cf6" />
          </>}
          {law === 'charles' && <>
            <Field label="V₁" value={V1} onChange={setV1} unit="L" hint="?" color="#8b5cf6" />
            <Field label="T₁" value={T1} onChange={setT1} unit="K" hint="?" color="#8b5cf6" />
            <Field label="V₂" value={V2} onChange={setV2} unit="L" hint="?" color="#8b5cf6" />
            <Field label="T₂" value={T2} onChange={setT2} unit="K" hint="?" color="#8b5cf6" />
          </>}
          {law === 'gayLussac' && <>
            <Field label="P₁" value={P1} onChange={setP1} unit="bar" hint="?" color="#8b5cf6" />
            <Field label="T₁" value={T1} onChange={setT1} unit="K" hint="?" color="#8b5cf6" />
            <Field label="P₂" value={P2} onChange={setP2} unit="bar" hint="?" color="#8b5cf6" />
            <Field label="T₂" value={T2} onChange={setT2} unit="K" hint="?" color="#8b5cf6" />
          </>}
        </div>

        <button onClick={calculate} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background:'#8b5cf6', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'-0.01em', transition:'background 0.15s' }}
          onMouseEnter={e=>e.target.style.background='#7c3aed'} onMouseLeave={e=>e.target.style.background='#8b5cf6'}>
          Solve
        </button>

        {error && <div style={{ marginTop:14, background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:12, padding:'14px 18px', color:'#be123c', fontSize:13, fontWeight:600 }}>{error}</div>}

        {result && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
            style={{ marginTop:16, background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1px solid #ddd6fe', borderRadius:16, padding:'22px 28px', textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:'#7c3aed', marginBottom:8 }}>✓ {result.law}</div>
            <div style={{ fontSize:14, color:'#6b7280', marginBottom:6 }}>The value of <strong style={{ color:'#5b21b6' }}>{result.variable}</strong> is</div>
            <div style={{ fontSize:40, fontWeight:900, color:'#111827', letterSpacing:'-0.03em', lineHeight:1 }}>{result.value}</div>
            <div style={{ fontSize:14, color:'#8b5cf6', fontWeight:700, marginTop:6 }}>{result.unit}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
