import React from 'react';
import { TrendingDown, IndianRupee, ShieldCheck, HeartHandshake, Building2, Layers } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/financialCalculations';
import { Language } from '../../types';

interface CostBreakdownCardProps {
  totalCost: number;
  totalAid: number;
  outOfPocket: number;
  reductionPercentage: number;
  isSimulatorActive: boolean;
  onToggleSimulator: () => void;
  language: Language;
}

export const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({
  totalCost,
  totalAid,
  outOfPocket,
  reductionPercentage,
  isSimulatorActive,
  onToggleSimulator,
  language
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
            <span>Multi-Pathway Relief Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'वित्तीय राहत और बचत' : language === 'mr' ? 'आर्थिक मदत आणि बचत' : 'Financial Relief Summary'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            We verified your patient profile against state schemes, charity bylaws, and insurance rules.
          </p>
        </div>

        <button
          onClick={onToggleSimulator}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
            isSimulatorActive
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
          <span>{isSimulatorActive ? 'Close Simulator' : 'Try "What-If" Calculator'}</span>
        </button>
      </div>

      {/* 3 Prominent Metric Cards (Original vs Aid vs Out of Pocket) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Estimated Bill */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Hospital Bill Estimate</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatIndianCurrency(totalCost)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Doctor quote & treatment package
            </div>
          </div>
          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
            Before applying any scheme or insurance
          </div>
        </div>

        {/* Card 2: Relief Identified (HERO METRIC) */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-300 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Potential Relief Identified</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase">
              Save {reductionPercentage}%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-800">
              ~{formatIndianCurrency(totalAid)}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-0.5">
              Cashless schemes + Trust concessions
            </div>
          </div>
          <div className="text-[11px] text-emerald-800 pt-2 border-t border-emerald-200/80 flex items-center gap-1">
            <span>Combined from 3-4 matching pathways</span>
          </div>
        </div>

        {/* Card 3: Out-of-Pocket Share */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Estimated Out-of-Pocket</span>
            <IndianRupee className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ~{formatIndianCurrency(outOfPocket)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Remaining balance (non-medical / copay)
            </div>
          </div>
          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
            Can be further lowered via Hospital MSW quota
          </div>
        </div>
      </div>
    </div>
  );
};
