import { PatientProfile, StreamApplication, DocumentItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card (Patient & Caregiver)',
    category: 'identity',
    requiredFor: ['Government Scheme (MJPJAY/PM-JAY)', 'Insurance TPA', 'Hospital MSW', 'NGO'],
    uploaded: true,
    fileName: 'aadhaar_ramesh_masked.pdf',
    fileSize: '1.2 MB',
    uploadedDate: 'Yesterday, 4:15 PM',
    verificationStatus: 'verified',
    verificationNote: 'e-KYC biometric linkage verified. Photo match confirmed.'
  },
  {
    id: 'ration_card',
    name: 'Maharashtra Ration Card (Orange / Priority)',
    category: 'income',
    requiredFor: ['Government Scheme (MJPJAY)', 'Hospital Indigent Assistance'],
    uploaded: true,
    fileName: 'ration_card_mh_scan.pdf',
    fileSize: '2.4 MB',
    uploadedDate: 'Yesterday, 4:20 PM',
    verificationStatus: 'verified',
    verificationNote: 'Valid Orange Ration card under State Food Security scheme.'
  },
  {
    id: 'cost_estimate',
    name: 'Hospital Medical Cost Estimate Certificate',
    category: 'medical',
    requiredFor: ['Government Scheme', 'Insurance TPA Pre-Auth', 'Hospital MSW', 'NGO'],
    uploaded: true,
    fileName: 'hospital_cost_estimate_oncology.pdf',
    fileSize: '850 KB',
    uploadedDate: 'Today, 10:30 AM',
    verificationStatus: 'verified',
    verificationNote: 'Signed by Medical Oncologist. Estimated sum ₹6,00,000 breakdown verified.'
  },
  {
    id: 'biopsy_report',
    name: 'Histopathology & Biopsy Diagnostic Report',
    category: 'medical',
    requiredFor: ['Government Scheme Pre-Auth', 'Insurance TPA', 'NGO Aid'],
    uploaded: true,
    fileName: 'biopsy_histopath_oncology_report.pdf',
    fileSize: '1.8 MB',
    uploadedDate: '2 days ago',
    verificationStatus: 'verified',
    verificationNote: 'Malignancy grade confirmed by NABL accredited lab.'
  },
  {
    id: 'discharge_summary',
    name: 'Interim Day-Care Admission / Clinical Summary',
    category: 'medical',
    requiredFor: ['Insurance Claim Reimbursement'],
    uploaded: true,
    fileName: 'clinical_admission_summary.pdf',
    fileSize: '950 KB',
    uploadedDate: 'Today, 11:00 AM',
    verificationStatus: 'verified',
    verificationNote: 'Clinical protocol for Chemotherapy cycle 1-6 attached.'
  },
  {
    id: 'bills',
    name: 'Diagnostic Invoices & Investigation Bills',
    category: 'financial',
    requiredFor: ['Insurance Claim Reimbursement', 'Hospital Trust Waiver'],
    uploaded: true,
    fileName: 'pet_scan_and_blood_invoices.pdf',
    fileSize: '3.1 MB',
    uploadedDate: 'Today, 11:15 AM',
    verificationStatus: 'verified',
    verificationNote: 'Pre-hospitalization receipts totaling ₹48,500.'
  },
  {
    id: 'policy_copy',
    name: 'Health Insurance Policy Copy / TPA Health Card',
    category: 'insurance',
    requiredFor: ['Insurance TPA Pre-Auth & Reimbursement'],
    uploaded: true,
    fileName: 'star_health_policy_schedule.pdf',
    fileSize: '1.5 MB',
    uploadedDate: 'Yesterday',
    verificationStatus: 'verified',
    verificationNote: 'Policy Active. Sum Insured ₹4,00,000. No waiting period for listed ailment.'
  },
  {
    id: 'income_cert',
    name: 'Tahsildar Income Certificate (< ₹1.6L / ₹2.8L)',
    category: 'income',
    requiredFor: ['CMRF State Relief Fund', 'Hospital MSW 50% Concession'],
    uploaded: false,
    verificationStatus: 'missing',
    verificationNote: 'Action required: Apply at Tehsil office or Aaple Sarkar portal.'
  },
  {
    id: 'bank_details',
    name: 'Cancelled Cheque / Bank Passbook Copy',
    category: 'financial',
    requiredFor: ['Insurance Reimbursement Settlement', 'Direct NGO DBT Transfer'],
    uploaded: false,
    verificationStatus: 'missing',
    verificationNote: 'Action required: Upload clear image of patient/caregiver cancelled cheque with IFSC.'
  },
  {
    id: 'claim_form',
    name: 'Signed TPA Claim Form (Part A & Part B)',
    category: 'insurance',
    requiredFor: ['Insurance Claim Settlement'],
    uploaded: false,
    verificationStatus: 'missing',
    verificationNote: 'Action required: Download pre-filled Part A from One-App tab and obtain hospital signature for Part B.'
  }
];

