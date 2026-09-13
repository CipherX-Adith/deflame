/**
 * DEFLAMES Malayalam / Manglish Funny Voice Verdict Engine
 * 
 * Auto-plays funny Malayalam/Manglish voice verdict based on relationship outcome:
 * - Low Breakup (<50%): Congratulatory Heaven verdict with laugh
 * - High Breakup (>=50%): "Sorry bro, you trapped, bye go to hell" with funny laugh
 */

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
      // Funny Malayalam / Manglish Trapped to Hell message with laughing
      text: 'Sorry bro, nee trapped aayi! Oru rakshayum illa, bye, go to hell! Ha ha ha ha ha!',
      displayMalayalam: 'സോറി ബ്രോ, നീ ട്രാപ്പിലായി! ഒരു രക്ഷയുമില്ല, ബൈ, ഗോ ടു ഹെൽ! ഹാ ഹാ ഹാ!',
      rate: 0.95,
      pitch: 1.22
    };
  }
}

function selectBestVoice(availableVoices) {
  if (!availableVoices || availableVoices.length === 0) return null;

  // 1. Look for Malayalam voice if installed
  const mlVoice = availableVoices.find(v => v.lang === 'ml-IN' || v.lang.startsWith('ml') || v.name.toLowerCase().includes('malayalam'));
  if (mlVoice) return mlVoice;

  // 2. Look for Indian English / South Asian voice (speaks Manglish with authentic comedic tone)
  const inVoice = availableVoices.find(v => v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Indian'));
  if (inVoice) return inVoice;

  // 3. Look for popular clear voices (Google, Samantha, Microsoft)
  const preferred = ['Google', 'Samantha', 'Microsoft', 'Daniel', 'Alex'];
  for (const name of preferred) {
    const match = availableVoices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
    if (match) return match;
  }

  // 4. Any English voice
  const enVoice = availableVoices.find(v => v.lang.startsWith('en'));
  if (enVoice) return enVoice;

  return availableVoices[0];
}

export function speakVerdict(result, onStart, onEnd, onError) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    if (onError) onError('Speech synthesis not supported in this browser.');
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const verdict = getMalayalamVerdict(result);
    if (verdict.error) return;

    const utterance = new SpeechSynthesisUtterance(verdict.text);
    utterance.rate = verdict.rate || 0.95;
    utterance.pitch = verdict.pitch || 1.25;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const bestVoice = selectBestVoice(voices);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        if (onError) onError(e);
      }
      if (onEnd) onEnd();
    };

    // Small timeout to ensure clean speech queue
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 120);

  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onError) onError(err);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
