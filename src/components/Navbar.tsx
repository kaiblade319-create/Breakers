import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  HeartHandshake, 
  Globe, 
  Users, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles,
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isCaregiverMode: boolean;
  onToggleCaregiverMode: () => void;
  caregiverName?: string;
  patientName: string;
  onOpenProfile: () => void;
  onQuickPreset: (presetKey: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isCaregiverMode,
  onToggleCaregiverMode,
  caregiverName,
  patientName,
  onOpenProfile,
  onQuickPreset
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Emergency & Schemes Hotline ticker */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            Verified Navigation Layer
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            {t.emergencyHelpline}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Toll-free 24x7 Support:</span>
          <a href="tel:14555" className="hover:text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-300">
            14555 (PM-JAY)
          </a>
          <a href="tel:155388" className="hover:text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-sky-300">
            155388 (MJPJAY)
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                {t.appTitle}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                <Sparkles className="w-3 h-3" />
                Cross-Source Navigator
              </span>
            </div>
            <p className="text-xs text-slate-700 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Caregiver vs Patient Mode toggle */}
          <button
            id="caregiver-mode-toggle-btn"
            onClick={onToggleCaregiverMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isCaregiverMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle between Patient and Family Caregiver view"
          >
            {isCaregiverMode ? (
              <>
                <Users className="w-4 h-4 text-amber-600" />
                <span className="font-medium">
                  {t.caregiverMode}: <strong className="text-amber-800">{caregiverName || 'Son'}</strong>
                </span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.patientMode} ({patientName})</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <div className="px-1.5 text-slate-700">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <button
              id="lang-en-btn"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              id="lang-hi-btn"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              id="lang-mr-btn"
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                language === 'mr'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Edit / Profile Action */}
          <button
            id="open-profile-btn"
            onClick={onOpenProfile}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            {t.editProfile}
          </button>
        </div>
      </div>
    </header>
  );
};
