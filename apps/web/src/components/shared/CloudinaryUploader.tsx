'use client';

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { CloudinaryFolder } from '@/lib/storage/CloudinaryService';
import { cn } from '@/lib/utils';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface CloudinaryUploaderProps {
  folder: CloudinaryFolder;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  className?: string;
  aspectRatio?: 'square' | 'banner' | 'portrait' | 'free';
  maxSizeMB?: number;
}

export function CloudinaryUploader({
  folder,
  value,
  onChange,
  accept = 'image/*',
  label = 'Upload Image',
  className,
  aspectRatio = 'free',
  maxSizeMB = 5,
}: CloudinaryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value || null);

  const aspectClasses: Record<string, string> = {
    square: 'aspect-square',
    banner: 'aspect-[3/1]',
    portrait: 'aspect-[3/4]',
    free: 'min-h-[120px]',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be under ${maxSizeMB}MB`);
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 200);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success('Uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      setPreview(value || null);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed border-white/20 rounded-lg cursor-pointer',
          'hover:border-violet-400/50 transition-colors overflow-hidden',
          aspectClasses[aspectRatio],
          uploading && 'pointer-events-none',
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span className="text-xs text-white font-medium">Click to replace</span>
              <button
                onClick={handleRemove}
                className="p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-violet-400 mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            )}
            <p className="text-sm font-medium text-muted-foreground">
              {uploading ? 'Uploading...' : label}
            </p>
            {!uploading && (
              <p className="text-xs text-muted-foreground/60 mt-1">
                Max {maxSizeMB}MB
              </p>
            )}
          </div>
        )}

        {/* Progress bar */}
        {uploading && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-violet-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
