import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// PARSER  — turns a formula string like "Ca(OH)2" into { Ca:1, O:2, H:2 }
// ─────────────────────────────────────────────────────────────────────────────
function parseFormula(formula) {
  // Normalise: 2H → H×2 is already expressed as H2, no change needed
  const stack = [{}];

  const merge = (target, src, mult) => {
    for (const el in src) target[el] = (target[el] || 0) + src[el] * mult;
  };

  let i = 0;
  while (i < formula.length) {
    const ch = formula[i];

    if (ch === '(') {
      stack.push({});
      i++;
    } else if (ch === ')') {
      i++;
      let numStr = '';
      while (i < formula.length && /\d/.test(formula[i])) { numStr += formula[i]; i++; }
      const mult = numStr ? parseInt(numStr) : 1;
      const top = stack.pop();
      merge(stack[stack.length - 1], top, mult);
    } else if (/[A-Z]/.test(ch)) {
      // Element symbol: one uppercase + optional lowercase letters
      let sym = ch; i++;
      while (i < formula.length && /[a-z]/.test(formula[i])) { sym += formula[i]; i++; }
      let numStr = '';
      while (i < formula.length && /\d/.test(formula[i])) { numStr += formula[i]; i++; }
      const count = numStr ? parseInt(numStr) : 1;
      const top = stack[stack.length - 1];
      top[sym] = (top[sym] || 0) + count;
    } else {
      i++; // skip unexpected chars
    }
  }
  return stack[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// GCD / LCM helpers
// ─────────────────────────────────────────────────────────────────────────────
function gcd(a, b) { return b === 0 ? Math.abs(a) : gcd(b, a % b); }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
function gcdArr(arr) { return arr.reduce((g, v) => gcd(g, v)); }

// ─────────────────────────────────────────────────────────────────────────────
// EQUATION BALANCER  — pure integer matrix approach
//
// Given: aA + bB → cC + dD  (any number of species)
// Build matrix M where M[element][compound] = count (negative for products).
// Find null vector of M over the rationals, then make it integer.
// We implement Gaussian elimination with fraction arithmetic.
// ─────────────────────────────────────────────────────────────────────────────

// Fraction: { n: numerator, d: denominator }
const F = (n, d = 1) => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  return { n: n / g, d: d / g };
};
const fadd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fsub = (a, b) => fadd(a, F(-b.n, b.d));
const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => fmul(a, F(b.d, b.n));
const fzero = (a) => a.n === 0;
const fneg = (a) => F(-a.n, a.d);

function balanceEquation(input) {
  // ── 1. Split on = or → or -> or ⇒
  const raw = input.trim().replace(/\s+/g, '');
  const sepMatch = raw.match(/→|->|⇒|=/);
  if (!sepMatch) return { error: 'No reaction arrow found (use = or →)' };

  const sep = sepMatch[0];
  const sepIdx = raw.indexOf(sep);
  const lhsRaw = raw.slice(0, sepIdx);
  const rhsRaw = raw.slice(sepIdx + sep.length);

  const lhsTerms = lhsRaw.split('+').filter(Boolean);
  const rhsTerms = rhsRaw.split('+').filter(Boolean);
  const allTerms = [...lhsTerms, ...rhsTerms];
  const n = allTerms.length; // number of compounds

  if (n < 2) return { error: 'Need at least two compounds.' };

  // ── 2. Parse each formula
  let compounds;
  try {
    compounds = allTerms.map(t => parseFormula(t));
  } catch {
    return { error: 'Could not parse one or more formulas.' };
  }

  // ── 3. Collect all elements
  const elemSet = new Set();
  compounds.forEach(c => Object.keys(c).forEach(e => elemSet.add(e)));
  const elements = [...elemSet];
  const m = elements.length; // number of elements (rows)

  // ── 4. Build matrix (m rows × n cols)
  //    reactant compounds get positive sign, product compounds get negative
  const isProduct = allTerms.map((_, i) => i >= lhsTerms.length);
  const mat = elements.map((el, r) =>
    allTerms.map((_, c) => {
      const count = compounds[c][el] || 0;
      return F(isProduct[c] ? -count : count);
    })
  );

  // ── 5. Gaussian elimination to reduced row echelon form
  // We work on an augmented system (mat | I_n) — actually we just want the null space.
  // Easier: just do RREF on mat, then back-substitute with last variable = 1.

  // rows = m, cols = n
  const rows = m, cols = n;
  const A = mat.map(r => [...r]); // copy
  let pivotCols = [];
  let row = 0;

  for (let col = 0; col < cols && row < rows; col++) {
    // Find pivot
    let pivotRow = -1;
    for (let r = row; r < rows; r++) {
      if (!fzero(A[r][col])) { pivotRow = r; break; }
    }
    if (pivotRow === -1) continue;
    // Swap
    [A[row], A[pivotRow]] = [A[pivotRow], A[row]];
    // Scale pivot row
    const piv = A[row][col];
    for (let c = 0; c < cols; c++) A[row][c] = fdiv(A[row][c], piv);
    // Eliminate column
    for (let r = 0; r < rows; r++) {
      if (r === row || fzero(A[r][col])) continue;
      const factor = A[r][col];
      for (let c = 0; c < cols; c++) A[r][c] = fsub(A[r][c], fmul(factor, A[row][c]));
    }
    pivotCols.push(col);
    row++;
  }

  // ── 6. Find free variables (non-pivot columns)
  const pivotSet = new Set(pivotCols);
  const freeCols = [];
  for (let c = 0; c < cols; c++) if (!pivotSet.has(c)) freeCols.push(c);

  if (freeCols.length === 0) return { error: 'Equation may already be balanced or is ill-formed.' };

  // Set free variable = 1, solve for pivot variables
  const freeCol = freeCols[0];
  const sol = Array(cols).fill(F(0));
  sol[freeCol] = F(1);

  for (let r = pivotCols.length - 1; r >= 0; r--) {
    const pc = pivotCols[r];
    let val = F(0);
    for (let c = 0; c < cols; c++) {
      if (c === pc) continue;
      val = fadd(val, fmul(A[r][c], sol[c]));
    }
    sol[pc] = fneg(val);
  }

  // ── 7. Convert to positive integers
  // Negate if any are negative (shouldn't happen but just in case)
  if (sol.some(f => f.n < 0)) sol.forEach((f, i) => sol[i] = fneg(f));

  // LCM of denominators to clear fractions
  const denom_lcm = sol.reduce((l, f) => lcm(l, f.d), 1);
  const intSol = sol.map(f => (f.n * denom_lcm) / f.d);

  // Divide by GCD to get smallest integers
  const g = gcdArr(intSol.filter(v => v !== 0));
  const coeffs = intSol.map(v => v / g);

  if (coeffs.some(c => c <= 0)) return { error: 'Could not find positive integer solution.' };

  return {
    lhsTerms,
    rhsTerms,
    coeffs,        // indexed same as allTerms
    elements,
    compounds,
    isProduct,
    allTerms,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Render a formula with proper subscript notation
// ─────────────────────────────────────────────────────────────────────────────
function FormulaText({ formula, coeff }) {
  // Turn digits after elements/closing-parens into <sub>
  const parts = [];
  let s = formula;
  const re = /([A-Z][a-z]?|\)|\(|\d+)/g;
  let last = 0, m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push({ type: 'text', val: s.slice(last, m.index) });
    if (/^\d+$/.test(m[0]) && m.index > 0 && /[A-Za-z)]/.test(s[m.index - 1])) {
      parts.push({ type: 'sub', val: m[0] });
    } else {
      parts.push({ type: 'text', val: m[0] });
    }
    last = re.lastIndex;
  }
  if (last < s.length) parts.push({ type: 'text', val: s.slice(last) });

  return (
    <span style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 18, fontWeight: 700, color: '#111827' }}>
      {coeff && coeff !== 1 && <span style={{ color: '#4f46e5' }}>{coeff}</span>}
      {parts.map((p, i) =>
        p.type === 'sub'
          ? <sub key={i} style={{ fontSize: '0.65em', verticalAlign: 'sub' }}>{p.val}</sub>
          : <span key={i}>{p.val}</span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────
const EXAMPLES = [
  'H2 + O2 = H2O',
  'Fe + O2 = Fe2O3',
  'CH4 + O2 = CO2 + H2O',
  'N2 + H2 = NH3',
  'Ca(OH)2 + HCl = CaCl2 + H2O',
  'C3H8 + O2 = CO2 + H2O',
  'KMnO4 + HCl = MnCl2 + KCl + H2O + Cl2',
  'Al + H2SO4 = Al2(SO4)3 + H2',
];

export default function EquationBalancer() {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  const handleBalance = (eq) => {
    const input = eq ?? equation;
    if (!input.trim()) return;
    const r = balanceEquation(input);
    setResult(r);
    setShowSteps(false);
  };

  const tryExample = (ex) => {
    setEquation(ex);
    const r = balanceEquation(ex);
    setResult(r);
    setShowSteps(false);
  };

  const isError = result && result.error;
  const isOk = result && !result.error;

  return (
    <div style={{
      width: '100%', maxWidth: 760,
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #fecdd3, #fda4af)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(248,113,113,0.25)',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
          Equation Balancer
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          Enter any chemical equation — balanced automatically using algebraic stoichiometry.
        </p>
      </div>

      {/* Main card */}
      <div style={{
        background: '#ffffff', borderRadius: 24, border: '1px solid #e5e7eb',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        <div style={{ padding: '28px 32px 32px' }}>

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); handleBalance(); }} style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={equation}
              onChange={e => { setEquation(e.target.value); setResult(null); }}
              placeholder="e.g.  Ca(OH)2 + HCl = CaCl2 + H2O"
              style={{
                flex: '1 1 200px', border: '1.5px solid #e5e7eb', borderRadius: 12,
                padding: '13px 16px', fontSize: 15, color: '#111827',
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                outline: 'none', transition: 'border-color 0.15s', background: '#fafafa',
                minWidth: 200,
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="submit"
              style={{
                background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12,
                padding: '13px 26px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', transition: 'background 0.15s',
                whiteSpace: 'nowrap', flex: '1 1 auto',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
            >
              Balance
            </button>
          </form>

          {/* Examples */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, display: 'flex', alignItems: 'center', marginRight: 2 }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => tryExample(ex)}
                style={{
                  background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8,
                  padding: '4px 10px', fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#4f46e5', cursor: 'pointer', fontWeight: 600, transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {isError && (
              <motion.div key="err"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16,
                  padding: '20px 24px', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d97706', marginBottom: 8 }}>
                  ⚠ Error
                </div>
                <p style={{ color: '#92400e', fontSize: 13, margin: 0 }}>{result.error}</p>
              </motion.div>
            )}

            {isOk && (
              <motion.div key="ok"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Balanced Equation Display */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1px solid #bbf7d0', borderRadius: 16, padding: '24px 28px', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#16a34a', marginBottom: 16 }}>
                    ✓ Balanced Equation
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                    {result.lhsTerms.map((term, i) => (
                      <React.Fragment key={`l${i}`}>
                        {i > 0 && <span style={{ fontSize: 20, color: '#6b7280', fontWeight: 600 }}>+</span>}
                        <FormulaText formula={term} coeff={result.coeffs[i]} />
                      </React.Fragment>
                    ))}
                    <span style={{ fontSize: 22, color: '#6b7280', fontWeight: 500, margin: '0 4px' }}>→</span>
                    {result.rhsTerms.map((term, i) => {
                      const idx = result.lhsTerms.length + i;
                      return (
                        <React.Fragment key={`r${i}`}>
                          {i > 0 && <span style={{ fontSize: 20, color: '#6b7280', fontWeight: 600 }}>+</span>}
                          <FormulaText formula={term} coeff={result.coeffs[idx]} />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Toggle Step-by-Step */}
                <button
                  onClick={() => setShowSteps(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: '1px solid #e5e7eb',
                    borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600,
                    color: '#6366f1', cursor: 'pointer', marginBottom: 12, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 16 }}>{showSteps ? '▴' : '▾'}</span>
                  {showSteps ? 'Hide' : 'Show'} Step-by-Step Working
                </button>

                <AnimatePresence>
                  {showSteps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <StepByStep result={result} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step-by-Step Panel
// ─────────────────────────────────────────────────────────────────────────────
function StepByStep({ result }) {
  const { lhsTerms, rhsTerms, coeffs, elements, compounds, isProduct, allTerms } = result;

  const Step = ({ num, title, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#6366f1', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, flexShrink: 0,
        }}>{num}</div>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{
      background: '#f8faff', border: '1px solid #e0e7ff',
      borderRadius: 16, padding: '24px 28px',
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 20 }}>
        Step-by-Step Working
      </div>

      <Step num={1} title="Identify all compounds and elements">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {allTerms.map((t, i) => (
            <div key={i} style={{
              background: isProduct[i] ? '#fdf4ff' : '#f0f9ff',
              border: `1px solid ${isProduct[i] ? '#e9d5ff' : '#bae6fd'}`,
              borderRadius: 10, padding: '8px 14px',
              fontSize: 13, color: '#374151',
            }}>
              <span style={{ fontWeight: 700, color: isProduct[i] ? '#9333ea' : '#0369a1', marginRight: 4 }}>
                {isProduct[i] ? 'Product' : 'Reactant'}:
              </span>
              <code>{t}</code>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                {Object.entries(compounds[i]).map(([el, cnt]) => `${el}: ${cnt}`).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </Step>

      <Step num={2} title="Build element count table (reactants – products = 0)">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left', background: '#e0e7ff', borderRadius: '8px 0 0 0', fontWeight: 700, color: '#3730a3' }}>Element</th>
                {allTerms.map((t, i) => (
                  <th key={i} style={{ padding: '8px 12px', textAlign: 'center', background: '#e0e7ff', fontWeight: 700, color: isProduct[i] ? '#9333ea' : '#0369a1' }}>
                    {isProduct[i] ? '–' : '+'}{t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {elements.map((el, r) => (
                <tr key={el} style={{ background: r % 2 === 0 ? '#fff' : '#f8f9ff' }}>
                  <td style={{ padding: '7px 12px', fontWeight: 700, color: '#374151' }}>{el}</td>
                  {allTerms.map((_, c) => (
                    <td key={c} style={{ padding: '7px 12px', textAlign: 'center', color: '#374151', fontFamily: 'monospace' }}>
                      {isProduct[c] ? '–' : ''}{compounds[c][el] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Step>

      <Step num={3} title="Solve for integer coefficients">
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ fontSize: 13, color: '#4b5563', marginBottom: 12, lineHeight: 1.6 }}>
            Using Gaussian elimination on the stoichiometry matrix, the smallest positive integer solution is:
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {allTerms.map((t, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#4f46e5', lineHeight: 1 }}>{coeffs[i]}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontFamily: 'monospace' }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </Step>

      <Step num={4} title="Verify atom balance">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {elements.map(el => {
            const lhsCount = lhsTerms.reduce((s, t, i) => s + (compounds[i][el] || 0) * coeffs[i], 0);
            const rhsCount = rhsTerms.reduce((s, t, i) => {
              const idx = lhsTerms.length + i;
              return s + (compounds[idx][el] || 0) * coeffs[idx];
            }, 0);
            const ok = lhsCount === rhsCount;
            return (
              <div key={el} style={{
                background: ok ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 10, padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, color: '#374151' }}>{el}</span>
                <span style={{ fontSize: 13, color: ok ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {lhsCount} = {rhsCount} {ok ? '✓' : '✗'}
                </span>
              </div>
            );
          })}
        </div>
      </Step>
    </div>
  );
}
