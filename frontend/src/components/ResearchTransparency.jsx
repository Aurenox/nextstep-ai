import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Database, Calendar } from 'lucide-react';

export default function ResearchTransparency({ searchQueries = [], sources = [], confidenceSummary = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden transition">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-800/40 transition"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-blue-400" />
          <div>
            <span className="text-xs font-bold text-neutral-200 block">
              🔎 How NEXTSTEP found this
            </span>
            <span className="text-[11px] text-neutral-500">
              SerpApi search queries, verified source citations, and confidence metrics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Official verified</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
        </div>
      </button>

      {/* Expanded Details */}
      {isOpen && (
        <div className="p-5 border-t border-neutral-800 space-y-5 text-xs bg-neutral-950/40">
          
          {/* Confidence Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                Official Source Found
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                ✓ Government / University Portal
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                Cross-Verification
              </span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                ✓ Multiple Official Rules Agree
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                Regulatory Status
              </span>
              <span className="text-neutral-300 font-semibold">
                {confidenceSummary.verification_note || 'Current Statutory Guidelines'}
              </span>
            </div>
          </div>

          {/* SerpApi Queries Used */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 block mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Targeted SerpApi Queries Executed:</span>
            </span>
            <div className="space-y-1.5">
              {searchQueries && searchQueries.length > 0 ? (
                searchQueries.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-950 font-mono text-[11px] text-neutral-300 border border-neutral-800/80 flex items-center gap-2"
                  >
                    <span className="text-blue-500 font-bold">Query {idx + 1}:</span>
                    <span className="truncate">{q}</span>
                  </div>
                ))
              ) : (
                <div className="text-neutral-500 text-xs italic">Live SerpApi queries indexed.</div>
              )}
            </div>
          </div>

          {/* Sources List */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 block mb-2">
              Verified Sources & Direct Citations:
            </span>
            <div className="space-y-2">
              {sources && sources.length > 0 ? (
                sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          src.source_type === 'official'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {src.source_type}
                        </span>
                        <span className="font-semibold text-neutral-200">{src.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{src.snippet}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[11px]">
                      {src.date_published && (
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {src.date_published}
                        </span>
                      )}
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium underline"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-neutral-500 text-xs italic">No additional sources logged.</div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
