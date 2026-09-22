// Utility to track seen quiz questions to prevent immediate repetition.
// Data is stored in localStorage under 'valenzy_seen_questions'
// Format: { [topicId]: [id1, id2, ...] }

const STORAGE_KEY = 'valenzy_seen_questions';

function getStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to read seen questions from localStorage', e);
    return {};
  }
}

function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save seen questions to localStorage', e);
  }
}

export function getSeenQuestions(topicId) {
  const data = getStorage();
  if (topicId === 'all') {
    // Return all seen IDs across all topics
    return Object.values(data).flat();
  }
  return data[topicId] || [];
}

export function markQuestionsAsSeen(topicId, questionIds) {
  const data = getStorage();
  
  if (topicId === 'all') {
    const currentSeen = data['all'] || [];
    data['all'] = [...new Set([...currentSeen, ...questionIds])];
  } else {
    const currentSeen = data[topicId] || [];
    data[topicId] = [...new Set([...currentSeen, ...questionIds])];
  }
  
  saveStorage(data);
}

export function resetSeenQuestions(topicId) {
  const data = getStorage();
  if (topicId === 'all') {
    data['all'] = [];
  } else {
    data[topicId] = [];
  }
  saveStorage(data);
}
