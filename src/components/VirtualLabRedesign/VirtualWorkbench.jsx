import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, RotateCcw, Droplets, FlaskConical, Target, Thermometer } from 'lucide-react';

const ELEMENTS = [
  { id: 'Na', name: 'Sodium Metal', type: 'metal', equation: '2Na + 2H₂O → 2NaOH + H₂↑', color: '#facc15' },
  { id: 'Li', name: 'Lithium Metal', type: 'metal', equation: '2Li + 2H₂O → 2LiOH + H₂↑', color: '#f87171' },
  { id: 'HCl', name: 'Hydrochloric Acid', type: 'acid', equation: 'HCl + H₂O → H₃O⁺ + Cl⁻', color: '#38bdf8' },
  { id: 'CuSO₄', name: 'Copper Sulfate', type: 'salt', equation: 'CuSO₄(s) ⇌ Cu²⁺(aq) + SO₄²⁻(aq)', color: '#10b981' }
];

export default function VirtualWorkbench() {
  const canvasRef = useRef(null);
  
  // State
  const [temperature, setTemperature] = useState(20);
  const [heaterOn, setHeaterOn] = useState(false);
  const [heaterIntensity, setHeaterIntensity] = useState(50);
  const [waterLevel, setWaterLevel] = useState(0); 
  const [activeElement, setActiveElement] = useState(ELEMENTS[0]);
  const [showElementMenu, setShowElementMenu] = useState(false);
  const [reactionActive, setReactionActive] = useState(false); 
  const [elementDropped, setElementDropped] = useState(false);
  
  // Refs for animation loop
  const stateRef = useRef({
    temperature: 20,
    heaterOn: false,
    heaterIntensity: 50,
    waterLevel: 0,
    activeElement: ELEMENTS[0],
    reactionActive: false,
    bubbles: [],
    antiGravParticles: [],
    wavePhase: 0,
    elementDropped: false,
    elementY: 0,
    fluidBaseY: 0
  });

  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      temperature,
      heaterOn,
      heaterIntensity,
      waterLevel,
      activeElement,
      reactionActive,
      elementDropped
    };
  }, [temperature, heaterOn, heaterIntensity, waterLevel, activeElement, reactionActive, elementDropped]);

  // Heating Logic
  useEffect(() => {
    let interval;
    if (heaterOn && waterLevel > 0) {
      interval = setInterval(() => {
        setTemperature(prev => {
          const maxTemp = 20 + (heaterIntensity / 100) * 80; 
          if (prev < maxTemp) return Math.min(prev + 0.5, maxTemp);
          return prev;
        });
      }, 100);
    } else {
      interval = setInterval(() => {
        setTemperature(prev => {
          if (prev > 20) return Math.max(prev - 0.2, 20);
          return prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [heaterOn, heaterIntensity, waterLevel]);

  // Reaction Logic
  useEffect(() => {
    if (elementDropped && waterLevel > 0 && !reactionActive) {
      const timer = setTimeout(() => setReactionActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [waterLevel, elementDropped, activeElement, reactionActive]);

  // Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 30; // Shifted beaker slightly up to give room for burner
      const beakerW = 140;
      const beakerH = 200;
      const beakerLeft = cx - beakerW / 2;
      const beakerTop = cy - beakerH / 2;

      // Dark mode check for dynamic canvas colors
      const isDark = document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('dark-theme');
      const strokeColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
      const textColor = isDark ? '#ffffff' : '#1e293b';
      const burnerBase = isDark ? '#1e293b' : '#94a3b8';
      const burnerTopC = isDark ? '#0f172a' : '#64748b';

      // Draw Burner underneath (moved lower to prevent overlap)
      const burnerTop = cy + beakerH / 2 + 20; 
      if (state.heaterOn) {
        ctx.fillStyle = burnerBase;
        ctx.fillRect(cx - 15, burnerTop, 30, 40);
        ctx.fillStyle = burnerTopC;
        ctx.fillRect(cx - 25, burnerTop + 35, 50, 10);
        
        const flameH = (state.heaterIntensity / 100) * 35; // Max 35px so it doesn't overlap beaker
        ctx.beginPath();
        ctx.moveTo(cx - 10, burnerTop);
        ctx.quadraticCurveTo(cx, burnerTop - flameH - Math.random() * 10, cx + 10, burnerTop);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.7 + Math.random() * 0.3})`; // Neon cyan burner flame
        ctx.fill();
      }

      const isAcid = state.activeElement.type === 'acid';
      const isVigorous = state.reactionActive && (state.activeElement.id === 'Na' || state.activeElement.id === 'Li');

      // Draw Fluid
      if (state.waterLevel > 0) {
        let waterHeight = (state.waterLevel / 100) * (beakerH - 20);
        
        if (isVigorous) {
           state.waterLevel = Math.max(0, state.waterLevel - 0.2); 
           waterHeight = (state.waterLevel / 100) * (beakerH - 20);
        }

        const waterY = cy + beakerH / 2 - 10 - waterHeight;
        state.wavePhase += 0.05;
        
        if (state.waterLevel > 0) {
          ctx.beginPath();
          ctx.moveTo(beakerLeft + 5, cy + beakerH / 2 - 10);
          ctx.lineTo(beakerLeft + 5, waterY);
          
          const waveAmp = state.temperature > 50 ? 5 + (state.temperature - 50) * 0.1 : 2;
          for (let x = beakerLeft + 5; x <= beakerLeft + beakerW - 5; x++) {
            const y = waterY + Math.sin((x - beakerLeft) * 0.05 + state.wavePhase) * waveAmp;
            ctx.lineTo(x, y);
          }
          
          ctx.lineTo(beakerLeft + beakerW - 5, cy + beakerH / 2 - 10);
          ctx.quadraticCurveTo(beakerLeft + beakerW - 5, cy + beakerH / 2 - 5, beakerLeft + beakerW - 10, cy + beakerH / 2);
          ctx.lineTo(beakerLeft + 10, cy + beakerH / 2);
          ctx.quadraticCurveTo(beakerLeft + 5, cy + beakerH / 2 - 5, beakerLeft + 5, cy + beakerH / 2 - 10);
          
          ctx.fillStyle = isAcid ? 'rgba(56, 189, 248, 0.5)' : state.activeElement.id === 'CuSO₄' && state.reactionActive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.6)';
          ctx.fill();
        }

        // Standard Reaction / Heating Bubbles (Stay in container)
        if (!isVigorous && (state.temperature > 40 || state.reactionActive)) {
          if (Math.random() < 0.3) {
            state.bubbles.push({
              x: beakerLeft + 10 + Math.random() * (beakerW - 20),
              y: cy + beakerH / 2 - 10,
              size: Math.random() * 4 + 2,
              speed: Math.random() * 2 + 1
            });
          }
        }
        
        // Vigorous Reaction Particles
        if (isVigorous) {
           if (Math.random() < 0.8) {
             state.antiGravParticles.push({
               x: beakerLeft + Math.random() * beakerW,
               y: waterY + Math.random() * waterHeight,
               vx: (Math.random() - 0.5) * 4,
               vy: -Math.random() * 6 - 2,
               life: 1.0,
               color: state.activeElement.color,
               size: Math.random() * 4 + 2
             });
           }
        }

        // Draw Standard Bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = state.bubbles.length - 1; i >= 0; i--) {
          const b = state.bubbles[i];
          b.y -= b.speed;
          b.x += Math.sin(b.y * 0.1) * 1;
          
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();
          
          if (b.y < waterY) state.bubbles.splice(i, 1);
        }
        
        // Draw Vigorous Particles
        for (let i = state.antiGravParticles.length - 1; i >= 0; i--) {
          const p = state.antiGravParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.005;
          
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fill();
          
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI*2);
          ctx.fill();

          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          
          if (p.life <= 0 || p.y < -50) state.antiGravParticles.splice(i, 1);
        }
      }

      // Draw Beaker Glass Container
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(beakerLeft, beakerTop);
      ctx.lineTo(beakerLeft, beakerTop + beakerH - 10);
      ctx.quadraticCurveTo(beakerLeft, beakerTop + beakerH, beakerLeft + 10, beakerTop + beakerH);
      ctx.lineTo(beakerLeft + beakerW - 10, beakerTop + beakerH);
      ctx.quadraticCurveTo(beakerLeft + beakerW, beakerTop + beakerH, beakerLeft + beakerW, beakerTop + beakerH - 10);
      ctx.lineTo(beakerLeft + beakerW, beakerTop);
      ctx.stroke();

      // Grid marks
      ctx.beginPath();
      ctx.lineWidth = 2;
      for(let i=1; i<=5; i++) {
        const y = beakerTop + beakerH - (i * (beakerH-20) / 5) - 10;
        ctx.moveTo(beakerLeft + beakerW - 15, y);
        ctx.lineTo(beakerLeft + beakerW - 5, y);
      }
      ctx.stroke();

      // Dropped Element Token
      if (state.elementDropped) {
        state.elementY += 5; // Gravity
        const limitY = cy + beakerH/2 - 20;
        if (state.elementY > limitY) state.elementY = limitY;
        
        let alpha = 1;
        if (isVigorous) {
           alpha = Math.max(0, state.waterLevel / 50); // Fades away as metal reacts
        } else if (state.activeElement.type === 'acid' || state.activeElement.type === 'salt') {
           alpha = state.reactionActive ? Math.max(0, 1 - (Date.now() % 1000) / 1000) : 1;
        }

        if (alpha > 0.01) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = state.activeElement.color;
          ctx.fillRect(cx - 20, state.elementY, 40, 40);
          
          ctx.fillStyle = textColor;
          ctx.font = 'bold 16px Space Grotesk, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(state.activeElement.id, cx, state.elementY + 26);
          ctx.globalAlpha = 1;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleAddWater = () => {
    setWaterLevel(100);
  };

  const handleReset = () => {
    setWaterLevel(0);
    setTemperature(20);
    setHeaterOn(false);
    setReactionActive(false);
    setElementDropped(false);
    stateRef.current.elementDropped = false;
    stateRef.current.elementY = 0;
    stateRef.current.bubbles = [];
    stateRef.current.antiGravParticles = [];
  };

  const handleDropElement = () => {
    setElementDropped(true);
    stateRef.current.elementDropped = true;
    stateRef.current.elementY = canvasRef.current.height / 2 - 250; 
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-[var(--bg-primary)]">
      <div className="w-full max-w-[1400px] h-[85vh] bg-[var(--bg-secondary)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden border border-[var(--border)]">
        
        {/* Top Bar */}
        <div className="flex items-start md:items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)] gap-4">
          <div className="flex items-center gap-3">
            <FlaskConical className="text-sky-500" size={20} />
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] font-['Space_Grotesk'] tracking-wide leading-tight">Chemistry Virtual Lab</h2>
          </div>
          <button className="w-8 h-8 rounded-full bg-[var(--bg-card)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] transition-colors flex-shrink-0 mt-1 md:mt-0">
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex overflow-hidden">
          
          {/* Reaction Equation Badge */}
          <AnimatePresence>
            {reactionActive && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 20, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className={`absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] border border-[var(--border)] px-8 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,229,255,0.2)] backdrop-blur-xl z-20 md:text-xl font-extrabold transition-all duration-500 max-w-[90%] text-center break-words
                  ${activeElement.type === 'metal' 
                     ? 'text-[#facc15] border-[#facc15]/60' 
                     : 'text-[var(--text-primary)] border-[var(--border)]'
                  }
                `}
              >
                {activeElement.equation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas Background Area */}
          <div className="absolute inset-0 bg-[var(--bg-primary)]">
             <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            <canvas 
              ref={canvasRef}
              width={1000}
              height={600}
              className="w-full h-full object-contain mix-blend-screen"
            />
          </div>

          {/* Left Vertical Slider (Temperature) */}
          <div className="absolute top-4 left-4 bg-[var(--bg-card)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-4 w-12 flex flex-col items-center gap-4 z-20 shadow-lg">
            <div className="h-48 w-4 bg-[var(--bg-primary)] rounded-full border border-[var(--border)] relative overflow-hidden flex flex-col justify-end shadow-inner">
               <motion.div 
                 className="w-full bg-[#00e5ff] rounded-full"
                 animate={{ height: `${((temperature - 20) / 80) * 100}%` }}
                 transition={{ duration: 0.2 }}
                 style={{ boxShadow: '0 0 15px #00e5ff' }}
               />
               <motion.div 
                 className="absolute w-6 h-6 bg-[var(--bg-primary)] border-2 border-[#00e5ff] rounded-full shadow-[0_0_20px_#00e5ff] -left-1"
                 animate={{ bottom: `calc(${((temperature - 20) / 80) * 100}% - 12px)` }}
                 transition={{ duration: 0.2 }}
               />
            </div>
            <div className="text-center mt-3">
              <Thermometer size={16} className="text-[var(--text-secondary)] mx-auto mb-1 opacity-70" />
              <div className="text-[var(--text-secondary)] text-[10px] uppercase tracking-widest font-bold mb-1">TEMP</div>
              <div className="text-sm font-bold text-[var(--text-primary)] font-mono">{Math.round(temperature)}°</div>
            </div>
          </div>

          {/* Responsive Bottom Controls Area */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 z-10 pointer-events-none">
            
            {/* Bottom Left Heater Control */}
            <div className="flex flex-col gap-2 pointer-events-auto shrink-0 w-full md:w-auto">
               <button onClick={() => setWaterLevel(prev => Math.min(prev + 10, 100))} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] font-bold transition-all w-full justify-center group shadow-md hover:shadow-lg">
                  <Droplets size={18} className="text-[#00e5ff] group-hover:scale-110 transition-transform" /> Inject Fluid
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 border border-[var(--border)] text-[var(--text-primary)] font-bold transition-all w-full justify-center shadow-md">
                  <RotateCcw size={16} /> Reset
                </button>
            </div>

            {/* Bottom Center Actions */}
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 pointer-events-auto">
               <div className="relative">
                 <button 
                   onClick={() => setShowElementMenu(!showElementMenu)}
                   className="px-4 md:px-6 py-2.5 md:py-3.5 bg-[var(--bg-card)] hover:bg-[var(--border)] backdrop-blur-xl text-[var(--text-primary)] text-sm md:text-base font-bold rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[var(--border)] transition-all flex items-center gap-3"
                 >
                   <div className="p-1 rounded-md bg-purple-500/10 text-purple-500 shrink-0">
                     <Target size={16} />
                   </div>
                   <span>Select Chemical</span>
                 </button>
                 
                 <AnimatePresence>
                   {showElementMenu && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       className="absolute bottom-[calc(100%+10px)] left-0 w-[200px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-2 flex flex-col gap-1 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 backdrop-blur-2xl"
                     >
                       {ELEMENTS.map(el => (
                         <button 
                           key={el.id}
                           onClick={() => { setActiveElement(el); setShowElementMenu(false); }}
                           className={`p-3 rounded-xl font-bold text-sm text-left border transition-all whitespace-normal leading-tight
                             ${activeElement.id === el.id 
                                ? `bg-[var(--bg-primary)] border-${el.color}` 
                                : 'border-transparent hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                             }`}
                           style={{ borderColor: activeElement.id === el.id ? el.color : 'transparent', color: activeElement.id === el.id ? el.color : '' }}
                         >
                           {el.name} ({el.id})
                         </button>
                       ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>

            {/* Bottom Right Element Stand */}
            <div className="flex flex-col items-center pointer-events-auto shrink-0 mb-4 md:mb-8 md:mr-8 hidden sm:flex">
              <motion.button 
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDropElement}
                className="w-16 h-16 bg-[var(--bg-card)] rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[var(--border)] cursor-pointer relative z-10 overflow-hidden"
                style={{ borderBottomWidth: '4px' }}
              >
                {activeElement.type === 'metal' && (
                  <div className="absolute inset-0 animate-pulse blur-md opacity-40" style={{ backgroundColor: activeElement.color }} />
                )}
                <span className="text-xl font-bold relative z-10 font-mono" style={{ color: activeElement.color }}>{activeElement.id}</span>
              </motion.button>
              
              <div className="w-20 h-4 bg-[var(--border)] rounded-sm mt-1 border-t border-[var(--border)]" />
              <div className="flex gap-10">
                <div className="w-3 h-8 bg-[var(--bg-card)] rounded-b-sm border-l border-r border-[var(--border)]" />
                <div className="w-3 h-8 bg-[var(--bg-card)] rounded-b-sm border-l border-r border-[var(--border)]" />
              </div>
              <div className="absolute -bottom-6 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest text-center flex items-center gap-1 opacity-70 w-full justify-center">
                <FlaskConical size={10} /> Add to Beaker
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
