import React, { useState, useMemo } from 'react';
import { ArrowRight, AlertTriangle, Sparkles, Dices } from 'lucide-react';
import { playSound } from '../utils/audio';

const SAMPLE_COUPLES = [
  { n1: "Ross", n2: "Rachel" },
  { n1: "Romeo", n2: "Juliet" },
  { n1: "Barbie", n2: "Ken" },
  { n1: "Batman", n2: "Joker" },
  { n1: "Pam", n2: "Jim" },
  { n1: "Shrek", n2: "Fiona" }
];

export default function LandingPage({ onStart, initialData, onOpenInfo }) {
  const [name1, setName1] = useState(initialData?.name1 || '');
  const [name2, setName2] = useState(initialData?.name2 || '');
  const [error, setError] = useState('');

  // Live FLAMES letter cancellation preview calculation
  const flamePreview = useMemo(() => {
    const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean1 || !clean2) return null;

    const freq1 = {};
    for (const c of clean1) freq1[c] = (freq1[c] || 0) + 1;
    const freq2 = {};
    for (const c of clean2) freq2[c] = (freq2[c] || 0) + 1;

    let commonCount = 0;
    const commonLetters = [];
    const all = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
    let remaining = 0;

    for (const c of all) {
      const c1 = freq1[c] || 0;
      const c2 = freq2[c] || 0;
      const common = Math.min(c1, c2);
      if (common > 0) {
        commonCount += common;
        commonLetters.push(`${c.toUpperCase()}×${common}`);
      }
      remaining += (c1 - common) + (c2 - common);
    }

    let baseDuration = 4.5;
    if (remaining >= 5 && remaining <= 8) baseDuration = 9;
    else if (remaining >= 9 && remaining <= 12) baseDuration = 18;
    else if (remaining > 12) baseDuration = 36;

    return {
      clean1,
      clean2,
      remaining,
      commonCount,
      commonLetters: commonLetters.join(', '),
      baseDuration
    };
  }, [name1, name2]);

  const handleRandomCouple = () => {
    playSound('blip');
    const random = SAMPLE_COUPLES[Math.floor(Math.random() * SAMPLE_COUPLES.length)];
    setName1(random.n1);
    setName2(random.n2);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      playSound('blip');
      setError('ERROR: BOTH NAMES ARE REQUIRED TO COMPUTE RELATIONSHIP DECAY.');
      return;
    }
    playSound('click');
    setError('');
    onStart({ name1: name1.trim(), name2: name2.trim(), mode: 'relationship' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Ticker Banner */}
      <div className="mb-6 p-2 bg-black text-white font-mono text-xs font-bold overflow-hidden border-2 border-black flex items-center justify-between shadow-[3px_3px_0px_#000]">
        <div className="flex items-center gap-2">
          <span className="bg-[#ff2d2d] px-1.5 py-0.5 text-[10px] uppercase">LIVE</span>
          <span className="truncate">PREDICTING EXPIRATION DATES WITH MATHEMATICAL PRECISION</span>
        </div>
        <span className="hidden sm:inline text-neutral-400">DEFLAMES v2.5</span>
      </div>

      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-left">
        <div className="inline-block brutal-badge px-3 py-1 text-xs sm:text-sm mb-3">
          ★ RELATIONSHIP HALF-LIFE PREDICTOR ★
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black leading-[0.92] tracking-tight text-black mb-3">
          RELATIONSHIP <span className="bg-[#ff2d2d] text-white px-2 py-0.5 inline-block">EXPIRY</span> PREDICTOR
        </h1>
        
        <p className="font-mono text-sm sm:text-base font-bold text-black uppercase tracking-tight border-b-4 border-black pb-3 inline-block">
          No Mercy — Pure Entertainment — 100% Fictional
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form Box */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="brutal-card p-6 sm:p-8 bg-white">
            <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-black">
                DROP YOUR LOVE HERE
              </h2>
              
              <button
                type="button"
                onClick={handleRandomCouple}
                className="brutal-btn px-2.5 py-1 text-[11px] font-mono flex items-center gap-1.5"
                title="Populate random couple"
              >
                <Dices className="w-3.5 h-3.5 text-[#fff500]" />
                <span>RANDOM PAIR</span>
              </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name1" className="block font-mono text-xs font-bold uppercase text-black mb-1.5">
                  NAME 1 (INITIATOR) *
                </label>
                <input
                  id="name1"
                  type="text"
                  value={name1}
                  onChange={(e) => {
                    setName1(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Alice"
                  className="brutal-input w-full px-4 py-3 text-base sm:text-lg font-bold"
                  autoComplete="off"
                  maxLength={30}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-[2px] bg-black flex-1" />
                <span className="font-mono font-black text-xs bg-black text-white px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">
                  VS
                </span>
                <div className="h-[2px] bg-black flex-1" />
              </div>

              <div>
                <label htmlFor="name2" className="block font-mono text-xs font-bold uppercase text-black mb-1.5">
                  NAME 2 (COUNTERPART) *
                </label>
                <input
                  id="name2"
                  type="text"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Bob"
                  className="brutal-input w-full px-4 py-3 text-base sm:text-lg font-bold"
                  autoComplete="off"
                  maxLength={30}
                />
              </div>
            </div>

            {/* FLAMES Matrix Cancellation Box */}
            {flamePreview && (
              <div className="p-4 bg-[#fff500] border-2 border-black font-mono text-xs mb-6 shadow-[4px_4px_0px_#000]">
                <div className="font-black text-black uppercase mb-1.5 flex items-center justify-between">
                  <span>⚡ FLAMES CANCELLATION MATRIX</span>
                  <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">
                    N = {flamePreview.remaining}
                  </span>
                </div>
                <div className="leading-relaxed text-black">
                  {flamePreview.commonLetters ? (
                    <div>Matched & Cancelled: <strong className="bg-white px-1 border border-black">{flamePreview.commonLetters}</strong></div>
                  ) : (
                    <div>Zero common characters cancelled.</div>
                  )}
                  <div className="mt-1">
                    Remaining Count: <strong>{flamePreview.remaining} letters</strong> (Baseline Duration: ~<strong>{flamePreview.baseDuration} months</strong>).
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-[#ff2d2d] text-white border-2 border-black font-mono text-xs font-bold mb-6 flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="brutal-btn-accent w-full py-4 px-6 text-base sm:text-lg flex items-center justify-center gap-3"
            >
              <span>START DEFLAMES ANALYSIS</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Disclaimer */}
            <p className="font-mono text-[11px] text-black mt-4 text-center leading-tight">
              ⚠️ This is a fictional game for fun. Not a real relationship predictor. Your love life is on its own.
            </p>
          </form>
        </div>

        {/* Right Column: Brutalist Info Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="brutal-card p-5 bg-white">
            <div className="font-black text-lg border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
              <span>HOW IT WORKS</span>
              <Sparkles className="w-4 h-4 text-[#ff2d2d]" />
            </div>
            <ul className="font-mono text-xs space-y-3 text-black">
              <li className="flex items-start gap-2">
                <span className="bg-black text-white px-1.5 py-0.5 font-bold shrink-0">1</span>
                <span>Enter two names to cancel FLAMES letter counts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-black text-white px-1.5 py-0.5 font-bold shrink-0">2</span>
                <span>Answer 7 brutal questions on fighting, money & goals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-[#ff2d2d] text-white px-1.5 py-0.5 font-bold shrink-0">3</span>
                <span>Receive certified relationship autopsy & expiry date.</span>
              </li>
            </ul>
          </div>

          <div className="brutal-card p-5 bg-[#ff2d2d] text-white">
            <div className="font-black text-lg border-b-2 border-black pb-2 mb-2">
              THE RULES
            </div>
            <p className="font-mono text-xs leading-relaxed font-bold">
              • 0% sugarcoating<br />
              • 100% deterministic math<br />
              • Guaranteed dramatic plot twists
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
