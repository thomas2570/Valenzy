import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWorksheet, REACTION_TYPES, DIFFICULTY_LEVELS, QUESTION_COUNTS } from '../data/worksheetData';

// ── Equation renderer ──────────────────────────────────────────────────────────
function EquationRow({ parts, mode, questionIndex, userAnswers, setUserAnswers, answers }) {
  let blankIndex = 0;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-0.5 font-mono text-[15px] leading-7">
      {parts.map((part, i) => {
        if (part.op) {
          return <span key={i} className="mx-1.5 text-[#5C6048] font-normal">{part.op}</span>;
        }
        const bIdx = blankIndex++;
        if (mode === 'print') {
          return (
            <span key={i} className="inline-flex items-baseline gap-0.5">
              <span className="inline-block w-5 border-b border-[#8B8878] mr-0.5 mb-0.5" />
              <span className="text-[#2C352E] font-medium" dangerouslySetInnerHTML={{ __html: part.formula }} />
            </span>
          );
        }
        if (mode === 'practice') {
          const key = `${questionIndex}-${bIdx}`;
          return (
            <span key={i} className="inline-flex items-baseline gap-0.5">
              <input
                type="text"
                maxLength={3}
                value={userAnswers[key] || ''}
                onChange={e => setUserAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-9 h-7 text-center text-sm font-bold bg-white border border-[#C8C4BB] rounded text-[#2C352E] focus:outline-none focus:ring-1 focus:ring-[#386638] focus:border-[#386638] mx-0.5"
              />
              <span className="text-[#2C352E] font-medium" dangerouslySetInnerHTML={{ __html: part.formula }} />
            </span>
          );
        }
        if (mode === 'answer_key') {
          const coeff = answers[bIdx];
          return (
            <span key={i} className="inline-flex items-baseline gap-0.5">
              <span className="text-[#2A592A] font-black mr-0.5">{coeff}</span>
              <span className="text-[#2C352E] font-medium" dangerouslySetInnerHTML={{ __html: part.formula }} />
            </span>
          );
        }
        return null;
      })}
    </span>
  );
}

export default function WorksheetPage() {
  // ── Config state ─────────────────────────────────────────────────
  const [exerciseType, setExerciseType]       = useState('Balance');
  const [questionCount, setQuestionCount]     = useState(10);
  const [selectedTypes, setSelectedTypes]     = useState(['synthesis', 'decomposition']);
  const [difficulty, setDifficulty]           = useState('Medium');

  // ── Worksheet state ───────────────────────────────────────────────
  const [worksheet, setWorksheet]   = useState(null);
  const [activeTab, setActiveTab]   = useState('Print');
  const [userAnswers, setUserAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedTypes.length === 0) return;
    setIsGenerating(true);
    setUserAnswers({});
    setTimeout(() => {
      const data = generateWorksheet(selectedTypes, questionCount);
      setWorksheet(data);
      setActiveTab('Print');
      setIsGenerating(false);
    }, 600);
  };

  // Auto-regenerate when configuration changes (only if already generated)
  React.useEffect(() => {
    if (worksheet && selectedTypes.length > 0) {
      const data = generateWorksheet(selectedTypes, questionCount);
      setWorksheet(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionCount, exerciseType, selectedTypes, difficulty]);

  const tabMode = activeTab === 'Print' ? 'print' : activeTab === 'Practice' ? 'practice' : 'answer_key';
  const selectedTypeLabels = REACTION_TYPES
    .filter(t => selectedTypes.includes(t.id))
    .map(t => t.label)
    .join(', ');

  // Convert subscripts in plain text formula for display
  const formatFormula = (text) =>
    text.replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');

  const printRef = useRef(null);
  const handlePrint = () => window.print();

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div
      className="no-print-bg flex print:h-auto print:block"
      style={{
        background: '#EFECE6',
        fontFamily: "'Inter', 'Space Grotesk', sans-serif",
        flexWrap: 'wrap',
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      {/* ── Left Sidebar ─────────────────────────────────────────── */}
      <div
        className="no-print flex flex-col overflow-y-auto"
        style={{
          flex: '1 1 280px',
          maxWidth: '100%',
          background: '#ECE8E1',
          borderRight: '1px solid #D8D4CC',
          padding: '20px 16px 24px',
          gap: 20,
        }}
      >
        {/* Title */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2C352E', letterSpacing: '-0.01em', margin: 0 }}>
          Worksheet Studio
        </h2>

        {/* Exercise Type */}
        <div>
          <Label>Exercise Type</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {['Balance', 'Identify Type'].map(t => (
              <SegBtn key={t} active={exerciseType === t} onClick={() => setExerciseType(t)} flex1>{t}</SegBtn>
            ))}
          </div>
          <div style={{ marginTop: 6 }}>
            <SegBtn active={exerciseType === 'Combined'} onClick={() => setExerciseType('Combined')} full>
              Combined
            </SegBtn>
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <Label>Number of Questions</Label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {QUESTION_COUNTS.map(n => (
              <PillBtn key={n} active={questionCount === n} onClick={() => setQuestionCount(n)}>
                {n}
              </PillBtn>
            ))}
          </div>
        </div>

        {/* Reaction Types */}
        <div>
          <Label>Reaction Types</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {REACTION_TYPES.map(rt => (
              <button
                key={rt.id}
                onClick={() => toggleType(rt.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  background: '#E1DDD5',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* Checkbox */}
                <span style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: selectedTypes.includes(rt.id) ? '#386638' : 'white',
                  border: `2px solid ${selectedTypes.includes(rt.id) ? '#386638' : '#B0AC9F'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedTypes.includes(rt.id) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2C352E' }}>{rt.label}</span>
                  <span style={{ display: 'block', fontSize: 11, color: '#88847C', marginTop: 2, fontStyle: 'italic' }}>{rt.formula}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <Label>Difficulty</Label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {DIFFICULTY_LEVELS.map(d => (
              <SegBtn key={d} active={difficulty === d} onClick={() => setDifficulty(d)} flex1>{d}</SegBtn>
            ))}
          </div>
        </div>

        {/* Spacer to push button down */}
        <div style={{ flex: 1 }} />

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || selectedTypes.length === 0}
          style={{
            width: '100%',
            background: '#386638',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '13px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: selectedTypes.length === 0 ? 'not-allowed' : 'pointer',
            opacity: selectedTypes.length === 0 ? 0.5 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (selectedTypes.length > 0) e.target.style.background = '#2D542D'; }}
          onMouseLeave={e => { e.target.style.background = '#386638'; }}
        >
          {isGenerating ? (
            <>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.916a2 2 0 00-1.272 1.272L12 21l-1.912-5.812a2 2 0 00-1.272-1.272L3 12l5.816-1.916a2 2 0 001.272-1.272L12 3z"/>
              </svg>
              Generate Worksheet
            </>
          )}
        </button>
      </div>

      {/* ── Right Canvas Area ─────────────────────────────────────── */}
      <div className="flex flex-col overflow-hidden print:overflow-visible" style={{ flex: '4 1 400px', minWidth: 300 }}>
        {/* Top Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          padding: '12px 20px',
          minHeight: 56, height: 'auto',
          borderBottom: '1px solid #D8D4CC',
          background: '#EFECE6',
          flexShrink: 0,
        }}>
          {/* Mode Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Print', 'Practice', 'Answer Key'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer',
                  background: activeTab === tab ? '#386638' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#66625B',
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                border: '1px solid #C8C4BB', borderRadius: 8,
                background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: '#4A4641',
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                border: '1px solid #C8C4BB', borderRadius: 8,
                background: '#E3DFD7', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: '#4A4641',
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {today}
            </button>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0">
          {!worksheet ? (
            /* Empty State */
            <div style={{
              height: '100%', minHeight: 400,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, color: '#B0AC9F',
            }}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p style={{ fontSize: 14, color: '#88847C', fontWeight: 500 }}>
                Click 'Generate Worksheet' to create practice problems
              </p>
            </div>
          ) : (
            /* Worksheet Paper */
            <AnimatePresence mode="wait">
              <motion.div
                key={worksheet.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                ref={printRef}
                style={{ maxWidth: 860, margin: '0 auto' }}
              >
                {/* Summary Pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                  background: '#E4E0D8',
                  borderRadius: 16,
                  padding: '8px 16px',
                  fontSize: 13, color: '#66625B', fontWeight: 500,
                  marginBottom: 20,
                }}>
                  {worksheet.count} questions
                  <span style={{ color: '#C8C4BB' }}>•</span>
                  {difficulty}
                  <span style={{ color: '#C8C4BB' }}>•</span>
                  {selectedTypeLabels}
                </div>

                {/* Paper */}
                <div style={{
                  background: '#EBE7DF',
                  borderRadius: 16,
                  padding: '24px 20px',
                }}>
                  {/* Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <h1 style={{
                      fontSize: 24, fontWeight: 800, color: '#2C352E',
                      letterSpacing: '-0.02em', margin: 0,
                      color: activeTab === 'Practice' ? '#4B6CB7' : '#2C352E',
                    }}>
                      {activeTab === 'Print' ? 'Worksheet Generator'
                       : activeTab === 'Practice' ? 'Practice'
                       : 'Answer Key'}
                    </h1>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#88847C',
                      fontFamily: 'monospace', letterSpacing: '0.05em',
                    }}>
                      {worksheet.id}
                    </span>
                  </div>

                  {/* Student Line (Print & Answer Key) */}
                  {activeTab !== 'Practice' && (
                    <div style={{ fontSize: 13, color: '#5C5850', marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: '16px 24px' }}>
                      <span style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>Name: <span style={{ display: 'inline-block', flex: '1 1 120px', minWidth: 120, borderBottom: '1px solid #8B8878' }} /></span>
                      <span style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>Date: <span style={{ display: 'inline-block', flex: '1 1 100px', minWidth: 100, borderBottom: '1px solid #8B8878' }} /></span>
                      <span style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>Score: <span style={{ display: 'inline-block', width: 40, borderBottom: '1px solid #8B8878' }} /> /{worksheet.count}</span>
                    </div>
                  )}

                  {/* Instructions */}
                  <p style={{ fontSize: 13, color: '#66625B', fontStyle: 'italic', marginBottom: 16 }}>
                    {activeTab === 'Practice'
                      ? 'Fill in the coefficients and click Check.'
                      : 'Balance the equations by filling in the coefficients.'}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: '#C8C4BB', marginBottom: 24 }} />

                  {/* Questions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {worksheet.questions.map((q, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: activeTab === 'Answer Key' ? '#DDEBDD' : 'transparent',
                          transition: 'background 0.2s',
                        }}
                      >
                        <span style={{
                          fontSize: 13, fontWeight: 700, color: '#386638',
                          minWidth: 24, textAlign: 'right', flexShrink: 0,
                        }}>
                          {i + 1}.
                        </span>
                        <EquationRow
                          parts={q.parts}
                          mode={tabMode}
                          questionIndex={i}
                          answers={q.answer}
                          userAnswers={userAnswers}
                          setUserAnswers={setUserAnswers}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ textAlign: 'center', marginTop: 48, fontSize: 12, color: '#99958C' }}>
                    Generated by Valenzy
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Spin animation keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Small helper components ───────────────────────────────────────────────────
function Label({ children }) {
  return (
    <span style={{
      display: 'block',
      fontSize: 11, fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#66625B',
    }}>
      {children}
    </span>
  );
}

function SegBtn({ children, active, onClick, full, flex1 }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: flex1 ? 1 : undefined,
        width: full ? '100%' : undefined,
        padding: '8px 14px',
        borderRadius: 10,
        border: 'none',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        background: active ? '#386638' : '#E3DFD7',
        color: active ? '#fff' : '#333',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function PillBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: 40,
        padding: '6px 12px',
        borderRadius: 8,
        border: 'none',
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        cursor: 'pointer',
        background: active ? '#386638' : '#E3DFD7',
        color: active ? '#fff' : '#555',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}
