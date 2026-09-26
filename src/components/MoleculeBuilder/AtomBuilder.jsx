/**
 * AtomBuilder.jsx — Left panel for the Molecule Builder
 * ═══════════════════════════════════════════════════════
 * Features:
 *  - Searchable element picker + quantity spinner (add N×3 at once)
 *  - Atom list with removal controls + click-to-set-central
 *  - Bond creator (atom A → atom B, bond order)
 *  - Bond list with removal
 *  - Example loader + Clear all
 */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import elementsData from '../../data/elements.json';
import { getValenceElectrons } from '../../lib/vsepr';

// ── Pre-process elements ──────────────────────────────────────────────────────
const ALL_ELEMENTS = elementsData.elements.map(el => ({
  ...el,
  valenceElectrons: getValenceElectrons(el),
  electronegativity: el.electronegativity_pauling ?? null,
  atomicRadius: el['atomic_radius'] ?? el.radius ?? 100,
  atomicMass: el.atomic_mass,
}));

// ── Starter examples ──────────────────────────────────────────────────────────
const EXAMPLES = [
  {
    name: 'Water (H₂O)',
    atoms: [{ symbol: 'O' }, { symbol: 'H' }, { symbol: 'H' }],
    bonds: [{ aIdx: 0, bIdx: 1, order: 1 }, { aIdx: 0, bIdx: 2, order: 1 }],
  },
  {
    name: 'Ammonia (NH₃)',
    atoms: [{ symbol: 'N' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }],
    bonds: [{ aIdx: 0, bIdx: 1, order: 1 }, { aIdx: 0, bIdx: 2, order: 1 }, { aIdx: 0, bIdx: 3, order: 1 }],
  },
  {
    name: 'Methane (CH₄)',
    atoms: [{ symbol: 'C' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }],
    bonds: [
      { aIdx: 0, bIdx: 1, order: 1 }, { aIdx: 0, bIdx: 2, order: 1 },
      { aIdx: 0, bIdx: 3, order: 1 }, { aIdx: 0, bIdx: 4, order: 1 },
    ],
  },
  {
    name: 'Carbon Dioxide (CO₂)',
    atoms: [{ symbol: 'C' }, { symbol: 'O' }, { symbol: 'O' }],
    bonds: [{ aIdx: 0, bIdx: 1, order: 2 }, { aIdx: 0, bIdx: 2, order: 2 }],
  },
  {
    name: 'BF₃',
    atoms: [{ symbol: 'B' }, { symbol: 'F' }, { symbol: 'F' }, { symbol: 'F' }],
    bonds: [{ aIdx: 0, bIdx: 1, order: 1 }, { aIdx: 0, bIdx: 2, order: 1 }, { aIdx: 0, bIdx: 3, order: 1 }],
  },
  {
    name: 'PCl₅',
    atoms: [{ symbol: 'P' }, ...Array(5).fill({ symbol: 'Cl' })],
    bonds: Array.from({ length: 5 }, (_, i) => ({ aIdx: 0, bIdx: i + 1, order: 1 })),
  },
  {
    name: 'SF₆',
    atoms: [{ symbol: 'S' }, ...Array(6).fill({ symbol: 'F' })],
    bonds: Array.from({ length: 6 }, (_, i) => ({ aIdx: 0, bIdx: i + 1, order: 1 })),
  },
];

// ── UID generators ────────────────────────────────────────────────────────────
let uidCounter = 0;
const uid = () => `atom-${++uidCounter}-${Date.now()}`;
let bondCounter = 0;
const bondUid = () => `bond-${++bondCounter}-${Date.now()}`;

function getElementBySymbol(s) {
  return ALL_ELEMENTS.find(e => e.symbol === s) || null;
}

function buildAtomObj(symbol) {
  const el = getElementBySymbol(symbol);
  if (!el) return null;
  return {
    id: uid(),
    symbol: el.symbol,
    name: el.name,
    atomicMass: el.atomicMass,
    electronegativity: el.electronegativity,
    valenceElectrons: el.valenceElectrons,
    atomicRadius: el.atomicRadius,
    group: el.group,
  };
}

