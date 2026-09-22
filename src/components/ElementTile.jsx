import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

// Colors exactly matching reference site valenzy.app
const CATEGORY_COLORS = {
  'alkali metal':          '#f87171', // red
  'alkaline earth metal':  '#fb923c', // orange
  'transition metal':      '#86efac', // green
  'post-transition metal': '#93c5fd', // blue
  'metalloid':             '#a78bfa', // purple
  'diatomic nonmetal':     '#6ee7b7', // teal
  'polyatomic nonmetal':   '#6ee7b7',
  'halogen':               '#fde047', // yellow
  'noble gas':             '#f9a8d4', // pink
  'lanthanide':            '#fca5a5', // salmon
  'actinide':              '#c084fc', // violet
  'unknown':               '#d1d5db', // gray
};

function getCategoryColor(category) {
  if (!category) return '#d1d5db';
  const c = category.toLowerCase();
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (c.includes(key)) return color;
  }
  return '#d1d5db';
}

// Make pastel version (lighten)
function tileBackground(color, isSelected) {
  if (isSelected) return color;
  return color + '55'; // ~33% opacity
}

export default function ElementTile({ element }) {
  const { state, dispatch } = useAppContext();

  if (!element) return <div style={{ gridColumn: element?.xpos, gridRow: element?.ypos }} />;

  const isSelected = state.selectedElement?.number === element.number;
  const f = state.activeFilter;
  const s = state.searchQuery.toLowerCase();
  let isDimmed = false;
  if (f !== 'all' && !element.category?.toLowerCase().includes(f)) isDimmed = true;
  if (s && !element.name.toLowerCase().includes(s) && !element.symbol.toLowerCase().includes(s)) isDimmed = true;

  const color = getCategoryColor(element.category);

  return (
    <motion.button
      onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: element })}
      whileHover={{ scale: 1.12, zIndex: 20 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        background: tileBackground(color, isSelected),
        border: isSelected ? `2px solid ${color}` : '1px solid rgba(0,0,0,0.06)',
        borderRadius: 8,
        padding: '4px 3px 3px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        textAlign: 'center',
        transition: 'opacity 0.15s',
        opacity: isDimmed ? 0.18 : 1,
        outline: 'none',
        fontFamily: "'Inter', 'Space Grotesk', sans-serif",
      }}
    >
      {/* Atomic number */}
      <span style={{
        position: 'absolute', top: 3, left: 4,
        fontSize: 8, fontWeight: 700, color: 'rgba(0,0,0,0.5)',
        lineHeight: 1,
      }}>
        {element.number}
      </span>

      {/* Symbol */}
      <span style={{
        fontSize: 17, fontWeight: 800, color: '#111827',
        lineHeight: 1, marginTop: 10,
        letterSpacing: '-0.01em',
      }}>
        {element.symbol}
      </span>

      {/* Name */}
      <span style={{
        fontSize: 7.5, color: 'rgba(0,0,0,0.6)', marginTop: 2,
        fontWeight: 600, lineHeight: 1,
        maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {element.name}
      </span>
    </motion.button>
  );
}
