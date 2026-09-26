/**
 * vsepr.js — Pure VSEPR Chemistry Engine
 * ========================================
 * This module is intentionally decoupled from React/Three.js so it can be
 * unit-tested independently. Feed it atoms + bonds, get back 3D coordinates,
 * geometry names, bond angles, polarity, hybridization, and lone-pair info.
 *
 * Supported geometries (by electron domain count around the central atom):
 *   2 → linear          (180°)
 *   3 → trigonal planar (120°)  — minus lone pairs → bent (120°)
 *   4 → tetrahedral     (109.5°) — minus lone pairs → trigonal pyramidal, bent
 *   5 → trigonal bipyramidal (90°/120°) — minus lone pairs → seesaw, T-shape, linear
 *   6 → octahedral      (90°)   — minus lone pairs → square pyramidal, square planar
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants: ideal bond lengths (Å) mapped from bond order
// ─────────────────────────────────────────────────────────────────────────────
const BOND_LENGTH_BY_ORDER = {
  1: 1.54,  // single (generic)
  2: 1.34,  // double
  3: 1.20,  // triple
};

// ─────────────────────────────────────────────────────────────────────────────
// Valence electron lookup (for elements not in elements.json or as override)
// We calculate lone pairs using: (valence_e - electrons_used_in_bonding) / 2
// ─────────────────────────────────────────────────────────────────────────────

/** Known valence electron counts by symbol, derived from group number. */
const VALENCE_BY_SYMBOL = {
  H: 1, He: 2, Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8,
  Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8,
  K: 1, Ca: 2, Ga: 3, Ge: 4, As: 5, Se: 6, Br: 7, Kr: 8,
  Rb: 1, Sr: 2, In: 3, Sn: 4, Sb: 5, Te: 6, I: 7, Xe: 8,
  Cs: 1, Ba: 2,
  // Transition metals – simplified to 2 for basic usage
  Sc: 2, Ti: 2, V: 2, Cr: 2, Mn: 2, Fe: 2, Co: 2, Ni: 2, Cu: 1, Zn: 2,
};

/**
 * Get valence electron count for an element.
 * Priority: explicit override → VALENCE_BY_SYMBOL → group number from element data.
 */
export function getValenceElectrons(element) {
  if (VALENCE_BY_SYMBOL[element.symbol] !== undefined) {
    return VALENCE_BY_SYMBOL[element.symbol];
  }
  // Fallback: derive from group (works for main-group elements)
  const g = element.group;
  if (g && g <= 2) return g;
  if (g && g >= 13 && g <= 18) return g - 10;
  return 4; // safe default
}

// ─────────────────────────────────────────────────────────────────────────────
// Geometry lookup tables
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps (electronDomains, lonePairs) → { name, angle, molecularName }
 *
 * electronDomains = bonded atoms + lone pairs on the central atom
 * angle is the principal bond angle in degrees (approximate)
 */
const GEOMETRY_MAP = {
  '1,0': { name: 'Linear',                 angle: 180,  molecularName: 'Linear' },
  '2,0': { name: 'Linear',                 angle: 180,  molecularName: 'Linear' },
  '3,0': { name: 'Trigonal Planar',        angle: 120,  molecularName: 'Trigonal Planar' },
  '3,1': { name: 'Trigonal Planar',        angle: 120,  molecularName: 'Bent' },
  '4,0': { name: 'Tetrahedral',            angle: 109.5, molecularName: 'Tetrahedral' },
  '4,1': { name: 'Tetrahedral',            angle: 107,  molecularName: 'Trigonal Pyramidal' },
  '4,2': { name: 'Tetrahedral',            angle: 104.5, molecularName: 'Bent' },
  '5,0': { name: 'Trigonal Bipyramidal',   angle: 120,  molecularName: 'Trigonal Bipyramidal' },
  '5,1': { name: 'Trigonal Bipyramidal',   angle: 102,  molecularName: 'Seesaw' },
  '5,2': { name: 'Trigonal Bipyramidal',   angle: 90,   molecularName: 'T-Shape' },
  '5,3': { name: 'Trigonal Bipyramidal',   angle: 180,  molecularName: 'Linear' },
  '6,0': { name: 'Octahedral',             angle: 90,   molecularName: 'Octahedral' },
  '6,1': { name: 'Octahedral',             angle: 90,   molecularName: 'Square Pyramidal' },
  '6,2': { name: 'Octahedral',             angle: 90,   molecularName: 'Square Planar' },
};

