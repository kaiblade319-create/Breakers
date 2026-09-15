import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  TrendingDown,
  Building,
  Info
} from 'lucide-react';

interface InsuranceGuideProps {
  language: Language;
  onNavigateTab: (tabId: string) => void;
}

export const InsuranceGuide: React.FC<InsuranceGuideProps> = ({
  language,
  onNavigateTab
}) => {
  const t = TRANSLATIONS[language];
  const [activeSubTab, setActiveSubTab] = useState<'comparison' | 'deductions' | 'timelines'>('comparison');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Patient-Side Insurance & TPA Navigator
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Insurance Navigation & Claim Protection
        </h2>
        <p className="text-sky-200 text-sm mt-1 max-w-2xl">
          Demystifying TPAs (Medi Assist, Vidal, Paramount, Star Health), cashless pre-authorization, reimbursement filing timelines, and hidden deductions.
        </p>

        {/* Sub Navigation Buttons */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-sky-900/80">
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'comparison'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/80 text-sky-200 hover:bg-slate-700'
            }`}
          >
            Cashless vs Reimbursement
          </button>
          <button
            onClick={() => setActiveSubTab('deductions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'deductions'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/80 text-sky-200 hover:bg-slate-700'
            }`}
          >
            Common Deductions & Co-pay
          </button>
          <button
            onClick={() => setActiveSubTab('timelines')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'timelines'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/80 text-sky-200 hover:bg-slate-700'
            }`}
          >
            Deadlines & Turnaround Times
          </button>
        </div>
      </div>

      {/* SubTab 1: Cashless vs Reimbursement Comparison */}
      {activeSubTab === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cashless Card */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Recommended Pathway
                </span>
                <span className="text-xs font-semibold text-slate-500">Zero upfront out-of-pocket</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Cashless Hospitalization
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                TPA directly approves bills with the hospital network. Patient pays only non-medical consumables and co-pay.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="font-semibold text-slate-900">How to Avail:</div>
                <ul className="space-y-1.5 text-slate-600 pl-4 list-disc">
                  <li><strong>Hospital Empanelment:</strong> Hospital must be on your insurer's network (or cashless everywhere GIPSA arrangement).</li>
                  <li><strong>Pre-Auth Timing:</strong> Submit pre-authorization form at the hospital TPA desk <strong>48 hours before planned admission</strong> or within 24 hours of emergency admission.</li>
                  <li><strong>Initial vs Final Sanction:</strong> TPA gives an initial approval (e.g. ₹50k-₹1L) and reviews the final discharge summary and bills on the day of discharge.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-semibold">TPA turnaround: ~4 to 6 hrs</span>
              <button
                onClick={() => onNavigateTab('one_application')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Pre-fill Pre-Auth Form →
              </button>
            </div>
          </div>

          {/* Reimbursement Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  Secondary Pathway
                </span>
                <span className="text-xs font-semibold text-amber-700">Requires upfront payment</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Reimbursement Claim
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                You pay the hospital upfront during discharge, then submit original bills, receipts, and claim forms to the TPA for bank transfer.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="font-semibold text-slate-900">Critical Guidelines:</div>
                <ul className="space-y-1.5 text-slate-600 pl-4 list-disc">
                  <li><strong>Filing Window:</strong> Claim must be submitted within <strong>15 to 30 days</strong> of discharge.</li>
                  <li><strong>Original Documents Required:</strong> Signed Part B from hospital billing, original discharge summary, itemized final bill, payment receipts with revenue stamp, and all lab/biopsy reports.</li>
                  <li><strong>Pre & Post Hospitalization:</strong> Medical expenses incurred 30 days prior to admission and 60/90 days post-discharge (e.g., follow-up chemotherapy medicines, scans) can be claimed separately.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">Settlement window: 15 to 21 days</span>
              <button
                onClick={() => onNavigateTab('documents')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Check Reimbursement Docs →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Deductions & Co-pay */}
      {activeSubTab === 'deductions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Why Does the Insurance TPA Deduct Money from the Claim?
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Understanding these 4 standard clauses protects you from unexpected out-of-pocket hospital surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                1. Room Rent Capping & Proportionate Deduction
              </h4>
              <p className="text-slate-600 mt-1.5 leading-relaxed">
                If your policy has a 1% room rent cap (e.g., ₹4,000/day on a ₹4L policy) and you choose a room costing ₹8,000/day, the insurer deducts 50% across <em>all</em> associated medical charges (doctor fees, OT charges, nursing), resulting in massive unexpected deductions!
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                2. Non-Payable Consumables (Schedule I & II)
              </h4>
              <p className="text-slate-600 mt-1.5 leading-relaxed">
                Gloves, syringes, PPE kits, admission files, and thermometer covers are marked non-medical by standard policies unless you possess a "Consumables Rider". This typically accounts for 5%–12% of total hospital bills.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                3. Mandatory Co-Payment (Senior Citizens / Zone)
              </h4>
              <p className="text-slate-600 mt-1.5 leading-relaxed">
                Senior citizen policies or policies with geo-zoning frequently have a 10% or 20% co-payment clause, meaning the patient family must pay that percentage of the admissible bill.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                4. Bridging the Gap with Hospital MSW / Schemes
              </h4>
              <p className="text-slate-600 mt-1.5 leading-relaxed">
                This is where CareNav's multi-pathway navigator excels: the non-payable gap and co-pay can often be covered by Hospital Indigent Trust funds or state relief schemes if presented proactively!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Deadlines & Turnaround */}
      {activeSubTab === 'timelines' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Critical Healthcare Financial Timelines & Deadlines
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">Planned Cashless Pre-Auth</span>
                <p className="text-slate-500">Submit to TPA desk at empanelled hospital</p>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                48 Hours before admission
              </span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">Emergency Cashless Intimation</span>
                <p className="text-slate-500">Intimate insurer / TPA via helpline or app</p>
              </div>
              <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                Within 24 Hours of hospitalization
              </span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">Reimbursement Claim Docket Submission</span>
                <p className="text-slate-500">Submit original bills & discharge summary to TPA branch</p>
              </div>
              <span className="font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                Strictly within 15 – 30 Days of discharge
              </span>
            </div>

            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900">Post-Hospitalization Expenses Claim</span>
                <p className="text-slate-500">Chemotherapy medicines, follow-up tests, consultations</p>
              </div>
              <span className="font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                Within 60 to 90 Days post-discharge
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
