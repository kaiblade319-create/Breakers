import React, { useState, useEffect } from 'react';
import { PatientProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  User, 
  Heart, 
  IndianRupee, 
  ShieldCheck, 
  Users, 
  X, 
  Check
} from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  onSave: (updated: PatientProfile) => void;
  language: Language;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  language
}) => {
  const [formData, setFormData] = useState<PatientProfile>({ ...profile });

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden min-h-[44px] sm:min-h-[36px]";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto sm:my-6">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Patient & Caregiver Clinical Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate inputs ensure precise multi-scheme eligibility and realistic coverage estimates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer shrink-0 min-h-[44px] sm:min-h-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Section 1: Patient Basic Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
              <User className="w-4 h-4 text-emerald-600" />
              Patient Personal Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Condition & Estimate */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Diagnosis & Hospital Estimate
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disease / Condition
                </label>
                <input
                  type="text"
                  value={formData.disease}
                  onChange={e => setFormData({ ...formData, disease: e.target.value })}
                  placeholder="e.g. Cancer, CAD, ESRD"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advised Treatment / Procedure
                </label>
                <input
                  type="text"
                  value={formData.treatment}
                  onChange={e => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="e.g. Chemotherapy, CABG Surgery"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Treatment Cost (₹)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.estimatedCost}
                  onChange={e => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                  className={`${inputClass} font-bold text-emerald-800`}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Socioeconomic & Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
              <IndianRupee className="w-4 h-4 text-amber-500" />
              Income, Location & Scheme Cards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.annualIncome}
                  onChange={e => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State / Location
                </label>
                <select
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className={inputClass}
                >
                  <option value="Maharashtra">Maharashtra (MJPJAY Active)</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Karnataka">Karnataka (Arogya Karnataka)</option>
                  <option value="Gujarat">Gujarat (PM-JAY MA)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu (CMCHIS)</option>
                  <option value="Other">Other States</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ration Card Category
                </label>
                <select
                  value={formData.rationCardType}
                  onChange={e => setFormData({ ...formData, rationCardType: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="yellow_bpl">Yellow / BPL / Antyodaya</option>
                  <option value="orange">Orange (Priority Household)</option>
                  <option value="white">White (Above Poverty Line)</option>
                  <option value="none">No Ration Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Insurance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              Private Health Insurance
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 min-h-[44px]">
                <input
                  type="checkbox"
                  checked={formData.hasInsurance}
                  onChange={e => setFormData({ ...formData, hasInsurance: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Patient possesses an active Private or Corporate Health Insurance Policy</span>
              </label>

              {formData.hasInsurance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Insurer / TPA Name
                    </label>
                    <input
                      type="text"
                      value={formData.insuranceCompany || ''}
                      onChange={e => setFormData({ ...formData, insuranceCompany: e.target.value })}
                      placeholder="e.g. Star Health / Medi Assist"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sum Insured (₹)
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={formData.insuranceSum || 400000}
                      onChange={e => setFormData({ ...formData, insuranceSum: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Caregiver Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Family Caregiver (Handles Paperwork)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caregiver Name
                </label>
                <input
                  type="text"
                  value={formData.caregiverName || ''}
                  onChange={e => setFormData({ ...formData, caregiverName: e.target.value })}
                  placeholder="e.g. Amit Sharma"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship to Patient
                </label>
                <input
                  type="text"
                  value={formData.caregiverRelation || ''}
                  onChange={e => setFormData({ ...formData, caregiverRelation: e.target.value })}
                  placeholder="e.g. Son, Daughter, Spouse"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.caregiverPhone || ''}
                  onChange={e => setFormData({ ...formData, caregiverPhone: e.target.value })}
                  placeholder="+91 98XXX XXXXX"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>Save & Recalculate Benefits</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
