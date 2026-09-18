import React, { useState } from 'react';
import { Target, FileText, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Mail, MapPin, Zap } from 'lucide-react';

export default function ActionMap({ actionMap, goalTitle = 'Your Goal' }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!actionMap || !actionMap.nodes) return null;

  const nodes = actionMap.nodes;

  const getNodeIcon = (type) => {
    switch (type) {
      case 'goal':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'branch':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'service':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'action':
        return <Mail className="w-4 h-4 text-indigo-400" />;
      case 'destination':
        return <MapPin className="w-4 h-4 text-sky-400" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Zap className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider font-bold text-neutral-300">Live Action Map</span>
        </div>
        <span className="text-[11px] text-neutral-500 font-medium">Dynamic Process Pipeline</span>
      </div>

      {/* Nodes Map Visualization */}
      <div className="py-4 overflow-x-auto">
        <div className="min-w-[640px] flex items-center justify-between gap-3 relative px-2">
          
          {nodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`cursor-pointer flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 min-w-[110px] max-w-[130px] relative ${
                    isActive
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                      : isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 border ${
                    isActive
                      ? 'bg-blue-600/20 border-blue-500/40'
                      : isCompleted
                        ? 'bg-emerald-500/20 border-emerald-500/30'
                        : 'bg-neutral-800 border-neutral-700'
                  }`}>
                    {getNodeIcon(node.type)}
                  </div>

                  <span className="text-xs font-semibold text-neutral-100 truncate w-full" title={node.label}>
                    {node.label}
                  </span>

                  <span className={`text-[10px] mt-1 font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'text-neutral-500'
                  }`}>
                    {node.status}
                  </span>

                  {node.details && (
                    <span className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                      {node.details}
                    </span>
                  )}
                </div>

                {/* Animated Flow Arrow / Line */}
                {idx < nodes.length - 1 && (
                  <div className="flex-1 flex items-center justify-center relative min-w-[32px]">
                    <div className="w-full h-0.5 bg-neutral-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 animate-flow-line opacity-75" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 absolute right-0 -mr-1" />
                  </div>
                )}
              </React.Fragment>
            );
          })}

        </div>
      </div>

      {/* Selected Node Details Bar */}
      {selectedNode && (
        <div className="mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{selectedNode.label}:</span>
            <span className="text-neutral-400">{selectedNode.details || 'Standard verification stage'}</span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-neutral-500 hover:text-neutral-300 text-[11px]"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
}
