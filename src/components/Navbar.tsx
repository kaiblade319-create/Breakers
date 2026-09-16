import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  HeartHandshake, 
  Globe, 
  Users, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  UserCheck, 
  Menu, 
  X, 
  UserCircle2 
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Emergency & Schemes Hotline ticker (desktop only to save vertical screen space on mobile) */}
      <div className="hidden sm:flex bg-slate-900 text-slate-200 text-xs px-4 py-1.5 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            Verified Healthcare Navigation Layer
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
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

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0 ring-1 ring-emerald-500/20">
            <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight flex items-baseline">
                {language === 'en' ? (
                  <span className="flex items-baseline tracking-tight">
                    <span className="text-emerald-700 font-extrabold">Fin</span>
                    <span className="text-slate-900 font-black">Care</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block ml-0.5 mb-0.5"></span>
                  </span>
                ) : (
                  <span className="text-slate-900 font-black">{t.appTitle}</span>
                )}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Cross-Source
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Caregiver vs Patient Mode toggle (desktop) */}
          <button
            id="caregiver-mode-toggle-btn"
            onClick={onToggleCaregiverMode}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isCaregiverMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle between Patient and Family Caregiver view"
          >
            {isCaregiverMode ? (
              <>
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {t.caregiverMode}: <strong>{caregiverName || 'Family'}</strong>
                </span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.patientMode} ({patientName})</span>
              </>
            )}
          </button>

          {/* Language Selector (visible on all screen sizes with touch targets >= 44px on mobile) */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              id="lang-en-btn"
              onClick={() => onLanguageChange('en')}
              className={`min-w-[32px] sm:min-w-[36px] min-h-[36px] sm:min-h-[32px] px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              id="lang-hi-btn"
              onClick={() => onLanguageChange('hi')}
              className={`min-w-[32px] sm:min-w-[36px] min-h-[36px] sm:min-h-[32px] px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हि
            </button>
            <button
              id="lang-mr-btn"
              onClick={() => onLanguageChange('mr')}
              className={`min-w-[32px] sm:min-w-[36px] min-h-[36px] sm:min-h-[32px] px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                language === 'mr'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              म
            </button>
          </div>

          {/* Edit / Profile Action (desktop) */}
          <button
            id="open-profile-btn"
            onClick={onOpenProfile}
            className="hidden sm:flex px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer items-center gap-1.5 min-h-[36px]"
          >
            <UserCircle2 className="w-3.5 h-3.5" />
            <span>{t.editProfile}</span>
          </button>

          {/* Mobile Menu Toggle Button (>= 44px touch target) */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Slide-Down Sheet */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3.5 shadow-md animate-fadeIn">
          {/* Patient / Caregiver Quick Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase">Active Patient</div>
              <div className="text-sm font-bold text-slate-900">{patientName}</div>
            </div>
            <button
              onClick={() => {
                onOpenProfile();
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer min-h-[44px] flex items-center"
            >
              Edit Case
            </button>
          </div>

          {/* Caregiver Switch Toggle */}
          <button
            onClick={() => {
              onToggleCaregiverMode();
            }}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer min-h-[44px] ${
              isCaregiverMode
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>{isCaregiverMode ? 'Caregiver View Active' : 'Patient View Active'}</span>
            </div>
            <span className="text-[11px] underline">Switch Mode</span>
          </button>

          {/* 24x7 Government Helplines */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>Free 24x7 Hospital Support Lines</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <a
                href="tel:14555"
                className="p-2.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 text-center flex flex-col items-center justify-center min-h-[44px]"
              >
                <span className="font-mono text-sm">14555</span>
                <span className="text-[10px] text-slate-500">PM-JAY Helpline</span>
              </a>
              <a
                href="tel:155388"
                className="p-2.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 text-center flex flex-col items-center justify-center min-h-[44px]"
              >
                <span className="font-mono text-sm">155388</span>
                <span className="text-[10px] text-slate-500">MJPJAY Maharashtra</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
