const { test, describe } = require('node:test');
const assert = require('node:assert');
const { cancelLetters, computeBaseDuration } = require('../algorithm/flamesEngine');
const { scoreAnswers } = require('../algorithm/questionnaire');
const { computeStabilityIndex, computeDecayRate, computeLifespan } = require('../algorithm/decayEngine');
const { calculateDeflames } = require('../algorithm/index');

describe('DEFLAMES Algorithm Unit Tests', () => {
  test('cancelLetters correctly handles multiplicity (anna & ban)', () => {
    const result = cancelLetters('anna', 'ban');
    // anna: a:2, n:2
    // ban: b:1, a:1, n:1
    // common: 1 a, 1 n
    // remaining anna: 1 a, 1 n (2)
    // remaining ban: 1 b (1)
    // total = 3
    assert.strictEqual(result.n, 3);
    assert.deepStrictEqual(result.commonCancelled, { a: 1, n: 1 });
  });

  test('computeBaseDuration boundary mappings', () => {
    assert.strictEqual(computeBaseDuration(3).base_duration, 4.5);
    assert.strictEqual(computeBaseDuration(4).base_duration, 4.5);
    assert.strictEqual(computeBaseDuration(6).base_duration, 9.0);
    assert.strictEqual(computeBaseDuration(10).base_duration, 18.0);
    assert.strictEqual(computeBaseDuration(15).base_duration, 36.0);
  });

  test('scoreAnswers scores questionnaire correctly', () => {
    const answers = {
      argue_frequency: 'Sometimes',
      communication_style: 'Mostly open',
      time_together: '5–10 hours',
      goals_similarity: 'Mostly similar',
      financial_compatibility: 'Somewhat different',
      interests_overlap: 'Medium',
      conflict_handling: 'We argue but reconcile'
    };
    const scores = scoreAnswers(answers);
    assert.strictEqual(scores.C, 0.75);
    assert.strictEqual(scores.T, 0.6);
    assert.strictEqual(scores.G, 0.8);
    assert.strictEqual(scores.F, 0.5);
    assert.strictEqual(scores.I, 0.65);
    // K = (0.7 + 0.7) / 2 = 0.7
    assert.strictEqual(scores.K, 0.7);
  });

  test('Stability index calculation matches weights', () => {
    const scores = { C: 0.75, T: 0.6, I: 0.65, F: 0.5, G: 0.8, K: 0.7 };
    // S = 0.20*0.75 + 0.15*0.6 + 0.10*0.65 + 0.15*0.5 + 0.25*0.8 + 0.15*0.7
    // S = 0.15 + 0.09 + 0.065 + 0.075 + 0.20 + 0.105 = 0.685
    const S = computeStabilityIndex(scores);
    assert.strictEqual(S, 0.685);
  });

  test('calculateDeflames produces complete valid schema matching API spec', () => {
    const result = calculateDeflames({
      name1: 'Alice',
      name2: 'Bob',
      answers: {
        argue_frequency: 'Sometimes',
        communication_style: 'Mostly open',
        time_together: '5–10 hours',
        goals_similarity: 'Mostly similar',
        financial_compatibility: 'Somewhat different',
        interests_overlap: 'Medium',
        conflict_handling: 'We argue but reconcile'
      }
    });

    assert.ok(result.duration_months >= 3 && result.duration_months <= 48);
    assert.ok(result.expiry_date.match(/^\d{4}-\d{2}-\d{2}$/));
    assert.ok(result.breakup_probability >= 0.1 && result.breakup_probability <= 0.95);
    assert.ok(result.primary_reason.length > 5);
    assert.ok(Array.isArray(result.secondary_factors));
    assert.ok(result.debug.n_remaining_letters !== undefined);
  });
});
