/**
 * Relationship Decay & Expiry Calculation Engine
 * 
 * Computes stability index S, decay rate d, final lifespan t_final,
 * expiry date, and breakup probability P_break.
 */

const WEIGHTS = {
  w_C: 0.20,
  w_T: 0.15,
  w_I: 0.10,
  w_F: 0.15,
  w_G: 0.25,
  w_K: 0.15
};

const D_BASE = 0.15;
const ALPHA = 1.8;
const K_LIFE = 1.2;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function computeStabilityIndex(scores) {
  const { C, T, I, F, G, K } = scores;
  const S = (
    WEIGHTS.w_C * C +
    WEIGHTS.w_T * T +
    WEIGHTS.w_I * I +
    WEIGHTS.w_F * F +
    WEIGHTS.w_G * G +
    WEIGHTS.w_K * K
  );
  return Number(clamp(S, 0, 1).toFixed(4));
}

function computeDecayRate(S) {
  const d = D_BASE * Math.pow(1 - S, ALPHA) + 0.02;
  return Number(d.toFixed(5));
}

function computeLifespan(d, base_duration) {
  const raw_t_expiry = K_LIFE / d;
  const t_expiry_months = clamp(raw_t_expiry, 3, 48);

  const t_final_raw = 0.7 * t_expiry_months + 0.3 * base_duration;
  const t_final = clamp(t_final_raw, 3, 48);

  let duration_months = Math.floor(t_final);
  let duration_days = Math.round((t_final - duration_months) * 30);

  if (duration_days >= 30) {
    duration_months += 1;
    duration_days = 0;
  }

  return {
    t_expiry_months: Number(t_expiry_months.toFixed(2)),
    t_final: Number(t_final.toFixed(2)),
    duration_months,
    duration_days
  };
}

function computeExpiryDate(t_final, fromDate = new Date()) {
  const totalDays = Math.round(t_final * 30.4375);
  const expiry = new Date(fromDate.getTime());
  expiry.setDate(expiry.getDate() + totalDays);

  const year = expiry.getFullYear();
  const month = String(expiry.getMonth() + 1).padStart(2, '0');
  const day = String(expiry.getDate()).padStart(2, '0');
  const isoDate = `${year}-${month}-${day}`;

  const monthsNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedDate = `${expiry.getDate()} ${monthsNames[expiry.getMonth()]} ${year}`;

  return {
    isoDate,
    formattedDate,
    timestamp: expiry.getTime()
  };
}

function computeBreakupProbability(S, K, G, noise = 0) {
  const goal_mismatch = 1 - G;
  const raw_P_break = 0.6 * (1 - S) + 0.25 * (1 - K) + 0.15 * goal_mismatch + noise;
  const P_break = clamp(raw_P_break, 0.10, 0.95);
  return Number(P_break.toFixed(2));
}

function generateDecayCurve(S, d, totalMonths = 48) {
  const points = [];
  const initialHealth = Math.min(100, Math.round((S * 0.7 + 0.3) * 100));
  
  for (let m = 0; m <= totalMonths; m += 2) {
    // Fictional decay curve: Health(m) = Initial * e^(-d * m)
    const health = Math.max(0, Math.round(initialHealth * Math.exp(-d * m * 1.1)));
    points.push({
      month: m,
      health
    });
  }
  return points;
}

module.exports = {
  WEIGHTS,
  computeStabilityIndex,
  computeDecayRate,
  computeLifespan,
  computeExpiryDate,
  computeBreakupProbability,
  generateDecayCurve
};
