/**
 * Master DEFLAMES Algorithm Engine
 */

const { cancelLetters, computeBaseDuration } = require('./flamesEngine');
const { scoreAnswers } = require('./questionnaire');
const {
  computeStabilityIndex,
  computeDecayRate,
  computeLifespan,
  computeExpiryDate,
  computeBreakupProbability,
  generateDecayCurve
} = require('./decayEngine');
const { generateReasons } = require('./reasonEngine');

function calculateDeflames({ name1 = '', name2 = '', answers = {}, mode = 'relationship', fromDate = new Date() }) {
  // 1. FLAMES cancellation & base duration
  const cancellation = cancelLetters(name1, name2);
  const baseData = computeBaseDuration(cancellation.n);

  // 2. Questionnaire dimension scoring
  const scores = scoreAnswers(answers);

  // 3. Stability Index S
  const S = computeStabilityIndex(scores);

  // 4. Decay Rate d
  const d = computeDecayRate(S);

  // 5. Lifespan & Expiry Date
  const lifespan = computeLifespan(d, baseData.base_duration);
  const expiry = computeExpiryDate(lifespan.t_final, fromDate);

  // 6. Breakup Probability (deterministic flavor noise seeded by remaining letters)
  const pseudoNoise = ((cancellation.n % 7) - 3) * 0.01;
  const breakup_probability = computeBreakupProbability(S, scores.K, scores.G, pseudoNoise);

  // 7. Separation reasons
  const reasonData = generateReasons(scores, mode);

  // 8. Decay Curve Data
  const decay_curve = generateDecayCurve(S, d, 48);

  return {
    name1: name1.trim(),
    name2: name2.trim(),
    mode,
    duration_months: lifespan.duration_months,
    duration_days: lifespan.duration_days,
    lifespan_text: `${lifespan.duration_months} months ${lifespan.duration_days} days`,
    expiry_date: expiry.isoDate,
    expiry_formatted: expiry.formattedDate,
    breakup_probability,
    breakup_percentage: `${Math.round(breakup_probability * 100)}%`,
    primary_reason: reasonData.primary_reason,
    secondary_factors: reasonData.secondary_factors,
    dimensions: {
      C: scores.C,
      T: scores.T,
      I: scores.I,
      F: scores.F,
      G: scores.G,
      K: scores.K
    },
    ranked_dimensions: reasonData.ranked_dimensions,
    decay_curve,
    debug: {
      n_remaining_letters: cancellation.n,
      common_cancelled: cancellation.commonCancelled,
      base_min_months: baseData.base_min,
      base_max_months: baseData.base_max,
      base_duration_months: baseData.base_duration,
      stability_index: S,
      decay_rate: d,
      t_expiry_months: lifespan.t_expiry_months,
      t_final_months: lifespan.t_final
    }
  };
}

module.exports = {
  calculateDeflames
};