/** Hybridization derived from electron domain count */
const HYBRIDIZATION_MAP = {
  1: 's',
  2: 'sp',
  3: 'sp²',
  4: 'sp³',
  5: 'sp³d',
  6: 'sp³d²',
};

// ─────────────────────────────────────────────────────────────────────────────
// 3D Coordinate generators — one per electron-domain count
// ─────────────────────────────────────────────────────────────────────────────

const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;

/**
 * Generate unit-sphere positions for a given electron geometry.
 * Returns an array of [x, y, z] vectors (already at unit length).
 * The first `bondedCount` entries are bonded-atom positions;
 * the remaining are lone-pair positions.
 */
function generatePositions(electronDomains) {
  switch (electronDomains) {
    case 1:
      return [[0, 0, 1]];

    case 2:
      // Linear — 180°
      return [[0, 0, 1], [0, 0, -1]];

    case 3:
      // Trigonal planar — 120°, all in the XZ plane
      return [
        [sin(2 * PI / 3 * 0), 0, cos(2 * PI / 3 * 0)],
        [sin(2 * PI / 3 * 1), 0, cos(2 * PI / 3 * 1)],
        [sin(2 * PI / 3 * 2), 0, cos(2 * PI / 3 * 2)],
      ];

    case 4: {
      // Tetrahedral — 109.47°
      const s = 1 / sqrt(3);
      return [
        [ s,  s,  s],
        [-s, -s,  s],
        [-s,  s, -s],
        [ s, -s, -s],
      ];
    }

    case 5: {
      // Trigonal bipyramidal
      // Axial (along Y) + 3 equatorial (in XZ plane)
      return [
        [0,  1,  0],  // axial up
        [0, -1,  0],  // axial down
        [sin(2 * PI / 3 * 0), 0, cos(2 * PI / 3 * 0)],  // equatorial
        [sin(2 * PI / 3 * 1), 0, cos(2 * PI / 3 * 1)],
        [sin(2 * PI / 3 * 2), 0, cos(2 * PI / 3 * 2)],
      ];
    }

    case 6: {
      // Octahedral — 90°
      return [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1],
      ];
    }

    default:
      // Fallback for unusual domain counts — place evenly in a ring
      return Array.from({ length: electronDomains }, (_, i) => {
        const theta = (2 * PI * i) / electronDomains;
        return [sin(theta), 0, cos(theta)];
      });
  }
}

/**
 * For trigonal bipyramidal geometry, lone pairs prefer equatorial positions.
 * Returns { bondedPositions, lonePositions }
 */
function reorderTBPForLonePairs(lonePairs) {
  const all = generatePositions(5);
  const axial = [all[0], all[1]];
  const equatorial = [all[2], all[3], all[4]];

  // Lone pairs occupy equatorial positions first
  const lonePositions = equatorial.slice(0, lonePairs);
  const bondedEquatorial = equatorial.slice(lonePairs);
  // Remaining bonded atoms fill axial then leftover equatorial
  const bondedPositions = [...bondedEquatorial, ...axial];

  return { bondedPositions, lonePositions };
}

// ─────────────────────────────────────────────────────────────────────────────
// Polarity analysis
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine if a bond is polar (|ΔEN| > 0.4) or nonpolar.
 * Returns 'polar', 'nonpolar', or 'ionic' (> 1.7).
 */
function bondPolarity(en1, en2) {
  if (en1 == null || en2 == null) return 'unknown';
  const diff = Math.abs(en1 - en2);
  if (diff > 1.7) return 'ionic';
  if (diff > 0.4) return 'polar';
  return 'nonpolar';
}

/**
 * Determine overall molecular polarity.
 * Symmetric geometries with no lone pairs → dipoles cancel → nonpolar.
 */
function determineMolecularPolarity(molecularGeometry, lonePairs, bondPolarities) {
  const hasAnyPolarBond = bondPolarities.some(p => p === 'polar' || p === 'ionic');
  if (!hasAnyPolarBond) return 'Nonpolar';

  // Lone pairs always create asymmetry → polar
  if (lonePairs > 0) return 'Polar';

  // Symmetric geometries without lone pairs → dipoles cancel → nonpolar
  const symmetricGeometries = new Set([
    'Linear', 'Trigonal Planar', 'Tetrahedral',
    'Trigonal Bipyramidal', 'Octahedral', 'Square Planar',
  ]);

  if (symmetricGeometries.has(molecularGeometry)) return 'Nonpolar';
  return 'Polar';
}

