import React, { useState, useMemo } from 'react';
import { ArrowRight, AlertTriangle, Sparkles, Dices, TimerReset, MousePointer2, Zap } from 'lucide-react';
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
  const [wasteCount, setWasteCount] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

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

  const handleWasteTime = () => {
    if (isCalibrating) return;
    playSound('blip');
    setIsCalibrating(true);
    window.setTimeout(() => {
      setWasteCount((count) => count + 1);
      setIsCalibrating(false);
      playSound('select');
    }, 900);
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
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-10 text-left relative">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs font-black uppercase mb-4">
          <span className="brutal-badge px-2.5 py-1">Live-ish relationship lab</span>
          <span className="bg-[#fff500] border-2 border-black px-2 py-1 shadow-[2px_2px_0_#000]">Est. accuracy: suspicious</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          <div className="lg:col-span-9">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.82] tracking-tighter text-black mb-4">
              WASTE A LITTLE<br />
              <span className="bg-[#ff2d2d] text-white px-2 py-1 inline-block -rotate-1">TIME ON LOVE.</span>
            </h1>
            <p className="font-mono text-xs sm:text-base font-bold text-black uppercase max-w-2xl leading-relaxed">
              A wildly unnecessary relationship expiry predictor, powered by cancelled letters, questionable maths and absolutely no credentials.
            </p>
          </div>
          <div className="lg:col-span-3 border-3 border-black bg-black text-white p-4 shadow-[6px_6px_0_#ff3434] rotate-1">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#fff500] mb-2"><TimerReset className="w-4 h-4" /> TODAY'S TIME SINK</div>
            <div className="font-black text-3xl leading-none">{(wasteCount * 0.9).toFixed(1).padStart(4, '0')}s</div>
            <div className="font-mono text-[10px] mt-2 uppercase">Productivity: officially cancelled</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Input Form Box */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="brutal-card p-6 sm:p-8 bg-white">
            <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6">
              <div>
                <div className="font-mono text-[10px] font-bold uppercase text-[#ff2d2d] mb-1">Step 01 / volunteer information</div>
                <h2 className="text-xl sm:text-2xl font-black text-black">DROP YOUR LOVE HERE</h2>
              </div>
              
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

              <div className="flex items-center gap-3" aria-hidden="true">
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
              ⚠️ This is fictional, frivolous and not qualified to speak on your love life.
            </p>
          </form>
        </div>

        {/* Right Column: Brutalist Info Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="brutal-card p-5 bg-[#fff500]">
            <div className="font-black text-lg border-b-2 border-black pb-2 mb-3 flex items-center justify-between">
              <span>USELESS PRE-FLIGHT</span>
              <MousePointer2 className="w-4 h-4 text-[#ff2d2d]" />
            </div>
            <p className="font-mono text-xs font-bold leading-relaxed mb-4">Press the button to calibrate nothing at all. Every press produces 0.9 seconds of ceremonial delay.</p>
            <button type="button" onClick={handleWasteTime} disabled={isCalibrating} className="brutal-btn w-full px-3 py-3 text-xs flex items-center justify-center gap-2">
              <Zap className={isCalibrating ? 'w-4 h-4 animate-pulse' : 'w-4 h-4'} />
              {isCalibrating ? 'CALIBRATING VIBES...' : 'WASTE 0.9 SECONDS'}
            </button>
            <div className="font-mono text-[10px] mt-3 pt-3 border-t-2 border-black flex justify-between font-bold">
              <span>POINTLESS CLICKS</span><span>{wasteCount}</span>
            </div>
          </div>

          <div className="brutal-card p-5 bg-white">
            <div className="font-black text-lg border-b-2 border-black pb-2 mb-3 flex justify-between items-center">
              <span>THE PROCESS</span><Sparkles className="w-4 h-4 text-[#ff2d2d]" />
            </div>
            <ol className="font-mono text-xs space-y-3 text-black font-bold">
              <li className="flex gap-2"><span className="bg-black text-white px-1.5 h-fit">01</span><span>Cancel matching letters like it is 2007.</span></li>
              <li className="flex gap-2"><span className="bg-black text-white px-1.5 h-fit">02</span><span>Confess seven inconvenient truths.</span></li>
              <li className="flex gap-2"><span className="bg-[#ff2d2d] text-white px-1.5 h-fit">03</span><span>Receive a deeply unserious autopsy.</span></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
