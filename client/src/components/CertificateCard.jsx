import React, { useRef, useState } from 'react';
import { Copy, Check, Download, ShieldCheck, Flame, Stamp } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';

export default function CertificateCard({ data }) {
  const certRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!data) return null;

  const { name1, name2, expiry_formatted, lifespan_text, breakup_percentage, primary_reason } = data;

  const handleCopyText = () => {
    playSound('click');
    const text = `🔥 DEFLAMES Certified Expiry Notice 🔥\nCouple: ${name1} & ${name2}\nStatus: Relationship certified to expire on ${expiry_formatted} (${lifespan_text} remaining)\nBreakup Probability: ${breakup_percentage}\nPrimary Grounds: ${primary_reason}\n\n(Playful entertainment prediction via DEFLAMES)`;
    
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
      link.download = `DEFLAMES-AUTOPSY-${name1}-${name2}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate image:', err);
    } finally {
      setDownloading(false);
    }
  };

  const certId = `DFL-${Math.abs((name1 + name2).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 900000 + 100000)}`;

  return (
    <div className="space-y-4">
      {/* Certificate Box */}
      <div
        ref={certRef}
        className="brutal-card p-6 sm:p-10 bg-white border-4 border-black relative select-none"
      >
        {/* Certificate Header */}
        <div className="border-b-4 border-black pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-black bg-[#ff2d2d] text-white px-2 py-0.5 inline-block mb-1">
              OFFICIAL VERDICT
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              OFFICIAL DEFLAMES CERTIFICATE
            </h2>
          </div>
          <div className="font-mono text-xs font-bold text-black border-2 border-black p-2 bg-[#fff500] self-start sm:self-auto shadow-[2px_2px_0px_#000]">
            REGISTRY NO: {certId}
          </div>
        </div>

        {/* Certificate Content */}
        <div className="space-y-4 font-mono text-black mb-6">
          <p className="text-xs uppercase font-bold text-neutral-600 tracking-wider">
            THIS DOCUMENT SOLEMNLY CERTIFIES THE PROJECTED SHELF-LIFE OF:
          </p>

          <div className="p-4 border-3 border-black bg-black text-white text-center shadow-[4px_4px_0px_#ff2d2d]">
            <span className="text-xl sm:text-3xl font-black uppercase tracking-tight">
              {name1} + {name2}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border-2 border-black p-3.5 bg-white shadow-[2px_2px_0px_#000]">
              <span className="text-[11px] font-bold block uppercase text-neutral-500">EXPIRATION DEADLINE</span>
              <span className="text-xl sm:text-2xl font-black text-[#ff2d2d] uppercase">{expiry_formatted}</span>
            </div>
            <div className="border-2 border-black p-3.5 bg-white shadow-[2px_2px_0px_#000]">
              <span className="text-[11px] font-bold block uppercase text-neutral-500">BREAKUP PROBABILITY</span>
              <span className="text-xl sm:text-2xl font-black text-black uppercase">{breakup_percentage}</span>
            </div>
          </div>

          <div className="p-4 border-2 border-black bg-[#f9f9f9] text-xs sm:text-sm font-bold leading-relaxed shadow-[2px_2px_0px_#000]">
            "This relationship is certified to expire on <span className="bg-[#ff2d2d] text-white px-1 uppercase">{expiry_formatted}</span>, unless patched with weekly date nights, radical honesty, and non-defensive communication."
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="border-t-3 border-black pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end font-mono">
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-500">ALGORITHM SIGN-OFF</div>
            <div className="text-sm font-black text-black uppercase mt-1 border-b border-black pb-1 w-48">
              DEFLAMES AUTOMATION
            </div>
            <div className="text-[9px] text-neutral-500 mt-0.5">Automated Quantum Relationship Coroner</div>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            <div className="inline-flex items-center gap-1 border-2 border-black px-2 py-1 bg-[#fff500] text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>100% FICTIONAL GUARANTEE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopyText}
          className="brutal-btn py-3.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#39ff14]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'SUMMARY COPIED!' : 'COPY SUMMARY TEXT'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={downloading}
          className="brutal-btn-accent py-3.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'GENERATING PNG...' : 'DOWNLOAD CERTIFICATE PNG'}</span>
        </button>
      </div>
    </div>
  );
}
