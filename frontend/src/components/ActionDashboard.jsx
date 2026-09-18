import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Building, Target, Clock, ShieldCheck, 
  ExternalLink, Mail, FileText, RefreshCw, Zap, CheckCircle2, 
  Phone, Globe, Check, AlertCircle, Sparkles, ChevronRight,
  Plus, Database, Edit2, X
} from 'lucide-react';
import StepCard from './StepCard';
import ActionMap from './ActionMap';
import ResearchTransparency from './ResearchTransparency';
import { updateStepStatus, calculateFastPath, updateProcessFields } from '../api';

export default function ActionDashboard({ 
  processData, 
  onBack, 
  onOpenEmail, 
  onOpenDocument, 
  onOpenAdaptive, 
  onProcessUpdated 
}) {
  const [currentData, setCurrentData] = useState(processData);
  const [fastPathMessage, setFastPathMessage] = useState(null);
  const [fieldsState, setFieldsState] = useState(processData.fields || {});
  const [editingFieldKey, setEditingFieldKey] = useState(null);
  const [editingFieldValue, setEditingFieldValue] = useState('');
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  // Sync state if prop changes
  React.useEffect(() => {
    setCurrentData(processData);
    setFieldsState(processData.fields || {});
  }, [processData]);

  // Handle saving a process field
  const handleSaveField = async (key, val) => {
    const updated = { ...fieldsState, [key]: val };
    setFieldsState(updated);
    setEditingFieldKey(null);
    try {
      await updateProcessFields(currentData.id, updated);
      const updatedProcess = { ...currentData, fields: updated };
      setCurrentData(updatedProcess);
      onProcessUpdated?.(updatedProcess);
    } catch (err) {
      console.error("Failed to update process fields:", err);
    }
  };

  // Handle adding a new custom field
  const handleAddNewField = async (e) => {
    e.preventDefault();
    if (!newFieldKey.trim()) return;
    const cleanKey = newFieldKey.trim().toLowerCase().replace(/\s+/g, '_');
    await handleSaveField(cleanKey, newFieldValue.trim());
    setNewFieldKey('');
    setNewFieldValue('');
    setShowAddFieldModal(false);
  };

  // Handle Step Completion Toggle
  const handleToggleStep = async (stepId, newStatus) => {
    try {
      const res = await updateStepStatus(currentData.id, stepId, newStatus);
      const updatedSteps = currentData.steps.map(s => 
        s.id === stepId ? { ...s, status: newStatus } : s
      );
      const updated = {
        ...currentData,
        steps: updatedSteps,
        completion_percentage: res.completion_percentage,
        next_step: res.next_step || currentData.next_step
      };
      setCurrentData(updated);
      onProcessUpdated?.(updated);
    } catch (err) {
      console.error("Failed to toggle step:", err);
    }
  };

  // Handle Document Toggle for Fast Path
  const handleToggleDocument = async (docId) => {
    const updatedDocs = currentData.documents.map(d => 
      d.id === docId ? { ...d, is_held: !d.is_held } : d
    );
    const heldIds = updatedDocs.filter(d => d.is_held).map(d => d.id);

    try {
      const fastRes = await calculateFastPath(currentData.id, heldIds);
      const updated = {
        ...currentData,
        documents: fastRes.documents,
        steps: fastRes.steps,
        completion_percentage: fastRes.completion_percentage,
        next_step: fastRes.next_step || currentData.next_step
      };
      setCurrentData(updated);
      setFastPathMessage(fastRes.message);
      onProcessUpdated?.(updated);
    } catch (err) {
      console.error("Fast path calculation failed:", err);
    }
  };

  const nextStep = currentData.next_step || currentData.steps?.[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Navigation & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition"
            title="Back to start"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-400 mb-1">
              <span className="flex items-center gap-1 font-medium text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {currentData.country} → {currentData.state} → {currentData.city}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Building className="w-3.5 h-3.5" />
                {currentData.authority}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentData.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons: Email, Affidavit, Update */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 transition"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Draft Email</span>
          </button>

          <button
            onClick={onOpenDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 transition"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Document</span>
          </button>

          <button
            onClick={onOpenAdaptive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-200 transition"
            title="Paste authority reply to update workflow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Update with Reply</span>
          </button>
        </div>
      </div>

      {/* Progress & Fast Path Notification */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">Action Plan Progress</span>
            <span className="text-[11px] text-neutral-500">
              ({currentData.steps?.filter(s => s.status === 'completed').length || 0} of {currentData.steps?.length || 0} steps completed)
            </span>
          </div>
          <span className="font-mono font-bold text-blue-400 text-sm">
            {currentData.completion_percentage}%
          </span>
        </div>

        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/80">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${currentData.completion_percentage}%` }}
          />
        </div>

        {fastPathMessage && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{fastPathMessage}</span>
            </div>
            <button
              onClick={() => setFastPathMessage(null)}
              className="text-amber-400/60 hover:text-amber-400 text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 🗺️ Process Stage Progression Tracker */}
      {currentData.stages && currentData.stages.length > 0 && (
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="font-bold text-neutral-200 uppercase tracking-wider text-[11px]">
                Process Stage Pipeline
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold text-[11px]">
              Current: {currentData.current_stage || currentData.stages.find(s => s.status === 'active')?.name || 'In Progress'}
            </span>
          </div>

          {/* Stage Steps Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currentData.stages.map((stage, idx) => {
              const isActive = stage.status === 'active' || stage.name === currentData.current_stage;
              const isCompleted = stage.status === 'completed';
              return (
                <div
                  key={stage.id || idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-500/10'
                      : isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-400'
                      : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-neutral-500'
                    }`}>
                      Stage 0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                    )}
                  </div>
                  <span className={`text-xs font-semibold block truncate ${
                    isActive ? 'text-white font-bold' : isCompleted ? 'text-neutral-300' : 'text-neutral-400'
                  }`}>
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 💡 Clear Focus Guidance Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3 text-xs text-blue-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-sm shrink-0">
            🎯
          </div>
          <div>
            <span className="font-bold text-white">Where to focus right now: </span>
            <span>Follow the highlighted <strong>"YOUR NEXT STEP"</strong> card below. Once you finish that task, click <strong className="text-emerald-400">"Mark Step Complete"</strong> to move forward.</span>
          </div>
        </div>
      </div>

      {/* 🔥 THE HERO SECTION: "YOUR NEXT STEP" */}
      {nextStep && (
        <div className="rounded-2xl bg-gradient-to-br from-blue-950/40 via-neutral-900 to-neutral-900 border-2 border-blue-500/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-xs font-extrabold text-blue-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>YOUR NEXT STEP</span>
            </div>
            <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              Estimated time: {nextStep.when_timeline || '5–10 min'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {nextStep.title}
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed mb-6 max-w-3xl">
            {nextStep.what}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
            <div className="text-xs text-neutral-400">
              <span className="text-neutral-500 font-semibold block">Prerequisites for this step:</span>
              <span>{nextStep.what_i_need?.[0] || 'Official portal login credentials'}</span>
            </div>

            <div className="flex items-center gap-3">
              {nextStep.where_url && (
                <a
                  href={nextStep.where_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition"
                >
                  <span>Open {nextStep.where_label || 'Official Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => handleToggleStep(nextStep.id, 'completed')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Step Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Action Map */}
      <ActionMap actionMap={currentData.action_map} goalTitle={currentData.title} />

      {/* Main Grid: Steps Timeline + Documents Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Step-by-Step Action Plan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">Your Action Plan</h2>
              <p className="text-xs text-neutral-400">Complete each task step in order</p>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {currentData.steps?.length || 0} Total Steps
            </span>
          </div>

          <div className="space-y-4">
            {currentData.steps?.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                onToggleStatus={handleToggleStep}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Document Tracker, Fast Path & Contacts */}
        <div className="space-y-6">
          
          {/* 🧠 Process Memory & File Data */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-neutral-200 block">Case Memory & Details</span>
                  <span className="text-[11px] text-neutral-500">Persisted for emails & documents</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFieldModal(true)}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20"
              >
                <Plus className="w-3 h-3" />
                <span>Add Field</span>
              </button>
            </div>

            {/* Missing field suggestion tip */}
            {currentData.suggested_missing_field && (
              <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-white block">Suggested: {currentData.suggested_missing_field.label}</span>
                  <span className="text-[10px] text-indigo-300 leading-tight block mt-0.5">
                    {currentData.suggested_missing_field.reason}
                  </span>
                </div>
              </div>
            )}

            {/* Fields list */}
            <div className="space-y-2">
              {Object.entries(fieldsState).map(([k, v]) => (
                <div
                  key={k}
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block truncate">
                      {k.replace(/_/g, ' ')}
                    </span>
                    {editingFieldKey === k ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="text"
                          value={editingFieldValue}
                          onChange={(e) => setEditingFieldValue(e.target.value)}
                          className="w-full bg-neutral-900 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveField(k, editingFieldValue);
                            if (e.key === 'Escape') setEditingFieldKey(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveField(k, editingFieldValue)}
                          className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                          title="Save"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFieldKey(null)}
                          className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-semibold text-neutral-200 block truncate mt-0.5">
                        {v || <span className="text-neutral-600 italic">Not specified</span>}
                      </span>
                    )}
                  </div>
                  {editingFieldKey !== k && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFieldKey(k);
                        setEditingFieldValue(v || '');
                      }}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                      title="Edit this detail"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Prerequisites Checklist & Fast Path */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-bold text-neutral-200 block">Required Documents</span>
                <span className="text-[11px] text-neutral-500">Check documents you already hold</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Zap className="w-3 h-3" />
                <span>Fast Path</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {currentData.documents?.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleToggleDocument(doc.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                    doc.is_held
                      ? 'bg-blue-950/20 border-blue-500/40 text-neutral-200'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={doc.is_held}
                    onChange={() => handleToggleDocument(doc.id)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-800 text-blue-600 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className={`font-semibold block ${doc.is_held ? 'text-white' : 'text-neutral-300'}`}>
                      {doc.name}
                    </span>
                    {doc.description && (
                      <span className="text-[10px] text-neutral-500 block mt-0.5 leading-snug">
                        {doc.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-neutral-500 italic pt-1">
              Checking documents you possess recalculates the fastest legitimate route.
            </p>
          </div>

          {/* Useful Official Links Section */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-3">
            <span className="text-xs font-bold text-neutral-200 block pb-2 border-b border-neutral-800">
              🔗 Useful Links & Official Portals
            </span>

            <div className="space-y-2 text-xs">
              {currentData.sources?.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-blue-500/40 transition flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-neutral-200 block truncate group-hover:text-blue-300 transition">
                      {src.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 truncate block">
                      {src.url}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Contacts Section */}
          {currentData.contacts && currentData.contacts.length > 0 && (
            <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-3">
              <span className="text-xs font-bold text-neutral-200 block pb-2 border-b border-neutral-800">
                📞 Department Contacts
              </span>

              {currentData.contacts.map((con) => (
                <div key={con.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-white block">{con.organization}</span>
                    <span className="text-[11px] text-neutral-400 block">{con.department}</span>
                  </div>

                  {con.phone && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {con.phone}
                      </span>
                      <a
                        href={`tel:${con.phone}`}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20"
                      >
                        Call
                      </a>
                    </div>
                  )}

                  {con.email && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-neutral-400 text-[11px] flex items-center gap-1 truncate max-w-[70%]">
                        <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{con.email}</span>
                      </span>
                      <button
                        onClick={onOpenEmail}
                        className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20"
                      >
                        Email
                      </button>
                    </div>
                  )}

                  {con.address && (
                    <div className="flex items-start justify-between gap-2 pt-1 border-t border-neutral-900">
                      <span className="text-[10px] text-neutral-500 leading-tight">
                        {con.address}
                      </span>
                      {con.map_url && (
                        <a
                          href={con.map_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-sky-400 font-semibold shrink-0 hover:underline"
                        >
                          Maps ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Research Transparency Section */}
      <ResearchTransparency
        searchQueries={currentData.search_queries_used}
        sources={currentData.sources}
        confidenceSummary={currentData.source_confidence_summary}
      />

      {/* Add Custom Field Modal */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Add Process Case Field</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddFieldModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewField} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Field Label / Name
                </label>
                <input
                  type="text"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                  placeholder="e.g. Police Complaint ID, PNR"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Value
                </label>
                <input
                  type="text"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  placeholder="e.g. GD-2026/88412"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
