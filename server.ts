import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

// Initialize Gemini SDK lazily / safely
let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Healthcare Schemes Database (Verified Indian Central & State Schemes, Insurance Guidelines, and NGO Funds)
export const VERIFIED_SCHEMES_DATABASE = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat PM-JAY',
    category: 'Government Scheme',
    level: 'Central',
    maxCoverage: 500000,
    coverageDescription: 'Up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization across empanelled hospitals.',
    eligibilityRules: {
      incomeLimit: 250000,
      requiresBPLOrSECC: true,
      conditionsCovered: ['Cancer', 'Cardiac', 'Renal', 'Neurology', 'Orthopedics', 'Pediatric surgery'],
      applicableStates: 'All India (except non-implementing UTs/states)',
      beneficiaryCriteria: 'Listed in SECC 2011 database or possessing valid Ayushman Card / NFSA Ration Card.'
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card (Yellow/BPL/NFSA)',
      'Hospital Pre-Auth Request Form',
      'Diagnostic & Biopsy Report',
      'Treating Doctor Estimate'
    ],
    nextSteps: [
      'Visit hospital Arogyamitra helpdesk at empanelled hospital',
      'Provide Aadhaar & Ration card for instant e-KYC verification',
      'Arogyamitra submits pre-authorization package on TMS portal'
    ]
  },
  {
    id: 'mjpjay',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    category: 'State Scheme',
    level: 'State (Maharashtra)',
    maxCoverage: 500000,
    coverageDescription: 'Up to ₹5,00,000 cashless coverage across 1,356 medical/surgical procedures in Maharashtra.',
    eligibilityRules: {
      incomeLimit: 1000000,
      requiresBPLOrSECC: false,
      conditionsCovered: ['Cancer', 'Cardiac', 'Kidney', 'Brain', 'Burns', 'Polytrauma'],
      applicableStates: 'Maharashtra',
      beneficiaryCriteria: 'All Maharashtra residents with valid Ration Card (Yellow/Orange/White) or Domicile.'
    },
    requiredDocuments: [
      'Aadhaar Card of Patient',
      'Maharashtra Ration Card (Yellow/Orange/White)',
      'Hospital Admission / Referral Memo',
      'Cost Estimate from Network Hospital MSW',
      'Histopathology / Biopsy / Scan Reports'
    ],
    nextSteps: [
      'Contact Arogyamitra at network hospital billing/registration',
      'Get treatment cost estimate prepared by medical oncologist/surgeon',
      'Submit biometric verification for online sanction'
    ]
  },
  {
    id: 'cmrf_maha',
    name: 'Chief Minister\'s Relief Fund (CMRF)',
    category: 'State Scheme',
    level: 'State (Maharashtra)',
    maxCoverage: 100000,
    coverageDescription: 'Financial grant up to ₹1,00,000 (disbursed directly to hospital account) for major surgeries and cancer treatments.',
    eligibilityRules: {
      incomeLimit: 160000,
      requiresBPLOrSECC: false,
      conditionsCovered: ['Cancer', 'Heart Surgery', 'Organ Transplant', 'Brain Disease', 'Accidents'],
      applicableStates: 'Maharashtra',
      beneficiaryCriteria: 'Family annual income below ₹1,60,000 with Tahsildar income certificate.'
    },
    requiredDocuments: [
      'CMRF Application Form (attested by MLA/MP or Civil Surgeon)',
      'Tahsildar Income Certificate (< ₹1.6 Lakh)',
      'Detailed Hospital Cost Estimate & Treatment Protocol',
      'Aadhaar Card & Ration Card',
      'Hospital Bank Account Details for direct RTGS'
    ],
    nextSteps: [
      'Fill physical CMRF application with hospital seal',
      'Get local MLA/MP recommendation letter',
      'Submit at Mantralaya CMRF cell or online portal'
    ]
  },
  {
    id: 'ran_pmnrf',
    name: 'Rashtriya Arogya Nidhi (RAN) & PMNRF',
    category: 'Government Scheme',
    level: 'Central',
    maxCoverage: 1500000,
    coverageDescription: 'One-time financial assistance up to ₹15,00,000 for below-poverty-line patients treated at designated Central Super Specialty hospitals.',
    eligibilityRules: {
      incomeLimit: 200000,
      requiresBPLOrSECC: true,
      conditionsCovered: ['Cancer', 'Rare Diseases', 'Renal failure', 'Bone marrow transplant'],
      applicableStates: 'All India',
      beneficiaryCriteria: 'BPL card holders receiving treatment in central institutes (e.g. AIIMS, TMC, Tata Memorial, JIPMER, PGIMER).'
    },
    requiredDocuments: [
      'RAN Application Form signed by Medical Superintendent',
      'BPL Certificate / State Income Certificate',
      'Treatment Estimate from Designated Central Hospital',
      'Income Proof & Ration Card Copy'
    ],
    nextSteps: [
      'Hospital Medical Superintendent forwards application directly to Ministry of Health & Family Welfare',
      'Funds are sanctioned directly to hospital account'
    ]
  },
  {
    id: 'hospital_trust_assistance',
    name: 'Hospital Indigent Patient Fund (IPF / MSW Concession)',
    category: 'Hospital Assistance',
    level: 'Hospital',
    maxCoverage: 75000,
    coverageDescription: 'Concessional or free treatment under 10% Indigent / 10% Weaker Section reserved quotas under Trust Acts (e.g. Maharashtra Public Trusts Act Section 41AA).',
    eligibilityRules: {
      incomeLimit: 180000,
      requiresBPLOrSECC: false,
      conditionsCovered: ['All in-patient procedures'],
      applicableStates: 'All Major Charitable/Trust Hospitals',
      beneficiaryCriteria: 'Indigent (income < ₹85,000/yr: 100% free beds) or Weaker Section (income < ₹1,80,000/yr: 50% concession).'
    },
    requiredDocuments: [
      'Income Certificate issued by Tahsildar / Sub-Divisional Officer',
      'Hospital Outpatient / Inpatient Case File',
      'Medical Social Work (MSW) assessment form',
      'Ration card copy'
    ],
    nextSteps: [
      'Meet the Medical Social Worker (MSW) department at the hospital',
      'Provide proof of income and family dependency declaration',
      'Hospital committee approves tariff discount or zero-billing slot'
    ]
  },
  {
    id: 'ngo_cancer_aid',
    name: 'Charitable Trust & NGO Aid (Tata Trusts / CPAA / Rotary / ICS)',
    category: 'NGO Support',
    level: 'National / Regional',
    maxCoverage: 100000,
    coverageDescription: 'Direct drug subsidies, chemotherapy medicine assistance, prosthetic grants, and emergency medical aid.',
    eligibilityRules: {
      incomeLimit: 350000,
      requiresBPLOrSECC: false,
      conditionsCovered: ['Cancer', 'Pediatric Cardiac', 'Dialysis'],
      applicableStates: 'All India',
      beneficiaryCriteria: 'Evaluated on family socioeconomic need and clinical urgency.'
    },
    requiredDocuments: [
      'NGO Assistance Application Form',
      'Biopsy / Histopathology confirmation report',
      'Treating oncologist chemotherapy protocol and medicine quotation',
      'Income tax return or self-declaration stamped by local corporator/sarpanch'
    ],
    nextSteps: [
      'Submit application online or to hospital desk liaison',
      'NGO conducts telephonic verification with caregiver',
      'Approved grant transferred to hospital pharmacy or direct voucher issued'
    ]
  }
];

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get verified schemes catalog
app.get('/api/schemes', (req, res) => {
  res.json({ schemes: VERIFIED_SCHEMES_DATABASE });
});

