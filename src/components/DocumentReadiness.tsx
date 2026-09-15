import React, { useState, useRef } from 'react';
import { DocumentItem, Language, PatientProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { DocumentItemRow } from './documents/DocumentItemRow';
import { DocumentUploadZone } from './documents/DocumentUploadZone';
import { DocumentInspectorModal } from './documents/DocumentInspectorModal';
import { 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  Download,
  Layers
} from 'lucide-react';

interface DocumentReadinessProps {
  documents: DocumentItem[];
  onUpdateDocuments: (docs: DocumentItem[]) => void;
  language: Language;
  patientProfile: PatientProfile;
  onNavigateTab?: (tabId: string) => void;
}

export const DocumentReadiness: React.FC<DocumentReadinessProps> = ({
  documents,
  onUpdateDocuments,
  language,
  patientProfile,
  onNavigateTab
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);

  // Upload & OCR states
  const [isSimulatingOcr, setIsSimulatingOcr] = useState<boolean>(false);
  const [ocrScanStep, setOcrScanStep] = useState<string>('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadDocIdRef = useRef<string | null>(null);

  const totalRequired = documents.length;
  const verifiedCount = documents.filter(d => d.uploaded && d.verificationStatus === 'verified').length;
  const missingCount = totalRequired - verifiedCount;
  const readinessPercent = Math.round((verifiedCount / totalRequired) * 100);

  const triggerFilePicker = (docId?: string) => {
    targetUploadDocIdRef.current = docId || null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processUploadedFile = (file: File, explicitDocId?: string | null) => {
    setIsSimulatingOcr(true);
    setUploadSuccessMessage(null);
    setOcrScanStep('Reading file structure and optical text...');

    let targetDocId = explicitDocId;
    if (!targetDocId) {
      const lower = file.name.toLowerCase();
      if (lower.includes('aadhaar') || lower.includes('aadhar')) targetDocId = 'aadhaar';
      else if (lower.includes('income') || lower.includes('tahsildar')) targetDocId = 'income_cert';
      else if (lower.includes('ration')) targetDocId = 'ration_card';
      else if (lower.includes('cheque') || lower.includes('bank')) targetDocId = 'bank_details';
      else if (lower.includes('estimate') || lower.includes('cost')) targetDocId = 'cost_estimate';
      else if (lower.includes('policy') || lower.includes('insurance')) targetDocId = 'policy_copy';
      else {
        const firstMissing = documents.find(d => !d.uploaded);
        targetDocId = firstMissing ? firstMissing.id : documents[0].id;
      }
    }

    setTimeout(() => {
      setOcrScanStep(`Matching identity details against patient "${patientProfile.name}"...`);
    }, 700);

    setTimeout(() => {
      const updated = documents.map(doc => {
        if (doc.id === targetDocId) {
          return {
            ...doc,
            uploaded: true,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadedDate: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            verificationStatus: 'verified' as const,
            verificationNote: `✓ Name "${patientProfile.name}" matched. Validity verified for Hospital & Scheme Desks.`
          };
        }
        return doc;
      });

      onUpdateDocuments(updated);
      setIsSimulatingOcr(false);
      setUploadSuccessMessage(`Successfully uploaded and verified: ${file.name}`);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    }, 1500);
  };

  const handleQuickVerify = (docId: string) => {
    const updated = documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          uploaded: true,
          fileName: `${doc.id}_sample_verified.pdf`,
          fileSize: '1.2 MB',
          uploadedDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          verificationStatus: 'verified' as const,
          verificationNote: `✓ Verified instantly against hospital database.`
        };
      }
      return doc;
    });
    onUpdateDocuments(updated);
  };

  const handleRemoveDoc = (docId: string) => {
    const updated = documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          uploaded: false,
          fileName: undefined,
          fileSize: undefined,
          uploadedDate: undefined,
          verificationStatus: 'missing' as const,
          verificationNote: undefined
        };
      }
      return doc;
    });
    onUpdateDocuments(updated);
  };

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processUploadedFile(file, targetUploadDocIdRef.current);
        }}
        className="hidden"
      />

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 mb-1.5">
              <span>Step 2 of 4</span>
              <span>•</span>
              <span>Essential Hospital Papers</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'दस्तावेज़ तैयारी और सत्यापन' : language === 'mr' ? 'कागदपत्रे पडताळणी' : 'Check & Verify Your Documents'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
              You only need 3-4 key papers (Aadhaar, Ration Card/Income proof, and Doctor's Estimate). Once uploaded, you can apply across all schemes in 1 click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                {verifiedCount} / {totalRequired}
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Papers Verified ({readinessPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
      </div>

      {/* Upload Zone */}
      <DocumentUploadZone
        onFileDrop={(file) => processUploadedFile(file)}
        onTriggerPicker={() => triggerFilePicker()}
        isSimulatingOcr={isSimulatingOcr}
        ocrScanStep={ocrScanStep}
        uploadSuccessMessage={uploadSuccessMessage}
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'identity', label: 'Identity (Aadhaar/Ration)' },
          { id: 'medical', label: 'Medical (Estimate/Biopsy)' },
          { id: 'income', label: 'Income Proof' },
          { id: 'insurance', label: 'Insurance & TPA' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <DocumentItemRow
            key={doc.id}
            document={doc}
            onInspect={(d) => setInspectingDoc(d)}
            onTriggerUpload={(id) => triggerFilePicker(id)}
            onQuickVerify={(id) => handleQuickVerify(id)}
            onRemove={(id) => handleRemoveDoc(id)}
          />
        ))}
      </div>

      {/* Navigation Card */}
      {onNavigateTab && (
        <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <button
            onClick={() => onNavigateTab('support_map')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Step 1: Savings</span>
          </button>

          <div className="text-center sm:text-right">
            <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
              {verifiedCount >= 3 ? '✓ Core Documents Ready!' : `${missingCount} papers pending verification`}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Ready to generate your single application form for hospital submission?
            </div>
          </div>

          <button
            id="proceed-to-step3-btn"
            onClick={() => onNavigateTab('one_application')}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Next: Generate 1-Page Form (Step 3 of 4)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Document Inspector Modal */}
      <DocumentInspectorModal
        document={inspectingDoc}
        onClose={() => setInspectingDoc(null)}
      />
    </div>
  );
};
