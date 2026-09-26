import React, { useState } from 'react';

const C = {
  indigo: '#6366f1', indigoDark: '#4f46e5', indigoLight: '#e0e7ff',
  text: '#111827', sub: '#6b7280', border: '#e5e7eb', white: '#ffffff',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

const FORMULA_DATA = {
  NCERT: [
    { title: 'Mole Concept', formulas: ['n = m / M', 'N = n × N_A', 'Molarity (M) = n / V (L)'] },
    { title: 'Thermodynamics', formulas: ['ΔU = q + w', 'ΔH = ΔU + pΔV', 'ΔG = ΔH - TΔS'] },
    { title: 'Equilibrium', formulas: ['K_c = [Products] / [Reactants]', 'pH = -log[H+]', 'pOH = -log[OH-]'] },
    { title: 'Electrochemistry', formulas: ['E_cell = E°_cell - (0.0591/n)log(Q)', 'ΔG° = -nFE°_cell'] },
  ],
  IB: [
    { title: 'Stoichiometry', formulas: ['n = m / M', 'c = n / V', 'pV = nRT'] },
    { title: 'Kinetics', formulas: ['Rate = k[A]^m[B]^n', 'k = A e^(-Ea/RT)'] },
    { title: 'Acids and Bases', formulas: ['pH + pOH = 14', 'K_w = [H+][OH-] = 1.0 x 10^-14'] },
    { title: 'Organic Chemistry', formulas: ['IHD = 0.5 * (2c + 2 - h - x + n)'] },
  ],
  AP: [
    { title: 'Gases, Liquids, and Solutions', formulas: ['PV = nRT', 'P_A = P_total × X_A', 'A = εbc (Beer-Lambert)'] },
    { title: 'Thermodynamics / Electrochemistry', formulas: ['q = mcΔT', 'ΔG° = -RT ln K', 'I = q / t'] },
    { title: 'Kinetics', formulas: ['ln[A]_t - ln[A]_0 = -kt', '1/[A]_t - 1/[A]_0 = kt', 't_1/2 = 0.693 / k'] },
  ]
};

export default function FormulaSheetPage() {
  const [board, setBoard] = useState('NCERT');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80 }}>
      
      {/* Hide controls when printing */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white; }
            .print-container { box-shadow: none !important; border: none !important; max-width: 100% !important; }
            .formula-box { break-inside: avoid; }
          }
        `}
      </style>

      <div className="print-container" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: '0 0 10px' }}>
              Formula Sheet Generator
            </h1>
            <p style={{ fontSize: 15, color: C.sub, margin: 0 }}>
              Select your exam board and generate a print-friendly reference sheet.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <select 
              value={board} 
              onChange={(e) => setBoard(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: 12, border: `1px solid ${C.border}`,
                background: C.white, fontSize: 14, fontWeight: 600, color: C.text, outline: 'none'
              }}
            >
              <option value="NCERT">NCERT (CBSE / JEE / NEET)</option>
              <option value="IB">IB Diploma</option>
              <option value="AP">AP Chemistry</option>
            </select>
            
            <button 
              onClick={handlePrint}
              style={{
                padding: '10px 20px', borderRadius: 12, border: 'none',
                background: C.indigo, fontSize: 14, fontWeight: 700, color: C.white, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Print Sheet
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '40px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 40, borderBottom: `2px solid ${C.border}`, paddingBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: C.text, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {board} Chemistry Formula Reference
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {FORMULA_DATA[board].map((section, idx) => (
              <div key={idx} className="formula-box" style={{ background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.indigoDark, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
                  {section.title}
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {section.formulas.map((f, i) => (
                    <li key={i} style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono', monospace", background: C.white, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
