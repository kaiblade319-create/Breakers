import { PatientProfile, SupportOption } from '../types';

export interface CalculatedFinancials {
  supportOptions: SupportOption[];
  totalMinAid: number;
  totalMaxAid: number;
  estimatedOutOfPocket: number;
  reductionPercentage: number;
  activeCost: number;
  activeIncome: number;
  activeInsuranceSum: number;
  hasInsurance: boolean;
}

export function calculatePatientAid(
  profile: PatientProfile,
  simValues?: {
    isSimulatorOpen: boolean;
    cost: number;
    income: number;
    insuranceSum: number;
    hasInsurance: boolean;
  }
): CalculatedFinancials {
  const isSim = simValues?.isSimulatorOpen ?? false;
  const cost = isSim ? simValues!.cost : profile.estimatedCost;
  const income = isSim ? simValues!.income : profile.annualIncome;
  const hasInsurance = isSim ? simValues!.hasInsurance : profile.hasInsurance;
  const insuranceSum = isSim
    ? (hasInsurance ? simValues!.insuranceSum : 0)
    : (profile.hasInsurance ? (profile.insuranceSum || 0) : 0);

  const isMaharashtra = /maharashtra/i.test(profile.location);
  const supportOptions: SupportOption[] = [];
  let totalMinAid = 0;
  let totalMaxAid = 0;

  // 1. Private Insurance
  if (hasInsurance && insuranceSum > 0) {
    const maxInsurance = Math.min(insuranceSum, Math.round(cost * 0.75));
    const minInsurance = Math.round(maxInsurance * 0.85);
    supportOptions.push({
      id: 'private_insurance',
      source: `Private Insurance (${profile.insuranceCompany || 'Health Policy'})`,
      category: 'Insurance',
      potentialSupportMin: minInsurance,
      potentialSupportMax: maxInsurance,
      status: 'Check Pre-Auth',
      statusColor: 'yellow',
      eligible: true,
      reason: `Active health policy with ₹${(insuranceSum / 100000).toFixed(1)} Lakh Sum Insured. Pre-authorization required 48 hrs prior to admission at hospital TPA desk.`,
      requiredDocs: [
        'TPA Pre-Auth Form (Part A signed by insured)',
        'Treating Doctor Prescription & Clinical Notes',
        'Hospital Medical Cost Estimate on Letterhead',
        'Government Photo ID (Aadhaar/PAN)'
      ],
      nextAction: 'Submit cashless pre-auth request at Hospital TPA Desk 48 hours before admission'
    });
    totalMinAid += minInsurance;
    totalMaxAid += maxInsurance;
  }

  // 2. Government Scheme: MJPJAY / PM-JAY
  const govtMax = Math.min(500000, Math.round(cost * 0.6));
  const govtMin = Math.round(govtMax * 0.75);
  const schemeTitle = isMaharashtra 
    ? 'State Scheme: Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)'
    : 'Government Scheme: Ayushman Bharat PM-JAY';

  supportOptions.push({
    id: 'government_scheme',
    source: schemeTitle,
    category: isMaharashtra ? 'State Scheme' : 'Government Scheme',
    potentialSupportMin: govtMin,
    potentialSupportMax: govtMax,
    status: 'Potentially Eligible',
    statusColor: 'green',
    eligible: true,
    reason: isMaharashtra
      ? 'Universal eligibility in Maharashtra for Orange/Yellow/White ration card holders covering oncology, cardiac, and critical procedures up to ₹5,00,000 per family.'
      : (income <= 250000 ? 'Income within SECC / Ayushman Bharat threshold; ₹5,00,000 per family/year.' : 'Subject to Ayushman Card verification on TMS portal.'),
    requiredDocs: [
      'Aadhaar Card (linked with mobile/biometrics)',
      'Valid Ration Card (Yellow/Orange/White)',
      'Hospital Admission Referral Letter',
      'Diagnostic Pathology / Biopsy Confirmation'
    ],
    nextAction: 'Visit Hospital Arogyamitra Helpdesk in the main lobby for biometric TMS registration'
  });
  totalMinAid += govtMin;
  totalMaxAid += govtMax;

  // 3. Hospital Financial Assistance / MSW Indigent Trust Quota
  if (income <= 360000) {
    const hospMin = 25000;
    const hospMax = Math.min(75000, Math.round(cost * 0.15));
    supportOptions.push({
      id: 'hospital_assistance',
      source: 'Hospital Financial Assistance (MSW Indigent Fund)',
      category: 'Hospital Concession',
      potentialSupportMin: hospMin,
      potentialSupportMax: hospMax,
      status: 'Apply',
      statusColor: 'yellow',
      eligible: true,
      reason: 'Under Trust Acts (Sec 41AA) and hospital charitable bylaws, indigent & weaker section patients receive 50% to 100% bed and surgery concessions.',
      requiredDocs: [
        'Tahsildar Income Certificate (< ₹1.8L)',
        'Formal Application Letter to Medical Superintendent',
        'MSW Socio-Economic Assessment Form',
        'Electricity bill (proof of residence)'
      ],
      nextAction: 'Submit financial hardship application and income proof to the Medical Social Work (MSW) office'
    });
    totalMinAid += hospMin;
    totalMaxAid += hospMax;
  }

  // 4. NGO / Charitable Support
  if (profile.disease.toLowerCase().includes('cancer') || profile.disease.toLowerCase().includes('cardiac') || income <= 400000) {
    const ngoMin = 20000;
    const ngoMax = Math.min(50000, Math.round(cost * 0.1));
    supportOptions.push({
      id: 'ngo_charity',
      source: 'NGO / Charity Support (Tata Trusts / CPAA / Rotary)',
      category: 'NGO Support',
      potentialSupportMin: ngoMin,
      potentialSupportMax: ngoMax,
      status: 'Potential Match',
      statusColor: 'yellow',
      eligible: true,
      reason: 'Non-profit foundations provide direct subsidies for high-cost chemotherapy drugs, dialysis consumables, and surgical items.',
      requiredDocs: [
        'Biopsy / Diagnostic Pathology Report',
        'Detailed Oncology / Procedure Quotation from Hospital Pharmacy',
        'Income Certificate / Ration Card',
        'Patient Bank Passbook Copy with IFSC'
      ],
      nextAction: 'Generate and submit NGO Grant application dossier from the Hospital Form tab'
    });
    totalMinAid += ngoMin;
    totalMaxAid += ngoMax;
  }

  // 5. Chief Minister Relief Fund (CMRF)
  if (isMaharashtra && income <= 160000) {
    const cmrfMin = 25000;
    const cmrfMax = 50000;
    supportOptions.push({
      id: 'cmrf',
      source: 'Maharashtra Chief Minister\'s Relief Fund (CMRF)',
      category: 'State Scheme',
      potentialSupportMin: cmrfMin,
      potentialSupportMax: cmrfMax,
      status: 'Potential Match',
      statusColor: 'green',
      eligible: true,
      reason: 'State discretionary relief fund providing direct RTGS disbursement to hospital for life-threatening medical procedures for families below ₹1.6L income.',
      requiredDocs: [
        'CMRF Application Form signed by Hospital Head',
        'Tahsildar Income Certificate',
        'Detailed Cost Estimate with procedure codes',
        'Local MLA / MP recommendation stamp'
      ],
      nextAction: 'Get doctor estimate certified by Civil Surgeon or hospital administrator'
    });
    totalMinAid += cmrfMin;
    totalMaxAid += cmrfMax;
  }

  // Calculate remaining Out-of-pocket
  const estimatedOutOfPocket = Math.max(15000, cost - totalMaxAid);
  const reductionPercentage = Math.min(95, Math.round(((cost - estimatedOutOfPocket) / cost) * 100));

  return {
    supportOptions,
    totalMinAid,
    totalMaxAid,
    estimatedOutOfPocket,
    reductionPercentage,
    activeCost: cost,
    activeIncome: income,
    activeInsuranceSum: insuranceSum,
    hasInsurance
  };
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
