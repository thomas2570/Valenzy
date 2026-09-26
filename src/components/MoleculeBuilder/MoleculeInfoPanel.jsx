/**
 * MoleculeInfoPanel.jsx — Compact right-side VSEPR info panel
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POLARITY_META = {
  'Polar':    { color: '#d97706', bg: '#fffbeb', label: 'Polar',    icon: '⚡' },
  'Nonpolar': { color: '#059669', bg: '#ecfdf5', label: 'Nonpolar', icon: '⚖️' },
  'Complex':  { color: '#7c3aed', bg: '#f5f3ff', label: 'Complex',  icon: '🔬' },
  '—':        { color: '#94a3b8', bg: '#f8fafc', label: '—',        icon: '·' },
};

function InfoRow({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0', borderBottom: '1px solid #f1f5f9', gap: 8,
    }}>
      <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: 14, fontWeight: 700, color: accent || '#0f172a',
        textAlign: 'right', wordBreak: 'break-word',
      }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

function AnimVal({ value }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'block' }}
      >
        {value ?? '—'}
      </motion.span>
    </AnimatePresence>
  );
}

const GEOMETRY_TIPS = {
  'Linear':               '180° — atoms in a straight line.',
  'Trigonal Planar':      '120° — flat triangle arrangement.',
  'Bent':                 '~104–120° — lone pair deflects bonds.',
  'Tetrahedral':          '109.5° — four atoms at tetrahedral corners.',
  'Trigonal Pyramidal':   '107° — three bonds + one lone pair (pyramid).',
  'Trigonal Bipyramidal': '90° / 120° — five bonds, bipyramidal.',
  'Seesaw':               '~102° — four bonds + one lone pair.',
  'T-Shape':              '~90° — three bonds + two lone pairs.',
  'Octahedral':           '90° — six bonds, octahedral.',
  'Square Pyramidal':     '~90° — five bonds + one lone pair.',
  'Square Planar':        '90° — four bonds, flat square.',
};

export default function MoleculeInfoPanel({ vsepResult, atoms, bonds, showLonePairs, onToggleLonePairs }) {
  if (!vsepResult) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', color: '#94a3b8', padding: '24px 8px',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🧪</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>No molecule yet</div>
        <div style={{ fontSize: 11, lineHeight: 1.6 }}>
          Add atoms and bonds — VSEPR properties appear here live.
        </div>
      </div>
    );
  }

  const {
    molecularFormula, electronGeometry, molecularGeometry,
    bondAngle, hybridization, lonePairs, polarity, molarMass,
    warning, error,
  } = vsepResult;

  const polarityMeta = POLARITY_META[polarity] || POLARITY_META['—'];
  const tip = GEOMETRY_TIPS[molecularGeometry] || '';
  const hasData = atoms && atoms.length > 0;
  const hasBonds = bonds && bonds.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: "'Inter', sans-serif" }}>

      {/* Formula + molar mass */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        borderRadius: 12, padding: '14px 14px',
        border: '1px solid #dbeafe', textAlign: 'center',
      }}>
        <motion.div key={molecularFormula} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
          <div style={{ fontSize: hasData ? 30 : 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {molecularFormula || (hasData ? '…' : 'No molecule')}
          </div>
          {molarMass > 0 && (
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              <strong>{molarMass}</strong> g/mol
            </div>
          )}
        </motion.div>
      </div>

      {/* Polarity badge — only when bonds exist */}
      {hasBonds && polarity !== '—' && (
        <motion.div
          key={polarity}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: polarityMeta.bg,
            border: `1.5px solid ${polarityMeta.color}30`,
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <span style={{ fontSize: 22 }}>{polarityMeta.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: polarityMeta.color }}>
              {polarityMeta.label} Molecule
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
              {polarity === 'Polar'
                ? 'Net dipole moment exists.'
                : polarity === 'Nonpolar'
                ? 'Dipoles cancel (symmetric).'
                : 'Complex — polarity undetermined.'}
            </div>
          </div>
        </motion.div>
      )}

      {/* VSEPR Properties table */}
      {hasBonds && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: '12px 14px',
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
            VSEPR Properties
          </div>
          <InfoRow label="Molecular Geometry" value={<AnimVal value={molecularGeometry} />} accent="#6366f1" />
          <InfoRow label="Electron Geometry" value={<AnimVal value={electronGeometry} />} />
          <InfoRow label="Bond Angle" value={bondAngle != null ? `~${bondAngle}°` : '—'} />
          <InfoRow label="Hybridization" value={<AnimVal value={hybridization} />} accent="#0369a1" />
          <InfoRow
            label="Lone Pairs (central)"
            value={lonePairs != null ? (lonePairs === 0 ? '0 (none)' : String(lonePairs)) : '—'}
            accent={lonePairs > 0 ? '#d97706' : undefined}
          />
          <InfoRow label="Atoms" value={atoms?.length ?? 0} />
          <InfoRow label="Bonds" value={bonds?.length ?? 0} />

          {tip && (
            <div style={{
              marginTop: 8, padding: '7px 10px',
              background: '#f8fafc', borderRadius: 8,
              fontSize: 11, color: '#64748b', lineHeight: 1.55,
              border: '1px solid #e2e8f0',
            }}>
              💡 {tip}
            </div>
          )}
        </div>
      )}

      {/* No bonds hint */}
      {!hasBonds && hasData && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 10, padding: '12px 14px',
          fontSize: 14, color: '#92400e', lineHeight: 1.5,
        }}>
          ⚠️ Add bonds between your atoms to calculate VSEPR geometry.
        </div>
      )}

      {/* Lone pair toggle */}
      {hasBonds && lonePairs > 0 && (
        <button
          onClick={onToggleLonePairs}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px',
            background: showLonePairs ? '#eff6ff' : '#f8fafc',
            border: `1px solid ${showLonePairs ? '#93c5fd' : '#e2e8f0'}`,
            borderRadius: 10, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.15s',
          }}
        >
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            background: showLonePairs ? '#3b82f6' : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s', flexShrink: 0,
          }}>
            {showLonePairs && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
            Show lone pair clouds
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#94a3b8' }}>
            {lonePairs} pair{lonePairs !== 1 ? 's' : ''}
          </span>
        </button>
      )}

      {/* Bond dipoles */}
      {vsepResult.bondDipoles?.length > 0 && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: '12px 14px',
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
            Bond Polarity
          </div>
          {vsepResult.bondDipoles.map((d, i) => {
            const aA = atoms?.find(a => a.id === d.atomA);
            const aB = atoms?.find(a => a.id === d.atomB);
            const col = d.polarity === 'ionic' ? '#ef4444' : d.polarity === 'polar' ? '#f59e0b' : '#10b981';
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 0', borderBottom: '1px solid #f1f5f9',
              }}>
                <span style={{ fontSize: 12, color: '#0f172a' }}>
                  {aA?.symbol ?? '?'} — {aB?.symbol ?? '?'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: col, background: `${col}15`, padding: '2px 8px', borderRadius: 999 }}>
                  {d.polarity === 'ionic' ? 'Ionic' : d.polarity === 'polar' ? 'Polar' : 'Nonpolar'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Warning / error */}
      {(warning || error) && (
        <div style={{
          padding: '9px 12px', borderRadius: 10,
          background: error ? '#fef2f2' : '#fffbeb',
          border: `1px solid ${error ? '#fecaca' : '#fde68a'}`,
          fontSize: 11, color: error ? '#b91c1c' : '#92400e', lineHeight: 1.5,
        }}>
          {error ? '❌ ' : '⚠️ '}{error || warning}
        </div>
      )}

    </div>
  );
}
