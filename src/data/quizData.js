import { getSeenQuestions, resetSeenQuestions } from '../utils/questionTracker';

export const TOPICS = [
  { id: 'all',            label: 'All Topics' },
  { id: 'matter',         label: 'Matter & Its Nature',       class: '9' },
  { id: 'atoms',          label: 'Atoms & Molecules',          class: '9' },
  { id: 'structure',      label: 'Structure of Atom',          class: '9' },
  { id: 'reactions',      label: 'Chemical Reactions',         class: '10' },
  { id: 'acids_bases',    label: 'Acids, Bases & Salts',       class: '10' },
  { id: 'metals',         label: 'Metals & Non-metals',        class: '10' },
  { id: 'carbon',         label: 'Carbon Compounds',           class: '10' },
  { id: 'mole',           label: 'Mole Concept',               class: '11' },
  { id: 'bonding',        label: 'Chemical Bonding',           class: '11' },
  { id: 'thermo',         label: 'Thermodynamics',             class: '11' },
  { id: 'equilibrium',    label: 'Chemical Equilibrium',       class: '11' },
  { id: 'redox',          label: 'Redox & Electrochemistry',  class: '12' },
  { id: 'organic',        label: 'Organic Chemistry',          class: '12' },
  { id: 'coordination',   label: 'Coordination Compounds',     class: '12' },
  { id: 'jee',            label: 'JEE Special',                class: 'JEE' },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'JEE'];

let QUESTIONS_CACHE = null;

export async function fetchQuestionsBank() {
  if (QUESTIONS_CACHE) return QUESTIONS_CACHE;
  try {
    const res = await fetch('/questionBank.json');
    QUESTIONS_CACHE = await res.json();
    return QUESTIONS_CACHE;
  } catch(e) {
    console.error("Failed to fetch questions", e);
    return [];
  }
}

export async function getTopicStats() {
  const qs = await fetchQuestionsBank();
  const stats = {};
  TOPICS.forEach(t => {
    if (t.id === 'all') return;
    stats[t.id] = qs.filter(q => q.topic === t.id).length;
  });
  return {
    stats,
    total: qs.length
  };
}

export async function getQuestions(topicId, difficulty, count) {
  const qs = await fetchQuestionsBank();
  let pool = qs;
  
  if (topicId && topicId !== 'all') pool = pool.filter(q => q.topic === topicId);
  if (difficulty && difficulty !== 'All') pool = pool.filter(q => q.difficulty === difficulty);

  // Implement no-repeat logic
  const seenIds = getSeenQuestions(topicId);
  let unseenPool = pool.filter(q => !seenIds.includes(q.id));
  
  let isRevisionRound = false;

  // If not enough unseen questions remain, trigger revision round
  if (unseenPool.length < count && pool.length >= count) {
    resetSeenQuestions(topicId);
    isRevisionRound = true;
    unseenPool = pool; // use the whole pool again
  }

  const shuffled = [...unseenPool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return {
    questions: selected,
    isRevisionRound,
  };
}
