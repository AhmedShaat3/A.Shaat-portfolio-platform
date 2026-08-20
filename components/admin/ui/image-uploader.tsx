"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import type { StorageFolder } from "@/lib/storage";

// Define the expected API response type for better type safety
interface UploadResponse {
  media: { url: string };
  error?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder,
  accept = "image/*",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: StorageFolder;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPdf = value?.toLowerCase().endsWith(".pdf");

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/media", { method: "POST", body: formData });
      
      // 1. Try to parse JSON safely
      let data: UploadResponse | null = null;
      try {
        data = await res.json();
      } catch {
        // If JSON parsing fails, handle it in the error flow below
      }

      // 2. Handle HTTP errors
      if (!res.ok) {
        let errorMessage = data?.error || `Upload failed (Status: ${res.status})`;
        if (res.status === 413) {
          errorMessage = "File size exceeds server limits (4.5MB max on Vercel).";
        }
        throw new Error(errorMessage);
      }

      // 3. Validate the successful response structure
      if (!data?.media?.url) {
        throw new Error("Invalid server response: Missing media URL.");
      }

      onChange(data.media.url);
      toast.success("File uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-adm-border">
          {isPdf ? (
            <div className="flex items-center gap-2 bg-adm-surface-2 p-4 text-sm text-adm-text">
              <FileText size={18} /> PDF uploaded
            </div>
          ) : (
           <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-adm-surface-2">
             <img src={value} alt="Uploaded" className="h-full w-full object-contain" />
           </div>
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove file"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm transition-colors ${
            dragOver
              ? "border-adm-accent bg-adm-accent-soft"
              : "border-adm-border text-adm-text-muted hover:border-adm-accent"
          }`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <UploadCloud size={20} />
          )}
          {uploading ? "Uploading..." : "Click or drag a file here"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}