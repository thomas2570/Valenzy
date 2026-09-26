import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, DIFFICULTIES, getQuestions, getTopicStats } from '../data/quizData';
import { useAppContext } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

import { markQuestionsAsSeen } from '../utils/questionTracker';

const COUNTS = [5, 10, 15, 20, 30];
const DEFAULT_TIME = { 5: 5, 10: 10, 15: 12, 20: 15, 30: 25 }; // minutes

// ─── Screens ────────────────────────────────────────────────────────────────
const SCREEN = { SETUP: 'setup', QUIZ: 'quiz', RESULT: 'result' };

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  indigo: '#6366f1', indigoDark: '#4f46e5', indigoLight: '#e0e7ff',
  green: '#16a34a', greenLight: '#dcfce7',
  red: '#dc2626', redLight: '#fee2e2',
  orange: '#d97706', orangeLight: '#fef3c7',
  slate: '#64748b', slateLight: '#f1f5f9',
  text: '#111827', sub: '#6b7280',
  border: '#e5e7eb', white: '#ffffff',
  bg: 'radial-gradient(ellipse 80% 60% at 20% 100%, #dbeafe44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 0%, #e0e7ff33 0%, transparent 50%), #f1f5f9',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function calcScore(questions, answers) {
  let score = 0, correct = 0, wrong = 0, skipped = 0;
  questions.forEach((q, i) => {
    if (answers[i] === undefined || answers[i] === null) { skipped++; }
    else if (answers[i] === q.correct) { score += 4; correct++; }
    else { score -= 1; wrong++; }
  });
  return { score, correct, wrong, skipped, total: questions.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { state: { user } } = useAppContext();
  const [screen, setScreen]     = useState(SCREEN.SETUP);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]   = useState({}); // questionIndex → optionIndex
  const [flagged, setFlagged]   = useState(new Set());
  const [current, setCurrent]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExplain, setShowExplain] = useState(false);
  const [isRevisionRound, setIsRevisionRound] = useState(false);

  const [searchParams] = useSearchParams();
  const challengeScore = searchParams.get('challengeScore');
  const challengerName = searchParams.get('challenger');

  // Setup config
  const [topic, setTopic]       = useState(searchParams.get('topic') || 'all');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [count, setCount]       = useState(parseInt(searchParams.get('count')) || 10);
  const [timerOn, setTimerOn]   = useState(true);
  
  // Async Data
  const [topicStats, setTopicStats] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTopicStats().then(data => {
      setTopicStats(data.stats);
      setTotalQuestions(data.total);
    });
  }, []);

  const timerRef = useRef(null);

  const handleSubmit = useCallback(async () => {
    clearInterval(timerRef.current);
    
    // Track seen questions when quiz finishes
    if (questions.length > 0) {
      const shownIds = questions.map(q => q.id);
      markQuestionsAsSeen(topic, shownIds);
    }

    const finalStats = calcScore(questions, answers);
    
    if (user) {
      try {
        addDoc(collection(db, 'quiz_scores'), {
          user_id: user.uid,
          topic: TOPICS.find(t => t.id === topic)?.label || topic,
          score: finalStats.score,
          total_questions: finalStats.total,
          correct: finalStats.correct,
          wrong: finalStats.wrong,
          skipped: finalStats.skipped,
          created_at: new Date().toISOString()
        }).catch(error => console.error('Failed to save score', error));

        // Update leaderboard stats in the user's profile
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            updateDoc(userRef, {
              total_score: increment(finalStats.score),
              quizzes_taken: increment(1)
            });
          } else {
            setDoc(userRef, {
              email: user.email,
              total_score: finalStats.score,
              quizzes_taken: 1
            }, { merge: true });
          }
        });

      } catch (error) {
        console.error('Failed to save score', error);
      }
    }
    
    setScreen(SCREEN.RESULT);
  }, [questions, topic, answers, user]);

  // Start timer
  const startTimer = useCallback((secs) => {
    setTimeLeft(secs);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [handleSubmit]); // eslint-disable-line

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleStart = async () => {
    setIsLoading(true);
    const result = await getQuestions(topic, difficulty === 'All' ? null : difficulty, count);
    setIsLoading(false);
    
    if (result.questions.length === 0) { 
      alert('No questions found for this filter. Try changing topic or difficulty.'); 
      return; 
    }
    
    setQuestions(result.questions);
    setIsRevisionRound(result.isRevisionRound);
    setAnswers({});
    setFlagged(new Set());
    setCurrent(0);
    setShowExplain(false);
    setScreen(SCREEN.QUIZ);
    if (timerOn) startTimer((DEFAULT_TIME[count] || 10) * 60);
  };

  const handleAnswer = (optIdx) => {
    setAnswers(prev => ({ ...prev, [current]: optIdx }));
    setShowExplain(false);
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const n = new Set(prev);
      n.has(current) ? n.delete(current) : n.add(current);
      return n;
    });
  };

  const stats = screen === SCREEN.RESULT ? calcScore(questions, answers) : null;

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.bg, fontFamily: "'Inter', 'Space Grotesk', sans-serif", paddingBottom: 80 }}>

      {/* Top nav area (Timer only) */}
      {screen === SCREEN.QUIZ && timerOn ? (
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: 60 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: timeLeft < 60 ? C.redLight : C.indigoLight,
            border: `1px solid ${timeLeft < 60 ? '#fecaca' : '#c7d2fe'}`,
            borderRadius: 999, padding: '6px 18px',
            fontSize: 17, fontWeight: 800,
            color: timeLeft < 60 ? C.red : C.indigo,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            ⏱ {fmtTime(timeLeft)}
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} />
      )}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '16px 24px 0' }}>
        <AnimatePresence mode="wait">

          {/* ── SETUP SCREEN ── */}
          {screen === SCREEN.SETUP && (
            <motion.div key="setup"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: '0 0 10px' }}>
                  Quiz Engine
                </h1>
                <p style={{ fontSize: 15, color: C.sub, margin: 0 }}>
                  JEE Main pattern · +4/−1 marking · Topic-wise MCQ tests
                </p>
              </div>

              <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '36px 40px' }}>

                {challengeScore && (
                  <div style={{ background: C.indigoLight, border: `1px solid #c7d2fe`, padding: 16, borderRadius: 16, marginBottom: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.indigo, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                      Friendly Challenge!
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.indigoDark }}>
                      {challengerName || 'A friend'} challenged you to beat their score of <span style={{ fontSize: 18, fontWeight: 900 }}>{challengeScore}</span>!
                    </div>
                  </div>
                )}

                {/* Topic */}
                <ConfigSection label={`Topic / Chapter · ${topicStats ? totalQuestions : '...'} questions total`}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                    {TOPICS.map(t => {
                      const qCount = topicStats ? (t.id === 'all' ? totalQuestions : (topicStats[t.id] || 0)) : 0;
                      return (
                        <button key={t.id} onClick={() => setTopic(t.id)} style={{
                          padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${topic === t.id ? C.indigo : C.border}`,
                          background: topic === t.id ? C.indigoLight : '#fafafa',
                          color: topic === t.id ? C.indigoDark : C.text,
                          fontSize: 13, fontWeight: topic === t.id ? 700 : 500, cursor: 'pointer',
                          textAlign: 'left', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        }}>
                          <span style={{ flex: 1 }}>{t.label}</span>
                          <span style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                            {t.class && <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, background: '#f1f5f9', borderRadius: 4, padding: '2px 5px' }}>Cl {t.class}</span>}
                            <span style={{ fontSize: 10, fontWeight: 700, color: topic === t.id ? C.indigo : '#9ca3af', background: topic === t.id ? '#c7d2fe' : '#f1f5f9', borderRadius: 4, padding: '2px 5px' }}>{qCount}Q</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ConfigSection>


                <div style={{ height: 1, background: C.border, margin: '28px 0' }} />

                {/* Difficulty & Count wrapping layout */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <ConfigSection label="Difficulty">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['All', ...DIFFICULTIES].map(d => (
                          <button key={d} onClick={() => setDifficulty(d)} style={{
                            padding: '8px 18px', borderRadius: 999, border: `1.5px solid ${difficulty === d ? C.indigo : C.border}`,
                            background: difficulty === d ? C.indigo : C.white,
                            color: difficulty === d ? C.white : C.text,
                            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                          }}>{d}</button>
                        ))}
                      </div>
                    </ConfigSection>
                  </div>

                  <div style={{ flex: '1 1 240px' }}>
                    <ConfigSection label="Number of Questions">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {COUNTS.map(n => (
                          <button key={n} onClick={() => setCount(n)} style={{
                            width: 48, height: 48, borderRadius: 12,
                            border: `1.5px solid ${count === n ? C.indigo : C.border}`,
                            background: count === n ? C.indigo : C.white,
                            color: count === n ? C.white : C.text,
                            fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                          }}>{n}</button>
                        ))}
                      </div>
                    </ConfigSection>
                  </div>
                </div>

                <div style={{ height: 1, background: C.border, margin: '28px 0' }} />

                {/* Timer toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Countdown Timer</div>
                    <div style={{ fontSize: 13, color: C.sub }}>
                      {DEFAULT_TIME[count] || 10} minutes for {count} questions
                    </div>
                  </div>
                  <button
                    onClick={() => setTimerOn(v => !v)}
                    style={{
                      width: 52, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer',
                      background: timerOn ? C.indigo : C.border, position: 'relative',
                      transition: 'background 0.25s',
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: C.white,
                      position: 'absolute', top: 3, transition: 'left 0.25s',
                      left: timerOn ? 27 : 3,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    }} />
                  </button>
                </div>

                <button
                  onClick={handleStart}
                  disabled={isLoading || !topicStats}
                  style={{
                    width: '100%', marginTop: 32,
                    background: isLoading || !topicStats ? C.slate : C.indigo, color: C.white, border: 'none',
                    borderRadius: 14, padding: '15px 0', fontSize: 16, fontWeight: 700,
                    cursor: isLoading || !topicStats ? 'not-allowed' : 'pointer', 
                    letterSpacing: '-0.01em', transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    opacity: isLoading || !topicStats ? 0.8 : 1
                  }}
                  onMouseEnter={e => { if (!isLoading && topicStats) e.currentTarget.style.background = C.indigoDark; }}
                  onMouseLeave={e => { if (!isLoading && topicStats) e.currentTarget.style.background = C.indigo; }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {isLoading ? 'Preparing Quiz...' : 'Start Quiz'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── QUIZ SCREEN ── */}
          {screen === SCREEN.QUIZ && questions.length > 0 && (
            <motion.div key="quiz"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            >
              {/* Progress */}
              <div style={{ marginBottom: 20 }}>
                {isRevisionRound && (
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', background: C.orangeLight, color: C.orange,
                    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, marginBottom: 12,
                    border: `1px solid #fcd34d`
                  }}>
                    🔄 REVISION ROUND
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>
                    Question {current + 1} of {questions.length}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.green, background: C.greenLight, padding: '3px 10px', borderRadius: 999 }}>+4 correct</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.red, background: C.redLight, padding: '3px 10px', borderRadius: 999 }}>−1 wrong</span>
                  </div>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: `linear-gradient(90deg, ${C.indigo}, #818cf8)`, borderRadius: 999 }}
                    animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div key={current}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', overflow: 'hidden' }}
                >
                  {/* Q header */}
                  <div style={{
                    padding: '24px 32px 20px',
                    borderBottom: `1px solid ${C.border}`,
                    background: 'linear-gradient(135deg, #f8faff, #f0f4ff)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                        <Pill color={C.indigo} bg={C.indigoLight}>{questions[current].classLevel === 'JEE' ? 'JEE' : `Class ${questions[current].classLevel}`}</Pill>
                        <Pill color={diffColor(questions[current].difficulty)} bg={diffBg(questions[current].difficulty)}>{questions[current].difficulty}</Pill>
                        <Pill color={C.sub} bg={C.slateLight}>{TOPICS.find(t => t.id === questions[current].topic)?.label}</Pill>
                      </div>
                      <p style={{ fontSize: 17, fontWeight: 600, color: C.text, lineHeight: 1.6, margin: 0 }}>
                        {questions[current].question}
                      </p>
                    </div>
                    <button
                      onClick={toggleFlag}
                      title={flagged.has(current) ? 'Remove flag' : 'Mark for review'}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${flagged.has(current) ? C.orange : C.border}`,
                        background: flagged.has(current) ? C.orangeLight : C.white,
                        cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: flagged.has(current) ? C.orange : C.sub, fontSize: 16,
                        transition: 'all 0.15s',
                      }}
                    >🚩</button>
                  </div>

                  {/* Options */}
                  <div style={{ padding: '24px 32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {questions[current].options.map((opt, oi) => {
                        const selected = answers[current] === oi;
                        return (
                          <motion.button
                            key={oi}
                            whileHover={{ scale: 1.005 }}
                            whileTap={{ scale: 0.998 }}
                            onClick={() => handleAnswer(oi)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 14,
                              padding: '14px 20px', borderRadius: 14, cursor: 'pointer',
                              border: `2px solid ${selected ? C.indigo : C.border}`,
                              background: selected ? C.indigoLight : '#fafafa',
                              textAlign: 'left', transition: 'all 0.15s', width: '100%',
                            }}
                          >
                            <div style={{
                              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${selected ? C.indigo : C.border}`,
                              background: selected ? C.indigo : C.white,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 13, fontWeight: 800,
                              color: selected ? C.white : C.sub,
                              transition: 'all 0.15s',
                            }}>
                              {String.fromCharCode(65 + oi)}
                            </div>
                            <span style={{ fontSize: 15, fontWeight: selected ? 600 : 400, color: selected ? C.indigoDark : C.text, lineHeight: 1.5 }}>
                              {opt}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Show explanation button */}
                    {answers[current] !== undefined && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
                        <button
                          onClick={() => setShowExplain(v => !v)}
                          style={{
                            background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10,
                            padding: '7px 16px', fontSize: 13, fontWeight: 600, color: C.indigo, cursor: 'pointer',
                          }}
                        >
                          {showExplain ? '▴ Hide' : '▾ Show'} Explanation
                        </button>
                        {showExplain && (
                          <div style={{
                            marginTop: 10, padding: '14px 18px', borderRadius: 12,
                            background: answers[current] === questions[current].correct ? C.greenLight : C.redLight,
                            border: `1px solid ${answers[current] === questions[current].correct ? '#bbf7d0' : '#fecaca'}`,
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, color: answers[current] === questions[current].correct ? C.green : C.red }}>
                              {answers[current] === questions[current].correct ? '✓ Correct!' : `✗ Incorrect — Answer: ${String.fromCharCode(65 + questions[current].correct)}`}
                            </div>
                            <p style={{ fontSize: 13, color: C.text, margin: 0, lineHeight: 1.7 }}>
                              {questions[current].explanation}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div style={{
                    padding: '16px 32px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: `1px solid ${C.border}`,
                  }}>
                    <button
                      onClick={() => { setCurrent(c => Math.max(0, c - 1)); setShowExplain(false); }}
                      disabled={current === 0}
                      style={{
                        padding: '10px 22px', borderRadius: 12, border: `1.5px solid ${C.border}`,
                        background: C.white, fontSize: 14, fontWeight: 600, cursor: current === 0 ? 'default' : 'pointer',
                        opacity: current === 0 ? 0.4 : 1, color: C.text, transition: 'all 0.15s',
                      }}
                    >← Previous</button>

                    {/* Dot nav */}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', maxWidth: 300, justifyContent: 'center' }}>
                      {questions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setCurrent(i); setShowExplain(false); }}
                          style={{
                            width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer',
                            background: i === current ? C.indigo : answers[i] !== undefined ? '#a5b4fc' : flagged.has(i) ? C.orange : C.border,
                            transition: 'background 0.15s',
                          }}
                        />
                      ))}
                    </div>

                    {current < questions.length - 1 ? (
                      <button
                        onClick={() => { setCurrent(c => c + 1); setShowExplain(false); }}
                        style={{
                          padding: '10px 22px', borderRadius: 12, border: 'none',
                          background: C.indigo, color: C.white, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = C.indigoDark}
                        onMouseLeave={e => e.currentTarget.style.background = C.indigo}
                      >Next →</button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        style={{
                          padding: '10px 22px', borderRadius: 12, border: 'none',
                          background: C.green, color: C.white, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                      >Submit Quiz ✓</button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Question status legend */}
              <div style={{ marginTop: 16, display: 'flex', gap: 16, fontSize: 12, color: C.sub, justifyContent: 'center' }}>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: C.indigo, marginRight: 5 }} />Current</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#a5b4fc', marginRight: 5 }} />Answered</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: C.orange, marginRight: 5 }} />Flagged</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: C.border, marginRight: 5 }} />Not visited</span>
              </div>
            </motion.div>
          )}

          {/* ── RESULT SCREEN ── */}
          {screen === SCREEN.RESULT && stats && (
            <motion.div key="result"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Score card */}
              <div style={{
                background: C.white, borderRadius: 24, border: `1px solid ${C.border}`,
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 20,
              }}>
                <div style={{
                  background: stats.score >= (stats.total * 4 * 0.6)
                    ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
                    : stats.score >= 0
                    ? 'linear-gradient(135deg, #fefce8, #fef9c3)'
                    : 'linear-gradient(135deg, #fff1f2, #fee2e2)',
                  padding: '40px',
                  textAlign: 'center',
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sub, marginBottom: 16 }}>
                    Quiz Complete!
                  </div>
                  <div style={{ fontSize: 64, fontWeight: 900, color: stats.score >= 0 ? C.green : C.red, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 4 }}>
                    {stats.score}
                  </div>
                  <div style={{ fontSize: 18, color: C.sub, fontWeight: 500 }}>
                    out of {stats.total * 4} marks
                  </div>
                  <div style={{ fontSize: 14, color: C.sub, marginTop: 8 }}>
                    ({Math.round((stats.score / (stats.total * 4)) * 100)}% accuracy)
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, justifyContent: 'center' }}>
                  {[
                    { label: 'Correct', value: stats.correct, color: C.green, bg: C.greenLight, suffix: `(+${stats.correct * 4})` },
                    { label: 'Wrong', value: stats.wrong, color: C.red, bg: C.redLight, suffix: `(−${stats.wrong})` },
                    { label: 'Skipped', value: stats.skipped, color: C.orange, bg: C.orangeLight, suffix: '(0)' },
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: '24px 0', textAlign: 'center', background: s.bg,
                      flex: '1 1 100px', minWidth: 100,
                      borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                      borderBottom: `1px solid ${C.border}`, // Since they might wrap, a bottom border is safe, or we can leave it
                    }}>
                      <div style={{ fontSize: 34, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{s.suffix}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
                <button
                  onClick={() => { setScreen(SCREEN.SETUP); }}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 14,
                    border: `1.5px solid ${C.border}`, background: C.white,
                    fontSize: 14, fontWeight: 700, color: C.text, cursor: 'pointer',
                  }}
                >← New Quiz</button>
                <button
                  onClick={() => {
                    const qs = getQuestions(topic, difficulty === 'All' ? null : difficulty, count);
                    setQuestions(qs); setAnswers({}); setFlagged(new Set());
                    setCurrent(0); setShowExplain(false); setScreen(SCREEN.QUIZ);
                    if (timerOn) startTimer((DEFAULT_TIME[count] || 10) * 60);
                  }}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 14,
                    border: 'none', background: C.indigo,
                    fontSize: 14, fontWeight: 700, color: C.white, cursor: 'pointer',
                  }}
                >↺ Retry Same Config</button>
                {user && (
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/quiz?topic=${topic}&difficulty=${difficulty}&count=${count}&challengeScore=${stats.score}&challenger=${encodeURIComponent(user.email?.split('@')[0] || 'Friend')}`;
                      navigator.clipboard.writeText(shareUrl);
                      alert('Challenge link copied to clipboard! Share it with your friend.');
                    }}
                    style={{
                      flex: 1, padding: '13px 0', borderRadius: 14,
                      border: 'none', background: '#8b5cf6',
                      fontSize: 14, fontWeight: 700, color: C.white, cursor: 'pointer',
                    }}
                  >⚔️ Challenge a Friend</button>
                )}
              </div>

              {/* Question Review Table */}
              <div style={{
                background: C.white, borderRadius: 20, border: `1px solid ${C.border}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden',
              }}>
                <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 15, color: C.text }}>
                  Question-wise Review
                </div>
                <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                  {questions.map((q, i) => {
                    const userAns = answers[i];
                    const isCorrect = userAns === q.correct;
                    const isSkipped = userAns === undefined;
                    const status = isSkipped ? 'skip' : isCorrect ? 'ok' : 'wrong';
                    const bgMap = { ok: '#f0fdf4', wrong: '#fff1f2', skip: '#fefce8' };
                    const colorMap = { ok: C.green, wrong: C.red, skip: C.orange };
                    const labelMap = { ok: '+4', wrong: '−1', skip: '0' };
                    return (
                      <div key={i} style={{
                        padding: '16px 28px', borderBottom: `1px solid ${C.border}`,
                        background: i % 2 === 0 ? '#fafafa' : C.white,
                        display: 'flex', gap: 16, alignItems: 'flex-start',
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: bgMap[status], border: `2px solid ${colorMap[status]}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: colorMap[status], marginTop: 2,
                        }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, color: C.text, fontWeight: 500, margin: '0 0 8px', lineHeight: 1.5 }}>
                            {q.question}
                          </p>
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
                            <span style={{ color: C.sub }}>
                              Your answer: <strong style={{ color: isSkipped ? C.orange : isCorrect ? C.green : C.red }}>
                                {isSkipped ? 'Skipped' : `${String.fromCharCode(65 + userAns)}: ${q.options[userAns]}`}
                              </strong>
                            </span>
                            {!isCorrect && !isSkipped && (
                              <span style={{ color: C.sub }}>
                                Correct: <strong style={{ color: C.green }}>{String.fromCharCode(65 + q.correct)}: {q.options[q.correct]}</strong>
                              </span>
                            )}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 12, color: '#4b5563', background: '#f8faff', padding: '8px 12px', borderRadius: 8, lineHeight: 1.6 }}>
                            💡 {q.explanation}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: colorMap[status], flexShrink: 0, marginTop: 2 }}>
                          {labelMap[status]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function ConfigSection({ label, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 14 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, borderRadius: 6, padding: '3px 8px' }}>
      {children}
    </span>
  );
}

function diffColor(d) {
  if (d === 'Easy') return '#16a34a';
  if (d === 'Medium') return '#d97706';
  if (d === 'Hard') return '#dc2626';
  return '#6366f1'; // JEE
}
function diffBg(d) {
  if (d === 'Easy') return '#dcfce7';
  if (d === 'Medium') return '#fef3c7';
  if (d === 'Hard') return '#fee2e2';
  return '#e0e7ff'; // JEE
}
