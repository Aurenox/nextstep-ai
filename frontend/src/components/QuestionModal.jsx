import React, { useState } from 'react';
import { ArrowRight, HelpCircle, Sparkles, Check, ChevronRight } from 'lucide-react';

export default function QuestionModal({ questions, remainingCount, onAnswerQuestion, onSkipAll, problem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customAnswer, setCustomAnswer] = useState('');

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex] || questions[0];
  const remaining = questions.length - currentIndex;

  const handleSelectOption = (option) => {
    onAnswerQuestion(currentQ.field_key, option);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setCustomAnswer('');
    }
  };

  const handleCustomSubmit = (e) => {
    e?.preventDefault();
    if (!customAnswer.trim()) return;
    onAnswerQuestion(currentQ.field_key, customAnswer.trim());
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setCustomAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Progress */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Question Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono font-medium border border-neutral-700">
              {remaining} question{remaining > 1 ? 's' : ''} remaining
            </span>
          </div>
        </div>

        {/* Goal Context Banner */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-neutral-950 text-xs text-neutral-400 border border-neutral-800/80 truncate">
          <span className="text-neutral-500 font-medium mr-1.5">For problem:</span>
          <span className="text-neutral-200">"{problem}"</span>
        </div>

        {/* The Question */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2 leading-snug">
            {currentQ.question}
          </h3>
          <p className="text-xs text-neutral-400">
            NEXTSTEP asks only what's necessary to identify the exact departmental procedure for your jurisdiction.
          </p>
        </div>

        {/* Options chips if available */}
        {currentQ.options && currentQ.options.length > 0 && (
          <div className="mb-5 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
              Select an option:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-neutral-950/80 hover:bg-blue-600/15 border border-neutral-800 hover:border-blue-500/50 text-xs text-neutral-200 hover:text-blue-300 font-medium transition flex items-center justify-between group"
                >
                  <span>{opt}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom text answer input */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder={currentQ.placeholder || "Type custom answer here..."}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 text-xs text-white placeholder-neutral-500 outline-none transition"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={onSkipAll}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition"
            >
              Skip questions & research directly
            </button>

            <button
              type="submit"
              disabled={!customAnswer.trim()}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                customAnswer.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
