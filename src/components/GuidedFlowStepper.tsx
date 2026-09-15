import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  Calculator, 
  FileCheck2, 
  FileSpreadsheet, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Heart
} from 'lucide-react';

interface GuidedFlowStepperProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  language: Language;
  missingDocsCount: number;
  pendingActionsCount: number;
  onOpenJargonBuster: () => void;
}

export const GuidedFlowStepper: React.FC<GuidedFlowStepperProps> = ({
  activeTab,
  onSelectTab,
  language,
  missingDocsCount,
  pendingActionsCount,
  onOpenJargonBuster
}) => {
  const t = TRANSLATIONS[language];
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const steps = [
    {
      id: 'support_map',
      number: 1,
      title: language === 'hi' ? 'राहत जांचें' : language === 'mr' ? 'मदत तपासा' : '1. Check Relief',
      subtitle: language === 'hi' ? 'सरकारी योजनाएं और बीमा' : language === 'mr' ? 'शासकीय योजना आणि विमा' : 'Find Schemes & Savings',
      icon: Calculator,
      badge: null
    },
    {
      id: 'documents',
      number: 2,
      title: language === 'hi' ? 'कागदपत्रे' : language === 'mr' ? 'कागदपत्रे' : '2. Check Papers',
      subtitle: language === 'hi' ? '3 जरूरी दस्तावेज' : language === 'mr' ? '3 आवश्यक कागदपत्रे' : '3 Essential Documents',
      icon: FileCheck2,
      badge: missingDocsCount > 0 ? `${missingDocsCount} to verify` : 'Ready'
    },
    {
      id: 'one_application',
      number: 3,
      title: language === 'hi' ? 'अस्पताल फॉर्म' : language === 'mr' ? 'रुग्णालय अर्ज' : '3. Hospital Form',
      subtitle: language === 'hi' ? '1 पेज में तैयार फॉर्म' : language === 'mr' ? '1 पानात तयार अर्ज' : '1-Page Dossier to Print',
      icon: FileSpreadsheet,
      badge: 'Single Dossier'
    },
    {
      id: 'tracking',
      number: 4,
      title: language === 'hi' ? 'मंजूरी ट्रैक करें' : language === 'mr' ? 'मंजुरी ट्रॅक करा' : '4. Track Approvals',
      subtitle: language === 'hi' ? 'लाइव स्थिति व प्रश्न' : language === 'mr' ? 'थेट स्थिती आणि प्रश्न' : 'Live Status & Fix Queries',
      icon: Clock,
      badge: pendingActionsCount > 0 ? `${pendingActionsCount} action` : null
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5">
        {/* Top Mini-Bar: Flow Explanation & Jargon Buster Toggle */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {language === 'hi' ? 'सरल 4-चरणीय प्रक्रिया:' : language === 'mr' ? 'सोपी 4-पायरी प्रक्रिया:' : 'Simple 4-Step Patient Journey:'}
            </span>
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHowItWorks ? 'Hide Guide' : 'How this works (1 min read)'}</span>
              {showHowItWorks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenJargonBuster}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-md transition-colors"
              title="Click to understand hospital terms like Arogyamitra, TPA, Pre-auth"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Hospital Terms Dictionary</span>
              <span className="sm:hidden">Dictionary</span>
            </button>
          </div>
        </div>

        {/* Expandable Layman Guide */}
        {showHowItWorks && (
          <div className="mb-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-2 animate-fadeIn">
            <div className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              How this app helps you reduce your hospital bill in 4 simple steps:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-700 pt-1">
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 1: Check Savings</strong>
                Enter your bill & income. We find matching government schemes (up to ₹5L free) and charity funds.
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 2: Check 3 Papers</strong>
                Gather just 3 documents (Aadhaar, Ration Card / Income slip, and Doctor's Estimate).
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 3: Print 1 Form</strong>
                Download our verified pre-filled form and hand it to the hospital desk. No repeating data!
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <strong className="text-emerald-700 block font-bold">Step 4: Track Cashless</strong>
                Watch live when the hospital approves cashless treatment, and easily fix any queries.
              </div>
            </div>
          </div>
        )}

        {/* 4 Main Sequential Steps + 2 Extra Tools */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2">
          {/* Stepper Buttons (1 to 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 flex-1">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  id={`stepper-btn-${step.id}`}
                  onClick={() => onSelectTab(step.id)}
                  className={`p-2.5 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                        isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {step.number}
                      </span>
                      <span className="truncate">{step.title}</span>
                    </span>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-700'}`} />
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px] w-full">
                    <span className={`truncate text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-700'}`}>
                      {step.subtitle}
                    </span>
                    {step.badge && (
                      <span className={`ml-1 px-1.5 py-0.2 rounded-md font-bold text-[10px] shrink-0 ${
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
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border ${
                activeTab === 'insurance'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="IRDAI 100% Cashless rules, TPA pre-authorization guide, Section 80D"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>{language === 'hi' ? 'बीमा गाइड' : language === 'mr' ? 'विमा मार्गदर्शक' : 'Insurance Guide'}</span>
            </button>

            {/* AI Assistant */}
            <button
              id="stepper-tab-ai"
              onClick={() => onSelectTab('ai_navigator')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border ${
                activeTab === 'ai_navigator'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Ask our AI Healthcare Financial Navigator in any language"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'AI सहायक से पूछें' : language === 'mr' ? 'AI सहाय्यक' : 'Ask AI Helper'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
