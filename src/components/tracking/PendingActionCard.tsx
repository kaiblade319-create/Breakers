import React from 'react';
import { Check } from 'lucide-react';

interface PendingActionCardProps {
  streamId: string;
  streamName: string;
  actionText: string;
  actionDepartment: string;
  deadline: string;
  priority: string;
  onNavigateToDocs: () => void;
  onResolve: (streamId: string) => void;
}

export const PendingActionCard: React.FC<PendingActionCardProps> = ({
  streamId,
  streamName,
  actionText,
  actionDepartment,
  deadline,
  priority,
  onNavigateToDocs,
  onResolve
}) => {
  return (
    <div className="bg-slate-800/90 border border-amber-500/40 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
          <span className="font-semibold text-slate-300 truncate">
            {streamName}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
            {priority.toUpperCase()} PRIORITY
          </span>
        </div>
        <div className="font-bold text-white text-xs sm:text-sm leading-snug">
          {actionText}
        </div>
        <div className="text-[11px] text-slate-300 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span><strong>Counter:</strong> {actionDepartment}</span>
          <span><strong>Deadline:</strong> {deadline}</span>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <button
          onClick={onNavigateToDocs}
          className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold underline text-left cursor-pointer min-h-[36px] flex items-center"
        >
          Attach Document →
        </button>
        <button
          onClick={() => onResolve(streamId)}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Mark As Submitted</span>
        </button>
      </div>
    </div>
  );
};
