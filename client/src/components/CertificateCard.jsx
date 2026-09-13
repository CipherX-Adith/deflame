import React, { useRef, useState } from 'react';
import { Copy, Check, Download, ShieldCheck, Award } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import VoiceVerdict from './VoiceVerdict';

export default function CertificateCard({ data }) {
  const certRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!data) return null;

  const {
    name1 = 'PERSON 1',
    name2 = 'PERSON 2',
    expiry_formatted,
    expiryDate = data.expiry_formatted || data.expiry_date || '18 JANUARY 2028',
    breakup_percentage,
    breakupProbability = data.breakup_percentage || '50%',
    primary_reason
  } = data;

  const displayExpiry = (expiry_formatted || expiryDate || '18 JANUARY 2028').toUpperCase();
  const displayProbability = typeof breakupProbability === 'number'
    ? `${Math.round(breakupProbability)}%`
    : String(breakup_percentage || breakupProbability || '50%').toUpperCase();

  // Registry Serial
  const certId = data.registryNo || `DFL-${Math.abs((name1 + name2).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 900000 + 100000)}`;

  const statementText = data.statement || `This relationship is certified to expire on ${displayExpiry}, unless patched with weekly date nights, radical honesty, and non-defensive communication.`;

  const handleCopyText = () => {
    playSound('click');
    const text = `🔥 OFFICIAL DEFLAMES CERTIFICATE 🔥\nCouple: ${name1.toUpperCase()} + ${name2.toUpperCase()}\nRegistry No: ${certId}\nExpiration Deadline: ${displayExpiry}\nBreakup Probability: ${displayProbability}\nStatement: ${statementText}\n\n(100% Fictional Guarantee • DEFLAMES)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleDownloadImage = async () => {
    if (!certRef.current) return;
    playSound('stamp');
    setDownloading(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2.5
      });
      const link = document.createElement('a');
      link.download = `DEFLAMES-CERTIFICATE-${name1}-${name2}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Neo-Brutalist Certificate Container */}
      <div
        ref={certRef}
        className="bg-white border-2 sm:border-3 border-black p-6 sm:p-10 shadow-[8px_8px_0px_#000] relative select-none"
      >
        {/* Certificate Header Bar */}
        <header className="border-b-3 border-black pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-black bg-[#ff3434] text-white px-2 py-0.5 inline-block mb-1.5 shadow-[2px_2px_0px_#000]">
              OFFICIAL VERDICT
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase leading-none">
              OFFICIAL DEFLAMES CERTIFICATE
            </h1>
          </div>

          {/* Yellow Registry Block */}
          <div className="font-mono text-xs font-bold text-black border-2 border-black p-2.5 bg-[#fff500] self-start sm:self-auto shadow-[3px_3px_0px_#000]">
            REGISTRY NO: {certId}
          </div>
        </header>

        {/* Certificate Body */}
        <main className="space-y-6 font-mono text-black">
          <p className="text-xs uppercase font-bold text-neutral-600 tracking-wider">
            THIS DOCUMENT SOLEMNLY CERTIFIES THE PROJECTED SHELF-LIFE OF:
          </p>

          {/* Black Center Name Banner with Red Horizontal Accent Line/Shadow */}
          <div className="relative">
            <div className="p-4 sm:p-5 bg-black text-white text-center border-2 border-black shadow-[0px_6px_0px_#ff3434]">
              <span className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                {name1.toUpperCase()} + {name2.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Expiration Deadline & Breakup Probability (Two Equal Bordered Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Card 1: Expiration Deadline */}
            <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <span className="text-[11px] font-bold block uppercase text-neutral-500 mb-1">
                EXPIRATION DEADLINE
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#ff3434] uppercase tracking-tight">
                {displayExpiry}
              </span>
            </div>

            {/* Card 2: Breakup Probability */}
            <div className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_#000] flex flex-col justify-between">
              <span className="text-[11px] font-bold block uppercase text-neutral-500 mb-1">
                BREAKUP PROBABILITY
              </span>
              <span className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
                {displayProbability}
              </span>
            </div>
          </div>

          {/* Certificate Statement with Red Inline Date Highlight */}
          <div className="p-4 sm:p-5 border-2 border-black bg-[#f9f9f9] text-xs sm:text-sm font-bold leading-relaxed shadow-[3px_3px_0px_#000]">
            "This relationship is certified to expire on{' '}
            <span className="bg-[#ff3434] text-white px-1.5 py-0.5 uppercase inline-block">
              {displayExpiry}
            </span>
            , unless patched with weekly date nights, radical honesty, and non-defensive communication."
          </div>
        </main>

        {/* Algorithm Sign-Off & 100% Fictional Guarantee */}
        <footer className="border-t-3 border-black pt-5 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end font-mono">
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-500">ALGORITHM SIGN-OFF</div>
            <div className="text-sm sm:text-base font-black text-black uppercase mt-1 border-b-2 border-black pb-1 max-w-[220px]">
              DEFLAMES AUTOMATION
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 font-semibold">
              Automated Quantum Relationship Coroner
            </div>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            {/* Yellow 100% Fictional Guarantee Badge */}
            <div className="inline-flex items-center gap-1.5 border-2 border-black px-3 py-1.5 bg-[#fff500] text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000]">
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
              <span>100% FICTIONAL GUARANTEE</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Voice Verdict Audio Controller (Calculates Voice Decision Dynamically) */}
      <VoiceVerdict result={data} />

      {/* Certificate Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopyText}
          className="brutal-btn py-3.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
        >
          {copied ? <Check className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'SUMMARY COPIED!' : 'COPY SUMMARY TEXT'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={downloading}
          className="brutal-btn-accent py-3.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'GENERATING PNG...' : 'DOWNLOAD CERTIFICATE PNG'}</span>
        </button>
      </div>
    </div>
  );
}