// AI Financial Care Navigator Chat Endpoint
app.post('/api/navigator/chat', async (req, res) => {
  try {
    const { message, patientProfile, language = 'en', history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();

    // Prepare system prompt with deep healthcare financial domain expertise in India
    const systemInstruction = `You are the "Healthcare Financial Navigator", an empathetic, highly specialized Indian healthcare financial & administrative expert.
Your mission is to guide patients and caregivers facing catastrophic healthcare expenses (like Cancer, Cardiac surgery, Dialysis, Transplant) through every realistic way to reduce their expenses and navigate administrative roadblocks.

Language instruction:
- If language is 'hi' (Hindi), answer primarily in clear, respectful, easy-to-understand Hindi (Devanagari script) with essential English terms in parentheses (e.g., "आयुष्मान भारत (Ayushman Bharat)", "कैशलेस (Cashless)").
- If language is 'mr' (Marathi), answer in respectful, natural Marathi.
- If language is 'en' (English), answer in clear, empathetic English with accurate Indian healthcare terminology.

Core Philosophy:
1. Never just list 20 schemes. Tell the patient:
   - What applies to them and WHY.
   - What documents are needed.
   - What to do NEXT (Actionable next-best action).
   - Where their application stands.
2. Differentiate between Cashless (hospital desk pre-auth before or upon admission) and Reimbursement (bills + discharge summary submitted within 15-30 days post-discharge).
3. Explain how to combine sources: E.g., Private Insurance (covers ₹3-4L) + Government Scheme (Ayushman Bharat or State Scheme MJPJAY covers ₹1-2L) + Hospital MSW trust discount (₹25k-50k) + NGO grant for chemotherapy drugs, radically bringing down out-of-pocket costs.
4. Keep advice grounded in verified rules, not AI hallucinations.
5. Always highlight:
   - "Missing Documents" to watch out for.
   - "Next Best Action": Exactly where to walk or who to talk to (e.g. "Visit the Arogyamitra desk in the hospital lobby with your Ration Card and Aadhaar").

Current Patient Profile Context:
${JSON.stringify(patientProfile || {}, null, 2)}
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemInstruction}\n\nUser Question: ${message}`
                }
              ]
            }
          ],
          config: {
            temperature: 0.3,
            maxOutputTokens: 1200
          }
        });

        const reply = response.text || 'I am ready to help navigate your healthcare financial support options.';
        return res.json({ reply, source: 'gemini' });
      } catch (err: any) {
        console.warn('Gemini API call error, using domain-rich fallback engine:', err?.message);
      }
    }

    // High quality contextual domain fallback if GEMINI_API_KEY is not configured or rates limited
    const fallbackResponse = generateDomainAdviceFallback(message, patientProfile, language);
    return res.json({ reply: fallbackResponse, source: 'rule-engine' });

  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Comprehensive AI & Rules Patient Case Assessment Endpoint
