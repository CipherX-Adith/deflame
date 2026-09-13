import React, { useEffect, useState } from 'react';
import { playSound } from '../utils/audio';

const PROCESSING_STEPS = [
  "ANALYZING FLAMES LETTER CANCELLATION MATRIX...",
  "CALIBRATING COMPATIBILITY VECTORS...",
  "COMPUTING NON-LINEAR DECAY CURVE...",
  "ESTIMATING BREAKUP PROBABILITY...",
  "GENERATING RELATIONSHIP AUTOPSY CERTIFICATE..."
];

export default function ProcessingPage({ name1, name2, answers, mode = 'relationship', onFinish, onError }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [errorState, setErrorState] = useState(null);

  const runCalculation = () => {
    setErrorState(null);
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < PROCESSING_STEPS.length - 1) {
          playSound('blip');
          return prev + 1;
        }
        return prev;
      });
      setProgress(p => Math.min(95, p + 18));
    }, 420);

    const startTime = Date.now();

    fetch('/api/deflames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1, name2, answers, mode })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to process DEFLAMES calculation.');
        }
        return res.json();
      })
      .then((data) => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 2100 - elapsed);
        setTimeout(() => {
          clearInterval(stepInterval);
          setProgress(100);
          playSound('success');
          setTimeout(() => onFinish(data), 250);
        }, remainingDelay);
      })
      .catch((err) => {
        clearInterval(stepInterval);
        console.error('API Error:', err);
        setErrorState(err.message || 'Error communicating with decay server.');
      });

    return () => clearInterval(stepInterval);
  };

  useEffect(() => {
    return runCalculation();
  }, [name1, name2, answers, mode]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 text-left">
      <div className="brutal-card p-8 sm:p-12 bg-white">
        <div className="inline-block brutal-badge px-3 py-1 text-xs font-mono font-bold mb-4">
          ★ SIMULATION IN PROGRESS ★
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black leading-tight mb-6">
          RUNNING RELATIONSHIP <span className="bg-[#ff2d2d] text-white px-2 py-0.5 inline-block">DECAY SIMULATION</span>…
        </h1>

        {/* Subjects bar */}
        <div className="p-3 bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase mb-6 flex justify-between items-center shadow-[3px_3px_0px_#000]">
          <span>SUBJECTS: {name1} VS {name2}</span>
          <span className="bg-[#ff2d2d] px-1.5 py-0.5 text-[10px] text-white font-black animate-pulse">
            JUDGING
          </span>
        </div>

        {errorState ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff2d2d] text-white border-2 border-black font-mono text-xs font-bold">
              [ ERROR ]: {errorState}
            </div>
            <button
              type="button"
              onClick={runCalculation}
              className="brutal-btn-accent px-6 py-3 text-xs w-full"
            >
              RETRY COMPUTATION
            </button>
          </div>
        ) : (
          <>
            {/* Dynamic cycling line */}
            <div className="p-4 border-3 border-black bg-[#fff500] font-mono text-sm sm:text-base font-bold text-black mb-6 shadow-[4px_4px_0px_#000]">
              &gt; {PROCESSING_STEPS[currentStepIndex]}
            </div>

            {/* Brutalist Hard Progress Bar */}
            <div className="w-full h-8 border-3 border-black bg-white p-1 mb-6 shadow-[3px_3px_0px_#000]">
              <div
                className="h-full bg-[#ff2d2d] transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom microcopy */}
            <div className="border-t-2 border-black pt-4 flex items-center justify-between font-mono text-xs text-black font-bold">
              <span>⚠️ DO NOT REFRESH</span>
              <span className="text-neutral-500">THE ALGORITHM HAS ZERO MERCY</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
