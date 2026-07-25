'use client';

import React, { useState } from 'react';
import { ProfileDocument } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Trash2, Eye, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentCenterProps {
  initialDocuments: ProfileDocument[];
  onUpload?: (title: string, type: string, file: File) => Promise<ProfileDocument>;
  onDelete?: (title: string) => Promise<void>;
  className?: string;
}

export function DocumentCenter({ initialDocuments, onUpload, onDelete, className }: DocumentCenterProps) {
  const [docs, setDocs] = useState<ProfileDocument[]>(initialDocuments);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const docTypes = [
    { type: 'Identity', label: 'Identity Proof', desc: 'Passport, Driver License, State ID.' },
    { type: 'Medical', label: 'Medical Fitness Certificate', desc: 'Sanctioned physical form signed by physician.' },
    { type: 'Age', label: 'Age Declaration Proof', desc: 'Birth certificate, school declaration stamp.' },
    { type: 'Club', label: 'Club Affiliation Certificate', desc: 'Valid membership registry verification document.' },
    { type: 'Consent', label: 'Consent Liability Waiver Form', desc: 'Signed tournament liability & drug-free declarations.' }
  ];

  const handleFileUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    // Mock upload timing
    setTimeout(() => {
      const newDoc: ProfileDocument = {
        title: file.name,
        type,
        url: '#',
        verified: false
      };
      setDocs(prev => {
        const filtered = prev.filter(d => d.type !== type);
        return [...filtered, newDoc];
      });
      setUploadingType(null);
      if (onUpload) onUpload(file.name, type, file);
    }, 1500);
  };

  const handleRemove = (type: string) => {
    const check = confirm('Are you sure you want to delete this document proof? You might need to re-verify for tournaments.');
    if (!check) return;

    const documentToRemove = docs.find(d => d.type === type);
    setDocs(prev => prev.filter(d => d.type !== type));
    if (onDelete && documentToRemove) {
      onDelete(documentToRemove.title);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4">
        {docTypes.map((item) => {
          const activeDoc = docs.find(d => d.type === item.type);
          const isUploading = uploadingType === item.type;

          return (
            <WidgetContainer
              key={item.type}
              className={cn(
                'p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-all',
                activeDoc?.verified
                  ? 'border-emerald-500/10 bg-emerald-500/5'
                  : activeDoc
                  ? 'border-amber-500/10 bg-amber-500/5'
                  : 'border-white/5 bg-black/15'
              )}
            >
              {/* Document info */}
              <div className="flex items-start gap-3 min-w-0">
                <div className={cn(
                  'p-2.5 rounded-xl border flex-shrink-0 mt-0.5',
                  activeDoc?.verified
                    ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                    : activeDoc
                    ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                    : 'bg-white/5 border-white/5 text-muted-foreground'
                )}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5 flex-wrap">
                    {item.label}
                    {activeDoc?.verified ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    ) : activeDoc ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400">
                        <AlertCircle className="w-2.5 h-2.5" /> Pending Verification
                      </span>
                    ) : null}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {activeDoc ? `Uploaded file: ${activeDoc.title}` : item.desc}
                  </p>
                </div>
              </div>

              {/* Actions controls */}
              <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
                {isUploading ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-1.5 px-3">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                    Uploading...
                  </div>
                ) : activeDoc ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Simulating viewing of document: ${activeDoc.title}`)}
                      className="border-white/10 text-xs gap-1 h-8 rounded-xl"
                    >
                      <Eye className="w-3.5 h-3.5 text-violet-400" />
                      Preview
                    </Button>
                    <label className="border border-white/10 hover:bg-white/5 text-xs gap-1 h-8 rounded-xl px-3 inline-flex items-center justify-center cursor-pointer transition-colors text-foreground">
                      <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
                      Replace
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(item.type, e)}
                        className="hidden"
                      />
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(item.type)}
                      className="border-red-500/20 hover:bg-red-500/10 text-xs gap-1 h-8 rounded-xl text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                ) : (
                  <label className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs h-8 px-3 rounded-xl gap-1 inline-flex items-center justify-center cursor-pointer shadow-lg shadow-violet-500/20 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(item.type, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </WidgetContainer>
          );
        })}
      </div>
    </div>
  );
}
