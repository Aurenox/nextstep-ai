import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, Send, ArrowRight, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';
import { submitAdaptiveUpdate } from '../api';

export default function AdaptiveModal({ processData, onClose, onUpdateSuccess }) {
  const [newInfo, setNewInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic contextual sample responses tailored to common citizen roadblocks
  const contextualPresets = [
    {
      label: '📜 Additional Notarized Affidavit Demanded',
      snippet: `The university examination branch emailed back: "Your application is on hold. You must submit a Gazetted Officer attested Sworn Affidavit on ₹200 Non-Judicial Stamp Paper along with original police acknowledgment before the duplicate certificate can be printed."`,
      tag: 'Missing Document'
    },
    {
      label: '✈️ Airline Denied Refund Citing Weather',
      snippet: `The airline customer grievance desk replied: "Flight disruption was occasioned by operational weather constraints outside carrier control. We can only issue non-refundable travel credits, not cash or bank reversal."`,
      tag: 'Dispute / CAR Violation'
    },
    {
      label: '💼 Municipal Officer Demanded Fire & Zoning NOC',
      snippet: `The Urban Local Body revenue inspector visited the premises and issued notice: "Commercial trade license cannot be approved until Fire Department NOC and building occupancy certificate are attached."`,
      tag: 'Compliance Roadblock'
    },
    {
      label: '🛡️ Service Center Denied Free Warranty Repair',
      snippet: `The service manager emailed: "Warranty voided due to unverified internal moisture sensor discoloration. Paid motherboard replacement estimate is ₹18,500."`,
      tag: 'Defect Denial'
    }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!newInfo.trim()) return;

    setLoading(true);
    try {
      const res = await submitAdaptiveUpdate(processData.id, newInfo.trim());
      onUpdateSuccess(res);
      onClose();
    } catch (err) {
      console.error("Adaptive update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Dynamic Replanning Agent</span>
        </div>
        <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
          Update Process with Authority Reply
        </h3>
        <p className="text-xs text-neutral-400 mb-5">
          Paste the letter, email, or SMS you received from the department. NEXTSTEP adapts your workflow and injects newly required steps dynamically.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-300 font-semibold block mb-1.5">
              Paste email, SMS, or notice received:
            </label>
            <textarea
              rows={4}
              value={newInfo}
              onChange={(e) => setNewInfo(e.target.value)}
              placeholder="e.g. 'The department emailed saying: Your file is delayed because we need an additional gazetted officer endorsement...'"
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Quick Contextual Presets */}
          <div>
            <span className="text-[11px] uppercase font-bold text-neutral-500 tracking-wider block mb-2">
              Or click a sample authority response to test adaptive replanning:
            </span>
            <div className="space-y-2">
              {contextualPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewInfo(preset.snippet)}
                  className="w-full text-left p-2.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-800/60 border border-neutral-800 text-xs text-neutral-300 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-white text-xs block truncate">{preset.label}</span>
                    <span className="text-[11px] text-neutral-400 truncate block">"{preset.snippet}"</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20 shrink-0">
                    {preset.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !newInfo.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                loading || !newInfo.trim()
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-500/25 cursor-pointer'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Analyzing & Replanning...' : 'Submit & Re-Plan Process'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
