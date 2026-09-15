import React, { useState } from 'react';
import { StreamApplication, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Check, 
  BellRing,
  HelpCircle,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

interface JourneyTrackerProps {
  streams: StreamApplication[];
  onUpdateStreams: (streams: StreamApplication[]) => void;
  language: Language;
  onNavigateTab: (tabId: string) => void;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  streams,
  onUpdateStreams,
  language,
  onNavigateTab
}) => {
  const t = TRANSLATIONS[language];
  const [activeTabStream, setActiveTabStream] = useState<string>('all');
  const [resolvedActionIds, setResolvedActionIds] = useState<string[]>([]);

  // Calculate pending actions today across streams
  const pendingActions = streams
    .filter(s => s.pendingAction && !resolvedActionIds.includes(s.id))
    .map(s => ({
      streamId: s.id,
      streamName: s.streamName,
      ...s.pendingAction!
    }));

  const pendingCount = pendingActions.length;

  const handleResolveAction = (streamId: string) => {
    setResolvedActionIds(prev => [...prev, streamId]);
    // Boost progress percent of the stream
    const updated = streams.map(s => {
      if (s.id === streamId) {
        return {
          ...s,
          progressPercent: Math.min(100, s.progressPercent + 15),
          currentStatus: 'Action Completed: Under Final Sanction Review',
          statusType: 'in_progress' as const
        };
      }
      return s;
    });
    onUpdateStreams(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Exact quote from Document Page 12 */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-400 text-slate-950 mb-2.5 uppercase tracking-wider">
              <span>Step 4 of 4</span>
              <span>•</span>
              <span>Live Progress & Approvals</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'hi' ? 'अस्पताल मंजूरी और प्रश्न निवारण' : language === 'mr' ? 'मंजुरी ट्रॅकिंग आणि प्रश्न निवारण' : 'Track Approvals & Fix Inquiries'}
            </h2>
            <div className="text-emerald-300 font-extrabold text-base mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.pendingActionsToday.replace('{count}', String(pendingCount))}
            </div>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Track the exact review stage at the hospital desk. When an insurance TPA or scheme officer raises an inquiry, click "Resolve" to clear the roadblock immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
              Active Streams: <strong className="text-white">{streams.length}</strong>
            </span>
          </div>
        </div>

        {/* Priority Pending Actions Cards (turns product into Action Management) */}
        {pendingCount > 0 ? (
          <div className="mt-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Critical Actions Requiring Your Attention Today:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingActions.map(act => (
                <div 
                  key={act.streamId} 
                  className="bg-slate-800/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                      <span className="font-semibold text-slate-300 truncate">
                        {act.streamName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {act.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">
                      {act.actionText}
                    </div>
                    <div className="text-xs text-slate-300 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span><strong>Counter:</strong> {act.actionDepartment}</span>
                      <span><strong>Deadline:</strong> {act.deadline}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                    <button
                      onClick={() => onNavigateTab('documents')}
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold underline"
                    >
                      Attach Document →
                    </button>
                    <button
                      onClick={() => handleResolveAction(act.streamId)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Mark As Submitted
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All priority actions for today have been addressed. Waiting for next portal refresh.</span>
          </div>
        )}
      </div>

      {/* Parallel Progress Overview matching Document Page 12 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {streams.map(stream => {
          const isQuery = stream.statusType === 'query_raised';
          return (
            <div key={stream.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 truncate" title={stream.streamName}>
                    {stream.streamName.split('(')[0]}
                  </span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {stream.progressPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden my-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      isQuery 
                        ? 'bg-amber-500' 
                        : stream.progressPercent >= 80 
                        ? 'bg-emerald-600' 
                        : 'bg-teal-600'
                    }`}
                    style={{ width: `${stream.progressPercent}%` }}
                  />
                </div>

                <div className="text-xs font-semibold mt-2 text-slate-900 line-clamp-2">
                  {stream.currentStatus}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Provider: {stream.provider}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Sanctioned:</span>
                <span className="font-bold text-emerald-700">
                  {stream.sanctionedAmount && stream.sanctionedAmount > 0 
                    ? `₹${(stream.sanctionedAmount / 100000).toFixed(1)}L` 
                    : 'In Review'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Stream Pipeline Breakdown */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          End-to-End Application Pipelines
        </h3>

        {streams.map(stream => {
          return (
            <div key={stream.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">
                      {stream.streamName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                      {stream.progressPercent}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Authority: {stream.provider} • Applied Sum: ₹{stream.appliedAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {stream.pendingAction && !resolvedActionIds.includes(stream.id) && (
                    <button
                      onClick={() => handleResolveAction(stream.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Resolve Pending Query
                    </button>
                  )}
                </div>
              </div>

              {/* Steps timeline */}
              <div className="p-5">
                <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-3">
                  {stream.steps.map((step, sIdx) => {
                    const isCompleted = step.status === 'completed';
                    const isInProgress = step.status === 'in_progress';
                    const isActionReq = step.status === 'action_required';

                    return (
                      <div key={step.id} className="relative">
                        {/* Status Icon */}
                        <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white ${
                          isCompleted
                            ? 'border-emerald-600 text-emerald-600'
                            : isInProgress
                            ? 'border-sky-600 text-sky-600 animate-pulse'
                            : isActionReq
                            ? 'border-amber-600 text-amber-600'
                            : 'border-slate-300 text-slate-400'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isInProgress ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : isActionReq ? (
                            <span>!</span>
                          ) : (
                            <span>{sIdx + 1}</span>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <div className="font-bold text-slate-900 text-sm">
                            {step.title}
                          </div>
                          {step.date && (
                            <div className="text-xs text-slate-700 font-medium">
                              {step.date}
                            </div>
                          )}
                        </div>

                        {step.note && (
                          <div className={`text-xs mt-1 p-2 rounded-lg ${
                            isActionReq
                              ? 'bg-amber-50 text-amber-900 border border-amber-200 font-medium'
                              : 'text-slate-700 bg-slate-50'
                          }`}>
                            {step.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation & Layman Help Desk Assistance Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-sky-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <button
          onClick={() => onNavigateTab('one_application')}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Step 3: Application Dossier</span>
        </button>

        <div className="text-center sm:text-right">
          <div className="text-xs text-sky-300 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-end gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Need Help at the Hospital?</span>
          </div>
          <div className="text-xs text-slate-300 mt-0.5">
            Call free national helpline <strong>14555</strong> (Ayushman Bharat) or visit the Ground Floor Arogyamitra desk.
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('support_map')}
          className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <span>Review Full Financial Summary</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
