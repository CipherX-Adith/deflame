/**
 * FLAMES Easter Egg & Name Cancellation Engine
 * 
 * Computes base duration based on cancellation of common characters between two names.
 */

function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

function cancelLetters(name1, name2) {
  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);

  const freq1 = {};
  for (const char of norm1) {
    freq1[char] = (freq1[char] || 0) + 1;
  }

  const freq2 = {};
  for (const char of norm2) {
    freq2[char] = (freq2[char] || 0) + 1;
  }

  const allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  let remainingCount = 0;
  const commonCancelled = {};
  const remaining1 = {};
  const remaining2 = {};

  for (const char of allChars) {
    const c1 = freq1[char] || 0;
    const c2 = freq2[char] || 0;
    const common = Math.min(c1, c2);
    if (common > 0) {
      commonCancelled[char] = common;
    }
    const diff1 = c1 - common;
    const diff2 = c2 - common;
    if (diff1 > 0) remaining1[char] = diff1;
    if (diff2 > 0) remaining2[char] = diff2;
    remainingCount += (diff1 + diff2);
  }

  return {
    norm1,
    norm2,
    n: remainingCount,
    commonCancelled,
    remaining1,
    remaining2
  };
}

function computeBaseDuration(n) {
  let base_min = 3;
  let base_max = 6;

  if (n <= 4) {
    base_min = 3;
    base_max = 6;
  } else if (n >= 5 && n <= 8) {
    base_min = 6;
    base_max = 12;
  } else if (n >= 9 && n <= 12) {
    base_min = 12;
    base_max = 24;
  } else {
    // n > 12
    base_min = 24;
    base_max = 48;
  }

  const base_duration = (base_min + base_max) / 2;

  return {
    base_min,
    base_max,
    base_duration
  };
}

module.exports = {
  normalizeName,
  cancelLetters,
  computeBaseDuration
};
