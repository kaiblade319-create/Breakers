import React from 'react';
import { DocumentItem } from '../../types';
import { FileCheck2, Sparkles, X } from 'lucide-react';

interface DocumentInspectorModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  document: doc,
  onClose
}) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Document Verification Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
            <div className="text-slate-600">File: {doc.fileName || 'Pending upload'}</div>
            {doc.fileSize && <div className="text-slate-600">Size: {doc.fileSize}</div>}
            {doc.uploadedDate && <div className="text-slate-600">Verified on: {doc.uploadedDate}</div>}
          </div>

          <div>
            <span className="font-bold text-slate-800">Accepted By These Counters:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {doc.requiredFor.map((r, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-[11px]"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>OCR & Compliance Verification:</span>
            </div>
            <p className="text-emerald-800 mt-1 leading-relaxed">
              {doc.verificationNote || 'Document scanned successfully. Patient identifier, doctor registration stamp, and date criteria matched.'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
