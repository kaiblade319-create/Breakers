import React from 'react';
import { Language } from '../types';
import { HelpCircle, X, CheckCircle, ShieldCheck, HeartHandshake, Building2, FileText, PhoneCall } from 'lucide-react';

interface JargonBusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const JargonBusterModal: React.FC<JargonBusterModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const terms = [
    {
      term: 'Arogyamitra (आरोग्यमित्र)',
      icon: HeartHandshake,
      color: 'emerald',
      meaning: 'A friendly government hospital guide who sits near the admission counter or OPD lobby. Their job is to verify your Aadhaar / Ration card and register you for free treatment under Ayushman Bharat (PM-JAY) or state schemes (like MJPJAY). You do NOT have to pay them any fee.',
      tip: 'Look for the Ayushman Bharat / MJPJAY help desk on the ground floor of the hospital.'
    },
    {
      term: 'TPA & Cashless Pre-Authorization (टीपीए और कैशलेस)',
      icon: ShieldCheck,
      color: 'sky',
      meaning: 'TPA stands for Third Party Administrator. It is the organization that handles insurance claims for your hospital. "Pre-Authorization" means the insurance company gives permission in advance to the hospital to start treatment without demanding cash from you.',
      tip: 'Always submit your doctor\'s estimate to the hospital TPA desk 48 hours before planned admission.'
    },
    {
      term: 'Indigent Quota / MSW (गरीब मरीज कोटा)',
      icon: Building2,
      color: 'amber',
      meaning: 'By law, all charitable trust hospitals (e.g., Tata Memorial, Lilavati, Hinduja, Apollo) must reserve 10% of their beds completely FREE for families earning under ₹85,000/year, and another 10% at 50% discount for families earning under ₹1.6 Lakh/year.',
      tip: 'Ask to meet the "Medical Social Worker (MSW)" at the hospital to claim this quota.'
    },
    {
      term: 'CMRF / PMNRF (मुख्यमंत्री / प्रधानमंत्री राहत कोष)',
      icon: FileText,
      color: 'purple',
      meaning: 'Chief Minister and Prime Minister Relief Funds. These are direct financial grants given for expensive surgeries (like Cancer, Heart Surgery, Kidney Transplants) when government schemes or insurance don\'t cover the full cost.',
      tip: 'Requires an official medical cost estimate signed by your hospital superintendent.'
    },
    {
      term: 'Cashless vs Reimbursement (कैशलेस बनाम प्रतिपूर्ति)',
      icon: CheckCircle,
      color: 'teal',
      meaning: 'In "Cashless", the hospital sends the bill directly to the scheme or insurance company, so you pay ₹0 or only non-medical extras. In "Reimbursement", you first pay from your pocket and submit receipts later to get money back.',
      tip: 'Always aim for Cashless upfront to avoid borrowing high-interest loans.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              Plain-Language Hospital Dictionary
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Understanding Hospital & Scheme Terms
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Confused by hospital jargon? Here is what these terms mean in simple everyday words.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dictionary Cards */}
        <div className="space-y-3.5 text-xs">
          {terms.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {item.term}
                  </h4>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs pl-9">
                  {item.meaning}
                </p>
                <div className="mt-2.5 ml-9 p-2 rounded-xl bg-white border border-slate-200 flex items-start gap-1.5 text-[11px] text-slate-600">
                  <span className="font-bold text-emerald-700 shrink-0">💡 Helpful Tip:</span>
                  <span>{item.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toll-free support footer */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-emerald-900 font-medium">
              Still confused? Call the official Ayushman Helpline <strong>14555</strong> (Free, 24x7 in all Indian languages).
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shrink-0 transition-colors"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
