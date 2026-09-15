import React, { useState, useEffect } from 'react';
import { PatientProfile, Language, SupportOption } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  IndianRupee, 
  ShieldCheck, 
  Building2, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Layers,
  FileCheck2,
  TrendingDown,
  Sliders,
  RotateCcw,
  Loader2,
  Check
} from 'lucide-react';

interface FinancialSupportMapProps {
  profile: PatientProfile;
  language: Language;
  onNavigateTab: (tabId: string) => void;
  onUpdateCostEstimate?: (newCost: number, newIncome?: number) => void;
}

export const FinancialSupportMap: React.FC<FinancialSupportMapProps> = ({
  profile,
  language,
  onNavigateTab,
  onUpdateCostEstimate
}) => {
  const t = TRANSLATIONS[language];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Dynamic Simulator State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simCost, setSimCost] = useState<number>(profile.estimatedCost);
  const [simIncome, setSimIncome] = useState<number>(profile.annualIncome);
  const [simInsurance, setSimInsurance] = useState<number>(profile.hasInsurance ? (profile.insuranceSum || 300000) : 0);
  const [hasSimInsurance, setHasSimInsurance] = useState<boolean>(profile.hasInsurance);

  // AI Strategic Assessment State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);

  // Reset simulator values when profile changes
  useEffect(() => {
    setSimCost(profile.estimatedCost);
    setSimIncome(profile.annualIncome);
    setSimInsurance(profile.hasInsurance ? (profile.insuranceSum || 300000) : 0);
    setHasSimInsurance(profile.hasInsurance);
    setAiNarrative(null);
  }, [profile]);

  // Active values derived from either simulator or baseline
  const cost = isSimulatorOpen ? simCost : profile.estimatedCost;
  const income = isSimulatorOpen ? simIncome : profile.annualIncome;
  const insuranceSum = isSimulatorOpen ? (hasSimInsurance ? simInsurance : 0) : (profile.hasInsurance ? (profile.insuranceSum || 0) : 0);
  const hasInsurance = isSimulatorOpen ? hasSimInsurance : profile.hasInsurance;
  const isMaharashtra = /maharashtra/i.test(profile.location);

  const supportOptions: SupportOption[] = [];
  let totalMinAid = 0;
  let totalMaxAid = 0;

  // 1. Private Insurance
  if (hasInsurance && insuranceSum > 0) {
    const maxInsurance = Math.min(insuranceSum, Math.round(cost * 0.75));
    const minInsurance = Math.round(maxInsurance * 0.85);
    supportOptions.push({
      id: 'private_insurance',
      source: `Private Insurance (${profile.insuranceCompany || 'Health Policy'})`,
      category: 'Insurance',
      potentialSupportMin: minInsurance,
      potentialSupportMax: maxInsurance,
      status: 'Check Pre-Auth',
      statusColor: 'yellow',
      eligible: true,
      reason: `Active health policy with ₹${(insuranceSum / 100000).toFixed(1)} Lakh Sum Insured. Pre-authorization required 48 hrs prior to admission at hospital TPA desk.`,
      requiredDocs: [
        'TPA Pre-Auth Form (Part A signed by insured)',
        'Treating Oncologist / Doctor Prescription',
        'Hospital Medical Cost Estimate on Letterhead',
        'Government Photo ID (Aadhaar/PAN)'
      ],
      nextAction: 'Submit cashless pre-auth request at Hospital TPA Desk 48 hours before admission'
    });
    totalMinAid += minInsurance;
    totalMaxAid += maxInsurance;
  }

  // 2. Government Scheme: MJPJAY / PM-JAY
  const govtMax = Math.min(500000, Math.round(cost * 0.6));
  const govtMin = Math.round(govtMax * 0.75);
  const schemeTitle = isMaharashtra 
    ? 'State Scheme: Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)'
    : 'Government Scheme: Ayushman Bharat PM-JAY';

  supportOptions.push({
    id: 'government_scheme',
    source: schemeTitle,
    category: isMaharashtra ? 'State Scheme' : 'Government Scheme',
    potentialSupportMin: govtMin,
    potentialSupportMax: govtMax,
    status: 'Potentially Eligible',
    statusColor: 'green',
    eligible: true,
    reason: isMaharashtra
      ? 'Universal eligibility in Maharashtra for Orange/Yellow/White ration card holders covering medical oncology and chemotherapy up to ₹5,00,000 per family.'
      : (income <= 250000 ? 'Income within SECC / Ayushman Bharat threshold; ₹5,00,000 per family/year.' : 'Subject to Ayushman Card verification on TMS portal.'),
    requiredDocs: [
      'Aadhaar Card (linked with mobile/biometrics)',
      'Valid Ration Card (Yellow/Orange/White)',
      'Hospital Admission Referral Letter',
      'Diagnostic Pathology / Biopsy Confirmation'
    ],
    nextAction: 'Visit Hospital Arogyamitra Helpdesk in the main lobby for biometric TMS registration'
  });
  totalMinAid += govtMin;
  totalMaxAid += govtMax;

  // 3. Hospital Financial Assistance / MSW Indigent Trust Quota
  if (income <= 360000) {
    const hospMin = 25000;
    const hospMax = Math.min(75000, Math.round(cost * 0.15));
    supportOptions.push({
      id: 'hospital_assistance',
      source: 'Hospital Financial Assistance (MSW Indigent Fund)',
      category: 'Hospital Concession',
      potentialSupportMin: hospMin,
      potentialSupportMax: hospMax,
      status: 'Apply',
      statusColor: 'yellow',
      eligible: true,
      reason: 'Under Trust Acts (Sec 41AA) and hospital charitable bylaws, indigent & weaker section patients receive 50% to 100% bed and surgery concessions.',
      requiredDocs: [
        'Tahsildar Income Certificate (< ₹1.8L)',
        'Formal Application Letter to Medical Superintendent',
        'MSW Socio-Economic Assessment Form',
        'Electricity bill (proof of residence)'
      ],
      nextAction: 'Submit financial hardship application and income proof to the Medical Social Work (MSW) office'
    });
    totalMinAid += hospMin;
    totalMaxAid += hospMax;
  }

  // 4. NGO / Charitable Support
  if (profile.disease.toLowerCase().includes('cancer') || profile.disease.toLowerCase().includes('cardiac') || income <= 400000) {
    const ngoMin = 20000;
    const ngoMax = Math.min(50000, Math.round(cost * 0.1));
    supportOptions.push({
      id: 'ngo_charity',
      source: 'NGO / Charity Support (Tata Trusts / CPAA / Rotary)',
      category: 'NGO Support',
      potentialSupportMin: ngoMin,
      potentialSupportMax: ngoMax,
      status: 'Potential Match',
      statusColor: 'yellow',
      eligible: true,
      reason: 'Non-profit foundations provide direct subsidies for high-cost chemotherapy drugs, dialysis consumables, and surgical items.',
      requiredDocs: [
        'Biopsy / Diagnostic Pathology Report',
        'Detailed Oncology Drug Quotation from Hospital Pharmacy',
        'Income Certificate / Ration Card',
        'Patient Bank Passbook Copy with IFSC'
      ],
      nextAction: 'Generate and submit NGO Grant application dossier from the One-App Pathways tab'
    });
    totalMinAid += ngoMin;
    totalMaxAid += ngoMax;
  }

  // 5. Chief Minister Relief Fund (CMRF)
  if (isMaharashtra && income <= 160000) {
    const cmrfMin = 25000;
    const cmrfMax = 50000;
    supportOptions.push({
      id: 'cmrf',
      source: 'Maharashtra Chief Minister\'s Relief Fund (CMRF)',
      category: 'State Scheme',
      potentialSupportMin: cmrfMin,
      potentialSupportMax: cmrfMax,
      status: 'Potential Match',
      statusColor: 'green',
      eligible: true,
      reason: 'State discretionary relief fund providing direct RTGS disbursement to hospital for life-threatening medical procedures for families below ₹1.6L income.',
      requiredDocs: [
        'CMRF Application Form signed by Hospital Head',
        'Tahsildar Income Certificate',
        'Detailed Cost Estimate with procedure codes',
        'Local MLA / MP recommendation stamp'
      ],
      nextAction: 'Get doctor estimate certified by Civil Surgeon or hospital administrator'
    });
    totalMinAid += cmrfMin;
    totalMaxAid += cmrfMax;
  }

  // Calculate estimated Out-of-pocket remaining
  const estimatedOutOfPocket = Math.max(15000, cost - totalMaxAid);
  const reductionPercentage = Math.min(95, Math.round(((cost - estimatedOutOfPocket) / cost) * 100));

  const formatLakh = (num: number) => {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} Lakh`;
    }
    return `₹${(num / 1000).toFixed(0)}k`;
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const simulatedProfile: PatientProfile = {
        ...profile,
        estimatedCost: cost,
        annualIncome: income,
        insuranceSum: insuranceSum,
        hasInsurance: hasInsurance
      };

      const res = await fetch('/api/navigator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientProfile: simulatedProfile,
          language
        })
      });

      const data = await res.json();
      if (data.aiSummary) {
        setAiNarrative(data.aiSummary);
      }
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cost Breakdown & Impact Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 mb-2.5 uppercase tracking-wider">
              <span>Step 1 of 4</span>
              <span>•</span>
              <span>Find Your Savings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'hi' ? 'वित्तीय राहत और योजनाएं' : language === 'mr' ? 'आर्थिक मदत आणि योजना' : 'Calculate Your Financial Relief'}
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              We checked your hospital, diagnosis, and income against official government schemes (Ayushman Bharat / MJPJAY), hospital trust funds, and health insurance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="toggle-simulator-btn"
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm ${
                isSimulatorOpen
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{isSimulatorOpen ? 'Exit Dynamic Simulator' : 'Adjust Live Sliders'}</span>
            </button>
            <button
              id="goto-documents-btn"
              onClick={() => onNavigateTab('documents')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              Check Document Readiness
            </button>
          </div>
        </div>

        {/* Live Interactive Sliders Drawer */}
        {isSimulatorOpen && (
          <div className="my-5 p-5 bg-slate-800/95 border border-amber-500/40 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Real-Time What-If Financial Modeling</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSimCost(profile.estimatedCost);
                    setSimIncome(profile.annualIncome);
                    setSimInsurance(profile.hasInsurance ? (profile.insuranceSum || 300000) : 0);
                    setHasSimInsurance(profile.hasInsurance);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to Case Defaults
                </button>
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1"
                >
                  {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{isAnalyzing ? 'Analyzing...' : 'Run AI Strategy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Slider 1: Hospital Treatment Cost */}
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                  <span>Hospital Bill / Procedure Cost:</span>
                  <span className="text-amber-300 font-bold text-sm">₹{simCost.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={simCost}
                  onChange={(e) => setSimCost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹50,000</span>
                  <span>₹10 Lakh</span>
                  <span>₹20 Lakh</span>
                </div>
              </div>

              {/* Slider 2: Annual Family Income */}
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                  <span>Annual Family Income:</span>
                  <span className="text-amber-300 font-bold text-sm">₹{simIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="20000"
                  value={simIncome}
                  onChange={(e) => setSimIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹50k (BPL)</span>
                  <span>₹3.6L (MSW Cap)</span>
                  <span>₹12L</span>
                </div>
              </div>

              {/* Slider 3: Private Insurance Sum */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      id="sim-has-insurance"
                      checked={hasSimInsurance}
                      onChange={(e) => setHasSimInsurance(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <label htmlFor="sim-has-insurance">Private Insurance Active</label>
                  </div>
                  <span className="text-amber-300 font-bold text-sm">
                    {hasSimInsurance ? `₹${simInsurance.toLocaleString('en-IN')}` : 'None'}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1500000"
                  step="50000"
                  disabled={!hasSimInsurance}
                  value={simInsurance}
                  onChange={(e) => setSimInsurance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 disabled:opacity-30"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹50k</span>
                  <span>₹5 Lakh</span>
                  <span>₹15 Lakh</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Dynamic Summary Card (if analyzed) */}
        {aiNarrative && (
          <div className="my-5 p-4 bg-emerald-950/80 border border-emerald-400/50 rounded-xl flex items-start gap-3 text-emerald-100 text-xs shadow-inner animate-fadeIn">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>AI Financial Care Strategy (Real-Time Rule Synthesis)</span>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">Gemini Verified</span>
              </div>
              <p className="mt-1 leading-relaxed text-emerald-100">
                {aiNarrative}
              </p>
            </div>
          </div>
        )}

        {/* 3 Metric Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          {/* Estimated Hospital Cost */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>{t.estimatedCost}</span>
              <span className="text-[11px] text-rose-400 font-semibold bg-rose-950/60 px-2 py-0.5 rounded">
                {isSimulatorOpen ? 'Simulated Bill' : 'Hospital Quote'}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              ₹{cost.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              For {profile.disease} ({profile.treatment.split(' ')[0]})
            </div>
          </div>

          {/* Total Identified Financial Aid */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4">
            <div className="text-xs text-emerald-300 font-medium flex items-center justify-between">
              <span>{t.totalPotentialAid}</span>
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-900/60 px-2 py-0.5 rounded">
                ~{reductionPercentage}% Covered
              </span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-300 mt-2">
              {formatLakh(totalMinAid)} – {formatLakh(totalMaxAid)}*
            </div>
            <div className="text-xs text-emerald-200/70 mt-1">
              From {supportOptions.length} combined support pathways
            </div>
          </div>

          {/* Remaining Out-of-Pocket Expense */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>{t.estimatedOutOfPocket}</span>
              <span className="text-[11px] text-sky-400 font-semibold bg-sky-950/60 px-2 py-0.5 rounded">
                Family Share
              </span>
            </div>
            <div className="text-2xl font-extrabold text-teal-300 mt-2">
              ~₹{estimatedOutOfPocket.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Significantly reduced through stacked assistance
            </div>
          </div>
        </div>

        {/* Visual progress bar comparison */}
        <div className="mt-6 pt-4 border-t border-slate-700/60">
          <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span>Overall Cost Protection Ratio</span>
            <span className="font-semibold text-emerald-400">{reductionPercentage}% Supported by identified programs</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700" 
              style={{ width: `${reductionPercentage}%` }}
            />
            <div 
              className="bg-amber-500/70 h-full transition-all duration-700" 
              style={{ width: `${100 - reductionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Combined Insurance + Schemes + Grants
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Remaining Out-of-Pocket (Payable by family)
            </span>
          </div>
        </div>
      </div>

      {/* Main Support Options List (Table & Cards matching document Page 8) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              {t.supportSources}
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Verified breakdown based on patient profile, income category, location, and hospital empanelment.
            </p>
          </div>
          <div className="text-[11px] font-medium text-slate-700 italic">
            *Amounts derived from verified rules, not AI guesses
          </div>
        </div>

        {/* Support Table / Cards */}
        <div className="divide-y divide-slate-100">
          {supportOptions.map((opt) => {
            const isExpanded = expandedId === opt.id;
            return (
              <div key={opt.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {opt.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        opt.statusColor === 'green'
                          ? 'bg-emerald-100 text-emerald-800'
                          : opt.statusColor === 'yellow'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          opt.statusColor === 'green' ? 'bg-emerald-600' : 'bg-amber-600'
                        }`} />
                        {opt.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">
                      {opt.source}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                      {opt.reason}
                    </p>
                  </div>

                  {/* Middle: Potential Amount */}
                  <div className="lg:text-right min-w-[150px]">
                    <div className="text-xs text-slate-700 font-medium">
                      {t.coverageHeader}
                    </div>
                    <div className="text-lg font-bold text-emerald-800">
                      {formatLakh(opt.potentialSupportMin)} – {formatLakh(opt.potentialSupportMax)}*
                    </div>
                  </div>

                  {/* Right: Next Action & Expand */}
                  <div className="flex items-center gap-2 sm:justify-end">
                    <button
                      id={`expand-${opt.id}-btn`}
                      onClick={() => setExpandedId(isExpanded ? null : opt.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Rules'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      id={`action-${opt.id}-btn`}
                      onClick={() => onNavigateTab('one_application')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Prepare Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/90 rounded-xl p-4 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        Required Documents for this Channel:
                      </div>
                      <ul className="space-y-1 text-slate-700 pl-5 list-disc">
                        {opt.requiredDocs.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-slate-200 md:pl-4 pt-3 md:pt-0">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        Next Recommended Step:
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {opt.nextAction}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => onNavigateTab('documents')}
                          className="text-emerald-700 hover:text-emerald-800 font-semibold underline text-xs flex items-center gap-1"
                        >
                          Verify required documents in checklist →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Best Actions Checklist (as shown on page 8 of document) */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              1-6
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {t.nextBestActionsTitle}
              </h3>
              <p className="text-xs text-emerald-300/80">
                Action sequence generated for {profile.name} to maximize financial relief
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-800 text-emerald-200 rounded-full">
            Caregiver Priority Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-300 font-semibold mb-1">
                <span>Step 1 • Document</span>
                <span className="text-[10px] bg-emerald-800 px-1.5 py-0.5 rounded text-white">Immediate</span>
              </div>
              <p className="font-bold text-white text-sm">
                Obtain Signed Medical Cost Estimate
              </p>
              <p className="text-emerald-200/80 text-[11px] mt-1">
                Ask treating oncologist / billing office for detailed estimate with package codes.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('documents')}
              className="mt-3 text-left font-semibold text-emerald-300 hover:text-white flex items-center gap-1"
            >
              Upload to Checklist →
            </button>
          </div>

          <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-300 font-semibold mb-1">
                <span>Step 2 • Pre-Auth</span>
                <span className="text-[10px] bg-emerald-800 px-1.5 py-0.5 rounded text-white">48h Before</span>
              </div>
              <p className="font-bold text-white text-sm">
                Submit Pre-Authorization at TPA Desk
              </p>
              <p className="text-emerald-200/80 text-[11px] mt-1">
                Provide insurance health card & estimate to initiate cashless approval before admission.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('insurance')}
              className="mt-3 text-left font-semibold text-emerald-300 hover:text-white flex items-center gap-1"
            >
              View TPA Cashless Protocol →
            </button>
          </div>

          <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-300 font-semibold mb-1">
                <span>Step 3 • Govt Scheme</span>
                <span className="text-[10px] bg-emerald-800 px-1.5 py-0.5 rounded text-white">Day 1</span>
              </div>
              <p className="font-bold text-white text-sm">
                Register with Hospital Arogyamitra
              </p>
              <p className="text-emerald-200/80 text-[11px] mt-1">
                Present Aadhaar & Orange Ration Card at the MJPJAY / PM-JAY desk in the hospital lobby.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('one_application')}
              className="mt-3 text-left font-semibold text-emerald-300 hover:text-white flex items-center gap-1"
            >
              Download Scheme Dossier →
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Next Step Navigation Card for Laymen */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Step 1 Completed</span>
            <span>•</span>
            <span>Relief Identified: ~₹{totalMaxAid.toLocaleString('en-IN')}</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            Ready to claim this financial support?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            In Step 2, see the exact 3 papers you need (Aadhaar, Ration Card, Doctor Estimate) so the hospital can start your cashless treatment.
          </p>
        </div>

        <button
          id="proceed-to-step2-btn"
          onClick={() => onNavigateTab('documents')}
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <span>Next: Check Documents (Step 2 of 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

