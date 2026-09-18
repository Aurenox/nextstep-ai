import React, { useState } from 'react';
import { X, Layers, ArrowRight, Trash2, CheckCircle2, Clock, MapPin, Building, AlertTriangle } from 'lucide-react';
import { deleteProcess } from '../api';

export default function ProcessesModal({ 
  processes, 
  currentProcessId, 
  onSelectProcess, 
  onClose, 
  onNewTask,
  onProcessDeleted 
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDeleteClick = (e, procId) => {
    e.stopPropagation();
    setDeletingId(procId);
  };

  const handleConfirmDelete = async (e, procId) => {
    e.stopPropagation();
    setLoadingDelete(true);
    try {
      await deleteProcess(procId);
      onProcessDeleted?.(procId);
      setDeletingId(null);
    } catch (err) {
      console.error("Failed to delete process:", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Persistent Process Tracker</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">My Processes</h3>
        <p className="text-xs text-neutral-400 mb-6">
          Track and manage your ongoing citizen and consumer tasks. Click to resume any action plan, or remove completed workflows.
        </p>

        {/* Process Cards List */}
        <div className="space-y-3">
          {processes && processes.length > 0 ? (
            processes.map((proc) => {
              const isSelected = proc.id === currentProcessId;
              const pct = proc.completion_percentage || 0;
              const isConfirming = deletingId === proc.id;

              return (
                <div
                  key={proc.id}
                  onClick={() => {
                    if (!isConfirming) {
                      onSelectProcess(proc.id);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer text-xs relative group ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500/80 shadow-lg shadow-blue-500/10'
                      : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Delete Confirmation Overlay */}
                  {isConfirming ? (
                    <div className="p-2 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center justify-between gap-3 text-red-200 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="font-semibold text-xs">Remove this process from your tracker?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => handleConfirmDelete(e, proc.id)}
                          disabled={loadingDelete}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-md text-[11px] font-bold transition cursor-pointer"
                        >
                          {loadingDelete ? 'Removing...' : 'Yes, Remove'}
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md text-[11px] font-medium transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-white">{proc.title}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold border border-blue-500/30">
                                Active View
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              {proc.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-neutral-500" />
                              {proc.authority}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-blue-400">
                            {pct}%
                          </span>
                          
                          {/* Trash Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, proc.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                            title="Remove from My Processes"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Next step indicator */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px]">
                        <div className="flex items-center gap-1.5 text-neutral-300 truncate max-w-[80%]">
                          <span className="text-neutral-500 font-semibold">NEXT:</span>
                          <span className="truncate">{proc.next_step_title || 'Continue step checklist'}</span>
                        </div>

                        <div className="flex items-center gap-1 text-blue-400 font-semibold shrink-0">
                          <span>Resume</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No processes in your tracker yet. Start a new task on the home screen!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {processes?.length || 0} active process{processes?.length === 1 ? '' : 'es'}
          </span>

          <button
            onClick={() => {
              onClose();
              onNewTask();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            + Start New Task
          </button>
        </div>

      </div>
    </div>
  );
}
