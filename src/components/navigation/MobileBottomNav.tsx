import React from 'react';
import { 
  Calculator, 
  FileCheck2, 
  FileSpreadsheet, 
  Clock, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';
import { Language } from '../../types';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  missingDocsCount: number;
  pendingActionsCount: number;
  onOpenJargonBuster: () => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  missingDocsCount,
  pendingActionsCount,
  onOpenJargonBuster,
  language
}) => {
  const items = [
    {
      id: 'support_map',
      label: language === 'hi' ? '1. राहत' : language === 'mr' ? '१. मदत' : '1. Relief',
      icon: Calculator,
      badge: null
    },
    {
      id: 'documents',
      label: language === 'hi' ? '2. कागद' : language === 'mr' ? '२. कागद' : '2. Papers',
      icon: FileCheck2,
      badge: missingDocsCount > 0 ? String(missingDocsCount) : null
    },
    {
      id: 'one_application',
      label: language === 'hi' ? '3. फॉर्म' : language === 'mr' ? '३. अर्ज' : '3. Form',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'tracking',
      label: language === 'hi' ? '4. ट्रॅक' : language === 'mr' ? '४. ट्रॅक' : '4. Track',
      icon: Clock,
      badge: pendingActionsCount > 0 ? String(pendingActionsCount) : null
    },
    {
      id: 'ai_navigator',
      label: language === 'hi' ? 'AI मदत' : language === 'mr' ? 'AI सहाय्य' : 'AI Help',
      icon: Sparkles,
      badge: null
    }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 py-1 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-between gap-0.5 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all relative min-h-[46px] min-w-0 cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-black bg-emerald-50/70'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-emerald-600 scale-110' : 'text-slate-500'} transition-transform`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-rose-500 text-white font-black text-[9px] rounded-full ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight mt-1 truncate max-w-full text-center tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-3.5 h-0.5 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Quick Dictionary Button */}
        <button
          onClick={onOpenJargonBuster}
          className="flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl text-slate-500 hover:text-slate-900 font-semibold transition-all min-h-[46px] min-w-0 cursor-pointer"
          title="Hospital Terms Dictionary"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
          <span className="text-[10px] leading-tight mt-1 text-slate-600 truncate max-w-full text-center tracking-tight">
            Terms
          </span>
        </button>
      </div>
    </nav>
  );
};
