import React, { useState, useEffect } from 'react';
import { RotateCcw, Share2, Check, Printer, AlertTriangle, Info, ChevronDown, ChevronUp, Clock, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import DecayChart from './DecayChart';
import WhatIfSimulator from './WhatIfSimulator';
import CertificateCard from './CertificateCard';
import { playSound } from '../utils/audio';

export default function ResultsPage({ data, onReset }) {
  const [currentData, setCurrentData] = useState(data);
  const [showDebug, setShowDebug] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const {
    name1 = 'PERSON 1',
    name2 = 'PERSON 2',
    mode = 'relationship',
    duration_months = 0,
    duration_days = 0,
    lifespan_text = `${duration_months} MONTHS ${duration_days} DAYS`,
    expiry_date,
    expiry_formatted,
    breakup_probability = 0.5,
    breakup_percentage = `${Math.round(breakup_probability * 100)}%`,
    primary_reason = 'Communication breakdown',
    secondary_factors = [],
    dimensions = {},
    ranked_dimensions = [],
    decay_curve = [],
    debug = {}
  } = currentData;

  // Safe Expiry Date Formatter with bulletproof fallbacks
  const displayExpiry = (
    expiry_formatted ||
    currentData.expiryDate ||
    (expiry_date ? (() => {
      try {
        const parts = String(expiry_date).split('-');
        if (parts.length === 3) {
          const monthsNames = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
          ];
          const monthIdx = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          const year = parts[0];
          if (!isNaN(monthIdx) && monthIdx >= 0 && monthIdx < 12) {
            return `${day} ${monthsNames[monthIdx]} ${year}`;
          }
        }
        return expiry_date;
      } catch (e) {
        return expiry_date;
      }
    })() : null) ||
    '18 JANUARY 2028'
  ).toUpperCase();

  // Live countdown timer to calculated expiry date
  useEffect(() => {
    const targetDateStr = expiry_date || '2028-01-18';
    const target = new Date(`${targetDateStr}T23:59:59`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0 || isNaN(diff)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiry_date]);

  const shareText = `🔥 DEFLAMES AUTOPSY: ${name1.toUpperCase()} & ${name2.toUpperCase()}\n📅 Relationship expires on: ${displayExpiry} (${lifespan_text})\n💔 Breakup Probability: ${breakup_percentage}\n💀 Primary Cause: ${primary_reason}\n\n(Playful entertainment via DEFLAMES)`;

  const handleShare = async () => {
    playSound('click');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DEFLAMES Relationship Autopsy',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareCopied(true);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 }
        });
        setTimeout(() => setShareCopied(false), 2500);
      });
    }
  };

  const handleTweet = () => {
    playSound('click');
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank');
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  const handleRecalculate = (updatedData) => {
    playSound('blip');
    setCurrentData(updatedData);
  };

  const probVal = Math.round(
    typeof breakup_probability === 'number'
      ? (breakup_probability <= 1 ? breakup_probability * 100 : breakup_probability)
      : Number(String(breakup_percentage || '50').replace('%', '')) || 50
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 text-left">
      {/* Header Block */}
      <div className="brutal-card p-6 sm:p-10 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-4 mb-4">
          <div>
            <div className="inline-block brutal-badge px-3 py-1 text-xs font-mono font-bold mb-2">
              ★ OFFICIAL AUTOPSY REPORT ★
            </div>
            <h1 className="text-3xl sm:text-6xl font-black text-black leading-tight">
              YOUR RELATIONSHIP <span className="bg-[#ff3434] text-white px-2 py-0.5 inline-block">AUTOPSY</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="brutal-btn px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#000]"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
          </div>
        </div>

        <p className="font-mono text-xs sm:text-sm font-bold text-black border-t-2 border-black pt-3">
          All results are generated for comedic entertainment. Do not make real-world breakups or life decisions based on this algorithm.
        </p>

        {/* Subjects bar */}
        <div className="mt-4 p-3 bg-black text-white font-mono text-xs sm:text-sm font-black uppercase flex justify-between items-center shadow-[3px_3px_0px_#ff3434]">
          <span>SUBJECTS: {name1.toUpperCase()} & {name2.toUpperCase()}</span>
          <span>STATUS: COMPLETE</span>
        </div>
      </div>

      {/* Live Countdown Clock Banner */}
      <div className="brutal-card p-4 sm:p-6 bg-[#fff500] border-3 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-black shrink-0" />
          <div>
            <span className="font-mono text-xs font-black uppercase block text-neutral-800">
              LIVE EXPIRATION COUNTDOWN
            </span>
            <span className="font-mono text-xs text-black font-bold">Ticking down to {displayExpiry}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="p-2 bg-black text-white border border-black shadow-[2px_2px_0px_#000]">
            <div className="text-lg sm:text-2xl font-black">{timeLeft.days}</div>
            <div className="text-[9px] uppercase">DAYS</div>
          </div>
          <div className="p-2 bg-black text-white border border-black shadow-[2px_2px_0px_#000]">
            <div className="text-lg sm:text-2xl font-black">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-[9px] uppercase">HRS</div>
          </div>
          <div className="p-2 bg-black text-white border border-black shadow-[2px_2px_0px_#000]">
            <div className="text-lg sm:text-2xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-[9px] uppercase">MIN</div>
          </div>
          <div className="p-2 bg-black text-white border border-black shadow-[2px_2px_0px_#000]">
            <div className="text-lg sm:text-2xl font-black text-[#ff3434]">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-[9px] uppercase">SEC</div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Lifespan */}
        <div className="brutal-card p-6 bg-white flex flex-col justify-between">
          <div className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-1 inline-block self-start mb-3 shadow-[2px_2px_0px_#000]">
            PREDICTED LIFESPAN
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
              {lifespan_text}
            </div>
            <p className="font-mono text-xs text-neutral-600 font-bold mt-1">
              Estimated duration remaining
            </p>
          </div>
        </div>

        {/* Metric 2: Expiry Date - Fixed High Contrast Red Highlight on White Card */}
        <div className="brutal-card p-6 bg-white flex flex-col justify-between">
          <div className="font-mono text-xs font-black uppercase bg-[#ff3434] text-white px-2 py-1 inline-block self-start mb-3 shadow-[2px_2px_0px_#000]">
            EXPIRY DATE
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#ff3434] uppercase tracking-tight">
              {displayExpiry}
            </div>
            <p className="font-mono text-xs text-neutral-600 font-bold mt-1">
              Hard projected deadline
            </p>
          </div>
        </div>

        {/* Metric 3: Breakup Probability */}
        <div className="brutal-card p-6 bg-white flex flex-col justify-between">
          <div className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-1 inline-block self-start mb-3 shadow-[2px_2px_0px_#000]">
            BREAKUP PROBABILITY
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-black">
              {breakup_percentage}
            </div>
            {/* Brutal Solid Bar */}
            <div className="w-full h-4 border-2 border-black bg-white p-0.5 mt-2 shadow-[2px_2px_0px_#000]">
              <div
                className="h-full bg-[#ff3434]"
                style={{ width: `${Math.min(100, Math.max(5, probVal))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary & Secondary Reasons */}
      <div className="brutal-card p-6 sm:p-8 bg-white">
        <div className="font-mono text-xs font-black bg-black text-white px-2 py-1 inline-block mb-3 shadow-[2px_2px_0px_#000]">
          PRIMARY GROUNDS FOR SEPARATION
        </div>

        <div className="p-4 border-3 border-black bg-[#fff500] mb-6 shadow-[4px_4px_0px_#000]">
          <p className="font-mono text-base sm:text-lg font-black text-black uppercase leading-snug">
            "{primary_reason}"
          </p>
        </div>

        {secondary_factors.length > 0 && (
          <div>
            <div className="font-mono text-xs font-bold text-black uppercase mb-2">
              [ CONTRIBUTING FACTORS ]
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {secondary_factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 border-2 border-black bg-white font-mono text-xs font-bold text-black flex items-start gap-2 shadow-[2px_2px_0px_#000]"
                >
                  <span className="bg-black text-white px-1 font-bold">!</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dimension Breakdown Bar */}
        {ranked_dimensions.length > 0 && (
          <div className="mt-6 pt-4 border-t-2 border-black">
            <div className="font-mono text-xs font-bold uppercase text-neutral-600 mb-2">
              [ DIMENSION STABILITY RANKINGS ]
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
              {ranked_dimensions.map((rd) => (
                <div key={rd.dim} className="p-2 border border-black bg-neutral-50 flex items-center justify-between">
                  <span className="truncate mr-1">{rd.name}</span>
                  <span className={`font-bold ${rd.score >= 0.7 ? 'text-[#008000]' : rd.score >= 0.5 ? 'text-amber-600' : 'text-[#ff3434]'}`}>
                    {Math.round(rd.score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Decay Curve Chart */}
      <DecayChart
        points={decay_curve}
        durationMonths={duration_months}
        expiryDate={displayExpiry}
      />

      {/* What-If Simulator */}
      <WhatIfSimulator
        name1={name1}
        name2={name2}
        mode={mode}
        initialDimensions={dimensions}
        onRecalculate={handleRecalculate}
      />

      {/* Official Certificate Box & Voice Controller */}
      <CertificateCard data={{ ...currentData, expiry_formatted: displayExpiry }} />

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="brutal-btn-accent w-full sm:flex-1 py-4 px-6 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
        >
          {shareCopied ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>SUMMARY COPIED TO CLIPBOARD!</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span>SHARE RESULT</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleTweet}
          className="brutal-btn w-full sm:w-auto py-4 px-5 text-sm font-mono flex items-center justify-center gap-2 cursor-pointer bg-black text-white shadow-[4px_4px_0px_#000]"
          title="Share on X / Twitter"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>POST ON X</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="brutal-btn w-full sm:w-auto py-4 px-6 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>TRY AGAIN</span>
        </button>
      </div>

      {/* Collapsible Debug Block */}
      <div className="border-2 border-black bg-white">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            setShowDebug(!showDebug);
          }}
          className="w-full p-3 font-mono text-xs font-bold text-black flex items-center justify-between hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          <span>[+] ALGORITHM DEBUG PARAMETERS</span>
          {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDebug && (
          <div className="p-4 border-t-2 border-black font-mono text-xs text-black space-y-2 bg-[#f9f9f9]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 border border-black bg-white">
                <div className="text-[10px] font-bold text-neutral-500">FLAMES REMAINDER (n)</div>
                <div className="font-black text-sm">{debug.n_remaining_letters} letters</div>
              </div>
              <div className="p-2 border border-black bg-white">
                <div className="text-[10px] font-bold text-neutral-500">BASE DURATION</div>
                <div className="font-black text-sm">{debug.base_duration_months} mos</div>
              </div>
              <div className="p-2 border border-black bg-white">
                <div className="text-[10px] font-bold text-neutral-500">STABILITY (S)</div>
                <div className="font-black text-sm">{debug.stability_index}</div>
              </div>
              <div className="p-2 border border-black bg-white">
                <div className="text-[10px] font-bold text-neutral-500">DECAY RATE (d)</div>
                <div className="font-black text-sm">{debug.decay_rate}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Final Disclaimer */}
      <footer className="border-t-3 border-black pt-6 pb-8 text-center">
        <p className="font-mono text-xs font-bold text-black max-w-xl mx-auto leading-relaxed">
          ⚠️ DEFLAMES is a fictional game. Results are not real predictions and should not be taken seriously.
        </p>
      </footer>
    </div>
  );
}
