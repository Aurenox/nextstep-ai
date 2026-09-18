import React, { useState, useEffect } from 'react';
import { Search, Globe, Building, FileText, CheckCircle2, ShieldAlert, Sparkles, Compass } from 'lucide-react';

export default function ResearchVisualizer({ problem, location = 'Kerala, India' }) {
  const steps = [
    { label: 'Location & Jurisdiction Detected', detail: location, icon: Compass },
    { label: 'Formulating Targeted SerpApi Queries', detail: 'Planning official registry searches', icon: Search },
    { label: 'Querying Official Portals via SerpApi', detail: 'Live web search with domain filters', icon: Globe },
    { label: 'Verifying Authority & Department', detail: 'Cross-checking official gazettes & rules', icon: Building },
    { label: 'Synthesizing Step-by-Step Action Plan', detail: 'Assembling links, contacts, and forms', icon: FileText },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden">
        
        {/* Pulsing ambient light */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Top Status */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>SerpApi Live Action Agent Active</span>
          </div>
          <h3 className="text-lg font-bold text-white">Researching your action path</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto truncate">"{problem}"</p>
        </div>

        {/* Stepper list */}
        <div className="space-y-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div 
                key={idx}
                className={`flex items-start gap-3 transition-all duration-300 ${
                  isDone 
                    ? 'opacity-80' 
                    : isCurrent 
                      ? 'opacity-100 scale-[1.02]' 
                      : 'opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold transition-all ${
                  isDone 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : isCurrent 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 animate-pulse' 
                      : 'bg-neutral-800/60 border-neutral-800 text-neutral-500'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="text-xs font-semibold text-neutral-200">{st.label}</div>
                  <div className="text-[11px] text-neutral-400 truncate">{st.detail}</div>
                </div>

                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping mt-2 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-800 text-center">
          <span className="text-[11px] text-neutral-500 font-medium">
            Analyzing official government and institutional regulations...
          </span>
        </div>

      </div>
    </div>
  );
}
