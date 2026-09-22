// Chemical equation balancing worksheet data
// Each equation has: reactants, products, and balanced coefficients

export const REACTION_TYPES = [
  { id: 'synthesis',          label: 'Synthesis',           formula: 'A + B → AB' },
  { id: 'decomposition',      label: 'Decomposition',       formula: 'AB → A + B' },
  { id: 'single_replacement', label: 'Single Replacement',  formula: 'A + BC → AC + B' },
  { id: 'double_replacement', label: 'Double Replacement',  formula: 'AB + CD → AD + CB' },
  { id: 'combustion',        label: 'Combustion',           formula: 'Hydrocarbon + O₂' },
];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const QUESTION_COUNTS = [5, 10, 20, 30, 50];

// Equations bank — each entry has display parts (with blanks) and answers
// `parts` = array of {coeff: number|null, formula: string, role: 'reactant'|'product'}
// `display` = human-readable unbalanced form
// The balanced coefficients go in the `answer` array (one number per blank, left-to-right)
export const EQUATIONS = {
  synthesis: [
    {
      display: '__ Li + __ N₂ → __ Li₃N',
      parts: [
        { blank: true, formula: 'Li', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'N₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'Li₃N', side: 'right' },
      ],
      answer: [6, 1, 2],
    },
    {
      display: '__ Al + __ S → __ Al₂S₃',
      parts: [
        { blank: true, formula: 'Al', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'S', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'Al₂S₃', side: 'right' },
      ],
      answer: [2, 3, 1],
    },
    {
      display: '__ P₄ + __ O₂ → __ P₄O₁₀',
      parts: [
        { blank: true, formula: 'P₄', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'P₄O₁₀', side: 'right' },
      ],
      answer: [1, 5, 1],
    },
    {
      display: '__ Fe + __ Cl₂ → __ FeCl₃',
      parts: [
        { blank: true, formula: 'Fe', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'Cl₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'FeCl₃', side: 'right' },
      ],
      answer: [2, 3, 2],
    },
    {
      display: '__ Na + __ O₂ → __ Na₂O',
      parts: [
        { blank: true, formula: 'Na', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'Na₂O', side: 'right' },
      ],
      answer: [4, 1, 2],
    },
    {
      display: '__ H₂ + __ N₂ → __ NH₃',
      parts: [
        { blank: true, formula: 'H₂', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'N₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'NH₃', side: 'right' },
      ],
      answer: [3, 1, 2],
    },
  ],
  decomposition: [
    {
      display: '__ AgNO₃ → __ Ag + __ NO₂ + __ O₂',
      parts: [
        { blank: true, formula: 'AgNO₃', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'Ag', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'NO₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'right' },
      ],
      answer: [2, 2, 2, 1],
    },
    {
      display: '__ PbO₂ → __ PbO + __ O₂',
      parts: [
        { blank: true, formula: 'PbO₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'PbO', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'right' },
      ],
      answer: [2, 2, 1],
    },
    {
      display: '__ KNO₃ → __ KNO₂ + __ O₂',
      parts: [
        { blank: true, formula: 'KNO₃', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'KNO₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'right' },
      ],
      answer: [2, 2, 1],
    },
    {
      display: '__ NH₄NO₃ → __ N₂O + __ H₂O',
      parts: [
        { blank: true, formula: 'NH₄NO₃', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'N₂O', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'H₂O', side: 'right' },
      ],
      answer: [1, 1, 2],
    },
    {
      display: '__ Al₂O₃ → __ Al + __ O₂',
      parts: [
        { blank: true, formula: 'Al₂O₃', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'Al', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'right' },
      ],
      answer: [2, 4, 3],
    },
    {
      display: '__ Fe + __ O₂ → __ Fe₂O₃',
      parts: [
        { blank: true, formula: 'Fe', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'Fe₂O₃', side: 'right' },
      ],
      answer: [4, 3, 2],
    },
  ],
  single_replacement: [
    {
      display: '__ Zn + __ HCl → __ ZnCl₂ + __ H₂',
      parts: [
        { blank: true, formula: 'Zn', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'HCl', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'ZnCl₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'H₂', side: 'right' },
      ],
      answer: [1, 2, 1, 1],
    },
    {
      display: '__ Fe + __ CuSO₄ → __ FeSO₄ + __ Cu',
      parts: [
        { blank: true, formula: 'Fe', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'CuSO₄', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'FeSO₄', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'Cu', side: 'right' },
      ],
      answer: [1, 1, 1, 1],
    },
    {
      display: '__ Mg + __ HCl → __ MgCl₂ + __ H₂',
      parts: [
        { blank: true, formula: 'Mg', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'HCl', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'MgCl₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'H₂', side: 'right' },
      ],
      answer: [1, 2, 1, 1],
    },
  ],
  double_replacement: [
    {
      display: '__ AgNO₃ + __ NaCl → __ AgCl + __ NaNO₃',
      parts: [
        { blank: true, formula: 'AgNO₃', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'NaCl', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'AgCl', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'NaNO₃', side: 'right' },
      ],
      answer: [1, 1, 1, 1],
    },
    {
      display: '__ BaCl₂ + __ Na₂SO₄ → __ BaSO₄ + __ NaCl',
      parts: [
        { blank: true, formula: 'BaCl₂', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'Na₂SO₄', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'BaSO₄', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'NaCl', side: 'right' },
      ],
      answer: [1, 1, 1, 2],
    },
    {
      display: '__ Pb(NO₃)₂ + __ KI → __ PbI₂ + __ KNO₃',
      parts: [
        { blank: true, formula: 'Pb(NO₃)₂', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'KI', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'PbI₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'KNO₃', side: 'right' },
      ],
      answer: [1, 2, 1, 2],
    },
  ],
  combustion: [
    {
      display: '__ CH₄ + __ O₂ → __ CO₂ + __ H₂O',
      parts: [
        { blank: true, formula: 'CH₄', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'CO₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'H₂O', side: 'right' },
      ],
      answer: [1, 2, 1, 2],
    },
    {
      display: '__ C₂H₆ + __ O₂ → __ CO₂ + __ H₂O',
      parts: [
        { blank: true, formula: 'C₂H₆', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'CO₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'H₂O', side: 'right' },
      ],
      answer: [2, 7, 4, 6],
    },
    {
      display: '__ C₃H₈ + __ O₂ → __ CO₂ + __ H₂O',
      parts: [
        { blank: true, formula: 'C₃H₈', side: 'left' },
        { op: '+' },
        { blank: true, formula: 'O₂', side: 'left' },
        { op: '→' },
        { blank: true, formula: 'CO₂', side: 'right' },
        { op: '+' },
        { blank: true, formula: 'H₂O', side: 'right' },
      ],
      answer: [1, 5, 3, 4],
    },
  ],
};

export function generateWorksheet(selectedTypes, count) {
  let pool = [];
  selectedTypes.forEach(type => {
    if (EQUATIONS[type]) {
      pool = pool.concat(EQUATIONS[type].map(eq => ({ ...eq, type })));
    }
  });
  
  if (pool.length === 0) return null;

  let finalQuestions = [];
  // Keep shuffling and adding from the pool until we meet the requested count
  while (finalQuestions.length < count) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    finalQuestions = finalQuestions.concat(shuffled);
  }

  // Generate a unique ID
  const id = '#' + Math.random().toString(36).toUpperCase().substr(2, 6);
  return {
    id,
    count,
    questions: finalQuestions.slice(0, count),
    selectedTypes,
  };
}
