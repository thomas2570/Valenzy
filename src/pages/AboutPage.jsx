import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Atom,
  FlaskConical,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  MessageSquare,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Globe2,
  HeartHandshake
} from 'lucide-react';

export default function AboutPage() {
  const { dispatch } = useAppContext();

  const PILLARS = [
    {
      title: 'Interactive Periodic Table',
      desc: 'Explore all 118 elements with comprehensive physical, chemical, and electron configurations in an ultra-responsive interface.',
      icon: <Layers size={26} color="#3b82f6" />,
      accent: '#3b82f6',
      bg: '#eff6ff',
      link: '/table'
    },
    {
      title: '3D Atom Models & Orbitals',
      desc: 'Step into microscopic dimensions to examine electron shells, nucleus representations, and quantum mechanics in interactive 3D.',
      icon: <Atom size={26} color="#8b5cf6" />,
      accent: '#8b5cf6',
      bg: '#f5f3ff',
      link: '/virtual-lab'
    },
    {
      title: 'Virtual Chemistry Lab',
      desc: 'Simulate chemical reactions, observe thermal and color transitions, and test solubility safely from any browser without hazards.',
      icon: <FlaskConical size={26} color="#10b981" />,
      accent: '#10b981',
      bg: '#ecfdf5',
      link: '/virtual-lab'
    },
    {
      title: 'Dynamic Worksheets & Quizzes',
      desc: 'Reinforce learning with dynamically generated problem sets, printable PDF test sheets, and timed knowledge check quizzes.',
      icon: <FileSpreadsheet size={26} color="#f59e0b" />,
      accent: '#f59e0b',
      bg: '#fffbeb',
      link: '/worksheet'
    }
  ];

  const AUDIENCES = [
    {
      role: 'High School & College Students',
      desc: 'Prepare for competitive chemistry exams and laboratory finals with visual models that transform complex theories into clear, memorable concepts.',
      icon: <GraduationCap size={24} color="#6366f1" />,
      tag: 'Exam Preparation'
    },
    {
      role: 'Teachers & Educators',
      desc: 'Equip your classroom with high-definition visual aids, instant demonstration simulators, and exportable worksheets tailored to any syllabus level.',
      icon: <Users size={24} color="#10b981" />,
      tag: 'Classroom Ready'
    },
    {
      role: 'Aspirants & Chemistry Enthusiasts',
      desc: 'Access a fast, trustworthy reference workstation for molar masses, gas law equations, solubility matrixes, and stoichiometric balancing.',
      icon: <Compass size={24} color="#f59e0b" />,
      tag: 'Reference & Research'
    }
  ];

  const STATS = [
    { value: '118', label: 'Elements Detailed', sub: 'Complete physical & atomic data' },
    { value: '3D', label: 'Interactive Visualization', sub: 'Real-time WebGL atom rendering' },
    { value: '100%', label: 'Free & Accessible', sub: 'No paywalls for core learning' },
    { value: '0 Hazard', label: 'Virtual Experimentation', sub: 'Safe simulated testing anytime' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: "'Inter', sans-serif",
      color: '#0f172a',
      position: 'relative',
      overflow: 'hidden',
      paddingBottom: 80,
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.06) 50%, rgba(250,250,250,0) 80%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 24px 40px',
        position: 'relative',
        zIndex: 10
      }}>

        {/* ── HERO SECTION ── */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tag Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#4f46e5',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 24,
            }}>
              <Sparkles size={15} />
              About Valenzy
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#0f172a',
              marginBottom: 24,
              maxWidth: 900,
              margin: '0 auto 24px'
            }}>
              Making Chemistry Visual, Intuitive, and{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #10b981 50%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Genuinely Enjoyable
              </span>
            </h1>

            {/* Intro paragraph from user text */}
            <p style={{
              fontSize: 'clamp(17px, 2vw, 20px)',
              color: '#475569',
              lineHeight: 1.65,
              maxWidth: 780,
              margin: '0 auto 36px',
            }}>
              Welcome to <strong>Valenzy</strong>, an interactive chemistry learning platform designed to make the world of atoms, elements, and chemical reactions easier to understand and more engaging to explore.
            </p>

            {/* CTA action row */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <NavLink
                to="/table"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    e.preventDefault();
                    dispatch({ type: 'OPEN_DESKTOP_WARNING' });
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  borderRadius: 99,
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>Launch Periodic Table</span>
                <ArrowRight size={16} />
              </NavLink>

              <NavLink
                to="/virtual-lab"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  borderRadius: 99,
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
              >
                <span>Explore Virtual Lab</span>
              </NavLink>
            </div>
          </motion.div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 80
        }}>
          {STATS.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '28px 24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: 36,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 6
              }}>
                {s.value}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── OUR MISSION CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
            borderRadius: 28,
            border: '1px solid #e2e8f0',
            padding: 'clamp(32px, 5vw, 56px)',
            marginBottom: 80,
            boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: 840 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#4f46e5',
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16
            }}>
              <Zap size={16} />
              Our Mission
            </div>

            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: 20
            }}>
              Beyond Rote Memorization: Visualizing How Chemistry Really Works
            </h2>

            <p style={{
              fontSize: 16,
              color: '#475569',
              lineHeight: 1.75,
              marginBottom: 20
            }}>
              Traditional periodic tables and textbooks can feel flat and disconnected from the real behavior of atoms and molecules. Valenzy changes that by combining an interactive periodic table, 3D atom models, virtual experiments, dynamic worksheets, and calculation tools into a single, easy-to-use platform.
            </p>

            <p style={{
              fontSize: 16,
              color: '#475569',
              lineHeight: 1.75
            }}>
              Our goal is simple: help students, teachers, and chemistry enthusiasts move beyond rote memorization and start truly visualizing how chemistry works. Whether inspecting electron arrangements across orbitals or balancing stoichiometric equations, chemistry comes alive when you can interact with it.
            </p>
          </div>
        </motion.div>

        {/* ── CORE PILLARS SECTION ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#6366f1',
              marginBottom: 10
            }}>
              Platform Capabilities
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              The Complete Chemistry Learning Ecosystem
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 650, margin: '12px auto 0' }}>
              Everything needed to explore, calculate, simulate, and practice chemical sciences on any device.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24
          }}>
            {PILLARS.map((p) => (
              <motion.div
                key={p.title}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  borderRadius: 24,
                  padding: 32,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: p.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}>
                  {p.icon}
                </div>

                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, marginBottom: 24, flex: 1 }}>
                  {p.desc}
                </p>

                <NavLink
                  to={p.link}
                  onClick={(e) => {
                    if (p.link === '/table' && typeof window !== 'undefined' && window.innerWidth < 1024) {
                      e.preventDefault();
                      dispatch({ type: 'OPEN_DESKTOP_WARNING' });
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    color: p.accent,
                    textDecoration: 'none'
                  }}
                >
                  <span>Explore Feature</span>
                  <ArrowRight size={15} />
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── WHO VALENZY IS BUILT FOR ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#10b981',
              marginBottom: 10
            }}>
              Built For Every Learner
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Supporting Your Learning Journey at Every Level
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24
          }}>
            {AUDIENCES.map((a) => (
              <div
                key={a.role}
                style={{
                  background: '#ffffff',
                  borderRadius: 24,
                  padding: 32,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {a.icon}
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: 99
                  }}>
                    {a.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                  {a.role}
                </h3>

                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── COMMUNITY & FEEDBACK SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            borderRadius: 28,
            padding: 'clamp(36px, 5vw, 60px)',
            color: '#ffffff',
            boxShadow: '0 25px 50px -15px rgba(15, 23, 42, 0.4)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle light orb */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 300,
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <HeartHandshake size={28} color="#818cf8" />
            </div>

            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 16
            }}>
              Continuous Improvement Driven by You
            </h2>

            <p style={{
              fontSize: 16,
              color: '#cbd5e1',
              lineHeight: 1.7,
              marginBottom: 32
            }}>
              We are committed to continuously improving Valenzy based on feedback from our community of learners and educators across the world. If you have questions, feedback, or partnership inquiries, we would love to hear from you.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => dispatch({ type: 'OPEN_CONTACT' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  borderRadius: 99,
                  background: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <MessageSquare size={18} color="#6366f1" />
                <span>Open Contact Form</span>
              </button>

              <NavLink
                to="/tools"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  borderRadius: 99,
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
              >
                <span>Explore Chemistry Tools</span>
                <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
