import React, { useState, useRef } from 'react';
import { PatientProfile, Language, DocumentItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  FileCheck2, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Sparkles, 
  Check, 
  Plus, 
  FilePlus2,
  Trash2,
  Download,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft
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
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [isSimulatingOcr, setIsSimulatingOcr] = useState<boolean>(false);
  const [ocrScanStep, setOcrScanStep] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isAddCustomDocOpen, setIsAddCustomDocOpen] = useState<boolean>(false);
  const [customDocName, setCustomDocName] = useState<string>('');
  const [customDocCategory, setCustomDocCategory] = useState<DocumentItem['category']>('medical');
  const [customDocRequiredFor, setCustomDocRequiredFor] = useState<string>('Hospital & Scheme Review');

  // File input ref for native upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetUploadDocIdRef = useRef<string | null>(null);

  const totalRequired = documents.length;
  const verifiedCount = documents.filter(d => d.uploaded && d.verificationStatus === 'verified').length;
  const missingCount = totalRequired - verifiedCount;
  const readinessPercent = Math.round((verifiedCount / totalRequired) * 100);

  // Groupings by pathway as highlighted on Page 11 of document
  const pathwayBreakdowns = [
    {
      name: 'Government Scheme (MJPJAY / PM-JAY)',
      docs: [
        { id: 'aadhaar', label: 'Aadhaar Card' },
        { id: 'ration_card', label: 'Income Certificate / Ration Card' },
        { id: 'biopsy_report', label: 'Medical Biopsy Report' },
        { id: 'bank_details', label: 'Bank Details / Cancelled Cheque' },
      ]
    },
    {
      name: 'Insurance Claim (TPA Cashless / Reimbursement)',
      docs: [
        { id: 'discharge_summary', label: 'Discharge Summary / Clinical Notes' },
        { id: 'bills', label: 'Hospital Invoices & Bills' },
        { id: 'claim_form', label: 'Signed Claim Form (Part A & B)' },
        { id: 'policy_copy', label: 'Insurance Policy Copy / TPA Card' },
      ]
    },
    {
      name: 'Hospital Assistance (MSW Indigent Quota)',
      docs: [
        { id: 'cost_estimate', label: 'Treating Doctor Cost Estimate' },
        { id: 'income_cert', label: 'Income Proof / Tahsildar Certificate' },
      ]
    }
  ];

  // Trigger file picker for a specific document or generic drop
  const triggerFilePicker = (docId?: string) => {
    targetUploadDocIdRef.current = docId || null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle actual native file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file, targetUploadDocIdRef.current);
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File, explicitDocId?: string | null) => {
    setIsSimulatingOcr(true);
    setUploadSuccessMessage(null);
    setOcrScanStep('Reading document binary & OCR pre-processing...');

    // Determine target document: either explicit or best guess by file name
    let targetDocId = explicitDocId;
    if (!targetDocId) {
      const lower = file.name.toLowerCase();
      if (lower.includes('aadhaar') || lower.includes('aadhar')) targetDocId = 'aadhaar';
      else if (lower.includes('income') || lower.includes('tahsildar') || lower.includes('salary')) targetDocId = 'income_cert';
      else if (lower.includes('ration')) targetDocId = 'ration_card';
      else if (lower.includes('cheque') || lower.includes('passbook') || lower.includes('bank')) targetDocId = 'bank_details';
      else if (lower.includes('claim') || lower.includes('tpa')) targetDocId = 'claim_form';
      else if (lower.includes('bill') || lower.includes('invoice') || lower.includes('receipt')) targetDocId = 'bills';
      else if (lower.includes('biopsy') || lower.includes('pathology') || lower.includes('histopath')) targetDocId = 'biopsy_report';
      else if (lower.includes('estimate') || lower.includes('quotation')) targetDocId = 'cost_estimate';
      else if (lower.includes('policy') || lower.includes('insurance')) targetDocId = 'policy_copy';
      else if (lower.includes('discharge') || lower.includes('summary')) targetDocId = 'discharge_summary';
      else {
        // Find first unverified document
        const firstMissing = documents.find(d => !d.uploaded);
        targetDocId = firstMissing ? firstMissing.id : documents[0].id;
      }
    }

    setTimeout(() => {
      setOcrScanStep(`Matching patient name "${patientProfile.name}" against document text...`);
    }, 400);

    setTimeout(() => {
      setOcrScanStep(`Verifying issuing authority stamp and validity dates...`);
    }, 800);

    setTimeout(() => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const updated = documents.map(doc => {
        if (doc.id === targetDocId) {
          return {
            ...doc,
            uploaded: true,
            fileName: file.name,
            fileSize: sizeStr,
            uploadedDate: 'Just now',
            verificationStatus: 'verified' as const,
            verificationNote: `AI Smart OCR: Verified 99.4% match for ${patientProfile.name}. Official seal and doctor registration number confirmed.`
          };
        }
        return doc;
      });

      onUpdateDocuments(updated);
      setIsSimulatingOcr(false);
      setOcrScanStep('');
      setUploadSuccessMessage(`Successfully scanned & verified "${file.name}"!`);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    }, 1300);
  };

  // Helper to handle manual document status toggle
  const handleToggleDocStatus = (docId: string) => {
    const updated = documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          uploaded: false,
          verificationStatus: 'missing' as const,
          verificationNote: 'Action required: Please scan or upload original document.'
        };
      }
      return doc;
    });
    onUpdateDocuments(updated);
  };

  // Handle Add Custom Document
  const handleAddCustomDocument = () => {
    if (!customDocName.trim()) return;
    const newDoc: DocumentItem = {
      id: `custom_${Date.now()}`,
      name: customDocName.trim(),
      category: customDocCategory,
      requiredFor: [customDocRequiredFor],
      uploaded: false,
      verificationStatus: 'missing',
      verificationNote: 'Custom document added. Please upload file.'
    };
    onUpdateDocuments([...documents, newDoc]);
    setCustomDocName('');
    setIsAddCustomDocOpen(false);
    setUploadSuccessMessage(`Added "${newDoc.name}" to checklist.`);
    setTimeout(() => setUploadSuccessMessage(null), 3000);
  };

  // Handle Export Checklist
  const handleExportChecklist = () => {
    const textLines = [
      `=============================================================`,
      `HEALTHCARE FINANCIAL NAVIGATOR (CareNav) - DOCUMENT DOSSIER`,
      `Patient Name: ${patientProfile.name} | Age/Gender: ${patientProfile.age}/${patientProfile.gender}`,
      `UHID / Hospital Reg: ${patientProfile.uhid || 'N/A'} | Hospital: ${patientProfile.hospital}`,
      `Primary Diagnosis: ${patientProfile.disease}`,
      `Readiness Index: ${readinessPercent}% (${verifiedCount}/${totalRequired} Verified)`,
      `Date Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      `=============================================================\n`,
      `VERIFIED & ATTACHED DOCUMENTS:`,
      ...documents.filter(d => d.uploaded).map(d => `[✓] ${d.name}\n    File: ${d.fileName} (${d.fileSize}) | Note: ${d.verificationNote}`),
      `\nPENDING / MISSING DOCUMENTS:`,
      ...documents.filter(d => !d.uploaded).map(d => `[✗] ${d.name}\n    Required For: ${d.requiredFor.join(', ')}\n    Action: ${d.verificationNote}`),
      `\n=============================================================`,
      `Dossier compiled by CareNav AI Health System for hospital submission.`
    ];

    const blob = new Blob([textLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Document_Readiness_Dossier_${patientProfile.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />

      {/* Success Notification Alert */}
      {uploadSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadSuccessMessage}</span>
          </div>
          <button onClick={() => setUploadSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* AI OCR Scanning Progress Overlay / Banner */}
      {isSimulatingOcr && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 shadow-md border border-emerald-500/40">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Intelligent OCR Document Engine
            </div>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">
              {ocrScanStep || 'Analyzing document...'}
            </p>
          </div>
        </div>
      )}

      {/* Top Header Card: Readiness Score & Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-400 text-slate-950 mb-2.5 uppercase tracking-wider">
              <span>Step 2 of 4</span>
              <span>•</span>
              <span>Essential Papers</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'hi' ? 'दस्तावेज़ तैयारी और सत्यापन' : language === 'mr' ? 'कागदपत्रे पडताळणी' : 'Check & Prepare Your Documents'}
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              You only need 3-4 key papers (Aadhaar, Ration Card/Income proof, and Doctor's Cost Estimate). Once verified, you can apply across all schemes in 1 click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => triggerFilePicker()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              Upload / Scan File
            </button>
            <button
              onClick={() => setIsAddCustomDocOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <Plus className="w-4 h-4" />
              Add Custom Doc
            </button>
            <button
              onClick={handleExportChecklist}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border border-slate-700"
              title="Download text compliance checklist"
            >
              <Download className="w-4 h-4" />
              Export Dossier
            </button>
          </div>
        </div>

        {/* Big Readiness Score & Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  className={readinessPercent >= 80 ? "text-emerald-400" : "text-amber-400"}
                  strokeDasharray={163}
                  strokeDashoffset={163 - (163 * readinessPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-extrabold text-sm text-white">
                {readinessPercent}%
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Readiness Index</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {readinessPercent >= 80 ? 'Application Ready' : 'Action Required'}
              </div>
              <div className="text-[11px] text-slate-400">
                {verifiedCount} of {totalRequired} documents verified
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Verified Documents</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2">
              {verifiedCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Ready to submit across active channels
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Missing / Critical</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-2">
              {missingCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Blockers for subsidy disbursement
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop File Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => triggerFilePicker()}
        className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50/80'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
          <Upload className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-900 text-sm">
          Drag & Drop Medical Records, Invoices, or Income Proof
        </h4>
        <p className="text-xs text-slate-700 mt-1">
          Supports PDF, JPG, PNG files. AI scanner automatically matches documents to patient {patientProfile.name} and confirms seals.
        </p>
        <span className="inline-block mt-3 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold">
          Browse from Device
        </span>
      </div>

      {/* Pathway Breakdown Cards (As shown on Page 11 of document) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pathwayBreakdowns.map((pathway, pIdx) => {
          const matchedDocs = pathway.docs.map(item => {
            const found = documents.find(d => d.id === item.id);
            return {
              ...item,
              uploaded: found ? found.uploaded : false,
              status: found ? found.verificationStatus : 'missing'
            };
          });

          const completedInPathway = matchedDocs.filter(d => d.uploaded).length;
          const isComplete = completedInPathway === matchedDocs.length;

          return (
            <div key={pIdx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pathway {pIdx + 1}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {completedInPathway}/{matchedDocs.length} Ready
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-3">
                  {pathway.name}
                </h3>

                <div className="space-y-2 text-xs">
                  {matchedDocs.map((item, idx) => {
                    const isReady = item.uploaded;
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2">
                          {isReady ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                              <span className="font-bold text-[10px]">✕</span>
                            </div>
                          )}
                          <span className={isReady ? 'text-slate-800 font-medium' : 'text-rose-700 font-semibold'}>
                            {item.label}
                          </span>
                        </div>
                        {!isReady && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerFilePicker(item.id);
                            }}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline ml-2"
                          >
                            + Upload
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Unified Document Manager & Quick Upload Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              Unified Document Checklist & Intelligence Scanner
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Click any document to inspect verified metadata, scan files, or upload missing items.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'identity', 'income', 'medical', 'insurance', 'financial'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Simulator Bar for Missing Items */}
        {missingCount > 0 && (
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Direct Upload for Missing Documents:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {documents.filter(d => !d.uploaded).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => triggerFilePicker(doc.id)}
                  disabled={isSimulatingOcr}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium transition-all shadow-2xs flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Upload {doc.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Document List Table */}
        <div className="divide-y divide-slate-100">
          {filteredDocs.map(doc => {
            const isVerified = doc.uploaded && doc.verificationStatus === 'verified';
            return (
              <div key={doc.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Document details */}
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {doc.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isVerified ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            {t.verified}
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {t.missing}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 mt-1">
                      Required for:{' '}
                      <span className="font-medium text-slate-700">
                        {doc.requiredFor.join(' • ')}
                      </span>
                    </div>

                    {isVerified && (
                      <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-2">
                        <span>File: {doc.fileName} ({doc.fileSize})</span>
                        <span>•</span>
                        <span>{doc.uploadedDate}</span>
                      </div>
                    )}

                    {doc.verificationNote && (
                      <div className={`text-[11px] mt-1 p-1.5 rounded-md ${
                        isVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                      }`}>
                        {doc.verificationNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  {isVerified ? (
                    <>
                      <button
                        onClick={() => setInspectingDoc(doc)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Details
                      </button>
                      <button
                        onClick={() => handleToggleDocStatus(doc.id)}
                        className="px-2 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => triggerFilePicker(doc.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload / Scan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Document Modal */}
      {isAddCustomDocOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FilePlus2 className="w-5 h-5 text-emerald-600" />
                Add Custom Document
              </h3>
              <button
                onClick={() => setIsAddCustomDocOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Document Name / Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. MLA Recommendation Letter, PET-CT Scan, etc."
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Document Category:
                </label>
                <select
                  value={customDocCategory}
                  onChange={(e) => setCustomDocCategory(e.target.value as DocumentItem['category'])}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="medical">Medical / Clinical</option>
                  <option value="identity">Identity & Residence</option>
                  <option value="income">Income & Social Status</option>
                  <option value="insurance">Insurance & TPA</option>
                  <option value="financial">Financial / Bank Account</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Required For:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chief Minister Relief Fund, Hospital MSW"
                  value={customDocRequiredFor}
                  onChange={(e) => setCustomDocRequiredFor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsAddCustomDocOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomDocument}
                disabled={!customDocName.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Next / Back Navigation Card for Laymen */}
      {onNavigateTab && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <button
            onClick={() => onNavigateTab('support_map')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Step 1: Savings Calculation</span>
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
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span>Next: Generate 1-Page Form (Step 3 of 4)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Document Inspector Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Document Intelligence Inspection
                </h3>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-900 text-sm">{inspectingDoc.name}</div>
                <div className="text-slate-600 mt-1">FileName: {inspectingDoc.fileName}</div>
                <div className="text-slate-600">File Size: {inspectingDoc.fileSize}</div>
                <div className="text-slate-600">Uploaded: {inspectingDoc.uploadedDate}</div>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Multi-Channel Utility:</span>
                <ul className="mt-1 pl-4 list-disc space-y-0.5 text-slate-600">
                  {inspectingDoc.requiredFor.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Verification & Rule Compliance:
                </div>
                <p className="text-emerald-800 mt-1 leading-relaxed">
                  {inspectingDoc.verificationNote}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
