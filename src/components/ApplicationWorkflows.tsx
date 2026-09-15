import React, { useState } from 'react';
import { PatientProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  getGovernmentDossier, 
  getInsuranceDossier, 
  getHospitalConcessionLetter, 
  getNgoGrantApplication 
} from '../utils/dossierTemplates';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  Printer, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface ApplicationWorkflowsProps {
  profile: PatientProfile;
  language: Language;
  onNavigateTab?: (tabId: string) => void;
}

export const ApplicationWorkflows: React.FC<ApplicationWorkflowsProps> = ({
  profile,
  language,
  onNavigateTab
}) => {
  const t = TRANSLATIONS[language];
  const [activePathway, setActivePathway] = useState<'govt' | 'insurance' | 'hospital' | 'ngo'>('govt');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingAiLetter, setIsGeneratingAiLetter] = useState<boolean>(false);
  const [customLetter, setCustomLetter] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getActiveText = () => {
    switch (activePathway) {
      case 'govt':
        return getGovernmentDossier(profile);
      case 'insurance':
        return getInsuranceDossier(profile, currentDate);
      case 'hospital':
        return customLetter || getHospitalConcessionLetter(profile, currentDate);
      case 'ngo':
        return getNgoGrantApplication(profile);
    }
  };

  const handleGenerateAiLetter = async () => {
    setIsGeneratingAiLetter(true);
    try {
      const res = await fetch('/api/navigator/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterType: 'Hospital Indigent Concession & MSW Fee Waiver Application',
          patientProfile: profile,
          language
        })
      });
      const data = await res.json();
      if (data.letter) {
        setCustomLetter(data.letter);
        setActivePathway('hospital');
      }
    } catch {
      setActivePathway('hospital');
    } finally {
      setIsGeneratingAiLetter(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 mb-1.5">
              <span>Step 3 of 4</span>
              <span>•</span>
              <span>1-Page Hospital Dossier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'एकल अस्पताल आवेदन पत्र' : language === 'mr' ? 'एकच रुग्णालय अर्ज' : 'Generate Pre-Filled Hospital Dossier'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
              Don't spend hours filling 4 different forms. This verified 1-page dossier is pre-filled with patient clinical codes, Aadhaar e-KYC, and hospital estimates—ready to print or copy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => handleCopy(getActiveText())}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px] sm:min-h-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Dossier!' : 'Copy Active Dossier'}</span>
            </button>
            <button
              onClick={handleGenerateAiLetter}
              disabled={isGeneratingAiLetter}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isGeneratingAiLetter ? 'Drafting...' : 'AI Concession Letter'}</span>
            </button>
          </div>
        </div>

        {/* Why this saves days of time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-3.5">
            <div className="font-bold text-slate-700 mb-1">
              Traditional Hospital Experience:
            </div>
            <p className="text-slate-600 leading-relaxed">
              Family members run between the TPA desk, the Arogyamitra lobby, and the Medical Social Work department filling multiple separate forms with duplicate details.
            </p>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 sm:p-3.5">
            <div className="font-bold text-indigo-900 mb-1">
              CareNav Unified Approach:
            </div>
            <p className="text-indigo-900 leading-relaxed">
              Your patient profile automatically populates all 4 required formats. Select the department tab below, print or copy, and hand it to the hospital desk officer.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Switcher Tabs - Mobile scrollable pill track */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x w-full">
        <button
          onClick={() => setActivePathway('govt')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 snap-start min-h-[44px] sm:min-h-0 ${
            activePathway === 'govt'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>{t.pathwayGovt}</span>
        </button>

        <button
          onClick={() => setActivePathway('insurance')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 snap-start min-h-[44px] sm:min-h-0 ${
            activePathway === 'insurance'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span>{t.pathwayInsurance}</span>
        </button>

        <button
          onClick={() => setActivePathway('hospital')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 snap-start min-h-[44px] sm:min-h-0 ${
            activePathway === 'hospital'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>{t.pathwayHospital}</span>
        </button>

        <button
          onClick={() => setActivePathway('ngo')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 snap-start min-h-[44px] sm:min-h-0 ${
            activePathway === 'ngo'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-rose-500" />
          <span>{t.pathwayNgo}</span>
        </button>
      </div>

      {/* Pre-filled Dossier Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              Standardized Pre-filled Form
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold shrink-0">
              Ready
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs min-h-[40px] sm:min-h-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => handleCopy(getActiveText())}
              className="flex-1 sm:flex-none px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[40px] sm:min-h-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Monospace Form Preview */}
        <div className="p-3.5 sm:p-5 overflow-x-auto bg-slate-900 text-slate-100 font-mono text-[11px] sm:text-xs leading-relaxed max-h-[420px] scrollbar-thin">
          <pre className="whitespace-pre-wrap font-mono">{getActiveText()}</pre>
        </div>

        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600">
          <div>
            Data linked to: <strong className="text-slate-900">{profile.name}</strong> • UHID: {profile.uhid || 'HOSP-2026-08149'}
          </div>
          <div className="text-emerald-700 font-bold">
            Auto-updates if patient inputs change.
          </div>
        </div>
      </div>

      {/* Prominent Next / Back Navigation Card */}
      {onNavigateTab && (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <button
            onClick={() => onNavigateTab('documents')}
            className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer border border-slate-700 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Step 2: Documents</span>
          </button>

          <div className="text-center sm:text-right">
            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
              Dossier Ready for Submission
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Submit at Hospital Helpdesk / TPA Counter, then track approvals live.
            </div>
          </div>

          <button
            id="proceed-to-step4-btn"
            onClick={() => onNavigateTab('tracking')}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer min-h-[44px]"
          >
            <span>Next: Track Approvals (Step 4 of 4)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
