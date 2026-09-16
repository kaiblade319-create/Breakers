import React, { useState } from 'react';
import { 
  Calculator, 
  FileCheck2, 
  FileSpreadsheet, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface GuidedFlowStepperProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  language: Language;
  missingDocsCount?: number;
  pendingActionsCount?: number;
  onOpenJargonBuster: () => void;
}

export const GuidedFlowStepper: React.FC<GuidedFlowStepperProps> = ({
  activeTab,
  onSelectTab,
  language,
  missingDocsCount = 0,
  pendingActionsCount = 0,
  onOpenJargonBuster,
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const steps = [
    {
      id: 'support_map',
      number: '1',
      title: language === 'hi' ? 'राहत खोजें' : language === 'mr' ? 'मदत शोधा' : 'Check Relief',
      subtitle: language === 'hi' ? 'सरकारी योजनाएं और छूट' : language === 'mr' ? 'शासकीय योजना व सवलत' : 'Find Govt & Hospital Aid',
      icon: Calculator,
      badge: language === 'hi' ? 'शुरू करें' : 'Step 1'
    },
    {
      id: 'documents',
      number: '2',
      title: language === 'hi' ? 'कागजात जांचें' : language === 'mr' ? 'कागदपत्रे तपासा' : 'Check Papers',
      subtitle: language === 'hi' ? '3 जरूरी दस्तावेज' : language === 'mr' ? '३ महत्त्वाची कागदपत्रे' : 'Ready Aadhaar & Income',
      icon: FileCheck2,
      badge: missingDocsCount > 0 ? `${missingDocsCount} to verify` : 'Ready'
    },
    {
      id: 'one_application',
      number: '3',
      title: language === 'hi' ? 'अस्पताल फॉर्म' : language === 'mr' ? 'रुग्णालय अर्ज' : 'Hospital Form',
      subtitle: language === 'hi' ? '1 फॉर्म, सभी योजनाएं' : language === 'mr' ? '१ अर्ज, सर्व योजना' : 'Auto-filled Dossier',
      icon: FileSpreadsheet,
      badge: '1-Click Dossier'
    },
    {
      id: 'tracking',
      number: '4',
      title: language === 'hi' ? 'मंजूरी ट्रैक करें' : language === 'mr' ? 'मंजुरी ट्रॅक करा' : 'Track Approvals',
      subtitle: language === 'hi' ? 'कैशलेस स्थिति' : language === 'mr' ? 'कॅशलेस स्थिती' : 'Live Status & Alerts',
      icon: Clock,
      badge: pendingActionsCount > 0 ? `${pendingActionsCount} action` : 'Timeline'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Top explainer ribbon */}
        <div className="flex items-center justify-between text-xs pb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              4-Step Guided Flow
            </span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
            >
              <span>{showHowItWorks ? 'Hide Guide' : 'How this works'}</span>
              {showHowItWorks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenJargonBuster}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 sm:px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] sm:text-xs"
              title="Click to understand hospital terms like Arogyamitra, TPA, Pre-auth"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>Terms Dictionary</span>
            </button>
          </div>
        </div>

        {/* Expandable Layman Guide */}
        {showHowItWorks && (
          <div className="mb-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-2 animate-fadeIn">
            <div className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              How this app helps you reduce your hospital bill in 4 simple steps:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-700 pt-1">
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 1: Check Savings</strong>
                Enter bill & income to identify PM-JAY, state schemes, and charity concessions.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 2: Check Papers</strong>
                Ensure Aadhaar, Income/Ration Card, and Doctor Estimate are in place.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 3: Print Form</strong>
                Download our pre-filled hospital dossier. Hand it directly to the Arogyamitra or TPA desk.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 4: Track Approvals</strong>
                Follow cashless pre-authorization real-time and resolve hospital queries quickly.
              </div>
            </div>
          </div>
        )}

        {/* Mobile Horizontal Carousel / Desktop 4-column Grid */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Stepper Buttons (1 to 4) - Mobile horizontal scrollable track */}
          <div className="flex sm:grid sm:grid-cols-4 gap-2 flex-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x w-full">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  id={`stepper-btn-${step.id}`}
                  onClick={() => onSelectTab(step.id)}
                  className={`p-2 sm:p-2.5 rounded-xl text-left transition-all border relative flex flex-col justify-between shrink-0 snap-start min-w-[130px] sm:min-w-0 cursor-pointer min-h-[52px] sm:min-h-0 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="flex items-center gap-1.5 font-extrabold text-xs">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {step.number}
                      </span>
                      <span className="truncate">{step.title}</span>
                    </span>
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] w-full">
                    <span className={`truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.subtitle}
                    </span>
                    {step.badge && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded font-bold text-[9px] shrink-0 ${
                        isActive 
                          ? 'bg-emerald-400 text-slate-950' 
                          : step.badge.includes('verify') || step.badge.includes('action')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-200 text-slate-700'
                      }`}>
                        {step.badge}
                      </span>
                    )}
                  </div>

                  {/* Active bottom accent bar */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-t-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Extra Help Tools (Insurance & AI Assistant) */}
          <div className="flex items-center gap-1.5 pt-1 lg:pt-0 lg:pl-3 lg:border-l lg:border-slate-200 shrink-0">
            {/* Insurance Guide */}
            <button
              id="stepper-tab-insurance"
              onClick={() => onSelectTab('insurance')}
              className={`px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border cursor-pointer min-h-[36px] ${
                activeTab === 'insurance'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="IRDAI 100% Cashless rules, TPA pre-authorization guide, Section 80D"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>{language === 'hi' ? 'बीमा गाइड' : language === 'mr' ? 'विमा' : 'Insurance'}</span>
            </button>

            {/* AI Assistant */}
            <button
              id="stepper-tab-ai"
              onClick={() => onSelectTab('ai_navigator')}
              className={`px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border cursor-pointer min-h-[36px] ${
                activeTab === 'ai_navigator'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Ask InCare AI in any language"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'AI सहायक' : language === 'mr' ? 'AI मदत' : 'AI Helper'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
