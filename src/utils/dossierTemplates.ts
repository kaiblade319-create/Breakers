import { PatientProfile } from '../types';

export function getGovernmentDossier(profile: PatientProfile): string {
  return `================================================================================
GOVERNMENT HEALTH ASSURANCE SCHEME (MJPJAY / PM-JAY) PRE-AUTHORIZATION DOSSIER
================================================================================
Generated via Healthcare Financial Navigator | 1-Click Multi-Pathway Engine

1. PATIENT IDENTIFICATION:
   - Patient Name: ${profile.name}
   - Age / Gender: ${profile.age} Years / ${profile.gender}
   - Hospital UHID / Reg No: ${profile.uhid || 'HOSP-2026-08149'}
   - Aadhaar Number: XXXX-XXXX-4821 (Linked via e-KYC)
   - Ration Card Category: ${profile.rationCardType.replace('_', ' ').toUpperCase()}
   - Family Annual Income: ₹${profile.annualIncome.toLocaleString('en-IN')}

2. CLINICAL & PROCEDURE DETAILS:
   - Primary Diagnosis: ${profile.disease}
   - Proposed Treatment / Procedure: ${profile.treatment}
   - Hospital: ${profile.hospital} (${profile.hospitalType.replace('_', ' ').toUpperCase()})
   - Treating Specialist: Empanelled Chief Medical Officer

3. FINANCIAL QUOTATION & STATE PACKAGE:
   - State Scheme Package: Critical Care Medical Management
   - Total Hospital Estimate: ₹${profile.estimatedCost.toLocaleString('en-IN')}
   - Requested Cashless Allocation: ₹${Math.min(500000, profile.estimatedCost).toLocaleString('en-IN')}

4. ENCLOSED DOCUMENTS REPOSITORY:
   [X] Biometric e-KYC Verification Slip
   [X] State Food Security Ration Card Copy
   [X] Detailed Treatment Cost Estimate with Doctor's Seal
   [X] Diagnostic Pathology / Biopsy Confirmation
   [X] Hospital Bed Allocation Slip

5. SUBMISSION COUNTER:
   - Submit directly to Ground Floor Arogyamitra Counter / State TMS Portal
================================================================================`;
}

export function getInsuranceDossier(profile: PatientProfile, currentDate: string): string {
  return `================================================================================
IRDAI STANDARDIZED CASHLESS PRE-AUTHORIZATION REQUEST FORM (PART A & B)
================================================================================
Generated for: ${profile.insuranceCompany || 'Health Insurance'} | TPA: ${profile.tpaName || 'Medi Assist TPA'}

1. DETAILS OF THE INSURED PATIENT (PART A):
   - Patient Name: ${profile.name}
   - Relationship to Insured: Self / Dependent
   - Policy Number: ${profile.policyNumber || 'SH-IND-2025-992140'}
   - TPA Member ID: TPA-${profile.age}992
   - Contact Number: ${profile.caregiverPhone || '+91 98201 44521'}
   - Address: ${profile.city}, ${profile.location}

2. DETAILS OF HOSPITAL & TREATING DOCTOR (PART B):
   - Hospital: ${profile.hospital}
   - Rohini ID: 89002148912
   - Diagnosis: ${profile.disease}
   - Proposed Admission Date: ${currentDate}

3. ESTIMATED EXPENSES BREAKUP:
   - Room & Nursing Charges: ₹35,000
   - Investigations / Diagnostics: ₹45,000
   - Procedure / Surgery / Chemo: ₹${Math.round(profile.estimatedCost * 0.7).toLocaleString('en-IN')}
   - Medicines & Consumables: ₹${Math.round(profile.estimatedCost * 0.2).toLocaleString('en-IN')}
   - Total Estimated Cost: ₹${profile.estimatedCost.toLocaleString('en-IN')}
   - Initial Cashless Requested: ₹${Math.min(profile.insuranceSum || 400000, profile.estimatedCost).toLocaleString('en-IN')}

4. SIGNATURE:
   Patient / Caregiver: ____________________ (${profile.caregiverName || profile.name})
================================================================================`;
}

export function getHospitalConcessionLetter(profile: PatientProfile, currentDate: string): string {
  return `Date: ${currentDate}

To,
The Medical Superintendent / In-Charge, Medical Social Work (MSW)
${profile.hospital}

Subject: Request for Financial Assistance & Bed Fee Concession for ${profile.name} (${profile.disease})

Respected Sir / Madam,

I am writing this application on behalf of ${profile.name} (Age: ${profile.age} years), who has been diagnosed with ${profile.disease} and has been advised ${profile.treatment} under your esteemed care.

The hospital medical cost estimate for this treatment is ₹${profile.estimatedCost.toLocaleString('en-IN')}. Our total annual family income is ₹${profile.annualIncome.toLocaleString('en-IN')}, and we belong to the economically vulnerable section (${profile.rationCardType.replace('_', ' ').toUpperCase()} card holder).

We earnestly request your compassionate intervention to sanction financial assistance under the Indigent Patient Fund (IPF) / Weaker Section Quota (Section 41AA) or Hospital Trust Charitable Reserve to provide:
1. Concession on hospital bed and nursing charges
2. Concession on pathology and imaging investigations
3. Subsidy on specialized medicine administration

Enclosed for your kind perusal:
- Signed Medical Cost Estimate from Treating Doctor
- Valid Tahsildar Income Certificate / Ration Card Copy
- Patient Aadhaar Card & Case Paper (UHID: ${profile.uhid || 'HOSP-2026-08149'})

We shall be deeply indebted for your kind support in our hour of urgent medical need.

Yours faithfully,

_____________________________
${profile.caregiverName || profile.name}
Relation: ${profile.caregiverRelation || 'Family Member'}
Contact: ${profile.caregiverPhone || '+91 98201 44521'}`;
}

export function getNgoGrantApplication(profile: PatientProfile): string {
  return `================================================================================
CHARITABLE TRUST & NGO MEDICAL AID GRANT APPLICATION DOCKET
================================================================================
Partner Foundations: Tata Trusts / CPAA / Rotary / Indian Cancer Society

1. APPLICANT & PATIENT DATA:
   - Patient: ${profile.name} (Age ${profile.age}, ${profile.gender})
   - Caregiver: ${profile.caregiverName || 'Self'} (${profile.caregiverRelation || 'Family'})
   - Diagnosis: ${profile.disease}
   - Hospital: ${profile.hospital}
   - Annual Family Income: ₹${profile.annualIncome.toLocaleString('en-IN')}

2. FINANCIAL NEED JUSTIFICATION:
   - Total Treatment Cost: ₹${profile.estimatedCost.toLocaleString('en-IN')}
   - Covered by Primary Scheme / Insurance: ₹${Math.min(profile.estimatedCost, 400000).toLocaleString('en-IN')}
   - Critical Uncovered Balance: ₹${Math.max(25000, profile.estimatedCost - 400000).toLocaleString('en-IN')}
   - Grant Requested: ₹40,000 – ₹50,000

3. VENDOR / HOSPITAL PHARMACY DETAILS FOR DIRECT DISBURSEMENT:
   - Cheque / RTGS to be issued directly in the name of ${profile.hospital}.

4. CHECKLIST OF ATTACHMENTS:
   [X] Pathology & Diagnostic Reports
   [X] Hospital Treating Doctor Protocol with Drug Regimen
   [X] Income Proof Endorsed by Local Authority / Tahsildar
   [X] Patient Bank Account Passbook Copy with IFSC Code
================================================================================`;
}
