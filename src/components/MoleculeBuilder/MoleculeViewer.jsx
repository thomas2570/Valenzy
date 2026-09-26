/**
 * MoleculeViewer.jsx
 * ═══════════════════
 * React Three Fiber canvas that renders atoms as spheres, bonds as cylinders,
 * and optional lone-pair clouds. Smoothly animates atom positions whenever the
 * VSEPR geometry changes using spring-style interpolation.
 */
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ELEMENT_COLORS } from '../../lib/vsepr';

// ─────────────────────────────────────────────────────────────────────────────
// Atom sphere — smoothly lerps to its target position each frame
// ─────────────────────────────────────────────────────────────────────────────
function AtomSphere({ position, color, radius, label, isCenter }) {
  const groupRef = useRef();
  const targetPos = useRef(new THREE.Vector3(...position));

  useEffect(() => {
    targetPos.current.set(...position);
  }, [position]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const lerpFactor = 1 - Math.pow(0.001, delta * 5);
    groupRef.current.position.lerp(targetPos.current, lerpFactor);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.25}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          emissive={isCenter ? color : '#000000'}
          emissiveIntensity={isCenter ? 0.1 : 0}
        />
      </mesh>
      {/* Element label floats above the sphere */}
      <Text
        position={[0, radius + 0.22, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bond cylinder — a single stick between two 3D positions
// Handles double/triple bonds by rendering offset parallel cylinders
// ─────────────────────────────────────────────────────────────────────────────
function SingleCylinder({ startPos, endPos, color, offset }) {
  const meshRef = useRef();
  const currentStart = useRef(new THREE.Vector3(...startPos));
  const currentEnd = useRef(new THREE.Vector3(...endPos));
  const targetStart = useRef(new THREE.Vector3(...startPos));
  const targetEnd = useRef(new THREE.Vector3(...endPos));

  useEffect(() => {
    targetStart.current.set(...startPos);
    targetEnd.current.set(...endPos);
  }, [startPos, endPos]);

  useFrame((_, delta) => {
    const lerp = 1 - Math.pow(0.001, delta * 5);
    currentStart.current.lerp(targetStart.current, lerp);
    currentEnd.current.lerp(targetEnd.current, lerp);

    if (!meshRef.current) return;

    // Midpoint
    const mid = currentStart.current.clone().add(currentEnd.current).multiplyScalar(0.5);
    // Apply perpendicular offset for double/triple bonds
    const dir = currentEnd.current.clone().sub(currentStart.current).normalize();
    // Perpendicular vector in XZ plane
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
    mid.addScaledVector(perp, offset);

    meshRef.current.position.copy(mid);

    // Length
    const length = currentEnd.current.distanceTo(currentStart.current);
    meshRef.current.scale.y = length;

    // Rotation — align Y-axis with bond direction
    const quaternion = new THREE.Quaternion();
    if (dir.lengthSq() > 0.0001) {
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    }
    meshRef.current.quaternion.copy(quaternion);
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.07, 0.07, 1, 12, 1]} />
      <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.15} />
    </mesh>
  );
}

function BondCylinder({ startPos, endPos, bondOrder, polarity }) {
  const bondColor =
    polarity === 'ionic'  ? '#ef4444' :
    polarity === 'polar'  ? '#f59e0b' :
                            '#94a3b8';

  // Offsets for parallel cylinders (double/triple bonds)
  const offsets =
    bondOrder === 3 ? [-0.14, 0, 0.14] :
    bondOrder === 2 ? [-0.10, 0.10] :
                      [0];

  return (
    <>
      {offsets.map((off, i) => (
        <SingleCylinder
          key={i}
          startPos={startPos}
          endPos={endPos}
          color={bondColor}
          offset={off}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lone pair cloud — translucent sphere near the central atom
// ─────────────────────────────────────────────────────────────────────────────
function LonePairCloud({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.48, 16, 16]} />
      <meshPhysicalMaterial
        color="#60a5fa"
        transparent
        opacity={0.22}
        roughness={0.8}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main 3D scene — wires atoms, bonds, and lone pairs
// ─────────────────────────────────────────────────────────────────────────────
function MoleculeScene({ atoms, bonds, vsepResult, showLonePairs }) {
  const { atomPositions, lonePositions, bondDipoles, centralAtomId } = vsepResult;

  return (
    <>
      {/* Lighting — consistent with existing Valenzy AtomicModel3D setup */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <pointLight position={[0, 6, 4]} intensity={0.8} />

      {/* Atom spheres */}
      {atoms.map(atom => {
        const pos = atomPositions[atom.id] || [0, 0, 0];
        const color = ELEMENT_COLORS[atom.symbol] || ELEMENT_COLORS.default;
        // Scale radius from atomic radius data (100 pm baseline → 0.5 scene units)
        const radius = Math.max(0.32, Math.min(0.65, (atom.atomicRadius || 100) / 200));
        return (
          <AtomSphere
            key={atom.id}
            position={pos}
            color={color}
            radius={radius}
            label={atom.symbol}
            isCenter={atom.id === centralAtomId}
          />
        );
      })}

      {/* Bond cylinders */}
      {bonds.map(bond => {
        const posA = atomPositions[bond.atomA];
        const posB = atomPositions[bond.atomB];
        if (!posA || !posB) return null;
        const dipole = bondDipoles?.find(d => d.bondId === bond.id);
        return (
          <BondCylinder
            key={bond.id}
            startPos={posA}
            endPos={posB}
            bondOrder={bond.order}
            polarity={dipole?.polarity || 'nonpolar'}
          />
        );
      })}

      {/* Lone pair clouds */}
      {showLonePairs && lonePositions?.map((pos, i) => (
        <LonePairCloud key={`lp-${i}`} position={pos} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported component
// ─────────────────────────────────────────────────────────────────────────────
export default function MoleculeViewer({ atoms, bonds, vsepResult, showLonePairs }) {
  const hasAtoms = atoms && atoms.length > 0;

  return (
    <div
      className="keep-color"
      style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Empty state overlay */}
      {!hasAtoms && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: '#475569', textAlign: 'center', padding: 24,
          fontFamily: "'Inter', sans-serif",
          zIndex: 1, pointerEvents: 'none',
        }}>
          <svg
            width="56" height="56" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1"
            style={{ marginBottom: 16, opacity: 0.35 }}
          >
            <circle cx="8" cy="8" r="3" />
            <circle cx="16" cy="8" r="3" />
            <circle cx="12" cy="17" r="3" />
            <line x1="10.5" y1="9.5" x2="13.5" y2="9.5" />
            <line x1="9" y1="10.5" x2="11" y2="14.8" />
            <line x1="15" y1="10.5" x2="13" y2="14.8" />
          </svg>
          <p style={{ fontSize: 14, opacity: 0.55, maxWidth: 200, lineHeight: 1.6 }}>
            Add atoms and bonds to see your molecule rendered in 3D
          </p>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 3, 9], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        {hasAtoms && vsepResult && (
          <MoleculeScene
            atoms={atoms}
            bonds={bonds}
            vsepResult={vsepResult}
            showLonePairs={showLonePairs}
          />
        )}
        <OrbitControls
          enablePan
          maxDistance={40}
          minDistance={2}
          enableDamping
          dampingFactor={0.08}
          autoRotate={false}
        />
      </Canvas>

      {/* Bond polarity legend — only shown when bonds exist */}
      {bonds && bonds.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(2, 6, 23, 0.82)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12, padding: '10px 14px',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: 6,
          pointerEvents: 'none',
        }}>
          {[
            { color: '#94a3b8', label: 'Nonpolar' },
            { color: '#f59e0b', label: 'Polar (ΔEN > 0.4)' },
            { color: '#ef4444', label: 'Ionic (ΔEN > 1.7)' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 5, borderRadius: 3, background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
