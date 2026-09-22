import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

const FloatingMolecule = () => {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = Math.sin(t / 4);
    group.current.rotation.y = Math.sin(t / 2);
  });

  return (
    <group ref={group}>
      {/* Central Atom */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>
      {/* Surrounding Atoms */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos((i * Math.PI) / 2) * 2.5,
          Math.sin((i * Math.PI) / 2) * 2.5,
          (i % 2 === 0 ? 1 : -1) * 1.5
        ]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
      {/* Bonds (simple lines) */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`bond-${i}`} rotation={[0, 0, (i * Math.PI) / 2]} position={[
          Math.cos((i * Math.PI) / 2) * 1.25,
          Math.sin((i * Math.PI) / 2) * 1.25,
          (i % 2 === 0 ? 1 : -1) * 0.75
        ]}>
          <cylinderGeometry args={[0.1, 0.1, 2.5]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
    </group>
  );
};

export default function HeroSection() {
  return (
    <div className="relative w-full h-[60vh] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#818cf8" />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
            <FloatingMolecule />
          </Float>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold text-sm mb-6">
            Valenzy Labs v1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-slate-400 mb-6 drop-shadow-sm">
            Virtual Science <br/> Laboratory
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience high-school chemistry like never before. Safely perform interactive experiments, visualize 3D molecular structures, and track your scientific journey.
          </p>
          <button 
            onClick={() => document.getElementById('experiment-zone')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-2xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all transform hover:scale-105 active:scale-95"
          >
            Start Experimenting
          </button>
        </motion.div>
      </div>
    </div>
  );
}