export const INITIAL_PATIENT_PROFILES: Record<string, PatientProfile> = {
  cancer_maharashtra: {
    name: 'Rameshwar Sharma',
    age: 52,
    gender: 'Male',
    disease: 'Colorectal Cancer (Stage III)',
    treatment: 'Adjuvant Chemotherapy + Targeted Drug Regimen',
    location: 'Maharashtra',
    city: 'Mumbai / Pune',
    hospital: 'Tata Memorial Empanelled Network Hospital',
    hospitalType: 'trust_charitable',
    estimatedCost: 600000,
    annualIncome: 280000,
    rationCardType: 'orange',
    hasAyushmanCard: true,
    hasInsurance: true,
    insuranceCompany: 'Star Health / Medi Assist TPA',
    insuranceSum: 400000,
    insuranceType: 'cashless',
    policyNumber: 'SH-IND-2025-992140',
    tpaName: 'Medi Assist Healthcare TPA',
    isCaregiver: true,
    caregiverName: 'Amit Sharma (Son)',
    caregiverRelation: 'Son',
    caregiverPhone: '+91 98201 44521',
    uhid: 'TMH-2026-08149',
    uploadedDocuments: INITIAL_DOCUMENTS
  },
  cardiac_delhi: {
    name: 'Sushila Devi',
    age: 61,
    gender: 'Female',
    disease: 'Coronary Artery Disease (Triple Vessel)',
    treatment: 'Coronary Artery Bypass Graft (CABG Surgery)',
    location: 'Delhi NCR',
    city: 'New Delhi',
    hospital: 'GB Pant / AIIMS Empanelled Cardiac Institute',
    hospitalType: 'private_empanelled',
    estimatedCost: 380000,
    annualIncome: 180000,
    rationCardType: 'yellow_bpl',
    hasAyushmanCard: true,
    hasInsurance: false,
    insuranceSum: 0,
    insuranceType: 'cashless',
    isCaregiver: true,
    caregiverName: 'Rajesh Kumar (Husband)',
    caregiverRelation: 'Husband',
    caregiverPhone: '+91 98110 33219',
    uhid: 'AIIMS-CD-44102',
    uploadedDocuments: INITIAL_DOCUMENTS.slice(0, 5)
  },
  renal_karnataka: {
    name: 'Mallikarjun Rao',
    age: 48,
    gender: 'Male',
    disease: 'End Stage Renal Disease (ESRD)',
    treatment: 'Bi-weekly Hemodialysis & Fistula Surgery',
    location: 'Karnataka',
    city: 'Bengaluru',
    hospital: 'Institute of Nephro Urology & Empanelled Trust',
    hospitalType: 'government',
    estimatedCost: 250000,
    annualIncome: 140000,
    rationCardType: 'yellow_bpl',
    hasAyushmanCard: true,
    hasInsurance: false,
    insuranceSum: 0,
    isCaregiver: false,
    caregiverName: 'Self',
    caregiverRelation: 'Self',
    caregiverPhone: '+91 94480 77123',
    uhid: 'INU-BLR-10928',
    uploadedDocuments: INITIAL_DOCUMENTS.slice(0, 4)
  }
};