// ── Tiny shared styles ────────────────────────────────────────────────────────
const S = {
  input: {
    width: '100%', padding: '9px 12px',
    borderRadius: 8, border: '1px solid #e2e8f0',
    fontSize: 14, color: '#0f172a', background: '#f8fafc',
    outline: 'none', fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  select: {
    padding: '9px 12px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14,
    color: '#0f172a', background: '#f8fafc',
    outline: 'none', fontFamily: "'Inter', sans-serif",
    cursor: 'pointer', width: '100%', boxSizing: 'border-box',
  },
  sectionLabel: {
    fontSize: 12, fontWeight: 800, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8,
  },
};

function SmallBtn({ onClick, children, color = '#6366f1', outline = false, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: outline
          ? (hov ? `${color}18` : 'transparent')
          : (hov ? color : `${color}22`),
        color: hov && !outline ? '#fff' : color,
        border: `1px solid ${hov ? color : `${color}44`}`,
        borderRadius: 7, padding: '5px 11px',
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.13s', whiteSpace: 'nowrap',
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function XBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#fee2e2' : 'transparent',
        color: hov ? '#dc2626' : '#cbd5e1',
        border: 'none', borderRadius: 5,
        width: 20, height: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.13s', flexShrink: 0, padding: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AtomBuilder({ atoms, bonds, centralAtomId, onAtomsChange, onBondsChange, onCentralAtomChange }) {
  const [search, setSearch] = useState('');
  const [qty, setQty] = useState(1);
  const [bondAtomA, setBondAtomA] = useState('');
  const [bondAtomB, setBondAtomB] = useState('');
  const [bondOrder, setBondOrder] = useState(1);
  const [showExamples, setShowExamples] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredElements = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_ELEMENTS.filter(e =>
      e.symbol.toLowerCase().startsWith(q) || e.name.toLowerCase().startsWith(q)
    ).slice(0, 10);
  }, [search]);

  // ── Add N atoms of a given symbol ─────────────────────────────────────────
  const handleAddAtom = (symbolOverride) => {
    const symbol = typeof symbolOverride === 'string' ? symbolOverride : search.trim();
    if (!symbol) return;
    
    const el = ALL_ELEMENTS.find(e => e.symbol.toLowerCase() === symbol.toLowerCase() || e.name.toLowerCase() === symbol.toLowerCase());
    if (!el) return;

    const count = Math.max(1, Math.min(20, Number(qty) || 1));
    const newAtoms = [];
    for (let i = 0; i < count; i++) {
      const atom = buildAtomObj(el.symbol);
      if (atom) newAtoms.push(atom);
    }
    
    onAtomsChange([...atoms, ...newAtoms]);
    
    // Auto-bonding logic
    if (atoms.length > 0) {
      const central = atoms[0];
      const newBonds = newAtoms.map(newAtom => {
        let order = 1;
        if (central.symbol === 'C' && newAtom.symbol === 'O') order = 2;
        return {
          id: bondUid(),
          atomA: central.id,
          atomB: newAtom.id,
          order
        };
      });
      onBondsChange([...bonds, ...newBonds]);
    }

    setSearch('');
    setQty(1);
    setIsDropdownOpen(false);
  };

  const handleRemoveAtom = (id) => {
    onAtomsChange(atoms.filter(a => a.id !== id));
    onBondsChange(bonds.filter(b => b.atomA !== id && b.atomB !== id));
    if (centralAtomId === id) onCentralAtomChange(null);
  };

  const handleAddBond = () => {
    if (!bondAtomA || !bondAtomB || bondAtomA === bondAtomB) return;
    const exists = bonds.some(
      b => (b.atomA === bondAtomA && b.atomB === bondAtomB) ||
           (b.atomA === bondAtomB && b.atomB === bondAtomA)
    );
    if (exists) return;
    onBondsChange([...bonds, {
      id: bondUid(), atomA: bondAtomA, atomB: bondAtomB, order: Number(bondOrder),
    }]);
    setBondAtomA('');
    setBondAtomB('');
  };

  const handleRemoveBond = (id) => onBondsChange(bonds.filter(b => b.id !== id));

  const handleLoadExample = (ex) => {
    const newAtoms = ex.atoms.map(a => buildAtomObj(a.symbol)).filter(Boolean);
    const newBonds = ex.bonds.map(b => ({
      id: bondUid(),
      atomA: newAtoms[b.aIdx]?.id,
      atomB: newAtoms[b.bIdx]?.id,
      order: b.order,
    })).filter(b => b.atomA && b.atomB);
    onAtomsChange(newAtoms);
    onBondsChange(newBonds);
    onCentralAtomChange(null);
    setShowExamples(false);
  };

  const handleClear = () => {
    onAtomsChange([]);
    onBondsChange([]);
    onCentralAtomChange(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'Inter', sans-serif" }}>

      {/* ── ADD ATOM ──────────────────────────────────────────────── */}
      <div>
        <div style={S.sectionLabel}>Add Atom</div>

        {/* Search + Qty + Add row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
          {/* Search input with dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative', flex: 1 }}>
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddAtom();
                }
              }}
              placeholder="Element (e.g. N, Oxygen)"
              style={S.input}
            />
            {filteredElements.length > 0 && search.trim() && isDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 9, boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                zIndex: 200, maxHeight: 220, overflowY: 'auto', marginTop: 3,
              }}>
                {filteredElements.map(el => (
                  <div
                    key={el.symbol}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearch(el.symbol);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      padding: '9px 12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      borderBottom: '1px solid #f1f5f9',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 6, background: '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13, color: '#3b82f6', flexShrink: 0,
                    }}>
                      {el.symbol}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{el.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        #{el.number} · V={el.valenceElectrons} · EN={el.electronegativity ?? '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quantity spinner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>×</span>
            <input
              type="number"
              min={1}
              max={20}
              value={qty}
              onChange={e => setQty(Math.max(1, Math.min(20, Number(e.target.value))))}
              style={{
                ...S.input, width: 50, textAlign: 'center',
                padding: '9px 6px', fontWeight: 700,
              }}
              title="How many atoms to add"
            />
          </div>
        </div>

        {/* Explicit Add Button */}
        <div style={{ marginTop: 8 }}>
          <SmallBtn onClick={handleAddAtom} style={{ width: '100%', padding: '9px', fontSize: 14 }}>
            Add Atom{qty > 1 ? 's' : ''} to Canvas
          </SmallBtn>
        </div>

        {/* Hint text */}
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, textAlign: 'center' }}>
          New atoms automatically bond to the first atom.
        </div>
      </div>

      {/* ── ATOM LIST ─────────────────────────────────────────────── */}
      {atoms.length > 0 && (
        <div>
          <div style={S.sectionLabel}>Atoms ({atoms.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {atoms.map((atom, i) => (
              <div
                key={atom.id}
                onClick={() => onCentralAtomChange(centralAtomId === atom.id ? null : atom.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                  background: centralAtomId === atom.id ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${centralAtomId === atom.id ? '#93c5fd' : '#e2e8f0'}`,
                  transition: 'all 0.13s',
                }}
                title="Click to set/unset as central atom"
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: centralAtomId === atom.id ? '#3b82f6' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 10,
                  color: centralAtomId === atom.id ? '#fff' : '#64748b',
                  flexShrink: 0, transition: 'all 0.13s',
                }}>
                  {atom.symbol}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                    {i + 1}. {atom.name}
                  </span>
                  {centralAtomId === atom.id && (
                    <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 700, marginLeft: 5 }}>★</span>
                  )}
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>
                    {atom.atomicMass?.toFixed(1)} g/mol
                  </div>
                </div>
                <XBtn onClick={e => { e.stopPropagation(); handleRemoveAtom(atom.id); }} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 5 }}>
            💡 Click atom to set as central (★)
          </div>
        </div>
      )}

      {/* ── ADD BOND ──────────────────────────────────────────────── */}
      {atoms.length >= 2 && (
        <div>
          <div style={S.sectionLabel}>Add Bond</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Atom A + Atom B */}
            <div style={{ display: 'flex', gap: 5 }}>
              <select value={bondAtomA} onChange={e => setBondAtomA(e.target.value)} style={S.select}>
                <option value="">Atom A</option>
                {atoms.map((a, i) => (
                  <option key={a.id} value={a.id}>{i + 1}. {a.symbol} ({a.name})</option>
                ))}
              </select>
              <select
                value={bondAtomB}
                onChange={e => setBondAtomB(e.target.value)}
                style={S.select}
              >
                <option value="">Atom B</option>
                {atoms.filter(a => a.id !== bondAtomA).map((a) => {
                  const idx = atoms.indexOf(a);
                  return <option key={a.id} value={a.id}>{idx + 1}. {a.symbol} ({a.name})</option>;
                })}
              </select>
            </div>
            {/* Bond order + Add button */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <select value={bondOrder} onChange={e => setBondOrder(Number(e.target.value))} style={{ ...S.select, flex: 1 }}>
                <option value={1}>Single (—)</option>
                <option value={2}>Double (═)</option>
                <option value={3}>Triple (≡)</option>
              </select>
              <SmallBtn onClick={handleAddBond} color="#6366f1" style={{ flex: '0 0 auto' }}>
                + Bond
              </SmallBtn>
            </div>
          </div>
        </div>
      )}

      {/* ── BOND LIST ─────────────────────────────────────────────── */}
      {bonds.length > 0 && (
        <div>
          <div style={S.sectionLabel}>Bonds ({bonds.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {bonds.map(bond => {
              const aA = atoms.find(a => a.id === bond.atomA);
              const aB = atoms.find(a => a.id === bond.atomB);
              const orderLabel = ['', '—', '═', '≡'][bond.order] || '—';
              return (
                <div key={bond.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px', borderRadius: 7,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                }}>
                  <span style={{ fontSize: 12, color: '#0f172a', flex: 1, fontWeight: 500 }}>
                    {aA?.symbol ?? '?'} {orderLabel} {aB?.symbol ?? '?'}
                    <span style={{ color: '#94a3b8', fontSize: 11, marginLeft: 5 }}>
                      ({bond.order === 1 ? 'single' : bond.order === 2 ? 'double' : 'triple'})
                    </span>
                  </span>
                  <XBtn onClick={() => handleRemoveBond(bond.id)} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── EXAMPLES + CLEAR ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <SmallBtn onClick={() => setShowExamples(v => !v)} color="#0369a1">
            {showExamples ? 'Hide' : '⚗️ Examples'}
          </SmallBtn>
          {atoms.length > 0 && (
            <SmallBtn onClick={handleClear} color="#ef4444">🗑 Clear</SmallBtn>
          )}
        </div>

        {showExamples && (
          <div style={{
            background: '#f8fafc', borderRadius: 10,
            border: '1px solid #e2e8f0', padding: '8px 10px',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            {EXAMPLES.map(ex => (
              <div
                key={ex.name}
                onClick={() => handleLoadExample(ex)}
                style={{
                  padding: '6px 8px', borderRadius: 6,
                  cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  color: '#0f172a', transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {ex.name}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