app.post('/api/navigator/analyze', async (req, res) => {
  try {
    const { patientProfile, language = 'en' } = req.body;
    const disease = patientProfile?.disease || 'Cancer';
    const treatment = patientProfile?.treatment || 'Chemotherapy';
    const location = patientProfile?.location || 'Maharashtra';
    const estimatedCost = Number(patientProfile?.estimatedCost) || 600000;
    const annualIncome = Number(patientProfile?.annualIncome) || 280000;
    const hasInsurance = Boolean(patientProfile?.hasInsurance);
    const insuranceSum = Number(patientProfile?.insuranceSum) || (hasInsurance ? 300000 : 0);

    // Rule-based Financial Support Map calculation
    const supportOptions: any[] = [];
    let totalPotentialSupport = 0;

    // 1. Private Insurance
    if (hasInsurance && insuranceSum > 0) {
      const estimatedClaim = Math.min(insuranceSum, Math.round(estimatedCost * 0.7));
      supportOptions.push({
        id: 'private_insurance',
        source: 'Private / Corporate Insurance',
        category: 'Insurance',
        potentialSupportMin: Math.round(estimatedClaim * 0.85),
        potentialSupportMax: estimatedClaim,
        status: 'Check Pre-Auth',
        statusColor: 'yellow',
        eligible: true,
        reason: `Active policy with ₹${(insuranceSum / 100000).toFixed(1)} Lakh sum insured. Pre-authorization needed at hospital TPA desk.`,
        requiredDocs: ['Insurance Card / Policy Copy', 'TPA Pre-Authorization Form', 'Doctor Prescription & Hospital Cost Estimate', 'Photo ID (Aadhaar/PAN)'],
        nextAction: 'Visit Hospital TPA Cashless Desk 48 hours prior to planned admission'
      });
      totalPotentialSupport += estimatedClaim;
    }

    // 2. Government Scheme: PM-JAY / State Scheme (MJPJAY for Maharashtra, etc.)
    const isMaharashtra = /maharashtra/i.test(location);
    if (annualIncome <= 1000000 || isMaharashtra) {
      const schemeName = isMaharashtra ? 'MJPJAY (Mahatma Jyotirao Phule Jan Arogya Yojana)' : 'Ayushman Bharat PM-JAY';
      const govtCoverage = Math.min(500000, Math.round(estimatedCost * 0.5));
      supportOptions.push({
        id: isMaharashtra ? 'mjpjay' : 'pmjay',
        source: schemeName,
        category: 'Government Scheme',
        potentialSupportMin: Math.round(govtCoverage * 0.7),
        potentialSupportMax: govtCoverage,
        status: 'Potentially Eligible',
        statusColor: 'green',
        eligible: true,
        reason: isMaharashtra
          ? 'Eligible under universal MJPJAY in Maharashtra with Yellow/Orange/White Ration Card.'
          : (annualIncome <= 250000 ? 'Income within SECC / Ayushman Bharat threshold criteria.' : 'Subject to Ayushman Card verification.'),
        requiredDocs: ['Aadhaar Card', 'Ration Card (Yellow/Orange/White)', 'Treating Oncologist/Surgeon Recommendation', 'Hospital Empanelled Package Code'],
        nextAction: 'Meet hospital Arogyamitra to verify biometric Aadhaar linkage and initiate TMS pre-auth'
      });
      totalPotentialSupport += govtCoverage;
    }

    // 3. Hospital Financial Assistance / MSW Indigent Trust Quota
    if (annualIncome <= 360000) {
      const hospitalAid = Math.min(75000, Math.round(estimatedCost * 0.15));
      supportOptions.push({
        id: 'hospital_assistance',
        source: 'Hospital Trust & MSW Assistance',
        category: 'Hospital Concession',
        potentialSupportMin: 25000,
        potentialSupportMax: hospitalAid,
        status: 'Apply',
        statusColor: 'yellow',
        eligible: true,
        reason: 'Charitable / Trust hospital reserve funds under Indigent/Weaker Section (Section 41AA) or discretionary charity committee.',
        requiredDocs: ['Tahsildar Income Certificate', 'Ration Card', 'Formal Concession Application to MSW Desk', 'Electricity / Utility bill proof of address'],
        nextAction: 'Submit concession request letter and income affidavit to the Medical Social Work department'
      });
      totalPotentialSupport += hospitalAid;
    }

    // 4. NGO & Charitable Trusts (Tata Trusts, CPAA, Indian Cancer Society)
    if (disease.toLowerCase().includes('cancer') || disease.toLowerCase().includes('cardiac') || annualIncome <= 500000) {
      const ngoAid = Math.min(50000, Math.round(estimatedCost * 0.1));
      supportOptions.push({
        id: 'ngo_charity',
        source: 'Cancer Aid NGOs (Tata Trusts / CPAA / Rotary)',
        category: 'NGO Support',
        potentialSupportMin: 20000,
        potentialSupportMax: ngoAid,
        status: 'Potential Match',
        statusColor: 'yellow',
        eligible: true,
        reason: 'Partner non-profits provide direct medicine subsidies (chemotherapy vials) and surgical grants.',
        requiredDocs: ['Histopathology/Biopsy Report', 'Detailed Hospital Cost Estimate Breakdown', 'Income declaration endorsed by local authority', 'Bank Details / Cancelled Cheque'],
        nextAction: 'Submit online grant docket with pharmacy quotation to charity liaison'
      });
      totalPotentialSupport += ngoAid;
    }

    // 5. State Chief Minister Relief Fund (CMRF)
    if (isMaharashtra && annualIncome <= 160000) {
      const cmrfAid = 50000;
      supportOptions.push({
        id: 'cmrf',
        source: 'Maharashtra Chief Minister\'s Relief Fund (CMRF)',
        category: 'State Scheme',
        potentialSupportMin: 25000,
        potentialSupportMax: cmrfAid,
        status: 'Potential Match',
        statusColor: 'green',
        eligible: true,
        reason: 'Emergency government discretionary grant for serious ailments (Cancer, Cardiac, Dialysis) for families with income < ₹1.6L.',
        requiredDocs: ['CMRF Form signed by Hospital Medical Director', 'Tahsildar Income Certificate', 'Aadhaar Card', 'MLA/MP Recommendation Stamp'],
        nextAction: 'Get doctor estimate certified by Civil Surgeon or empanelled hospital administration'
      });
      totalPotentialSupport += cmrfAid;
    }

    // Out-of-pocket remaining calculation
    const calculatedOutOfPocket = Math.max(0, estimatedCost - totalPotentialSupport);

    // Missing Documents list
    const uploadedDocs = patientProfile?.uploadedDocuments || [];
    const allRequiredDocs = [
      { id: 'aadhaar', name: 'Aadhaar Card of Patient & Caregiver', schemes: ['Government Scheme', 'Insurance', 'Hospital', 'NGO'] },
      { id: 'ration_card', name: 'Ration Card (Yellow / Orange / White)', schemes: ['Government Scheme', 'Hospital Assistance'] },
      { id: 'income_cert', name: 'Income Certificate (Tahsildar issued)', schemes: ['Government Scheme', 'Hospital Assistance', 'CMRF'] },
      { id: 'cost_estimate', name: 'Detailed Medical Cost Estimate from Hospital', schemes: ['Government Scheme', 'Insurance', 'Hospital', 'NGO'] },
      { id: 'biopsy_report', name: 'Biopsy / Diagnostic Pathology Reports', schemes: ['Government Scheme', 'Insurance', 'NGO'] },
      { id: 'insurance_policy', name: 'Insurance Policy Copy / TPA E-Card', schemes: ['Insurance'] },
      { id: 'bank_details', name: 'Cancelled Cheque / Bank Passbook Copy', schemes: ['Insurance Reimbursement', 'NGO Grant'] },
      { id: 'discharge_summary', name: 'Discharge Summary (if completed)', schemes: ['Insurance Reimbursement'] },
      { id: 'hospital_bills', name: 'Itemized Hospital Invoices & Receipts', schemes: ['Insurance Reimbursement'] }
    ];

    const documentReadiness = allRequiredDocs.map(doc => {
      const isUploaded = uploadedDocs.some((u: any) => u.docType === doc.id || u.name?.toLowerCase().includes(doc.id));
      return {
        ...doc,
        uploaded: isUploaded
      };
    });

    const totalDocs = documentReadiness.length;
    const readyDocs = documentReadiness.filter(d => d.uploaded).length;

    // AI generated dynamic narrative summary if Gemini is available
    let aiSummary = '';
    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `Patient: Age ${patientProfile?.age || 52}, Disease: ${disease}, Treatment: ${treatment}, State: ${location}, Annual Income: ₹${annualIncome}, Insurance: ${hasInsurance ? 'Yes' : 'No'}, Cost: ₹${estimatedCost}.
Language: ${language}.
Provide a crisp 3-sentence action summary answering:
1. What support options they qualify for and approximate financial reduction.
2. What critical document is missing right now.
3. Their exact Next Best Action today.`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { maxOutputTokens: 250, temperature: 0.2 }
        });
        aiSummary = resp.text || '';
      } catch (e) {
        // fallback will be used
      }
    }

    if (!aiSummary) {
      if (language === 'hi') {
        aiSummary = `आपकी स्थिति के अनुसार, आप ${supportOptions.length} वित्तीय सहायता कार्यक्रमों (सरकारी योजना, अस्पताल सहायता व एनजीओ) के लिए संभावित रूप से पात्र हैं। आपकी अनुमानित लागत ₹${(estimatedCost/100000).toFixed(1)} लाख से घटकर मात्र ₹${(calculatedOutOfPocket/100000).toFixed(2)} लाख रह सकती है। आपकी सबसे महत्वपूर्ण अगली कार्रवाई अस्पताल के आरोग्यमित्र अथवा एमएसडब्ल्यू डेस्क से 'उपचार लागत अनुमान' (Medical Cost Estimate) प्राप्त करना है।`;
      } else if (language === 'mr') {
        aiSummary = `तुमच्या माहितीनुसार, तुम्ही ${supportOptions.length} आर्थिक सहाय्य योजनांसाठी (शासकीय योजना, रुग्णालय सवलत आणि एनजीओ) पात्र आहात. तुमचा अपेक्षित खर्च ₹${(estimatedCost/100000).toFixed(1)} लाखांवरून कमी होऊन ₹${(calculatedOutOfPocket/100000).toFixed(2)} लाखांपर्यंत येऊ शकतो. तुमचे पुढील महत्त्वाचे पाऊल म्हणजे रुग्णालयाकडून अधिकृत 'उपचार खर्च अंदाजपत्रक' (Cost Estimate) घेणे हे आहे.`;
      } else {
        aiSummary = `Based on your profile, you are eligible for ${supportOptions.length} financial support channels. Your estimated ₹${(estimatedCost/100000).toFixed(1)} Lakh cost can be reduced to approximately ₹${(calculatedOutOfPocket/100000).toFixed(2)} Lakh out-of-pocket. Your immediate next-best action is to obtain the signed Treatment Cost Estimate and submit your pre-authorization at the hospital Arogyamitra / TPA desk.`;
      }
    }

    res.json({
      estimatedCost,
      totalPotentialSupport,
      calculatedOutOfPocket,
      supportOptions,
      documentReadiness,
      totalDocs,
      readyDocs,
      aiSummary,
      nextBestActions: [
        {
          priority: 1,
          title: 'Obtain Hospital Medical Cost Estimate',
          department: 'Treating Doctor / Billing Section',
          why: 'Every government scheme (MJPJAY/PM-JAY), TPA insurance pre-auth, and NGO requires the signed cost estimate on hospital letterhead.',
          timeframe: 'Immediate (Day 1)'
        },
        {
          priority: 2,
          title: hasInsurance ? 'Submit Cashless Pre-Auth at TPA Desk' : 'Register with Arogyamitra for Scheme Pre-Authorization',
          department: hasInsurance ? 'Hospital TPA Cashless Desk' : 'Arogyamitra Kiosk (Lobby)',
          why: hasInsurance ? 'Cashless approval requires 4-6 hours initial turnaround before admission.' : 'Arogyamitra enters package code on government TMS portal to reserve coverage.',
          timeframe: '24-48 hours before planned admission'
        },
        {
          priority: 3,
          title: 'Apply for Hospital Medical Social Work (MSW) Concession',
          department: 'Medical Social Work (MSW) Office',
          why: 'Covers non-medical items, consumables, and pharmacy discounts not covered by primary insurance.',
          timeframe: 'During admission / workup'
        }
      ]
    });

  } catch (error: any) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: error.message || 'Error running assessment' });
  }
});

