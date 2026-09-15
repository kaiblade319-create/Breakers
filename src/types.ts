export type Language = 'en' | 'hi' | 'mr';

export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  disease: string;
  treatment: string;
  location: string;
  city: string;
  hospital: string;
  hospitalType: 'private_empanelled' | 'government' | 'trust_charitable';
  estimatedCost: number;
  annualIncome: number;
  rationCardType: 'yellow_bpl' | 'orange' | 'white' | 'none';
  hasAyushmanCard: boolean;
  hasInsurance: boolean;
  insuranceCompany?: string;
  insuranceSum?: number;
  insuranceType?: 'cashless' | 'reimbursement';
  policyNumber?: string;
  tpaName?: string;
  isCaregiver: boolean;
  caregiverName?: string;
  caregiverRelation?: string;
  caregiverPhone?: string;
  uhid?: string;
  uploadedDocuments: DocumentItem[];
}

export interface SupportOption {
  id: string;
  source: string;
  category: 'Government Scheme' | 'Insurance' | 'Hospital Concession' | 'NGO Support' | 'State Scheme';
  potentialSupportMin: number;
  potentialSupportMax: number;
  status: string;
  statusColor: 'green' | 'yellow' | 'blue' | 'red';
  eligible: boolean;
  reason: string;
  requiredDocs: string[];
  nextAction: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'identity' | 'income' | 'medical' | 'insurance' | 'financial';
  requiredFor: string[];
  uploaded: boolean;
  fileName?: string;
  fileSize?: string;
  uploadedDate?: string;
  verificationStatus: 'verified' | 'pending' | 'missing' | 'rejected';
  verificationNote?: string;
}

export interface TrackingStep {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending' | 'action_required';
  date?: string;
  note?: string;
}

export interface StreamApplication {
  id: string;
  streamName: string;
  provider: string;
  appliedAmount: number;
  sanctionedAmount?: number;
  progressPercent: number;
  currentStatus: string;
  statusType: 'in_progress' | 'query_raised' | 'approved' | 'settled';
  steps: TrackingStep[];
  pendingAction?: {
    actionText: string;
    actionDepartment: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'navigator';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'rule-engine';
  suggestedActions?: string[];
}
