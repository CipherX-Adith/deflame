import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Flame, Check, Dices, AlertCircle } from 'lucide-react';
import { getRandomQuestions } from '../data/questions';
import { playSound } from '../utils/audio';

export default function Questionnaire({ name1, name2, mode = 'relationship', onComplete, onBackToNames }) {
  const [answers, setAnswers] = useState({});
  const [questions] = useState(() => getRandomQuestions());
  const questionRefs = useRef({});

  const handleSelectOption = (question, option, index) => {
    playSound('select');
    const updated = {
      ...answers,
      [question.id]: { value: option.value, score: option.score, dimension: question.dimension }
    };
    setAnswers(updated);

    // Auto-scroll to next unanswered question after a brief delay
    const nextUnansweredIndex = questions.findIndex((q, i) => i > index && !updated[q.id]);
    if (nextUnansweredIndex !== -1 && questionRefs.current[questions[nextUnansweredIndex].id]) {
      setTimeout(() => {
        questionRefs.current[questions[nextUnansweredIndex].id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 150);
    }
  };

  const handleFillRandom = () => {
    playSound('blip');
    const randomized = {};
    questions.forEach((q) => {
      const randomOpt = q.options[Math.floor(Math.random() * q.options.length)];
      randomized[q.id] = { value: randomOpt.value, score: randomOpt.score, dimension: q.dimension };
    });
    setAnswers(randomized);
  };

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) {
      playSound('blip');
      // Scroll to first unanswered question
      const firstUnanswered = questions.find(q => !answers[q.id]);
      if (firstUnanswered && questionRefs.current[firstUnanswered.id]) {
        questionRefs.current[firstUnanswered.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    playSound('success');
    onComplete(answers);
  };

  const scrollToQuestion = (id) => {
    playSound('click');
    if (questionRefs.current[id]) {
      questionRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="brutal-card p-6 sm:p-8 bg-white mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-4 mb-4">
          <div>
            <div className="inline-block brutal-badge px-2.5 py-0.5 text-xs font-mono font-bold mb-2">
              EXAMINATION PROTOCOL
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black leading-tight">
              ANSWER HONESTLY. THE ALGORITHM HAS NO MERCY.
            </h1>
          </div>

          <div className="font-mono text-sm sm:text-base font-bold bg-black text-white px-3 py-1.5 self-start sm:self-auto shrink-0 shadow-[2px_2px_0px_#ff2d2d]">
            {answeredCount} / {questions.length} ANSWERED
          </div>
        </div>

        {/* Pairing info & Quick Fill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs font-bold text-black pt-1">
          <div>
            SUBJECTS: <span className="bg-[#fff500] px-1.5 py-0.5 border border-black">{name1}</span> & <span className="bg-[#fff500] px-1.5 py-0.5 border border-black">{name2}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFillRandom}
              className="text-neutral-700 hover:text-black underline flex items-center gap-1 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-[#ff2d2d]" />
              <span>RANDOMIZE ANSWERS</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onBackToNames}
              className="hover:underline text-[#ff2d2d] flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> [ CHANGE NAMES ]
            </button>
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div className="mt-4 pt-3 border-t-2 border-black flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="font-mono text-[10px] uppercase font-bold text-neutral-500 mr-1">JUMP:</span>
          {questions.map((q, i) => {
            const hasAns = Boolean(answers[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => scrollToQuestion(q.id)}
                className={`px-2.5 py-1 text-xs font-mono font-bold border-2 border-black transition-all flex items-center gap-1 shrink-0 ${
                  hasAns
                    ? 'bg-[#39ff14] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                <span>Q{i + 1}</span>
                {hasAns && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => {
          const selectedVal = answers[q.id]?.value;
          const isAnswered = Boolean(selectedVal);

          return (
            <div
              key={q.id}
              ref={el => questionRefs.current[q.id] = el}
              className={`brutal-card p-6 sm:p-8 transition-all scroll-mt-24 ${
                isAnswered ? 'border-black' : 'border-black'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 inline-block mb-2">
                    QUESTION {idx + 1} OF {questions.length} • DIMENSION [{q.dimension}]
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black">
                    {q.title}
                  </h2>
                  <p className="font-mono text-xs text-black mt-1">
                    {q.subtitle}
                  </p>
                </div>

                {isAnswered ? (
                  <span className="brutal-badge px-2 py-0.5 text-xs shrink-0 flex items-center gap-1">
                    <Check className="w-3 h-3" /> SET
                  </span>
                ) : (
                  <span className="border border-black px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-500 shrink-0">
                    PENDING
                  </span>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt) => {
                  const isSelected = selectedVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(q, opt, idx)}
                      className={`p-4 border-2 border-black text-left transition-all font-mono flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff2d2d] text-white shadow-[4px_4px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-sm sm:text-base uppercase flex items-center justify-between">
                        <span>{opt.label}</span>
                        {isSelected && <span className="font-black text-xs">[X]</span>}
                      </div>
                      {opt.desc && (
                        <div className={`text-xs mt-1.5 ${isSelected ? 'text-white/90' : 'text-neutral-600 group-hover:text-white'}`}>
                          {opt.desc}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Sticky Bottom Action Bar */}
        <div className="brutal-card p-5 sm:p-6 bg-white sticky bottom-4 shadow-[8px_8px_0px_#000] z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToNames}
            className="brutal-btn w-full sm:w-auto px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EDIT NAMES</span>
          </button>

          <div className="text-center font-mono text-xs font-bold text-black">
            {isComplete ? (
              <span className="text-[#ff2d2d] font-black">★ ALL {questions.length} QUESTIONS CALIBRATED ★</span>
            ) : (
              <span className="flex items-center gap-1.5 text-neutral-700">
                <AlertCircle className="w-3.5 h-3.5 text-[#ff2d2d]" />
                {questions.length - answeredCount} QUESTION{questions.length - answeredCount > 1 ? 'S' : ''} REMAINING
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full sm:w-auto px-8 py-3.5 text-base sm:text-lg flex items-center justify-center gap-2 ${
              isComplete ? 'brutal-btn-accent' : 'brutal-btn'
            }`}
          >
            <span>CALCULATE EXPIRY</span>
            <Flame className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
