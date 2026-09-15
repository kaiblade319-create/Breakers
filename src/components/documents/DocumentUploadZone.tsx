import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface DocumentUploadZoneProps {
  onFileDrop: (file: File) => void;
  onTriggerPicker: () => void;
  isSimulatingOcr: boolean;
  ocrScanStep: string;
  uploadSuccessMessage: string | null;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  onFileDrop,
  onTriggerPicker,
  isSimulatingOcr,
  ocrScanStep,
  uploadSuccessMessage
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileDrop(file);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
        isDragOver
          ? 'border-emerald-500 bg-emerald-50/50'
          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
      }`}
    >
      {isSimulatingOcr ? (
        <div className="py-4 flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-emerald-700 animate-spin" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Simulated Document OCR in Progress</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              {ocrScanStep}
            </p>
          </div>
        </div>
      ) : uploadSuccessMessage ? (
        <div className="py-4 flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-emerald-900">
            {uploadSuccessMessage}
          </div>
          <button
            onClick={onTriggerPicker}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Upload another file
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center mx-auto shadow-2xs">
            <Upload className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900">
              Drag & Drop your Aadhaar, Ration Card, or Doctor Estimate
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports PDF, PNG, JPG (up to 15MB). We verify name, UHID, and doctor estimate codes automatically.
            </p>
          </div>
          <button
            onClick={onTriggerPicker}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Browse Computer / Phone</span>
          </button>
        </div>
      )}
    </div>
  );
};
