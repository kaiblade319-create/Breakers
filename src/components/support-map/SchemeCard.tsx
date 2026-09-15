import React, { useState } from 'react';
import { SupportOption, Language } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  ChevronDown, 
  ChevronUp, 
  FileCheck2, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { formatIndianCurrency } from '../../utils/financialCalculations';

interface SchemeCardProps {
  scheme: SupportOption;
  language: Language;
  onNavigateToDocs: () => void;
  onNavigateToOneApp: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  language,
  onNavigateToDocs,
  onNavigateToOneApp
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Insurance':
        return <ShieldCheck className="w-5 h-5 text-sky-600" />;
      case 'Government Scheme':
      case 'State Scheme':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'Hospital Concession':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'NGO Support':
        return <HeartHandshake className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusBadge = () => {
    if (scheme.statusColor === 'green') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          ✓ {scheme.status}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        ⚡ {scheme.status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs overflow-hidden">
      {/* Main Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
            {getCategoryIcon(scheme.category)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {scheme.category}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {scheme.source}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 sm:line-clamp-2">
              {scheme.reason}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <div className="text-[11px] font-semibold text-slate-500">
              Potential Aid
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-800">
              {formatIndianCurrency(scheme.potentialSupportMin)} – {formatIndianCurrency(scheme.potentialSupportMax)}
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Collapsible Details */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 text-xs space-y-4 animate-fadeIn">
          <div>
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-600" />
              <span>Why this applies to your case:</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5">
              {scheme.reason}
            </p>
          </div>

          {/* Required Papers */}
          <div>
            <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Required Documents for Hospital Desk:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
              {scheme.requiredDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Next Action & Button */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-emerald-950 font-medium">
              <strong className="font-bold text-emerald-900">Immediate Next Action: </strong>
              {scheme.nextAction}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToDocs();
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-300 text-xs transition-colors cursor-pointer"
              >
                Check Papers (Step 2)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToOneApp();
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Get Form</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
