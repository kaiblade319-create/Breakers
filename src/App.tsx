import React, { useState, useEffect } from 'react';
import { 
  PatientProfile, 
  Language, 
  StreamApplication, 
  DocumentItem 
} from './types';
import { TRANSLATIONS } from './data/translations';
import { 
  INITIAL_PATIENT_PROFILES, 
  INITIAL_DOCUMENTS, 
  INITIAL_TRACKING_STREAMS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { CaseSummaryBanner } from './components/CaseSummaryBanner';
import { GuidedFlowStepper } from './components/GuidedFlowStepper';
import { JargonBusterModal } from './components/JargonBusterModal';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { FinancialSupportMap } from './components/FinancialSupportMap';
import { DocumentReadiness } from './components/DocumentReadiness';
import { ApplicationWorkflows } from './components/ApplicationWorkflows';
import { JourneyTracker } from './components/JourneyTracker';
import { InsuranceGuide } from './components/InsuranceGuide';
import { AINavigatorChat } from './components/AINavigatorChat';
import { PatientProfileModal } from './components/PatientProfileModal';
import { 
  Layers, 
  FileCheck2, 
  FileSpreadsheet, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activePreset, setActivePreset] = useState<string>('cancer_maharashtra');
  const [profile, setProfile] = useState<PatientProfile>(INITIAL_PATIENT_PROFILES.cancer_maharashtra);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [streams, setStreams] = useState<StreamApplication[]>(INITIAL_TRACKING_STREAMS);
  const [activeTab, setActiveTab] = useState<string>('support_map');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCaregiverMode, setIsCaregiverMode] = useState<boolean>(true);
  const [isJargonBusterOpen, setIsJargonBusterOpen] = useState<boolean>(false);

  // Sync documents whenever profile documents change
  const handleUpdateDocuments = (updatedDocs: DocumentItem[]) => {
    setDocuments(updatedDocs);
    setProfile(prev => ({ ...prev, uploadedDocuments: updatedDocs }));
  };

  const handleSelectPreset = (presetKey: string) => {
    if (INITIAL_PATIENT_PROFILES[presetKey]) {
      setActivePreset(presetKey);
      const chosen = INITIAL_PATIENT_PROFILES[presetKey];
      setProfile(chosen);
      setDocuments(chosen.uploadedDocuments);
    }
  };

  const handleSaveProfile = (updated: PatientProfile) => {
    setProfile(updated);
    setDocuments(updated.uploadedDocuments);
  };

  const handleUpdateCostEstimate = (newCost: number, newIncome?: number) => {
    setProfile(prev => ({
      ...prev,
      estimatedCost: newCost,
      annualIncome: newIncome !== undefined ? newIncome : prev.annualIncome
    }));
  };

  const t = TRANSLATIONS[language];

  // Badges for tabs
  const missingDocsCount = documents.filter(d => !d.uploaded).length;
  const pendingActionsCount = streams.filter(s => s.pendingAction).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Fixed Header with Helpline & Language switch */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        isCaregiverMode={isCaregiverMode}
        onToggleCaregiverMode={() => setIsCaregiverMode(!isCaregiverMode)}
        caregiverName={profile.caregiverName}
        patientName={profile.name}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onQuickPreset={handleSelectPreset}
      />

      {/* Case Context Summary & Preset Switcher */}
      <CaseSummaryBanner
        profile={profile}
        language={language}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onSelectPreset={handleSelectPreset}
        activePreset={activePreset}
      />

      {/* 4-Step Layman Guided Flow Stepper & Dictionary */}
      <GuidedFlowStepper
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
        missingDocsCount={missingDocsCount}
        pendingActionsCount={pendingActionsCount}
        onOpenJargonBuster={() => setIsJargonBusterOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 sm:pb-8">
        {activeTab === 'support_map' && (
          <FinancialSupportMap
            profile={profile}
            language={language}
            onNavigateTab={setActiveTab}
            onUpdateCostEstimate={handleUpdateCostEstimate}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentReadiness
            documents={documents}
            onUpdateDocuments={handleUpdateDocuments}
            language={language}
            patientProfile={profile}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'one_application' && (
          <ApplicationWorkflows
            profile={profile}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'tracking' && (
          <JourneyTracker
            streams={streams}
            onUpdateStreams={setStreams}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'insurance' && (
          <InsuranceGuide
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'ai_navigator' && (
          <AINavigatorChat
            profile={profile}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Edit Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
        language={language}
      />

      {/* Hospital Terms Dictionary / Jargon Buster Modal */}
      <JargonBusterModal
        isOpen={isJargonBusterOpen}
        onClose={() => setIsJargonBusterOpen(false)}
        language={language}
      />

      {/* Mobile Bottom Navigation Bar (1-Thumb navigation for patients & caregivers on mobile) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        missingDocsCount={missingDocsCount}
        pendingActionsCount={pendingActionsCount}
        onOpenJargonBuster={() => setIsJargonBusterOpen(true)}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 pb-24 sm:pb-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-slate-700">
            Healthcare Financial Navigator (CareNav) • Connecting Patient, Hospital, Schemes & Insurance
          </div>
          <div className="text-slate-500">
            Designed for Ayushman Bharat PM-JAY, MJPJAY, IRDAI TPAs, Hospital Indigent Funds & Cancer Relief Trusts
          </div>
        </div>
      </footer>
    </div>
  );
}
