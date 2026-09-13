import React, { useState, useEffect } from 'react';
import { Flame, X, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import ProcessingPage from './components/ProcessingPage';
import ResultsPage from './components/ResultsPage';
import { isSoundEnabled, toggleSound, playSound } from './utils/audio';

export default function App() {
  const [step, setStep] = useState('landing'); // 'landing' | 'questionnaire' | 'processing' | 'results'
  const [namesData, setNamesData] = useState({ name1: '', name2: '', mode: 'relationship' });
  const [answers, setAnswers] = useState({});
  const [resultsData, setResultsData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playSound('click');
  };

  // Handlers
  const handleStartAnalysis = ({ name1, name2, mode }) => {
    setNamesData({ name1, name2, mode });
    setStep('questionnaire');
  };

  const handleCompleteQuestions = (surveyAnswers) => {
    setAnswers(surveyAnswers);
    setErrorMsg(null);
    setStep('processing');
  };

  const handleProcessingFinish = (data) => {
    setResultsData(data);
    setStep('results');
  };

  const handleProcessingError = (err) => {
    setErrorMsg(err);
    setStep('landing');
  };

  const handleReset = () => {
    playSound('click');
    setStep('landing');
    setAnswers({});
    setResultsData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-black">
      {/* Top Raw Brutal Bar */}
      <header className="w-full border-b-3 border-black bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 font-black text-2xl sm:text-4xl tracking-tighter uppercase group cursor-pointer"
          >
            <span className="bg-black text-white px-2 py-0.5 group-hover:bg-[#ff2d2d] transition-colors">
              DEFLAMES
            </span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Toggle Audio Feedback"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#ff2d2d]" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
              <span className="hidden sm:inline">{soundOn ? 'SFX ON' : 'SFX OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setShowInfoModal(true);
              }}
              className="underline hover:text-[#ff2d2d] cursor-pointer"
            >
              WHAT IS THIS?
            </button>

            {step !== 'landing' && (
              <button
                type="button"
                onClick={handleReset}
                className="brutal-btn px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RESTART</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6">
        {errorMsg && (
          <div className="w-full max-w-lg mx-auto my-4 p-4 bg-[#ff2d2d] text-white border-3 border-black shadow-[4px_4px_0px_#000] font-mono text-xs font-bold">
            [ ERROR ]: {errorMsg}
          </div>
        )}

        {step === 'landing' && (
          <LandingPage
            onStart={handleStartAnalysis}
            initialData={namesData}
            onOpenInfo={() => setShowInfoModal(true)}
          />
        )}

        {step === 'questionnaire' && (
          <Questionnaire
            name1={namesData.name1}
            name2={namesData.name2}
            mode={namesData.mode}
            onComplete={handleCompleteQuestions}
            onBackToNames={() => setStep('landing')}
          />
        )}

        {step === 'processing' && (
          <ProcessingPage
            name1={namesData.name1}
            name2={namesData.name2}
            mode={namesData.mode}
            answers={answers}
            onFinish={handleProcessingFinish}
            onError={handleProcessingError}
          />
        )}

        {step === 'results' && resultsData && (
          <ResultsPage
            data={resultsData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* "What is this?" Brutalist Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="brutal-card p-6 sm:p-8 bg-white max-w-lg w-full relative shadow-[10px_10px_0px_#ff2d2d]">
            <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-black uppercase">
                ABOUT DEFLAMES
              </h3>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowInfoModal(false);
                }}
                className="brutal-btn p-1.5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="font-mono text-xs sm:text-sm space-y-3 text-black leading-relaxed">
              <p>
                <strong>DEFLAMES</strong> is a satirical web application combining the classic childhood FLAMES letter cancellation game with an exponential relationship decay formula.
              </p>
              <div className="bg-[#fff500] p-3 border-2 border-black font-bold text-xs space-y-1">
                <div>• Formula: Non-linear decay constant d = 0.15·(1-S)^1.8 + 0.02</div>
                <div>• Stability Index: S = 0.20C + 0.15T + 0.10I + 0.15F + 0.25G + 0.15K</div>
                <div>• Baseline: Remainder letters (n) determine base duration range</div>
              </div>
              <p className="text-neutral-600 text-xs">
                ⚠️ <strong>Disclaimer:</strong> 100% fictional. No actual psychological, romantic, or life advice is provided.
              </p>
            </div>

            <div className="mt-6 border-t-2 border-black pt-4 text-right">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowInfoModal(false);
                }}
                className="brutal-btn-accent px-5 py-2.5 text-xs cursor-pointer"
              >
                GOT IT, LET'S PLAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom Bar */}
      <footer className="w-full py-4 text-center font-mono text-xs font-bold text-black border-t-3 border-black bg-white">
        <p>DEFLAMES © 2026 • NEO-BRUTALIST RELATIONSHIP AUTOPSY ENGINE</p>
      </footer>
    </div>
  );
}
