/**
 * MoleculeBuilderPage.jsx — Route: /molecule-builder
 *
 * Compact three-panel layout:
 *   Left (260px)  → AtomBuilder (element picker + bond creator)
 *   Center        → MoleculeViewer (3D R3F canvas)
 *   Right (240px) → MoleculeInfoPanel (VSEPR properties)
 *
 * Panels stack below the canvas on mobile (<900px).
 * VSEPR is recalculated on every atoms/bonds change via useMemo.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import AtomBuilder from '../components/MoleculeBuilder/AtomBuilder';
import MoleculeViewer from '../components/MoleculeBuilder/MoleculeViewer';
import MoleculeInfoPanel from '../components/MoleculeBuilder/MoleculeInfoPanel';
import { calculateVSEPR } from '../lib/vsepr';

export default function MoleculeBuilderPage() {
  const [atoms, setAtoms] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [centralAtomId, setCentralAtomId] = useState(null);
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const isMobile = windowWidth < 900;

  // VSEPR recalculation — pure function, zero side-effects
  const vsepResult = useMemo(() => {
    if (atoms.length === 0) return null;
    return calculateVSEPR(atoms, bonds, centralAtomId);
  }, [atoms, bonds, centralAtomId]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 61px)',
      background: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Compact header bar ─────────────────────────────────────────────── */}
      <div style={{
        height: 52,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
            <circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><circle cx="12" cy="17" r="3" />
            <line x1="10.5" y1="9.5" x2="13.5" y2="9.5" />
            <line x1="9" y1="10.5" x2="11" y2="14.8" />
            <line x1="15" y1="10.5" x2="13" y2="14.8" />
          </svg>
        </div>

        {/* Title */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Molecule Builder
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
            VSEPR geometry · real-time 3D
          </div>
        </div>

        {/* Live formula pill */}
        {vsepResult?.molecularFormula && (
          <motion.div
            key={vsepResult.molecularFormula}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              marginLeft: 'auto',
              padding: '4px 14px', borderRadius: 999,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff', fontSize: 14, fontWeight: 800,
              letterSpacing: '-0.01em',
              boxShadow: '0 3px 10px rgba(99,102,241,0.28)',
            }}
          >
            {vsepResult.molecularFormula}
          </motion.div>
        )}

        {/* Geometry badge (in header on mobile) */}
        {vsepResult?.molecularGeometry && vsepResult.molecularGeometry !== '—' && !isMobile && (
          <motion.div
            key={vsepResult.molecularGeometry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '3px 12px', borderRadius: 999,
              background: '#eff6ff', color: '#3730a3',
              fontSize: 12, fontWeight: 700, border: '1px solid #c7d2fe',
            }}
          >
            {vsepResult.molecularGeometry}
            {vsepResult.bondAngle && (
              <span style={{ fontWeight: 400, marginLeft: 5, opacity: 0.7 }}>
                ~{vsepResult.bondAngle}°
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Three-panel body ────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : '280px 1fr 280px',
        width: '100%',
        minHeight: isMobile ? undefined : 'calc(100vh - 52px - 61px)', // Approximate header/nav subtraction
      }}>

        {/* LEFT — AtomBuilder */}
        <div style={{
          borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          borderBottom: isMobile ? '1px solid #e2e8f0' : 'none',
          background: '#ffffff',
          padding: '14px 14px',
          order: isMobile ? 1 : undefined,
        }}
        className="hide-scrollbar"
        >
          <AtomBuilder
            atoms={atoms}
            bonds={bonds}
            centralAtomId={centralAtomId}
            onAtomsChange={setAtoms}
            onBondsChange={setBonds}
            onCentralAtomChange={setCentralAtomId}
          />
        </div>

        {/* CENTER — 3D Canvas */}
        <div style={{
          position: 'relative',
          background: '#0f172a',
          order: isMobile ? 0 : undefined,
          minHeight: isMobile ? '60vw' : undefined,
        }}>
          <MoleculeViewer
            atoms={atoms}
            bonds={bonds}
            vsepResult={vsepResult || {
              atomPositions: {}, lonePositions: [], bondDipoles: [], centralAtomId: null,
            }}
            showLonePairs={showLonePairs}
          />

          {/* Geometry overlay badge (desktop) — shown on canvas */}
          {vsepResult?.molecularGeometry && vsepResult.molecularGeometry !== '—' && (
            <motion.div
              key={vsepResult.molecularGeometry}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute', top: 12, left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 14px', borderRadius: 999,
                background: 'rgba(99,102,241,0.88)',
                backdropFilter: 'blur(8px)',
                color: '#fff', fontSize: 12, fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.18)',
                whiteSpace: 'nowrap', zIndex: 10,
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              }}
            >
              {vsepResult.molecularGeometry}
              {vsepResult.bondAngle && (
                <span style={{ opacity: 0.75, marginLeft: 7, fontWeight: 400 }}>
                  ~{vsepResult.bondAngle}°
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* RIGHT — Info Panel */}
        <div style={{
          borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
          borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
          background: '#ffffff',
          padding: '14px 14px',
          order: isMobile ? 2 : undefined,
        }}
        className="hide-scrollbar"
        >
          <MoleculeInfoPanel
            vsepResult={vsepResult}
            atoms={atoms}
            bonds={bonds}
            showLonePairs={showLonePairs}
            onToggleLonePairs={() => setShowLonePairs(v => !v)}
          />
        </div>

      </div>
    </div>
  );
}
