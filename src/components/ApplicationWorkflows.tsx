import React, { useState } from 'react';
import { PatientProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  Send, 
  Layers, 
  Building2, 
  ShieldCheck, 
  HeartHandshake,
  Printer,
  ChevronRight,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ApplicationWorkflowsProps {
  profile: PatientProfile;
  language: Language;
  onNavigateTab?: (tabId: string) => void;
}

export const ApplicationWorkflows: React.FC<ApplicationWorkflowsProps> = ({
  profile,
  language,
  onNavigateTab
}) => {
  const t = TRANSLATIONS[language];
  const [activePathway, setActivePathway] = useState<'govt' | 'insurance' | 'hospital' | 'ngo'>('govt');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingAiLetter, setIsGeneratingAiLetter] = useState<boolean>(false);
  const [customLetter, setCustomLetter] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Pre-filled forms
  const govtPreAuthForm = `================================================================================
GOVERNMENT HEALTH ASSURANCE SCHEME (MJPJAY / PM-JAY) PRE-AUTHORIZATION DOSSIER
================================================================================
Generated via Healthcare Financial Navigator | One-Application Pathway

1. PATIENT IDENTIFICATION:
   - Patient Name: ${profile.name}
   - Age / Gender: ${profile.age} Years / ${profile.gender}
   - UHID / Hospital Reg No: ${profile.uhid || 'TMH-2026-08149'}
   - Aadhaar Number: XXXX-XXXX-4821 (Linked via e-KYC)
   - Ration Card: ${profile.rationCardType.toUpperCase()} (MH State Database Verified)
   - Annual Family Income: ₹${profile.annualIncome.toLocaleString('en-IN')}

2. CLINICAL & PROCEDURE DETAILS:
   - Primary Diagnosis: ${profile.disease}
   - Proposed Treatment / Procedure: ${profile.treatment}
   - Clinical Specialty: Medical Oncology / Surgical Care
   - Hospital Name: ${profile.hospital} (${profile.hospitalType.replace('_', ' ').toUpperCase()})
   - Treating Specialist: Dr. Medical Specialist, MD, DM (Empanelled)

3. FINANCIAL QUOTATION & PACKAGE CODE:
   - State Package Code: S110001 (Oncology Medical Management / Chemotherapy)
   - Estimated Treatment Cost: ₹${profile.estimatedCost.toLocaleString('en-IN')}
   - Requested Cashless Scheme Allocation: ₹${Math.min(500000, profile.estimatedCost).toLocaleString('en-IN')}

4. ENCLOSED DOCUMENTS REPOSITORY:
   [X] Biometric e-KYC Verification Slip
   [X] State Food Security Ration Card Copy
   [X] Detailed Treatment Cost Estimate with Doctor's Seal
   [X] Histopathology / Biopsy Diagnostic Malignancy Confirmation
   [X] Hospital Bed Allocation Slip

5. SUBMISSION DESTINATION:
   - Submit directly to Hospital Arogyamitra Counter 3 / State TMS Portal
================================================================================`;

  const insurancePreAuthForm = `================================================================================
IRDAI STANDARDIZED CASHLESS PRE-AUTHORIZATION REQUEST FORM (PART A & B)
================================================================================
Generated for: ${profile.insuranceCompany || 'Health Insurance'} | TPA: ${profile.tpaName || 'Medi Assist TPA'}

1. DETAILS OF THE INSURED PATIENT (PART A):
   - Patient Name: ${profile.name}
   - Relationship to Primary Insured: Self / Dependent
   - Policy Number: ${profile.policyNumber || 'SH-IND-2025-992140'}
   - TPA Card ID: MA-902-8812
   - Contact Number: ${profile.caregiverPhone || '+91 98201 44521'}
   - Current Address: ${profile.city}, ${profile.location}

2. DETAILS OF HOSPITAL & TREATING DOCTOR (PART B):
   - Hospital Name: ${profile.hospital}
   - Rohini ID: 89002148912
   - Treating Doctor: Dr. Specialist, MD (Registration: MMC-88912)
   - Illness / Ailment: ${profile.disease}
   - Duration of Present Ailment: Confirmed Histopathology Staging
   - Proposed Date of Admission / Day Care: ${currentDate}

3. ESTIMATED EXPENSES BREAKUP:
   - Investigation / Diagnostics: ₹45,000
   - Bed / ICU Charges: ₹35,000
   - Chemotherapy / Surgery Protocol: ₹4,20,000
   - Medicine / Consumables: ₹1,00,000
   - Total Estimated Cost: ₹${profile.estimatedCost.toLocaleString('en-IN')}
   - Initial Cashless Amount Requested: ₹${Math.min(profile.insuranceSum || 400000, profile.estimatedCost).toLocaleString('en-IN')}

4. CAREGIVER / PATIENT DECLARATION:
   I hereby declare that all clinical details and policy credentials are true.
   Signature of Patient/Caregiver: ____________________ (${profile.caregiverName || profile.name})
================================================================================`;

  const hospitalConcessionLetter = customLetter || `Date: ${currentDate}

To,
The Medical Superintendent / In-Charge, Medical Social Work (MSW)
${profile.hospital}

Subject: Urgent Request for Financial Assistance & Bed Fee Concession for ${profile.name} (${profile.disease})

Respected Sir / Madam,

I am writing this application on behalf of ${profile.name} (Age: ${profile.age} years), who has been diagnosed with ${profile.disease} and has been advised ${profile.treatment} under your esteemed care.

The hospital medical cost estimate for this life-saving protocol is approximately ₹${profile.estimatedCost.toLocaleString('en-IN')}. Our total annual family income is ₹${profile.annualIncome.toLocaleString('en-IN')}, and we belong to the economically vulnerable section (${profile.rationCardType.replace('_', ' ').toUpperCase()} ration card holder).

We earnestly request your compassionate intervention to sanction financial assistance under the Indigent Patient Fund (IPF) / Weaker Section Quota (Section 41AA) or Hospital Trust Charitable Reserve to provide:
1. Concession on hospital bed and nursing charges
2. Concession on pathology and CT/PET imaging investigations
3. Subsidy on specialized chemotherapy medicine administration

Enclosed for your kind perusal:
- Signed Medical Cost Estimate from Treating Doctor
- Valid Tahsildar Income Certificate / Ration Card Copy
- Patient Aadhaar Card & Case Paper (UHID: ${profile.uhid || 'TMH-2026-08149'})

We shall be deeply indebted for your kind support in our hour of urgent medical need.

Yours faithfully,

_____________________________
${profile.caregiverName || profile.name}
Relation: ${profile.caregiverRelation || 'Family Member'}
Contact: ${profile.caregiverPhone || '+91 98201 44521'}`;

  const ngoGrantApplication = `================================================================================
CHARITABLE TRUST & NGO MEDICAL AID GRANT APPLICATION DOCKET
================================================================================
Partner Foundations: Tata Trusts / CPAA / Rotary Cancer Foundation / Indian Cancer Society

1. APPLICANT & PATIENT DATA:
   - Patient: ${profile.name} (Age ${profile.age}, ${profile.gender})
   - Caregiver: ${profile.caregiverName || 'Self'} (${profile.caregiverRelation || 'Family'})
   - Diagnosis: ${profile.disease} (Biopsy Confirmed)
   - Hospital: ${profile.hospital}
   - Annual Family Income: ₹${profile.annualIncome.toLocaleString('en-IN')}

2. FINANCIAL NEED JUSTIFICATION:
   - Total Cost: ₹${profile.estimatedCost.toLocaleString('en-IN')}
   - Covered by Primary Insurance/Govt Scheme: ₹${Math.min(profile.estimatedCost, 400000).toLocaleString('en-IN')}
   - Critical Uncovered Balance (Chemo Drugs & Disposables): ₹1,00,000
   - Grant Requested from Charitable Trust: ₹40,000 – ₹50,000

3. VENDOR / HOSPITAL PHARMACY DETAILS FOR DIRECT DISBURSEMENT:
   - Hospital Pharmacy Account: ${profile.hospital} Relief Account
   - Cheque / RTGS to be issued directly in the name of the Hospital/Pharmacy.

4. CHECKLIST OF ATTACHMENTS:
   [X] Biopsy & Histopathology Reports
   [X] Hospital Treating Doctor Protocol with Drug Regimen
   [X] Income Proof Endorsed by Local Authority / Tahsildar
   [X] Patient Bank Account Passbook Copy with IFSC Code
================================================================================`;

  const getActiveText = () => {
    switch (activePathway) {
      case 'govt': return govtPreAuthForm;
      case 'insurance': return insurancePreAuthForm;
      case 'hospital': return hospitalConcessionLetter;
      case 'ngo': return ngoGrantApplication;
    }
  };

  const handleGenerateAiLetter = async () => {
    setIsGeneratingAiLetter(true);
    try {
      const res = await fetch('/api/navigator/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterType: 'Hospital Indigent Concession & MSW Fee Waiver Application',
          patientProfile: profile,
          language: language
        })
      });
      const data = await res.json();
      if (data.letter) {
        setCustomLetter(data.letter);
        setActivePathway('hospital');
      }
    } catch (e) {
      console.error('Letter generation error:', e);
    } finally {
      setIsGeneratingAiLetter(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: One Application -> Multiple Pathways USP */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-900/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-400 text-slate-950 mb-2.5 uppercase tracking-wider">
              <span>Step 3 of 4</span>
              <span>•</span>
              <span>1-Page Hospital Dossier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'hi' ? 'एकल अस्पताल आवेदन पत्र' : language === 'mr' ? 'एकच रुग्णालय अर्ज' : 'Generate Pre-Filled Hospital Dossier'}
            </h2>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Don't spend hours filling 4 different forms. This verified 1-page dossier is pre-filled with patient clinical codes, Aadhaar e-KYC, and hospital estimates—ready to print or copy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(getActiveText())}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Dossier!' : 'Copy Active Dossier'}</span>
            </button>
            <button
              onClick={handleGenerateAiLetter}
              disabled={isGeneratingAiLetter}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingAiLetter ? 'Drafting...' : 'AI Custom Concession Letter'}</span>
            </button>
          </div>
        </div>

        {/* Process Flow Comparison (Today vs CareNav Navigator as drawn on page 10) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5">
            <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Today's Painful Fragmented Reality:
            </div>
            <p className="text-slate-300 leading-relaxed">
              Patient / Caregiver must separately fill 4 redundant paper forms, travel between multiple counters, make repeated phone calls, and repeatedly submit Aadhaar and income proofs.
            </p>
          </div>

          <div className="bg-indigo-950/80 border border-indigo-500/50 rounded-xl p-3.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Healthcare Financial Navigator (CareNav):
            </div>
            <p className="text-indigo-200 leading-relaxed">
              Enter patient & medical profile ONCE. CareNav instantly generates pre-filled dossiers for Government Scheme, Insurance TPA Pre-Auth, Hospital Trust Concession, and NGO Grants.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Switcher Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActivePathway('govt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePathway === 'govt'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>{t.pathwayGovt}</span>
        </button>

        <button
          onClick={() => setActivePathway('insurance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePathway === 'insurance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span>{t.pathwayInsurance}</span>
        </button>

        <button
          onClick={() => setActivePathway('hospital')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePathway === 'hospital'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>{t.pathwayHospital}</span>
        </button>

        <button
          onClick={() => setActivePathway('ngo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePathway === 'ngo'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-rose-500" />
          <span>{t.pathwayNgo}</span>
        </button>
      </div>

      {/* Pre-filled Dossier Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900 text-sm">
              Standardized Pre-filled Form Package
            </span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              Ready for Print & Submission
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Dossier
            </button>
            <button
              onClick={() => handleCopy(getActiveText())}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* Monospace Form Preview */}
        <div className="p-5 overflow-x-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-[500px]">
          <pre className="whitespace-pre-wrap font-mono">{getActiveText()}</pre>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            Data sourced from active case: <strong className="text-slate-900">{profile.name}</strong> • UHID: {profile.uhid || 'TMH-2026-08149'}
          </div>
          <div className="text-emerald-700 font-semibold">
            All 4 pathway dossiers are kept automatically in sync when profile updates.
          </div>
        </div>
      </div>

      {/* Prominent Next / Back Navigation Card for Laymen */}
      {onNavigateTab && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <button
            onClick={() => onNavigateTab('documents')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Step 2: Documents</span>
          </button>

          <div className="text-center sm:text-right">
            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
              Dossier Ready for Submission
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Submit this at the Hospital Helpdesk / TPA Counter, then track approvals in real time.
            </div>
          </div>

          <button
            id="proceed-to-step4-btn"
            onClick={() => onNavigateTab('tracking')}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span>Next: Track Hospital Approvals (Step 4 of 4)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
