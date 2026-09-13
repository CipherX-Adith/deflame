import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function WhatIfSimulator({ name1, name2, initialDimensions, mode = 'relationship', onRecalculate }) {
  const [dimensions, setDimensions] = useState({
    C: initialDimensions?.C ?? 0.75,
    T: initialDimensions?.T ?? 0.60,
    I: initialDimensions?.I ?? 0.65,
    F: initialDimensions?.F ?? 0.75,
    G: initialDimensions?.G ?? 0.80,
    K: initialDimensions?.K ?? 0.70
  });

  const [baselineMonths, setBaselineMonths] = useState(null);
  const [currentMonths, setCurrentMonths] = useState(null);

  useEffect(() => {
    if (initialDimensions) {
      const initialDims = {
        C: initialDimensions.C ?? 0.75,
        T: initialDimensions.T ?? 0.60,
        I: initialDimensions.I ?? 0.65,
        F: initialDimensions.F ?? 0.75,
        G: initialDimensions.G ?? 0.80,
        K: initialDimensions.K ?? 0.70
      };
      setDimensions(initialDims);
    }
  }, [initialDimensions]);

  const handleChange = (dim, value) => {
    playSound('blip');
    const updated = {
      ...dimensions,
      [dim]: parseFloat(value)
    };
    setDimensions(updated);
    triggerRecalc(updated);
  };

  const triggerRecalc = async (dims) => {
    try {
      const res = await fetch('/api/deflames/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name1, name2, dimensions: dims, mode })
      });
      if (res.ok) {
        const data = await res.json();
        if (baselineMonths === null && data.duration_months !== undefined) {
          setBaselineMonths(data.duration_months);
        }
        setCurrentMonths(data.duration_months);
        onRecalculate(data);
      }
    } catch (err) {
      console.error('What-if recalc error:', err);
    }
  };

  const applyPreset = (preset) => {
    playSound('click');
    let presetDims;
    if (preset === 'perfect') {
      presetDims = { C: 1.0, T: 1.0, I: 1.0, F: 1.0, G: 1.0, K: 1.0 };
    } else if (preset === 'chaos') {
      presetDims = { C: 0.2, T: 0.3, I: 0.3, F: 0.2, G: 0.2, K: 0.15 };
    } else {
      presetDims = {
        C: initialDimensions?.C ?? 0.75,
        T: initialDimensions?.T ?? 0.60,
        I: initialDimensions?.I ?? 0.65,
        F: initialDimensions?.F ?? 0.75,
        G: initialDimensions?.G ?? 0.80,
        K: initialDimensions?.K ?? 0.70
      };
    }
    setDimensions(presetDims);
    triggerRecalc(presetDims);
  };

  const sliders = [
    { key: 'C', label: 'COMMUNICATION (C)', desc: 'Direct vs Avoidant' },
    { key: 'T', label: 'QUALITY TIME (T)', desc: 'Active Attention' },
    { key: 'I', label: 'INTERESTS OVERLAP (I)', desc: 'Shared Passions' },
    { key: 'F', label: 'FINANCES (F)', desc: 'Budget Harmony' },
    { key: 'G', label: 'LIFE GOALS (G)', desc: '5-Year Vision' },
    { key: 'K', label: 'CONFLICT HANDLING (K)', desc: 'Resolution vs Fights' },
  ];

  const deltaMonths = (currentMonths !== null && baselineMonths !== null) ? currentMonths - baselineMonths : 0;

  return (
    <div className="brutal-card p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-[#ff2d2d] text-white px-2 py-0.5">SIMULATOR</span>
            <h3 className="text-lg font-black text-black">WHAT-IF HABIT PATCHER</h3>
            {deltaMonths !== 0 && (
              <span className={`font-mono text-xs font-black px-2 py-0.5 border border-black flex items-center gap-1 ${
                deltaMonths > 0 ? 'bg-[#39ff14] text-black' : 'bg-[#ff2d2d] text-white'
              }`}>
                {deltaMonths > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {deltaMonths > 0 ? `+${deltaMonths} MOS` : `${deltaMonths} MOS`}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-black mt-1">
            Slide parameters to simulate how modifying habits alters the expiration date live.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => applyPreset('perfect')}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-[#39ff14] text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            [ MAX UTOPIA ]
          </button>
          <button
            type="button"
            onClick={() => applyPreset('chaos')}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-[#ff2d2d] text-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            [ FULL CHAOS ]
          </button>
          <button
            type="button"
            onClick={() => applyPreset('reset')}
            className="p-1 text-xs font-mono font-bold bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            title="Reset to survey answers"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sliders.map((s) => {
          const val = dimensions[s.key] ?? 0.5;
          const pct = Math.round(val * 100);
          return (
            <div key={s.key} className="border-2 border-black p-3 bg-white shadow-[3px_3px_0px_#000]">
              <div className="flex items-center justify-between mb-1 font-mono text-xs font-bold text-black">
                <span>{s.label}</span>
                <span className="bg-black text-white px-1.5 py-0.5">{pct}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={val}
                onChange={(e) => handleChange(s.key, e.target.value)}
                className="w-full"
              />
              <div className="font-mono text-[10px] text-neutral-600 mt-1 uppercase font-semibold">
                {s.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