export const INITIAL_TRACKING_STREAMS: StreamApplication[] = [
  {
    id: 'stream_govt',
    streamName: 'Government Scheme (MJPJAY / Ayushman Bharat)',
    provider: 'State Health Assurance Society (SHAS)',
    appliedAmount: 200000,
    sanctionedAmount: 200000,
    progressPercent: 80,
    currentStatus: 'Approval Pending from State Pre-Auth Doctor',
    statusType: 'in_progress',
    steps: [
      { id: '1', title: 'Arogyamitra e-KYC Verification', status: 'completed', date: '14 Sep, 10:15 AM', note: 'Biometrics matched with Orange Ration card' },
      { id: '2', title: 'Package Selection & Estimate Upload', status: 'completed', date: '14 Sep, 02:40 PM', note: 'Package Code S110001 (Medical Oncology Chemotherapy)' },
      { id: '3', title: 'Documents Verified by Hospital Desk', status: 'completed', date: '14 Sep, 05:20 PM', note: 'Biopsy report and clinical staging approved' },
      { id: '4', title: 'Government Medical Officer Pre-Auth Approval', status: 'in_progress', date: 'In Review (Est. 4 hrs)', note: 'Pending sanction on TMS Portal' },
      { id: '5', title: 'Final Cashless Voucher Issuance', status: 'pending', note: 'Automatic authorization upon sanction' }
    ],
    pendingAction: {
      actionText: 'Follow up with Arogyamitra Counter 3 if pre-auth not approved within 6 hours',
      actionDepartment: 'Hospital Arogyamitra Helpdesk',
      deadline: 'Today, 5:00 PM',
      priority: 'high'
    }
  },
  {
    id: 'stream_insurance',
    streamName: 'Private Health Insurance (Cashless / Pre-Auth)',
    provider: 'Star Health / Medi Assist TPA',
    appliedAmount: 350000,
    sanctionedAmount: 280000,
    progressPercent: 60,
    currentStatus: 'Query Raised: Additional Clinical Document Required',
    statusType: 'query_raised',
    steps: [
      { id: '1', title: 'Initial Pre-Auth Intimation Submitted', status: 'completed', date: '13 Sep, 03:00 PM', note: 'Pre-auth request #MA-892109 lodged' },
      { id: '2', title: 'Initial Query Raised by TPA Desk', status: 'action_required', date: '14 Sep, 11:30 AM', note: 'TPA requested detailed itemized chemo drug quotation' },
      { id: '3', title: 'Additional Documents Uploaded', status: 'pending', note: 'Awaiting submission of signed chemotherapy protocol' },
      { id: '4', title: 'Final Authorization / Enhanced Sanction', status: 'pending', note: 'Will issue updated cashless letter' },
      { id: '5', title: 'Discharge Settlement & Payment to Hospital', status: 'pending', note: 'Settled directly with hospital billing' }
    ],
    pendingAction: {
      actionText: 'Upload signed Chemotherapy Drug Quotation & Oncologist justification letter to resolve TPA query',
      actionDepartment: 'Hospital TPA Cashless Cell (Room 108)',
      deadline: 'Today, 3:30 PM',
      priority: 'high'
    }
  },
  {
    id: 'stream_hospital',
    streamName: 'Hospital Charitable Trust Assistance (MSW Quota)',
    provider: 'Hospital Social Service Committee (Sec 41AA)',
    appliedAmount: 50000,
    sanctionedAmount: 0,
    progressPercent: 30,
    currentStatus: 'Application Started: Tahsildar Income Proof Required',
    statusType: 'in_progress',
    steps: [
      { id: '1', title: 'Initial MSW Social Assessment Interview', status: 'completed', date: '14 Sep, 12:00 PM', note: 'Caregiver interviewed regarding financial hardship' },
      { id: '2', title: 'Income & Vulnerability Verification', status: 'action_required', date: 'Pending', note: 'Official Income Certificate required to prove < ₹1.8L bracket' },
      { id: '3', title: 'Medical Superintendent Concession Approval', status: 'pending', note: 'Committee meets Tuesdays & Fridays' },
      { id: '4', title: 'Direct Credit / Hospital Fee Waiver', status: 'pending', note: 'Direct waiver applied to final hospital bill' }
    ],
    pendingAction: {
      actionText: 'Submit Tahsildar Income Certificate or local MLA hardship certificate to MSW department',
      actionDepartment: 'Medical Social Work (MSW) Dept, 2nd Floor',
      deadline: 'Tomorrow, 12:00 PM',
      priority: 'medium'
    }
  },
  {
    id: 'stream_ngo',
    streamName: 'NGO Cancer Aid Grant',
    provider: 'Tata Memorial Cancer Patients Aid Association (CPAA)',
    appliedAmount: 40000,
    sanctionedAmount: 0,
    progressPercent: 40,
    currentStatus: 'Application Docket Prepared',
    statusType: 'in_progress',
    steps: [
      { id: '1', title: 'Application Dossier Generated', status: 'completed', date: 'Today, 09:00 AM', note: 'Ready for submission via InCare One-App' },
      { id: '2', title: 'Document Screening & Case Review', status: 'in_progress', date: 'In Queue', note: 'Verifying biopsy report and hospital tariff' },
      { id: '3', title: 'Grant Committee Sanction', status: 'pending', note: 'Medicine vouchers issued directly to pharmacy' }
    ],
    pendingAction: {
      actionText: 'Submit the generated NGO application docket with pharmacy medicine quotation',
      actionDepartment: 'CPAA Patient Guidance Desk / Online Portal',
      deadline: '18 Sep 2026',
      priority: 'low'
    }
  }
];

