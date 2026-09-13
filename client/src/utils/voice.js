/**
 * DEFLAMES Malayalam / Manglish Funny Voice Verdict Engine
 * 
 * Auto-plays the supplied verdict recordings based on relationship outcome:
 * - Low Breakup (<50%): supplied positive recording
 * - High Breakup (>=50%): supplied negative recording
 */

const VERDICT_AUDIO = {
  negative: '/audio/breakup-50-and-above.mpeg',
  positive: '/audio/breakup-below-50-loop.mpeg'
};

let activeAudio = null;

export function getMalayalamVerdict(result) {
  if (!result) {
    return { error: 'Result data is missing.' };
  }

  let raw = result.breakupProbability ?? result.breakup_probability ?? result.breakup_percentage;

  let num;
  if (typeof raw === 'string') {
    const cleaned = raw.replace('%', '').trim();
    num = Number(cleaned);
  } else if (typeof raw === 'number') {
    num = raw <= 1 && raw > 0 && !Number.isInteger(raw) ? raw * 100 : raw;
  } else {
    num = 50;
  }

  const p = Math.max(0, Math.min(100, Math.round(num)));

  if (p < 50) {
    return {
      type: 'positive',
      probability: p,
      audioSrc: VERDICT_AUDIO.positive,
      loop: true,
      // Funny Malayalam / Manglish Congratulatory Heaven message with laughing
      text: 'Congratulations aliya! Ningal randu perum DEFLAMES scan-il rekshapettu. Enjoy your heaven! Ha ha ha ha ha!',
      displayMalayalam: 'കൺഗ്രാജുലേഷൻസ് അളിയാ! നിങ്ങൾ രണ്ടുപേരും രക്ഷപ്പെട്ടു. എൻജോയ് യുവർ ഹെവൻ! ഹാ ഹാ ഹാ!',
      rate: 0.96,
      pitch: 1.28
    };
  } else {
    return {
      type: 'negative',
      probability: p,
      audioSrc: VERDICT_AUDIO.negative,
      loop: false,
      // Funny Malayalam / Manglish Trapped to Hell message with laughing
      text: 'Sorry bro, nee trapped aayi! Oru rakshayum illa, bye, go to hell! Ha ha ha ha ha!',
      displayMalayalam: 'സോറി ബ്രോ, നീ ട്രാപ്പിലായി! ഒരു രക്ഷയുമില്ല, ബൈ, ഗോ ടു ഹെൽ! ഹാ ഹാ ഹാ!',
      rate: 0.95,
      pitch: 1.22
    };
  }
}

export function speakVerdict(result, onStart, onEnd, onError) {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') {
    if (onError) onError('Audio playback is not supported in this browser.');
    return;
  }

  try {
    stopSpeaking();

    const verdict = getMalayalamVerdict(result);
    if (verdict.error) return;

    const audio = new Audio(verdict.audioSrc);
    activeAudio = audio;
    audio.preload = 'auto';
    audio.loop = verdict.loop === true;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      if (activeAudio === audio) activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      if (activeAudio === audio) activeAudio = null;
      if (onError) onError('Verdict audio could not be played.');
    };

    // Called when the results screen opens, so the selected recording starts automatically.
    audio.play().catch((error) => {
      if (activeAudio === audio) activeAudio = null;
      if (onError) onError(error);
    });

  } catch (err) {
    console.warn('Verdict audio error:', err);
    if (onError) onError(err);
  }
}

export function stopSpeaking() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}
