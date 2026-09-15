import React, { useState } from 'react';
import { PatientProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  FileText, 
  MapPin, 
  Building2, 
  IndianRupee, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

interface CaseSummaryBannerProps {
  profile: PatientProfile;
  language: Language;
  onOpenProfile: () => void;
  onSelectPreset: (presetKey: string) => void;
  activePreset: string;
}

export const CaseSummaryBanner: React.FC<CaseSummaryBannerProps> = ({
  profile,
  language,
  onOpenProfile,
  onSelectPreset,
  activePreset,
}) => {
  const t = TRANSLATIONS[language];
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);

  // Approximate calculations for the quick relief banner
  const isMaharashtra = /maharashtra/i.test(profile.location);
  const govtAid = Math.min(500000, Math.round(profile.estimatedCost * 0.6));
  const insuranceAid = profile.hasInsurance ? Math.min(profile.insuranceSum || 0, Math.round(profile.estimatedCost * 0.75)) : 0;
  const hospitalAid = Math.round(profile.estimatedCost * 0.15);
  const totalAid = Math.min(profile.estimatedCost, Math.max(govtAid + hospitalAid, insuranceAid));
  const remaining = Math.max(0, profile.estimatedCost - totalAid);
  const savingsPct = Math.round((totalAid / profile.estimatedCost) * 100);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Step 0 / Case Scenario Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Select a sample hospital case to explore:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="preset-cancer-btn"
              onClick={() => onSelectPreset('cancer_maharashtra')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activePreset === 'cancer_maharashtra'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🩺</span>
              <span>Cancer Treatment (₹6.5L, Mumbai)</span>
            </button>

            <button
              id="preset-cardiac-btn"
              onClick={() => onSelectPreset('cardiac_delhi')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activePreset === 'cardiac_delhi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>👶</span>
              <span>Child Heart Surgery (₹3.8L, Delhi)</span>
            </button>

            <button
              id="preset-dialysis-btn"
              onClick={() => onSelectPreset('renal_karnataka')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activePreset === 'renal_karnataka'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🩸</span>
              <span>Kidney Dialysis (₹1.8L, BLR)</span>
            </button>

            <button
              id="preset-custom-btn"
              onClick={onOpenProfile}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Enter My Own Bill</span>
            </button>
          </div>
        </div>

        {/* Layman-Friendly High-Contrast Case Snapshot Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Patient Context */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold uppercase tracking-wider">
                Current Case
              </span>
              <span className="text-xs text-slate-300">
                {profile.hospital} • {profile.city}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{profile.name} ({profile.age}y, {profile.gender})</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-emerald-300 font-semibold text-sm">{profile.disease}</span>
            </h2>
            <p className="text-xs text-slate-300">
              Prescribed Care: <strong className="text-white">{profile.treatment}</strong>
            </p>
          </div>

          {/* Financial Relief Highlight */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 sm:p-3 rounded-xl border border-slate-700/80">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">
                Hospital Bill: ₹{profile.estimatedCost.toLocaleString('en-IN')}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-400 flex items-center justify-end gap-1">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>Save ~₹{totalAid.toLocaleString('en-IN')} ({savingsPct}%)</span>
              </div>
              <div className="text-[11px] text-slate-300">
                You pay only: <strong className="text-white">~₹{remaining.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-l border-slate-700 pl-3">
              <button
                id="edit-case-btn"
                onClick={onOpenProfile}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-center"
              >
                Edit Case
              </button>
              <button
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-0.5 justify-center"
              >
                <span>{isDetailsExpanded ? 'Less' : 'More'}</span>
                {isDetailsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Details Grid for Deep Inspection */}
        {isDetailsExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs animate-fadeIn">
            {/* Location & Hospital */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                Hospital Details
              </div>
              <div className="mt-1 font-bold text-slate-900 truncate">
                {profile.hospital}
              </div>
              <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{profile.city}, {profile.location}</span>
              </div>
              <div className="text-emerald-700 font-medium capitalize mt-0.5">
                Type: {profile.hospitalType.replace('_', ' ')}
              </div>
            </div>

            {/* Financial Capacity */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                Income & Category
              </div>
              <div className="mt-1 font-bold text-slate-900">
                ₹{(profile.annualIncome / 100000).toFixed(1)} Lakh / year
              </div>
              <div className="text-slate-600 mt-0.5 capitalize">
                Ration Card: <strong className="text-slate-800">{profile.rationCardType.replace('_', ' ')}</strong>
              </div>
              <div className="text-slate-600 mt-0.5">
                Ayushman e-KYC: {profile.hasAyushmanCard ? <span className="text-emerald-700 font-bold">Linked</span> : 'Not Linked'}
              </div>
            </div>

            {/* Insurance Status */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Insurance Status
              </div>
              <div className="mt-1 font-bold text-slate-900 truncate">
                {profile.hasInsurance ? profile.insuranceCompany : 'No Private Insurance'}
              </div>
              {profile.hasInsurance ? (
                <>
                  <div className="text-emerald-700 font-semibold mt-0.5">
                    Cover: ₹{((profile.insuranceSum || 0) / 100000).toFixed(1)} Lakh
                  </div>
                  <div className="text-slate-600 truncate mt-0.5">
                    TPA: {profile.tpaName || 'Standard TPA'}
                  </div>
                </>
              ) : (
                <div className="text-slate-600 mt-0.5">
                  Full Govt & Charity eligibility
                </div>
              )}
            </div>

            {/* Caregiver Contact */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                Family / Caregiver
              </div>
              <div className="mt-1 font-bold text-slate-900">
                {profile.caregiverName || 'Family Member'} ({profile.caregiverRelation || 'Caregiver'})
              </div>
              <div className="text-slate-600 mt-0.5">
                Phone: {profile.caregiverPhone || '+91 98201 44521'}
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Assisting patient with approvals
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