// ─────────────────────────────────────────────────────────────────────────────
// Molecular formula generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate molecular formula in conventional chemistry notation.
 * - If carbon present: C first, H second, then rest alphabetically (Hill order).
 * - Otherwise: non-H elements alphabetically first, then H at the end.
 *   This gives NH3 (not H3N), H2O (O before H → OH2, but we put H last so it's OH2 → common
 *   exception: water is H2O — we special-case single non-H elements to put H after).
 * This matches what students expect from their textbooks.
 */
export function generateFormula(atoms) {
  const orig = {};
  atoms.forEach(a => { orig[a.symbol] = (orig[a.symbol] || 0) + 1; });

  const order = [];
  if (orig['C']) {
    // Hill order with carbon: C → H → alphabetical
    order.push('C');
    if (orig['H']) order.push('H');
    Object.keys(orig).sort().forEach(s => {
      if (s !== 'C' && s !== 'H') order.push(s);
    });
  } else {
    // No carbon: non-H elements alphabetically, then H last
    // This gives NH3, BF3, SF6, etc. which match conventional notation.
    Object.keys(orig).sort().forEach(s => {
      if (s !== 'H') order.push(s);
    });
    if (orig['H']) order.push('H');
  }

  return order.map(s => s + (orig[s] > 1 ? orig[s] : '')).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main VSEPR calculation engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate full VSEPR data for a molecule.
 *
 * @param {Array} atoms - List of atom objects with id, symbol, atomicMass, electronegativity, valenceElectrons, group
 * @param {Array} bonds - List of bond objects with id, atomA (id), atomB (id), order (1|2|3)
 * @param {string|null} centralAtomId - ID of manually designated central atom (or null for auto-detect)
 *
 * @returns {Object} Full VSEPR result with positions, geometry info, polarity, etc.
 */
export function calculateVSEPR(atoms, bonds, centralAtomId = null) {
  // ── 0. Trivial / guard cases ────────────────────────────────────────────
  if (!atoms || atoms.length === 0) {
    return emptyResult();
  }

  if (atoms.length === 1) {
    const a = atoms[0];
    return {
      ...emptyResult(),
      centralAtomId: a.id,
      molecularFormula: generateFormula(atoms),
      molarMass: +(a.atomicMass || 0).toFixed(3),
      atomPositions: { [a.id]: [0, 0, 0] },
      warning: 'Single atom — no bonds to analyse.',
    };
  }

  // ── No bonds yet: spread atoms in a row, skip geometry calculation ──────────
  // This prevents showing bogus geometry ("Complex", "-90°") when the user
  // has added atoms but hasn't defined any bonds yet.
  if (!bonds || bonds.length === 0) {
    const spacing = 2.8;
    const atomPositions = {};
    atoms.forEach((a, i) => {
      // Lay atoms out in a horizontal row centred at origin
      atomPositions[a.id] = [(i - (atoms.length - 1) / 2) * spacing, 0, 0];
    });
    return {
      ...emptyResult(),
      centralAtomId: null,
      molecularFormula: generateFormula(atoms),
      molarMass: +atoms.reduce((s, a) => s + (a.atomicMass || 0), 0).toFixed(3),
      atomPositions,
      warning: `${atoms.length} atom${atoms.length > 1 ? 's' : ''} added — now add bonds between them to calculate geometry.`,
    };
  }

  // ── 1. Build adjacency map ──────────────────────────────────────────────
  const adjacency = {};
  atoms.forEach(a => { adjacency[a.id] = []; });
  bonds.forEach(b => {
    adjacency[b.atomA]?.push({ neighborId: b.atomB, bondOrder: b.order });
    adjacency[b.atomB]?.push({ neighborId: b.atomA, bondOrder: b.order });
  });

  // ── 2. Pick central atom ─────────────────────────────────────────────────
  let centralId = centralAtomId;
  if (!centralId) {
    let maxDegree = -1;
    atoms.forEach(a => {
      const degree = adjacency[a.id]?.length || 0;
      if (degree > maxDegree) {
        maxDegree = degree;
        centralId = a.id;
      } else if (degree === maxDegree && centralId) {
        // Tie-break: prefer lower electronegativity (central atoms tend to be less electronegative)
        const currentEN = atoms.find(x => x.id === centralId)?.electronegativity ?? 99;
        const thisEN = a.electronegativity ?? 99;
        if (thisEN < currentEN) centralId = a.id;
      }
    });
  }

  const centralAtom = atoms.find(a => a.id === centralId);
  if (!centralAtom) {
    return { ...emptyResult(), error: 'Central atom not found.' };
  }

  const centralNeighbors = adjacency[centralId] || [];
  const bondedCount = centralNeighbors.length;

  // ── 3. Detect chain molecules (no atom has > 2 bonds) ──────────────────
  const allMaxDegree = Math.max(...atoms.map(a => adjacency[a.id]?.length || 0));
  if (allMaxDegree <= 2 && atoms.length > 3) {
    return calculateChainLayout(atoms, bonds, adjacency);
  }

  // ── 4. Calculate lone pairs on central atom ─────────────────────────────
  // lone_pairs = floor((valence_electrons - bonded_atom_count) / 2)
  // Each bonding domain uses ONE pair of electrons from the central atom's perspective.
  const valenceE = centralAtom.valenceElectrons || getValenceElectrons(centralAtom);
  const lonePairs = Math.max(0, Math.floor((valenceE - bondedCount) / 2));

  // ── 5. Electron domain count & geometry lookup ─────────────────────────
  const electronDomains = bondedCount + lonePairs;
  const geoKey = `${Math.min(electronDomains, 6)},${Math.min(lonePairs, 3)}`;
  const geoData = GEOMETRY_MAP[geoKey] || { name: 'Unknown', angle: 90, molecularName: 'Complex' };
  const hybridization = HYBRIDIZATION_MAP[Math.min(electronDomains, 6)] || 'sp³';

  // ── 6. Generate 3D positions ─────────────────────────────────────────────
  const atomPositions = {};
  let lonePositions = [];
  const bondLength = 2.0; // scene units

  atomPositions[centralId] = [0, 0, 0];

  if (electronDomains === 5 && lonePairs > 0) {
    // TBP: lone pairs go equatorial (less repulsion)
    const { bondedPositions, lonePositions: lp } = reorderTBPForLonePairs(lonePairs);
    centralNeighbors.forEach((nb, i) => {
      const pos = bondedPositions[i] || [1, 0, 0];
      const len = bondLength * 1.3;
      atomPositions[nb.neighborId] = pos.map(v => v * len);
    });
    lonePositions = lp.map(p => p.map(v => v * bondLength * 0.9));
  } else {
    const allPositions = generatePositions(Math.min(electronDomains, 6));
    // Bonded atoms occupy the first `bondedCount` positions
    centralNeighbors.forEach((nb, i) => {
      const pos = allPositions[i] || [1, 0, 0];
      atomPositions[nb.neighborId] = pos.map(v => v * bondLength * 1.3);
    });
    // Lone pairs occupy the remaining positions
    for (let lp = 0; lp < lonePairs; lp++) {
      const pos = allPositions[bondedCount + lp];
      if (pos) lonePositions.push(pos.map(v => v * bondLength * 0.85));
    }
  }

  // Position any atoms not yet placed (not direct neighbors of central atom)
  atoms.forEach(a => {
    if (a.id === centralId || atomPositions[a.id] !== undefined) return;
    const neighbors = adjacency[a.id] || [];
    const positionedNb = neighbors.find(n => atomPositions[n.neighborId] !== undefined);
    if (positionedNb) {
      const parentPos = atomPositions[positionedNb.neighborId];
      atomPositions[a.id] = parentPos.map((v, i) => v + [0.8, 0.8, 0][i]);
    } else {
      atomPositions[a.id] = [3, 0, 0];
    }
  });

  // ── 7. Bond polarity analysis ─────────────────────────────────────────────
  const bondDipoles = bonds.map(b => {
    const aA = atoms.find(x => x.id === b.atomA);
    const aB = atoms.find(x => x.id === b.atomB);
    return {
      atomA: b.atomA,
      atomB: b.atomB,
      bondId: b.id,
      polarity: bondPolarity(aA?.electronegativity, aB?.electronegativity),
    };
  });

  const molecularPolarity = determineMolecularPolarity(
    geoData.molecularName,
    lonePairs,
    bondDipoles.map(d => d.polarity)
  );

  // ── 8. Molar mass & formula ──────────────────────────────────────────────
  const molarMass = +atoms.reduce((sum, a) => sum + (a.atomicMass || 0), 0).toFixed(3);
  const molecularFormula = generateFormula(atoms);

  // ── 9. Validation warnings ───────────────────────────────────────────────
  let warning = null;
  if (electronDomains > 6) {
    warning = 'Electron domain count > 6 is not fully supported — showing best-effort geometry.';
  }
  const totalValence = atoms.reduce((s, a) => s + (a.valenceElectrons || getValenceElectrons(a)), 0);
  const totalBondingE = bonds.reduce((s, b) => s + b.order * 2, 0);
  if (totalBondingE > totalValence + 4) {
    warning = warning || 'Warning: electron count suggests this structure may be chemically unstable.';
  }

  return {
    centralAtomId: centralId,
    molecularFormula,
    electronGeometry: geoData.name,
    molecularGeometry: geoData.molecularName,
    bondAngle: geoData.angle,
    hybridization,
    lonePairs,
    polarity: molecularPolarity,
    molarMass,
    atomPositions,
    lonePositions,
    bondDipoles,
    warning,
    error: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain layout fallback (for linear/chain molecules like ethane)
// ─────────────────────────────────────────────────────────────────────────────

function calculateChainLayout(atoms, bonds, adjacency) {
  const visited = new Set();
  const positions = {};
  const BOND_LEN = 2.0;
  const TETRA_ANGLE = (109.5 * PI) / 180;

  // Find a terminal atom to start the chain
  let startId = atoms[0].id;
  atoms.forEach(a => {
    if ((adjacency[a.id]?.length || 0) === 1) startId = a.id;
  });

  function dfs(atomId, parentPos, direction, depth) {
    if (visited.has(atomId)) return;
    visited.add(atomId);
    positions[atomId] = parentPos
      ? parentPos.map((v, i) => v + direction[i] * BOND_LEN)
      : [0, 0, 0];

    const neighbors = adjacency[atomId] || [];
    let branchIndex = 0;
    neighbors.forEach(nb => {
      if (visited.has(nb.neighborId)) return;
      const up = branchIndex % 2 === 0 ? 1 : -1;
      // Zigzag chain in the XY plane using tetrahedral angle
      const nextDir = [
        cos(TETRA_ANGLE),
        sin(TETRA_ANGLE) * up * 0.6,
        (depth % 2 === 0 ? 0.2 : -0.2),
      ];
      const mag = Math.sqrt(nextDir.reduce((s, v) => s + v * v, 0));
      dfs(nb.neighborId, positions[atomId], nextDir.map(v => v / mag), depth + 1);
      branchIndex++;
    });
  }

  dfs(startId, null, [1, 0, 0], 0);
  atoms.forEach(a => { if (!positions[a.id]) positions[a.id] = [3, 0, 0]; });

  return {
    centralAtomId: null,
    molecularFormula: generateFormula(atoms),
    electronGeometry: 'Tetrahedral (chain)',
    molecularGeometry: 'Chain / Extended',
    bondAngle: 109.5,
    hybridization: 'sp³',
    lonePairs: null,
    polarity: 'Complex',
    molarMass: +atoms.reduce((s, a) => s + (a.atomicMass || 0), 0).toFixed(3),
    atomPositions: positions,
    lonePositions: [],
    bondDipoles: [],
    warning: 'Chain or extended molecule detected — using sequential tetrahedral layout.',
    error: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function emptyResult() {
  return {
    centralAtomId: null,
    molecularFormula: '',
    electronGeometry: '—',
    molecularGeometry: '—',
    bondAngle: null,
    hybridization: '—',
    lonePairs: null,
    polarity: '—',
    molarMass: 0,
    atomPositions: {},
    lonePositions: [],
    bondDipoles: [],
    warning: null,
    error: null,
  };
}

/** CPK-inspired element colour palette for 3D rendering */
export const ELEMENT_COLORS = {
  H:  '#FFFFFF', He: '#D9FFFF', Li: '#CC80FF', Be: '#C2FF00',
  B:  '#FFB5B5', C:  '#909090', N:  '#3050F8', O:  '#FF0D0D',
  F:  '#90E050', Ne: '#B3E3F5', Na: '#AB5CF2', Mg: '#8AFF00',
  Al: '#BFA6A6', Si: '#F0C8A0', P:  '#FF8000', S:  '#FFFF30',
  Cl: '#1FF01F', Ar: '#80D1E3', K:  '#8F40D4', Ca: '#3DFF00',
  Fe: '#E06633', Cu: '#C88033', Zn: '#7D80B0', Br: '#A62929',
  I:  '#940094', default: '#888888',
};
