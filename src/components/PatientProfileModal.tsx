import React, { useState, useEffect } from 'react';
import { PatientProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  User, 
  Heart, 
  MapPin, 
  Building2, 
  IndianRupee, 
  ShieldCheck, 
  Users, 
  X, 
  Check,
  FileText
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Patient & Caregiver Clinical Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate inputs ensure precise multi-scheme eligibility and realistic coverage estimates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Patient Basic Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Condition & Estimate */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
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
                  placeholder="e.g. Cancer, Triple Vessel CAD, ESRD"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Hospital Treatment Cost (₹)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={formData.estimatedCost}
                  onChange={e => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Socioeconomic & Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              Private Health Insurance
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.hasInsurance}
                  onChange={e => setFormData({ ...formData, hasInsurance: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Patient possesses an active Private or Corporate Health Insurance Policy</span>
              </label>

              {formData.hasInsurance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Insurer / TPA Name
                    </label>
                    <input
                      type="text"
                      value={formData.insuranceCompany || ''}
                      onChange={e => setFormData({ ...formData, insuranceCompany: e.target.value })}
                      placeholder="e.g. Star Health / Medi Assist"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Caregiver Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save & Recalculate Benefits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
