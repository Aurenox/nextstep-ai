import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, MapPin, Sparkles, Shield, Dices, 
  GraduationCap, Plane, Briefcase, ShieldAlert, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { analyzeIntent, fetchSuggestions } from '../api';

export default function TaskComposer({ onSubmit, onSelectScenario, initialProblem = '' }) {
  const [problem, setProblem] = useState(initialProblem);
  const [userLocation, setUserLocation] = useState('Thiruvananthapuram, Kerala');
  const [isLocEditing, setIsLocEditing] = useState(false);
  const [previewIntent, setPreviewIntent] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const textareaRef = useRef(null);

  const samplePrompts = [
    "I lost my university degree certificate from KTU and need a duplicate replacement",
    "My domestic flight was cancelled by airline and they are refusing 100% full refund",
    "I want to register a new small business and get MSME Udyam registration",
    "My laptop broke under warranty and the service center is refusing free repair",
    "I need to apply for a German student visa and open a blocked account",
    "I need to renew my expired driving licence in Kerala"
  ];

  const quickScenarios = [
    {
      id: 'certificate',
      icon: GraduationCap,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      badge: 'Education',
      title: 'Lost Degree Certificate',
      desc: 'KTU Kerala • Police FIR certificate, ₹200 Stamp Paper affidavit, duplicate degree process',
      query: 'I lost my university degree certificate from KTU and need a replacement'
    },
    {
      id: 'flight',
      icon: Plane,
      color: 'from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-300',
      badge: 'Travel & Aviation',
      title: 'Flight Cancelled Refund',
      desc: 'DGCA CAR Sec 3 • Mandatory 100% refund within 7 days without cancellation fees',
      query: 'My domestic flight was cancelled and the airline is refusing full refund'
    },
    {
      id: 'business',
      icon: Briefcase,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      badge: 'Small Business',
      title: 'Start MSME Business',
      desc: 'Govt of India • Zero-fee Udyam registration certificate, bank loans, collateral subsidies',
      query: 'I want to start a small proprietorship business and need MSME Udyam registration'
    },
    {
      id: 'warranty',
      icon: ShieldAlert,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
      badge: 'Consumer Rights',
      title: 'Warranty Claim Dispute',
      desc: 'National Consumer Helpline • ₹50,000 defective product notice & statutory grievance',
      query: 'My laptop is under warranty but authorized service center is refusing free repair'
    }
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [problem]);

  // Debounced live intent analysis
  useEffect(() => {
    if (!problem.trim() || problem.trim().length < 8) {
      setPreviewIntent(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingIntent(true);
      try {
        const intent = await analyzeIntent(problem, userLocation);
        setPreviewIntent(intent);
      } catch (err) {
        console.error("Intent preview error:", err);
      } finally {
        setLoadingIntent(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [problem, userLocation]);

  // Debounced live process suggestions ("Did you mean?")
  useEffect(() => {
    if (!problem.trim() || problem.trim().length < 4) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetchSuggestions(problem.trim(), userLocation);
        if (res && Array.isArray(res.suggestions)) {
          setSuggestions(res.suggestions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Suggestions fetch error:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [problem, userLocation]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!problem.trim()) return;
    onSubmit(problem.trim(), userLocation);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFillRandom = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setProblem(randomPrompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCardClick = (sc) => {
    if (onSelectScenario) {
      onSelectScenario(sc.id);
    } else {
      onSubmit(sc.query, userLocation);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* 🎯 Primary Action Box */}
      <div className="relative rounded-2xl bg-neutral-900/95 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/10 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300">
        
        {/* Step indicator header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-extrabold text-[11px] uppercase tracking-wider">
              Step 1
            </span>
            <span className="text-neutral-300 font-semibold text-xs sm:text-sm">
              Tell NEXTSTEP what you need to get done:
            </span>
          </div>

          <button
            type="button"
            onClick={handleFillRandom}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer border border-neutral-700"
            title="Click to fill in a real-world sample problem"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Fill sample</span>
          </button>
        </div>

        {/* Location bar */}
        <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-neutral-950/70 border border-neutral-800 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-neutral-400 text-[11px]">Your Jurisdiction:</span>
            {isLocEditing ? (
              <input
                type="text"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                onBlur={() => setIsLocEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsLocEditing(false)}
                autoFocus
                className="bg-neutral-900 text-white px-2 py-0.5 rounded outline-none border border-blue-500 text-xs w-48"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsLocEditing(true)}
                className="text-white font-semibold hover:text-blue-300 transition underline decoration-dotted cursor-pointer"
              >
                {userLocation} <span className="text-[10px] text-blue-400 font-normal">(Click to edit)</span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Official Government Portals Only</span>
          </div>
        </div>

        {/* The Big Text Input */}
        <form onSubmit={handleSubmit}>
          <div className="relative py-1">
            <textarea
              ref={textareaRef}
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Example: I lost my university certificate from KTU and need a duplicate copy..."
              className="w-full bg-transparent text-white placeholder-neutral-500 text-base sm:text-lg focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* AI Intent Live Feedback */}
          {previewIntent && (
            <div className="mt-3 pt-3 border-t border-neutral-800/80 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>AI Detected Your Goal & Jurisdiction</span>
                {loadingIntent && <span className="text-neutral-400 font-normal">· Updating...</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Identified Task</span>
                  <span className="font-semibold text-white truncate block">{previewIntent.goal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Jurisdiction</span>
                  <span className="font-semibold text-neutral-200 truncate block">
                    {previewIntent.detected_state || 'State'} · {previewIntent.detected_city || 'City'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Likely Department</span>
                  <span className="font-semibold text-emerald-400 truncate block">{previewIntent.likely_authority}</span>
                </div>
              </div>
            </div>
          )}

          {/* 💡 Dynamic "Did you mean?" suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-800/80 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Did you mean?</span>
                  <span className="text-neutral-500 font-normal lowercase tracking-normal">
                    (Click to select specific procedure)
                  </span>
                </div>
                {loadingSuggestions && (
                  <span className="text-[10px] text-neutral-400 animate-pulse">Checking options...</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {suggestions.map((sug) => (
                  <button
                    key={sug.id}
                    type="button"
                    onClick={() => {
                      const selectedQuery = sug.query || sug.title;
                      setProblem(selectedQuery);
                      onSubmit(selectedQuery, userLocation);
                    }}
                    className="group text-left p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base leading-none">{sug.icon || '📌'}</span>
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                          {sug.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                        {sug.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-neutral-800/50 flex items-center justify-between text-[10px] text-amber-400/90 font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>Launch procedure</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px] border border-neutral-700">Enter ↵</kbd> or click button
            </span>

            <button
              type="submit"
              disabled={!problem.trim()}
              className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                problem.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-100 hover:scale-[1.02]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Get My Action Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

      {/* 🚀 1-Click Ready Scenarios (Instant Run) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Or click one of these to try instantly (1-Click Run):
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">Zero typing needed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickScenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleCardClick(sc)}
                className={`p-4 rounded-xl text-left bg-gradient-to-br ${sc.color} bg-neutral-900/80 hover:bg-neutral-800 border transition-all duration-200 group relative cursor-pointer hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-950/60 border border-neutral-800 text-neutral-400">
                    {sc.badge}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition mb-1">
                  {sc.title}
                </h4>
                
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                  {sc.desc}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Run this workflow</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
