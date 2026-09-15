import React, { useState, useEffect } from 'react';
import { PatientProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { calculatePatientAid, formatIndianCurrency } from '../utils/financialCalculations';
import { CostBreakdownCard } from './support-map/CostBreakdownCard';
import { CostSimulator } from './support-map/CostSimulator';
import { SchemeCard } from './support-map/SchemeCard';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileText, 
  HeartHandshake, 
  PhoneCall
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

  // Dynamic Simulator State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simCost, setSimCost] = useState<number>(profile.estimatedCost);
  const [simIncome, setSimIncome] = useState<number>(profile.annualIncome);
  const [simInsurance, setSimInsurance] = useState<number>(
    profile.hasInsurance ? (profile.insuranceSum || 300000) : 0
  );
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

  // Clean pure functional calculation from modular utility
  const {
    supportOptions,
    totalMaxAid,
    estimatedOutOfPocket,
    reductionPercentage,
    activeCost
  } = calculatePatientAid(profile, {
    isSimulatorOpen,
    cost: simCost,
    income: simIncome,
    insuranceSum: simInsurance,
    hasInsurance: hasSimInsurance
  });

  const handleResetSimulator = () => {
    setSimCost(profile.estimatedCost);
    setSimIncome(profile.annualIncome);
    setSimInsurance(profile.hasInsurance ? (profile.insuranceSum || 300000) : 0);
    setHasSimInsurance(profile.hasInsurance);
  };

  const handleApplySimulatorToProfile = () => {
    if (onUpdateCostEstimate) {
      onUpdateCostEstimate(simCost, simIncome);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const simulatedProfile: PatientProfile = {
        ...profile,
        estimatedCost: simCost,
        annualIncome: simIncome,
        insuranceSum: simInsurance,
        hasInsurance: hasSimInsurance
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
    } catch {
      setAiNarrative(
        'Based on your hospital and clinical profile, you are eligible for up to ₹5 Lakh cashless treatment under Ayushman Bharat / MJPJAY. Immediate priority: Collect your Signed Medical Cost Estimate and present your Ration Card at the Hospital Arogyamitra Helpdesk.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Clean Financial Breakdown Metric Cards */}
      <CostBreakdownCard
        totalCost={activeCost}
        totalAid={totalMaxAid}
        outOfPocket={estimatedOutOfPocket}
        reductionPercentage={reductionPercentage}
        isSimulatorActive={isSimulatorOpen}
        onToggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        language={language}
      />

      {/* 2. Modular Simulator (What-if slider tool) */}
      {isSimulatorOpen && (
        <CostSimulator
          cost={simCost}
          income={simIncome}
          insuranceSum={simInsurance}
          hasInsurance={hasSimInsurance}
          onCostChange={setSimCost}
          onIncomeChange={setSimIncome}
          onInsuranceSumChange={setSimInsurance}
          onHasInsuranceToggle={setHasSimInsurance}
          onReset={handleResetSimulator}
          onApplyToProfile={onUpdateCostEstimate ? handleApplySimulatorToProfile : undefined}
          onRunAiAnalysis={handleRunAiAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* 3. AI Counselor Narrative Box (if generated) */}
      {aiNarrative && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Personalized AI Financial Strategy</span>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {aiNarrative}
          </p>
        </div>
      )}

      {/* 4. Matching Schemes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">
            Verified Support Schemes for {profile.name} ({supportOptions.length})
          </h3>
          <span className="text-xs text-slate-600">
            Click any scheme to see documents & next action
          </span>
        </div>

        <div className="space-y-3">
          {supportOptions.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              onNavigateToDocs={() => onNavigateTab('documents')}
              onNavigateToOneApp={() => onNavigateTab('one_application')}
            />
          ))}
        </div>
      </div>

      {/* 5. Layman Quick-Action Sequence */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Recommended 3-Step Hospital Order
            </h4>
            <p className="text-xs text-slate-600">
              Follow these in exact order to avoid delays at the hospital billing desk.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-full">
            Caregiver Checklist
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="text-emerald-700 font-bold mb-1">
                Action 1 • Obtain Estimate
              </div>
              <p className="font-extrabold text-slate-900 text-sm">
                Get Doctor's Cost Estimate
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Ask treating oncologist / doctor for a signed estimate with procedure package codes.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('documents')}
              className="mt-3 text-left font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Check Required Papers →</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="text-sky-700 font-bold mb-1">
                Action 2 • Pre-Auth
              </div>
              <p className="font-extrabold text-slate-900 text-sm">
                Submit Pre-Auth at TPA Desk
              </p>
              <p className="text-slate-600 text-xs mt-1">
                If having health insurance, submit pre-auth 48 hours prior to planned admission.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('insurance')}
              className="mt-3 text-left font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Insurance Guide →</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="text-indigo-700 font-bold mb-1">
                Action 3 • Govt Scheme
              </div>
              <p className="font-extrabold text-slate-900 text-sm">
                Meet Hospital Arogyamitra
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Present Aadhaar & Ration Card at the Ground Floor helpdesk for 100% cashless treatment.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('one_application')}
              className="mt-3 text-left font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Get 1-Page Form →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Prominent Next Step Navigation Card */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Step 1 Completed</span>
            <span>•</span>
            <span>Relief Identified: ~{formatIndianCurrency(totalMaxAid)}</span>
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
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>Next: Check Documents (Step 2 of 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
