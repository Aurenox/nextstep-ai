import React from 'react';
import { ShieldCheck, Compass, CheckCircle, ExternalLink, Zap, ArrowRight, Sparkles, Search, CheckSquare } from 'lucide-react';
import TaskComposer from './TaskComposer';

export default function LandingView({ onSubmitProblem, onSelectDemoScenario }) {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-20 px-4 sm:px-6">
      
      {/* 🌟 Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Universal Action Agent</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
          Don't search how to do it. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
            Tell NEXTSTEP what you need done.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-2xl mx-auto mb-6">
          No government departments to memorize. No endless Google tabs. NEXTSTEP researches live official rules via SerpApi, resolves your local jurisdiction, and tells you your exact next step.
        </p>

        {/* 3 Simple Steps Banner */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 shadow-inner">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px]">1</span>
            <span>Describe problem</span>
          </div>
          <span className="text-neutral-600 hidden sm:inline">→</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">2</span>
            <span>SerpApi live checks rules</span>
          </div>
          <span className="text-neutral-600 hidden sm:inline">→</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[11px]">3</span>
            <span>Get steps, email & affidavits</span>
          </div>
        </div>
      </div>

      {/* 🎯 The Focal Point: Primary Task Composer with 1-Click Cards */}
      <TaskComposer 
        onSubmit={onSubmitProblem} 
        onSelectScenario={onSelectDemoScenario} 
      />

      {/* Trust Badges Strip */}
      <div className="mt-12 w-full max-w-3xl border-t border-neutral-800/80 pt-5 flex flex-wrap items-center justify-around gap-4 text-xs text-neutral-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SERPAPI LIVE RESEARCH</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>OFFICIAL PORTALS ONLY</span>
        </div>
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>LOCATION AWARE</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>PRE-FILLED GMAIL & AFFIDAVITS</span>
        </div>
      </div>

      {/* Real-World Demonstration Card */}
      <div className="mt-12 w-full max-w-3xl bg-neutral-900/60 p-5 sm:p-6 rounded-2xl border border-neutral-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="text-[11px] uppercase tracking-wider text-blue-400 font-bold">
            Real-World Demonstration
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
            DGCA Civil Aviation Mandate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-1">Citizen's Situation:</span>
            <p className="text-neutral-300 italic">
              "My flight was cancelled at the airport and airline refuses full refund, offering only flight vouchers."
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40">
            <span className="text-[10px] text-blue-400 uppercase font-semibold block mb-1">What NEXTSTEP Discovers Live:</span>
            <ul className="space-y-1 text-neutral-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>100% full refund mandatory within 7 days</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Airlines strictly barred from deducting fees</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Direct escalation via AirSewa statutory portal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          <span className="text-xs text-neutral-400">Want to see the step-by-step resolution?</span>
          <button
            onClick={() => onSelectDemoScenario('flight')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            <span>Launch Flight Refund Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