// Generate formal Application & Appeal Letters
app.post('/api/navigator/generate-letter', async (req, res) => {
  try {
    const { letterType, patientProfile, language = 'en' } = req.body;
    const ai = getGenAI();
    const patientName = patientProfile?.name || 'Patient';
    const disease = patientProfile?.disease || 'Cancer';
    const hospital = patientProfile?.hospital || 'Hospital';
    const estimatedCost = patientProfile?.estimatedCost || '5,00,000';
    const income = patientProfile?.annualIncome || '2,50,000';
    const caregiverName = patientProfile?.caregiverName || 'Family Member';

    if (ai) {
      try {
        const prompt = `Write a professional, compassionate formal ${letterType || 'Financial Assistance & Concession Request Letter'} for an Indian hospital/organization.
Patient Name: ${patientName}
Caregiver / Signatory: ${caregiverName}
Disease/Condition: ${disease}
Hospital: ${hospital}
Estimated Cost: ₹${estimatedCost}
Annual Family Income: ₹${income}
Language: ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
Include:
- Clear salutation (To Medical Superintendent / MSW Department / TPA Grievance Officer)
- Clear statement of medical diagnosis, urgent clinical need, and financial hardship
- List of attached documents (Income certificate, doctor prescription, estimate)
- Polite request for maximum fee waiver / approval under indigent quotas
- Sign-off block with signature lines`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { maxOutputTokens: 900, temperature: 0.3 }
        });

        return res.json({ letter: resp.text });
      } catch (e) {
        // fallback
      }
    }

    // Fallback template
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const fallbackLetter = `Date: ${dateStr}

To,
The Medical Superintendent / In-Charge, Medical Social Work (MSW)
${hospital}

Subject: Urgent Request for Financial Assistance & Fee Concession for ${patientName} (${disease} Treatment)

Respected Sir / Madam,

I am writing this application on behalf of ${patientName} (Age: ${patientProfile?.age || '52'}), who has been diagnosed with ${disease} and is currently undergoing treatment under your esteemed care.

The estimated cost of the advised medical procedure/treatment protocol is approximately ₹${estimatedCost}. Our total annual family income is approximately ₹${income}, which makes it extremely difficult for our family to bear the full expense of this life-saving treatment without severe distress.

We earnestly request your consideration under the Indigent / Weaker Section Assistance Quota or Hospital Charitable Trust Fund to grant a concession or financial waiver on hospital charges, bed fees, and diagnostic expenses.

Enclosed Documents for your verification:
1. Treating Doctor's Prescription and Detailed Medical Cost Estimate
2. Government Issued Income Certificate / Ration Card
3. Copy of Patient's Aadhaar Card
4. Diagnostic & Biopsy Pathology Reports

We shall remain deeply grateful for your compassionate support and prompt sanction.

Yours sincerely,

______________________
${caregiverName || patientName}
Contact: ${patientProfile?.phone || '+91 98XXXXXXXX'}
Patient UHID / Case No: ${patientProfile?.uhid || 'Pending'}`;

    res.json({ letter: fallbackLetter });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for contextual fallback advice
function generateDomainAdviceFallback(message: string, profile: any, language: string): string {
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';
  const query = message.toLowerCase();

  if (query.includes('delay') || query.includes('stuck') || query.includes('देरी') || query.includes('थांबले')) {
    if (isHindi) {
      return `दावा या आवेदन में देरी के मुख्य कारण एवं समाधान:
1. **अधूरी जानकारी (Query Raised):** टीपीए या सरकारी पोर्टल (TMS) ने अस्पताल से अतिरिक्त बिल ब्रेकडाउन या डॉक्टर का स्पष्टीकरण मांगा हो सकता है।
2. **अगला कदम:** अस्पताल के कैशलेस / टीपीए डेस्क पर जाएं और 'Query Sheet' मांगें।
3. **आवश्यक दस्तावेज:** अक्सर हिस्टोपैथोलॉजी (बायोप्सी) रिपोर्ट या पूर्व-मौजूद बीमारी का इतिहास छूट जाता है। डॉक्टर से तुरंत प्रमाण पत्र बनवाकर जमा करें।`;
    }
    if (isMarathi) {
      return `दावा किंवा अर्जात विलंब होण्याची मुख्य कारणे व उपाय:
1. **अपूर्ण कागदपत्रे:** टीपीए किंवा शासनाच्या पोर्टलने अतिरिक्त स्पष्टीकरण मागितले असू शकते.
2. **पुढील पाऊल:** रुग्णालयाच्या टीपीए / आरोग्यमित्र कक्षात जाऊन प्रलंबित त्रुटींची माहिती घ्या.
3. **कागदपत्रे:** डिस्चार्ज सारांश किंवा मूळ वैद्यकीय अहवाल पुन्हा तपासा आणि तात्काळ जमा करा.`;
    }
    return `Common reasons for claim or application delay and your next steps:
1. **Pending Information (TPA/Portal Query):** Often the insurance TPA or TMS portal requires doctor's clinical justification or first consultation note.
2. **Next Action:** Visit the Hospital Cashless/TPA Desk or Arogyamitra and request the pending "Query Letter".
3. **Key Document Check:** Ensure the treating oncologist/surgeon has signed the clinical necessity note and all bills have itemized breakups.`;
  }

  if (isHindi) {
    return `स्वास्थ्य वित्तीय मार्गदर्शन (Healthcare Financial Guidance):

1. **उपलब्ध सहायता विकल्प:**
   - **आयुष्मान भारत / राज्य योजना (MJPJAY):** अस्पताल में ₹5 लाख तक कैशलेस कवरेज।
   - **निजी बीमा (Insurance):** प्री-ऑथराइजेशन फॉर्म भरकर टीपीए डेस्क पर जमा करें।
   - **अस्पताल एमएसडब्ल्यू (MSW) छूट:** दुर्बल घटक कोटे के तहत 25,000 - 75,000 रुपये तक की रियायत।
   - **एनजीओ (NGO) अनुदान:** टाटा ट्रस्ट व कैंसर केयर सोसायटियों से दवाओं पर सहायता।

2. **आवश्यक कागदपत्रे (Documents Needed):**
   - आधार कार्ड, राशन कार्ड (पीला/केसरिया)
   - आय प्रमाण पत्र (Income Certificate)
   - डॉक्टर द्वारा हस्ताक्षरित 'उपचार खर्च का अनुमान' (Cost Estimate)

3. **आज की प्राथमिकता (Next Best Action):**
   - तुरंत अस्पताल के बिलिंग विभाग से डॉक्टर का मुहर लगा हुआ 'Medical Cost Estimate' लें और आरोग्यमित्र/टीपीए काउंटर पर प्री-ऑथ शुरू करवाएं।`;
  }

  if (isMarathi) {
    return `आरोग्य आर्थिक मार्गदर्शन (Healthcare Financial Guidance):

1. **उपलब्ध आर्थिक सहाय्य मार्ग:**
   - **महात्मा जोतिराव फुले जन आरोग्य योजना (MJPJAY):** केशरी/पिवळे रेशन कार्ड धारकांसाठी ₹5 लाखांपर्यंत मोफत उपचार.
   - **विमा (Insurance):** दाखल होण्यापूर्वी टीपीए डेस्कवर प्री-ऑथ फॉर्म जमा करा.
   - **रुग्णालय एमएसडब्ल्यू (MSW) सवलत:** धर्मादाय रुग्णालय कायद्यांतर्गत गरीब रुग्णांना बिलात सूट.
   - **एनजीओ (NGO) सहाय्य:** केमोथेरपी व औषधांसाठी धर्मादाय संस्थांची मदत.

2. **महत्त्वाची कागदपत्रे:**
   - आधार कार्ड, रेशन कार्ड
   - तहसीलदारांचा उत्पन्न दाखला (< ₹1.6 किंवा ₹2.5 लाख)
   - डॉक्टरांचे उपचार खर्च अंदाजपत्रक (Cost Estimate)

3. **तात्काळ कृती (Next Best Action):**
   - प्रथम डॉक्टरांकडून उपचार खर्चाचे अधिकृत अंदाजपत्रक घ्या आणि रुग्णालयातील आरोग्यमित्राशी संपर्क साधा.`;
  }

  return `Here is your step-by-step Healthcare Financial Guidance:

1. **Matching Support Options Identified:**
   - **Government Health Scheme (PM-JAY / MJPJAY):** Cashless support up to ₹5,00,000 for listed surgical/medical oncology packages.
   - **Health Insurance:** TPA pre-authorization for cashless admission or reimbursement claim filing within 30 days.
   - **Hospital Charitable Trust (MSW Quota):** Concession on bed charges, investigations, and OT fees (₹25k - ₹75k).
   - **NGO Medical Grants (Tata Trusts, CPAA, ICS):** Financial aid specifically for chemotherapy drugs and specialized disposables.

2. **Document Readiness Checklist:**
   - Aadhaar & Ration Card (Yellow/Orange)
   - Valid Income Certificate from Tahsildar
   - Hospital Doctor's Treatment Cost Estimate with clinic stamp
   - Biopsy / Histopathology diagnostic reports

3. **Immediate Next-Best Action:**
   - Request the official Treatment Cost Estimate from the treating doctor/billing counter.
   - Present this with your Aadhaar & Ration Card to the Hospital Arogyamitra or Insurance TPA desk at least 24-48 hours before scheduled admission.`;
}

// Setup Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
