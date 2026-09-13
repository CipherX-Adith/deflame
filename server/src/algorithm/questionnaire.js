/**
 * Questionnaire Dimension Scoring Engine
 * 
 * Maps user questionnaire answers to normalized scores [0, 1] for dimensions:
 * C - Communication
 * T - Time together
 * I - Interests overlap
 * F - Finances
 * G - Life Goals
 * K - Conflict handling
 */

const SCORING_MAP = {
  argue_frequency: {
    "Rarely": 1.0,
    "Sometimes": 0.7,
    "Often": 0.4,
    "Constantly": 0.15
  },
  communication_style: {
    "Very open and direct": 1.0,
    "Mostly open": 0.75,
    "Sometimes avoidant": 0.45,
    "Mostly avoidant or aggressive": 0.2
  },
  time_together: {
    "Less than 5 hours": 0.3,
    "<5h": 0.3,
    "5–10 hours": 0.6,
    "5-10 hours": 0.6,
    "5-10h": 0.6,
    "10–20 hours": 0.85,
    "10-20 hours": 0.85,
    "10-20h": 0.85,
    "More than 20 hours": 1.0,
    ">20h": 1.0
  },
  goals_similarity: {
    "Very different": 0.2,
    "Somewhat different": 0.5,
    "Mostly similar": 0.8,
    "Very similar": 1.0
  },
  financial_compatibility: {
    "Very different": 0.2,
    "Somewhat different": 0.5,
    "Mostly similar": 0.75,
    "Very similar": 1.0
  },
  interests_overlap: {
    "Low": 0.3,
    "Medium": 0.65,
    "High": 1.0
  },
  conflict_handling: {
    "We resolve calmly": 1.0,
    "We argue but reconcile": 0.7,
    "We often leave things unresolved": 0.4,
    "We frequently escalate conflicts": 0.15
  }
};

function normalizeScore(val, defaultVal = 0.5) {
  if (typeof val === 'number') {
    return Math.max(0, Math.min(1, val));
  }
  return defaultVal;
}

function scoreAnswers(answers = {}) {
  // Check if answers already contains raw dimension numbers (e.g. from What-If slider)
  if (answers.C !== undefined && answers.T !== undefined && answers.G !== undefined) {
    const C = normalizeScore(answers.C, 0.75);
    const T = normalizeScore(answers.T, 0.6);
    const I = normalizeScore(answers.I, 0.65);
    const F = normalizeScore(answers.F, 0.75);
    const G = normalizeScore(answers.G, 0.8);
    const K = normalizeScore(answers.K, 0.7);

    return { C, T, I, F, G, K, rawAnswers: answers };
  }

  const dynamicAnswers = Object.values(answers).filter((answer) =>
    answer && typeof answer === 'object' && typeof answer.score === 'number' && answer.dimension
  );
  if (dynamicAnswers.length > 0) {
    const buckets = { C: [], T: [], I: [], F: [], G: [], K: [] };
    dynamicAnswers.forEach(({ dimension, score }) => {
      if (buckets[dimension]) buckets[dimension].push(normalizeScore(score));
    });
    const average = (dimension, fallback) => {
      const values = buckets[dimension];
      return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4)) : fallback;
    };
    return {
      C: average('C', 0.75), T: average('T', 0.6), I: average('I', 0.65),
      F: average('F', 0.75), G: average('G', 0.8), K: average('K', 0.7), rawAnswers: answers
    };
  }

  // Map from question answers
  const k1Answer = answers.argue_frequency;
  const K1 = SCORING_MAP.argue_frequency[k1Answer] ?? 0.7;

  const cAnswer = answers.communication_style;
  const C = SCORING_MAP.communication_style[cAnswer] ?? 0.75;

  const tAnswer = answers.time_together;
  const T = SCORING_MAP.time_together[tAnswer] ?? 0.6;

  const gAnswer = answers.goals_similarity;
  const G = SCORING_MAP.goals_similarity[gAnswer] ?? 0.8;

  const fAnswer = answers.financial_compatibility;
  const F = SCORING_MAP.financial_compatibility[fAnswer] ?? 0.75;

  const iAnswer = answers.interests_overlap;
  const I = SCORING_MAP.interests_overlap[iAnswer] ?? 0.65;

  const k2Answer = answers.conflict_handling;
  const K2 = SCORING_MAP.conflict_handling[k2Answer] ?? 0.7;

  const K = (K1 + K2) / 2;

  return {
    C: Number(C.toFixed(4)),
    T: Number(T.toFixed(4)),
    I: Number(I.toFixed(4)),
    F: Number(F.toFixed(4)),
    G: Number(G.toFixed(4)),
    K: Number(K.toFixed(4)),
    breakdown: { K1, K2 },
    rawAnswers: answers
  };
}

module.exports = {
  SCORING_MAP,
  scoreAnswers
};
