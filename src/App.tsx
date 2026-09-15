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

      {/* Main Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
            {/* Tab 1: Financial Support Map */}
            <button
              id="tab-support-map"
              onClick={() => setActiveTab('support_map')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'support_map'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{t.tabSupportMap}</span>
            </button>

            {/* Tab 2: Document Readiness */}
            <button
              id="tab-documents"
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'documents'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>{t.tabDocuments}</span>
              {missingDocsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950">
                  {missingDocsCount}
                </span>
              )}
            </button>

            {/* Tab 3: One Application -> Multiple Pathways */}
            <button
              id="tab-one-app"
              onClick={() => setActiveTab('one_application')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'one_application'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>{t.tabOneApplication}</span>
              <span className="hidden lg:inline text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold uppercase">
                USP
              </span>
            </button>

            {/* Tab 4: My Support Journey & Tracking */}
            <button
              id="tab-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'tracking'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{t.tabTracking}</span>
              {pendingActionsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-rose-500 text-white animate-pulse">
                  {pendingActionsCount}
                </span>
              )}
            </button>

            {/* Tab 5: Insurance Navigation */}
            <button
              id="tab-insurance"
              onClick={() => setActiveTab('insurance')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'insurance'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>{t.tabInsurance}</span>
            </button>

            {/* Tab 6: AI Financial Care Navigator */}
            <button
              id="tab-ai-navigator"
              onClick={() => setActiveTab('ai_navigator')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'ai_navigator'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{t.tabAiNavigator}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'support_map' && (
          <FinancialSupportMap
            profile={profile}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentReadiness
            documents={documents}
            onUpdateDocuments={handleUpdateDocuments}
            language={language}
            patientProfile={profile}
          />
        )}

        {activeTab === 'one_application' && (
          <ApplicationWorkflows
            profile={profile}
            language={language}
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
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
