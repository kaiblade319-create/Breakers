import React from 'react';
import { StreamApplication } from '../../types';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface PipelineStepTimelineProps {
  stream: StreamApplication;
  isResolved: boolean;
  onResolve: (streamId: string) => void;
}

export const PipelineStepTimeline: React.FC<PipelineStepTimelineProps> = ({
  stream,
  isResolved,
  onResolve
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Stream Header */}
      <div className="p-3.5 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {stream.streamName}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 shrink-0">
              {stream.progressPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Authority: {stream.provider} • Applied: ₹{stream.appliedAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stream.pendingAction && !isResolved && (
            <button
              onClick={() => onResolve(stream.id)}
              className="w-full sm:w-auto px-3.5 py-2.5 sm:py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Resolve Pending Query</span>
            </button>
          )}
        </div>
      </div>

      {/* Steps timeline */}
      <div className="p-4 sm:p-5 space-y-1">
        {stream.steps.map((step, sIdx) => {
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          const isActionReq = step.status === 'action_required';
          const isLast = sIdx === stream.steps.length - 1;

          return (
            <div key={step.id} className="flex items-start gap-3 sm:gap-4">
              {/* Timeline Node & Connector Line */}
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white shrink-0 ${
                    isCompleted
                      ? 'border-emerald-600 text-emerald-600'
                      : isInProgress
                      ? 'border-sky-600 text-sky-600 animate-pulse'
                      : isActionReq
                      ? 'border-amber-600 text-amber-600'
                      : 'border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isInProgress ? (
                    <Clock className="w-3 h-3" />
                  ) : isActionReq ? (
                    <span>!</span>
                  ) : (
                    <span>{sIdx + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 min-h-[32px] grow my-1 ${
                    isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Step Details */}
              <div className="flex-1 pb-3 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm break-words">
                    {step.title}
                  </div>
                  {step.date && (
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium shrink-0">
                      {step.date}
                    </div>
                  )}
                </div>

                {step.note && (
                  <div
                    className={`text-xs mt-1.5 p-2.5 rounded-xl break-words ${
                      isActionReq
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 font-medium'
                        : 'text-slate-700 bg-slate-50 border border-slate-100'
                    }`}
                  >
                    {step.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
