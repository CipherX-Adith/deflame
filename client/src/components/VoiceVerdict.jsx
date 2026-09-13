import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, AlertCircle, Play, Square, Sparkles } from 'lucide-react';

/**
 * Calculates the exact verdict voice text and configuration from result data.
 */
export function getVerdictVoice(result) {
  if (!result) {
    return { error: 'Voice unavailable: result data is missing.' };
  }

  // Extract raw probability from multiple possible property formats
  let raw = result.breakupProbability ?? result.breakup_probability ?? result.breakup_percentage;

  if (raw === undefined || raw === null) {
    return { error: 'Voice unavailable: breakup probability is missing.' };
  }

  // Clean string or number: handle "40%", "0.40", 40, etc.
  let num;
  if (typeof raw === 'string') {
    const cleaned = raw.replace('%', '').trim();
    num = Number(cleaned);
  } else if (typeof raw === 'number') {
    // If it's a decimal between 0 and 1, convert to 0-100 percentage
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
      text: 'Congratulations! You two made it through the DEFLAMES scan. Enjoy your heaven!',
      rate: 0.95,
      pitch: 1.25
    };
  } else {
    // p >= 50 (including exactly 50)
    return {
      type: 'negative',
      probability: p,
      text: 'Sorry bro, you got trapped. Bye, go to hell!',
      rate: 0.94,
      pitch: 1.20
    };
  }
}

export default function VoiceVerdict({ result }) {
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('VOICE READY'); // 'VOICE READY' | 'PLAYING VERDICT…' | 'VOICE FINISHED' | 'STOPPED'
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceError, setVoiceError] = useState(null);

  const utteranceRef = useRef(null);

  // Check Web Speech API support & load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices() || [];
        setVoices(availableVoices);
      } catch (e) {
        // Fallback gracefully
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel speech if result changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setVoiceStatus('VOICE READY');
    setHasPlayedOnce(false);
    setVoiceError(null);
  }, [result]);

  const selectBestVoice = (availableVoices) => {
    if (!availableVoices || availableVoices.length === 0) return null;

    // Prefer English voices with Google, Samantha, Microsoft, or Daniel
    const preferredNames = ['Google', 'Samantha', 'Microsoft', 'Daniel', 'Alex', 'Karen'];
    
    // 1. Preferred English voice
    for (const name of preferredNames) {
      const match = availableVoices.find(v => 
        v.name.includes(name) && (v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB'))
      );
      if (match) return match;
    }

    // 2. Any English voice
    const anyEnglish = availableVoices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) return anyEnglish;

    // 3. Default voice
    const defaultVoice = availableVoices.find(v => v.default);
    if (defaultVoice) return defaultVoice;

    return availableVoices[0];
  };

  const handlePlayVerdict = () => {
    if (!speechSupported) return;

    const verdict = getVerdictVoice(result);
    if (verdict.error) {
      setVoiceError(verdict.error);
      return;
    }

    setVoiceError(null);

    // Cancel any ongoing speech before starting new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(verdict.text);
    utteranceRef.current = utterance;

    // Set voice configuration
    utterance.rate = verdict.rate || 0.95;
    utterance.pitch = verdict.pitch || 1.25;
    utterance.volume = 1.0;

    const chosenVoice = selectBestVoice(voices);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setVoiceStatus('PLAYING VERDICT…');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setVoiceStatus('VOICE FINISHED');
      setHasPlayedOnce(true);
    };

    utterance.onerror = (event) => {
      // Ignore if canceled intentionally
      if (event.error === 'canceled' || event.error === 'interrupted') {
        setIsPlaying(false);
        setVoiceStatus('STOPPED');
        return;
      }
      console.warn('SpeechSynthesis error:', event);
      setIsPlaying(false);
      setVoiceStatus('VOICE ERROR');
      setVoiceError('Speech playback encountered an error. Please try again.');
    };

    utterance.onpause = () => {
      setIsPlaying(false);
      setVoiceStatus('PAUSED');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopVerdict = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setVoiceStatus('STOPPED');
  };

  const verdictMeta = getVerdictVoice(result);

  return (
    <div className="brutal-card p-5 sm:p-6 bg-white border-3 border-black shadow-[6px_6px_0px_#000]">
      {/* Voice Status & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 border-2 border-black ${isPlaying ? 'bg-[#ff3434] text-white animate-pulse' : 'bg-[#fff500] text-black'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-black uppercase text-black block">
              AI VERDICT AUDIO SYNTHESIZER
            </span>
            <span
              aria-live="polite"
              className={`font-mono text-[11px] font-bold uppercase ${
                isPlaying ? 'text-[#ff3434]' : 'text-neutral-600'
              }`}
            >
              STATUS: [{voiceStatus}]
            </span>
          </div>
        </div>

        {/* Verdict Badge */}
        {!verdictMeta.error && (
          <div className="font-mono text-xs font-bold self-start sm:self-auto">
            {verdictMeta.type === 'positive' ? (
              <span className="bg-[#39ff14] text-black border border-black px-2 py-0.5 shadow-[2px_2px_0px_#000]">
                HEAVEN VERDICT (&lt;50% BREAKUP)
              </span>
            ) : (
              <span className="bg-[#ff3434] text-white border border-black px-2 py-0.5 shadow-[2px_2px_0px_#000]">
                TRAPPED VERDICT (≥50% BREAKUP)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Voice Preview Box */}
      {!verdictMeta.error && (
        <div className="p-3 bg-[#f9f9f9] border-2 border-black font-mono text-xs sm:text-sm font-bold text-black mb-4 shadow-[2px_2px_0px_#000] italic">
          "{verdictMeta.text}"
        </div>
      )}

      {/* Error or Warning Message */}
      {(!speechSupported || voiceError || verdictMeta.error) && (
        <div className="p-3 bg-[#fff500] border-2 border-black font-mono text-xs font-bold text-black mb-4 flex items-start gap-2 shadow-[2px_2px_0px_#000]">
          <AlertCircle className="w-4 h-4 text-[#ff3434] shrink-0 mt-0.5" />
          <span>
            {!speechSupported
              ? "Voice playback is not supported in this browser. Try Chrome, Edge, or Safari."
              : (voiceError || verdictMeta.error)}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handlePlayVerdict}
          disabled={!speechSupported || isPlaying || Boolean(verdictMeta.error)}
          className={`w-full sm:flex-1 py-3 px-4 text-xs sm:text-sm font-mono font-black uppercase border-3 border-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isPlaying
              ? 'bg-[#e5e5e5] text-neutral-500 border-neutral-400 cursor-not-allowed'
              : hasPlayedOnce
              ? 'bg-[#fff500] text-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5'
              : 'bg-[#ff3434] text-white shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5'
          }`}
        >
          {isPlaying ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>PLAYING VERDICT VOICE…</span>
            </>
          ) : hasPlayedOnce ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>REPLAY VERDICT</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY VERDICT VOICE</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStopVerdict}
            className="w-full sm:w-auto py-3 px-5 text-xs sm:text-sm font-mono font-black uppercase bg-black text-white border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-neutral-800 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current text-[#ff3434]" />
            <span>STOP VOICE</span>
          </button>
        )}
      </div>
    </div>
  );
}