export const PRESET_TRACKING_STREAMS: Record<string, StreamApplication[]> = {
  cancer_maharashtra: INITIAL_TRACKING_STREAMS,
  cardiac_delhi: [
    {
      id: 'stream_pmjay_cardiac',
      streamName: 'Ayushman Bharat PM-JAY (Cardiac Surgery)',
      provider: 'National Health Authority (NHA)',
      appliedAmount: 220000,
      sanctionedAmount: 220000,
      progressPercent: 90,
      currentStatus: 'Pre-Authorization Approved for CABG Surgery Package',
      statusType: 'approved',
      steps: [
        { id: '1', title: 'Ayushman Golden Card Biometric Check', status: 'completed', date: '12 Sep, 11:00 AM', note: 'Yellow BPL card verified at AIIMS Helpdesk' },
        { id: '2', title: 'Angiography CD & Staging Clinical Review', status: 'completed', date: '12 Sep, 03:30 PM', note: 'Severe triple vessel CAD documented' },
        { id: '3', title: 'Surgical Package Code Selected (MC001)', status: 'completed', date: '13 Sep, 10:00 AM', note: 'CABG off-pump / on-pump package assigned' },
        { id: '4', title: 'Pre-Authorization Sanctioned by NHA', status: 'completed', date: '13 Sep, 04:00 PM', note: 'Sanction letter #NHA-DL-994102 generated' },
        { id: '5', title: 'Bed Booking & Pre-Op Admission', status: 'in_progress', date: 'Scheduled for Tomorrow', note: 'Cardiothoracic Surgery Ward' }
      ]
    },
    {
      id: 'stream_ran_cardiac',
      streamName: 'Rashtriya Arogya Nidhi (RAN) Emergency Aid',
      provider: 'Ministry of Health & Family Welfare',
      appliedAmount: 120000,
      sanctionedAmount: 0,
      progressPercent: 50,
      currentStatus: 'Action Required: Medical Superintendent Endorsement',
      statusType: 'in_progress',
      steps: [
        { id: '1', title: 'RAN Application Form Filled', status: 'completed', date: '13 Sep', note: 'Prepared via InCare One-App' },
        { id: '2', title: 'BPL Income Certificate Verification', status: 'completed', date: '14 Sep', note: 'Income certified < ₹1.8L' },
        { id: '3', title: 'HOD Cardiology & MS Signature', status: 'action_required', date: 'Pending Today', note: 'Requires signature on Section 4' },
        { id: '4', title: 'Ministry Fund Allocation to AIIMS Account', status: 'pending', note: 'Direct grant allocation' }
      ],
      pendingAction: {
        actionText: 'Get Section 4 of RAN form signed by Head of Cardiology or Medical Superintendent',
        actionDepartment: 'AIIMS Main Administrative Block, Room 14',
        deadline: 'Today, 2:00 PM',
        priority: 'high'
      }
    },
    {
      id: 'stream_aiims_poor_fund',
      streamName: 'AIIMS Poor Patient Welfare Fund',
      provider: 'AIIMS Charitable Welfare Society',
      appliedAmount: 40000,
      sanctionedAmount: 35000,
      progressPercent: 75,
      currentStatus: 'Concession Granted for ICU Consumables & Stents',
      statusType: 'approved',
      steps: [
        { id: '1', title: 'Socio-Economic Hardship Assessment', status: 'completed', date: '13 Sep', note: 'MSW officer verified low-income family status' },
        { id: '2', title: 'Approval by Committee', status: 'completed', date: '14 Sep', note: 'Sanctioned ₹35,000 for post-op ICU disposable kit' },
        { id: '3', title: 'Billing Adjustment at Discharge', status: 'pending', note: 'Applied automatically to pharmacy counter' }
      ]
    }
  ],
  renal_karnataka: [
    {
      id: 'stream_sast_renal',
      streamName: 'Suvarna Arogya Suraksha Trust (SAST / PM-JAY)',
      provider: 'Government of Karnataka (Arogya Karnataka)',
      appliedAmount: 180000,
      sanctionedAmount: 180000,
      progressPercent: 85,
      currentStatus: 'Free Hemodialysis Package Pre-Auth Active',
      statusType: 'approved',
      steps: [
        { id: '1', title: 'Arka ID & Aadhaar Biometric Seeding', status: 'completed', date: '10 Sep', note: 'BPL ration card tagged on SAST portal' },
        { id: '2', title: 'Nephrology Referral from Taluk Hospital', status: 'completed', date: '11 Sep', note: 'Form 2A referral issued' },
        { id: '3', title: 'Dialysis Sessions Block Approval', status: 'completed', date: '12 Sep', note: 'Covering 24 dialysis sessions + EPO injections' },
        { id: '4', title: 'Fistula Surgery Schedule Confirmation', status: 'in_progress', date: 'This Friday', note: 'Vascular surgeon appointment booked' }
      ]
    },
    {
      id: 'stream_rotary_dialysis',
      streamName: 'Rotary Bangalore Dialysis Kit Subsidy',
      provider: 'Rotary Charitable Foundation & Kidney Trust',
      appliedAmount: 30000,
      sanctionedAmount: 25000,
      progressPercent: 60,
      currentStatus: 'Action Required: Submit Nephrologist Dialyzer Prescription',
      statusType: 'in_progress',
      steps: [
        { id: '1', title: 'NGO Grant Application Submitted', status: 'completed', date: '12 Sep', note: 'Uploaded patient ID and income proof' },
        { id: '2', title: 'Prescription Verification', status: 'action_required', date: 'Pending Today', note: 'Requires monthly dialyzer and tubing prescription' },
        { id: '3', title: 'Direct Subsidy to Hospital Dialysis Unit', status: 'pending', note: 'Covers consumables for 3 months' }
      ],
      pendingAction: {
        actionText: 'Submit treating nephrologist dialyzer prescription to Rotary Patient Desk at INU',
        actionDepartment: 'INU Dialysis Wing Counter 2',
        deadline: 'Today, 4:00 PM',
        priority: 'medium'
      }
    }
  ]
};
