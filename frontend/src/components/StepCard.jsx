import React, { useState } from 'react';
import { 
  CheckCircle, Circle, ChevronDown, ChevronUp, ExternalLink, 
  MapPin, Clock, ShieldCheck, FileCheck, Building, Sparkles 
} from 'lucide-react';

export default function StepCard({ step, onToggleStatus }) {
  const [expanded, setExpanded] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});

  const isCompleted = step.status === 'completed';
  const isInProgress = step.status === 'in_progress';
  const isSkipped = step.status === 'skipped';

  const toggleCheckItem = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getSourceBadge = (type) => {
    switch (type) {
      case 'official':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Official Source
          </span>
        );
      case 'trusted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Trusted Portal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Supporting Info
          </span>
        );
    }
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      step.is_new_step
        ? 'bg-neutral-900/90 border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30'
        : isCompleted 
          ? 'bg-neutral-950/70 border-emerald-900/40 opacity-90' 
          : isInProgress 
            ? 'bg-neutral-900/90 border-neutral-700 shadow-xl' 
            : isSkipped 
              ? 'bg-neutral-950/40 border-neutral-800/40 opacity-60' 
              : 'bg-neutral-900/60 border-neutral-800'
    }`}>
      
      {/* Top Header Row */}
      <div className="p-5 flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3.5">
          
          {/* Status Checkbox Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(step.id, isCompleted ? 'in_progress' : 'completed');
            }}
            className="mt-0.5 shrink-0 focus:outline-none"
            title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="w-6 h-6 text-neutral-600 hover:text-neutral-400 transition" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono font-bold text-neutral-400">
                STEP {String(step.order).padStart(2, '0')}
              </span>
              {step.is_new_step && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white animate-pulse">
                  🔄 Process Updated
                </span>
              )}
              {isSkipped && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
                  ⚡ Fast Path Skipped
                </span>
              )}
              {getSourceBadge(step.source_type)}
            </div>

            <h3 className={`text-base font-bold transition ${isCompleted ? 'text-neutral-400 line-through' : 'text-white'}`}>
              {step.title}
            </h3>
          </div>
        </div>

        {/* Expand / Collapse Icon */}
        <button type="button" className="text-neutral-500 hover:text-neutral-300 transition shrink-0 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details Body */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 space-y-4 text-xs border-t border-neutral-800/80">
          
          {/* WHAT */}
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
              WHAT TO DO
            </span>
            <p className="text-neutral-200 leading-relaxed">{step.what}</p>
          </div>

          {/* WHY */}
          <div>
            <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
              WHY THIS IS NECESSARY
            </span>
            <p className="text-neutral-400 leading-relaxed">{step.why}</p>
          </div>

          {/* HOW */}
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
            <span className="font-bold text-[10px] uppercase tracking-wider text-blue-400 block mb-1">
              HOW TO COMPLETE
            </span>
            <p className="text-neutral-300 leading-relaxed font-mono text-[11px]">{step.how}</p>
          </div>

          {/* WHAT I NEED (Interactive Checklist) */}
          {step.what_i_need && step.what_i_need.length > 0 && (
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 block mb-2">
                WHAT YOU NEED
              </span>
              <div className="space-y-1.5">
                {step.what_i_need.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleCheckItem(idx)}
                    className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer hover:text-white transition p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[idx]}
                      onChange={() => toggleCheckItem(idx)}
                      className="rounded border-neutral-700 bg-neutral-800 text-blue-600 focus:ring-0 focus:outline-none"
                    />
                    <span className={checkedItems[idx] ? 'line-through text-neutral-500' : ''}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Grid: WHERE, WHO, WHEN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/60 text-[11px]">
            {/* WHERE */}
            <div>
              <span className="text-neutral-500 uppercase tracking-wider font-semibold block mb-0.5">WHERE</span>
              {step.where_url ? (
                <a
                  href={step.where_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 truncate max-w-full"
                >
                  <span className="truncate">{step.where_label || 'Official Portal'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-neutral-300 truncate block">{step.where_label || 'Department Office'}</span>
              )}
            </div>

            {/* WHO */}
            <div>
              <span className="text-neutral-500 uppercase tracking-wider font-semibold block mb-0.5">WHO</span>
              <span className="text-neutral-300 truncate block">{step.who_authority}</span>
            </div>

            {/* WHEN */}
            <div>
              <span className="text-neutral-500 uppercase tracking-wider font-semibold block mb-0.5">TIMELINE</span>
              <span className="text-neutral-300 truncate block">{step.when_timeline}</span>
            </div>
          </div>

          {/* SOURCE & ACTION FOOTER */}
          <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="text-neutral-500">Source:</span>
              <a
                href={step.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
              >
                <span>{step.source_title}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => onToggleStatus(step.id, isCompleted ? 'in_progress' : 'completed')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                isCompleted 
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                  : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
              }`}
            >
              {isCompleted ? 'Mark Incomplete' : 'Mark as Complete ✓'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
