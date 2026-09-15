import React, { useState } from 'react';
import { StreamApplication, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PendingActionCard } from './tracking/PendingActionCard';
import { PipelineStepTimeline } from './tracking/PipelineStepTimeline';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  Layers, 
  PhoneCall
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
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner: Status and Pending Actions */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-700/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-400 text-slate-950 mb-2 uppercase tracking-wider">
              <span>Step 4 of 4</span>
              <span>•</span>
              <span>Live Progress & Approvals</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'hi' ? 'अस्पताल मंजूरी और प्रश्न निवारण' : language === 'mr' ? 'मंजुरी ट्रॅकिंग आणि प्रश्न निवारण' : 'Track Approvals & Fix Inquiries'}
            </h2>
            <div className="text-emerald-300 font-extrabold text-sm sm:text-base mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span>{t.pendingActionsToday.replace('{count}', String(pendingCount))}</span>
            </div>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Track the exact review stage at the hospital desk. When an insurance TPA or scheme officer raises an inquiry, click "Mark As Submitted" to clear the roadblock immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
              Active Streams: <strong className="text-white">{streams.length}</strong>
            </span>
          </div>
        </div>

        {/* Priority Pending Actions Cards */}
        {pendingCount > 0 ? (
          <div className="mt-4 sm:mt-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Critical Actions Requiring Your Attention Today:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingActions.map(act => (
                <PendingActionCard
                  key={act.streamId}
                  streamId={act.streamId}
                  streamName={act.streamName}
                  actionText={act.actionText}
                  actionDepartment={act.actionDepartment}
                  deadline={act.deadline}
                  priority={act.priority}
                  onNavigateToDocs={() => onNavigateTab('documents')}
                  onResolve={handleResolveAction}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All priority actions for today have been addressed. Waiting for next portal refresh.</span>
          </div>
        )}
      </div>

      {/* Parallel Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {streams.map(stream => {
          const isQuery = stream.statusType === 'query_raised';
          return (
            <div key={stream.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
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

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
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
      <div className="space-y-3 sm:space-y-4">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>End-to-End Application Pipelines</span>
        </h3>

        {streams.map(stream => (
          <PipelineStepTimeline
            key={stream.id}
            stream={stream}
            isResolved={resolvedActionIds.includes(stream.id)}
            onResolve={handleResolveAction}
          />
        ))}
      </div>

      {/* Bottom Navigation & Layman Help Desk Assistance Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-sky-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-lg">
        <button
          onClick={() => onNavigateTab('one_application')}
          className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer border border-slate-700 min-h-[44px]"
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
          className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer min-h-[44px]"
        >
          <span>Review Full Financial Summary</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
