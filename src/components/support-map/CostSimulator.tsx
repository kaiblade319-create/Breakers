import React from 'react';
import { Sliders, RotateCcw, Check, Sparkles, Loader2 } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/financialCalculations';

interface CostSimulatorProps {
  cost: number;
  income: number;
  insuranceSum: number;
  hasInsurance: boolean;
  onCostChange: (v: number) => void;
  onIncomeChange: (v: number) => void;
  onInsuranceSumChange: (v: number) => void;
  onHasInsuranceToggle: (v: boolean) => void;
  onReset: () => void;
  onApplyToProfile?: () => void;
  onRunAiAnalysis: () => void;
  isAnalyzing: boolean;
}

export const CostSimulator: React.FC<CostSimulatorProps> = ({
  cost,
  income,
  insuranceSum,
  hasInsurance,
  onCostChange,
  onIncomeChange,
  onInsuranceSumChange,
  onHasInsuranceToggle,
  onReset,
  onApplyToProfile,
  onRunAiAnalysis,
  isAnalyzing
}) => {
  return (
    <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Live "What-If" Relief Simulator
            </h3>
            <p className="text-xs text-slate-600">
              Adjust sliders below to see how changes in your hospital bill or income affect scheme eligibility in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Profile</span>
          </button>

          {onApplyToProfile && (
            <button
              onClick={onApplyToProfile}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save as Active Case</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider 1: Estimated Cost */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-800">
              Hospital Treatment Cost
            </label>
            <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {formatIndianCurrency(cost)}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={2000000}
            step={25000}
            value={cost}
            onChange={(e) => onCostChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>₹50k</span>
            <span>₹10 Lakh</span>
            <span>₹20 Lakh</span>
          </div>
        </div>

        {/* Slider 2: Annual Household Income */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-800">
              Family Annual Income
            </label>
            <span className="text-sm font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              {formatIndianCurrency(income)}
            </span>
          </div>
          <input
            type="range"
            min={40000}
            max={1200000}
            step={20000}
            value={income}
            onChange={(e) => onIncomeChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>₹40k (BPL)</span>
            <span>₹2.5L (SECC)</span>
            <span>₹12 Lakh</span>
          </div>
        </div>

        {/* Slider 3: Insurance Cover */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={hasInsurance}
                onChange={(e) => onHasInsuranceToggle(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 cursor-pointer"
              />
              <span>Private Health Insurance</span>
            </label>
            <span className={`text-sm font-extrabold px-2 py-0.5 rounded-md border ${
              hasInsurance 
                ? 'text-indigo-800 bg-indigo-50 border-indigo-200' 
                : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}>
              {hasInsurance ? formatIndianCurrency(insuranceSum) : 'No Policy'}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={1500000}
            step={50000}
            value={insuranceSum}
            disabled={!hasInsurance}
            onChange={(e) => onInsuranceSumChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
          />
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>₹50k</span>
            <span>₹5 Lakh</span>
            <span>₹15 Lakh</span>
          </div>
        </div>
      </div>

      {/* AI Strategist Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-xs text-slate-600">
          Want a doctor & financial counselor summary of these simulated numbers?
        </div>
        <button
          onClick={onRunAiAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Analyzing Options with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get AI Strategic Advice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
