import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Droplets, Zap, Clock, ArrowRight } from 'lucide-react';
import FlameTestExperiment from './FlameTestExperiment';
import { toast } from 'react-hot-toast';

const EXPERIMENTS = [
  {
    id: 'flame-test',
    title: 'Flame Test Analysis',
    category: 'Chemistry',
    difficulty: 'Beginner',
    time: '15 mins',
    desc: 'Identify unknown metal ions by observing their emission spectra when heated.',
    Icon: Flame,
    color: 'from-amber-500 to-rose-500'
  },
  {
    id: 'titration',
    title: 'Acid-Base Titration',
    category: 'Chemistry',
    difficulty: 'Intermediate',
    time: '30 mins',
    desc: 'Determine the unknown concentration of an acid using a standard base solution and phenolphthalein.',
    Icon: Droplets,
    color: 'from-sky-400 to-indigo-500'
  },
  {
    id: 'electrolysis',
    title: 'Electrolysis of Water',
    category: 'Chemistry',
    difficulty: 'Advanced',
    time: '20 mins',
    desc: 'Use electricity to split water into hydrogen and oxygen gas at the electrodes.',
    Icon: Zap,
    color: 'from-emerald-400 to-teal-600'
  }
];

export default function ExperimentsTab() {
  const [activeExperiment, setActiveExperiment] = useState(null);

  if (activeExperiment === 'flame-test') {
    return (
      <div className="p-8 w-full max-w-[1400px] mx-auto">
        <FlameTestExperiment onBack={() => setActiveExperiment(null)} />
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto min-h-[80vh]">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-extrabold font-['Space_Grotesk'] text-[var(--text-primary)]">
          Guided Experiments
        </h2>
        <p className="text-[var(--text-secondary)] mt-3 text-lg max-w-2xl">Step-by-step interactive labs with real-time simulations, quizzes, and downloadable PDF reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {EXPERIMENTS.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-[var(--bg-secondary)] backdrop-blur-md border border-[var(--border)] rounded-[2rem] overflow-hidden hover:bg-[var(--bg-card)] transition-all duration-300 hover:-translate-y-2 shadow-lg cursor-pointer flex flex-col"
            onClick={() => {
              if (exp.id === 'flame-test') setActiveExperiment(exp.id);
              else toast.error('This experiment will be available in Phase 3!');
            }}
          >
            {/* Thumbnail Header */}
            <div className={`h-48 bg-gradient-to-br ${exp.color} relative overflow-hidden flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
              <motion.div 
                className="relative z-10 text-white drop-shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <exp.Icon size={72} strokeWidth={1.5} />
              </motion.div>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="px-4 py-1.5 bg-[var(--bg-primary)] rounded-full text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase border border-[var(--border)] shadow-sm">
                  {exp.category}
                </span>
                <span className="text-[var(--text-secondary)] text-sm font-semibold flex items-center gap-1.5">
                  <Clock size={16} /> {exp.time}
                </span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 font-['Space_Grotesk'] group-hover:text-sky-500 transition-colors break-words">{exp.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 md:mb-8 flex-1 break-words">{exp.desc}</p>
              
              <div className="flex justify-between items-center border-t border-[var(--border)] pt-6 mt-auto flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${exp.difficulty === 'Beginner' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : exp.difficulty === 'Intermediate' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                  <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    {exp.difficulty}
                  </span>
                </div>
                <button className="flex items-center gap-2 text-sky-500 text-sm font-bold group-hover:text-sky-400 transition-colors">
                  Start Lab 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
