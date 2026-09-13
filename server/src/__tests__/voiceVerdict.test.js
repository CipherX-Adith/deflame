const { test, describe } = require('node:test');
const assert = require('node:assert');

function getVerdictVoice(result) {
  if (!result) {
    return { error: 'Voice unavailable: result data is missing.' };
  }

  let raw = result.breakupProbability ?? result.breakup_probability ?? result.breakup_percentage;

  if (raw === undefined || raw === null) {
    return { error: 'Voice unavailable: breakup probability is missing.' };
  }

  let num;
  if (typeof raw === 'string') {
    const cleaned = raw.replace('%', '').trim();
    num = Number(cleaned);
  } else if (typeof raw === 'number') {
    num = raw <= 1 && raw > 0 && !Number.isInteger(raw) ? raw * 100 : raw;
  }

  if (!Number.isFinite(num)) {
    return { error: 'Voice unavailable: breakup probability is missing or invalid.' };
  }

  const p = Math.max(0, Math.min(100, Math.round(num)));

  if (p < 50) {
    return {
      type: 'positive',
      probability: p,
      text: 'Congratulations! You two made it through the DEFLAMES scan. Enjoy your heaven!'
    };
  } else {
    return {
      type: 'negative',
      probability: p,
      text: 'Sorry bro, you got trapped. Bye, go to hell!'
    };
  }
}

describe('Voice Verdict Logic Tests', () => {
  test('Probability < 50 triggers positive congratulations message', () => {
    const res1 = getVerdictVoice({ breakupProbability: 40 });
    assert.strictEqual(res1.type, 'positive');
    assert.strictEqual(res1.text, 'Congratulations! You two made it through the DEFLAMES scan. Enjoy your heaven!');

    const res2 = getVerdictVoice({ breakup_percentage: '27%' });
    assert.strictEqual(res2.type, 'positive');
    assert.strictEqual(res2.text, 'Congratulations! You two made it through the DEFLAMES scan. Enjoy your heaven!');
  });

  test('Probability >= 50 triggers negative trapped message', () => {
    const res1 = getVerdictVoice({ breakupProbability: 63 });
    assert.strictEqual(res1.type, 'negative');
    assert.strictEqual(res1.text, 'Sorry bro, you got trapped. Bye, go to hell!');

    const res2 = getVerdictVoice({ breakup_percentage: '85%' });
    assert.strictEqual(res2.type, 'negative');
    assert.strictEqual(res2.text, 'Sorry bro, you got trapped. Bye, go to hell!');
  });

  test('Exactly 50% triggers negative trapped message', () => {
    const res = getVerdictVoice({ breakupProbability: 50 });
    assert.strictEqual(res.type, 'negative');
    assert.strictEqual(res.text, 'Sorry bro, you got trapped. Bye, go to hell!');
  });

  test('Handles decimal fraction input (0.40 -> positive, 0.50 -> negative)', () => {
    const resPositive = getVerdictVoice({ breakup_probability: 0.35 });
    assert.strictEqual(resPositive.type, 'positive');

    const resNegative = getVerdictVoice({ breakup_probability: 0.72 });
    assert.strictEqual(resNegative.type, 'negative');
  });

  test('Handles missing / invalid values with error object', () => {
    const resMissing = getVerdictVoice({});
    assert.ok(resMissing.error);
    assert.strictEqual(resMissing.error, 'Voice unavailable: breakup probability is missing.');
  });
});
