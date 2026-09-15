import React from 'react';
import { DocumentItem } from '../../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Upload, 
  Eye, 
  Trash2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface DocumentItemRowProps {
  document: DocumentItem;
  onInspect: (doc: DocumentItem) => void;
  onTriggerUpload: (docId: string) => void;
  onQuickVerify: (docId: string) => void;
  onRemove: (docId: string) => void;
}

export const DocumentItemRow: React.FC<DocumentItemRowProps> = ({
  document: doc,
  onInspect,
  onTriggerUpload,
  onQuickVerify,
  onRemove
}) => {
  const isVerified = doc.uploaded && doc.verificationStatus === 'verified';
  const isPending = doc.uploaded && doc.verificationStatus === 'pending';

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isVerified 
        ? 'bg-white border-emerald-200 hover:border-emerald-300' 
        : isPending
        ? 'bg-amber-50/40 border-amber-200'
        : 'bg-white border-slate-200 hover:border-slate-300'
    } shadow-2xs`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Status Icon & Details */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="mt-0.5 shrink-0">
            {isVerified ? (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            ) : isPending ? (
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 break-words">
                {doc.name}
              </span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-3 h-3" />
                  Pending Review
                </span>
              )}
              {!doc.uploaded && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Required
                </span>
              )}
            </div>

            {/* Where this document is accepted */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-500 font-medium">Needed by:</span>
              {doc.requiredFor.map((scheme, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                >
                  {scheme}
                </span>
              ))}
            </div>

            {/* OCR snippet if verified */}
            {doc.verificationNote && isVerified && (
              <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{doc.verificationNote}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-start sm:justify-end flex-wrap">
          {doc.uploaded ? (
            <>
              <button
                onClick={() => onInspect(doc)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                onClick={() => onRemove(doc.id)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Remove Document"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onQuickVerify(doc.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                1-Click Sample
              </button>

              <button
                onClick={() => onTriggerUpload(doc.id)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
