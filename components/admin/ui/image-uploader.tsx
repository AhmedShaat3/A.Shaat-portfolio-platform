"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
// ✅ تعديل مهم: تم تصحيح المسار ليتوافق مع ملف التصدير الرئيسي
import type { StorageFolder } from "@/lib/storage";

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

      // ✅ تحسين: استخدام res.json() مباشرة بدلاً من قراءة النص وتحويله
      if (!res.ok) {
        let errorMessage = "Upload failed.";
        try {
          const errorJson = await res.json();
          errorMessage = errorJson.error || errorMessage;
        } catch {
          // إذا لم يكن الرد JSON صالحاً (مثلاً خطأ 413 من السيرفر مباشرة بدون JSON)
          if (res.status === 413) {
            errorMessage = "File size exceeds server limits (4.5MB max on Vercel).";
          }
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
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
            <div className="relative h-40 w-full bg-adm-surface-2">
              <Image src={value} alt="Uploaded" fill className="object-contain" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove file"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
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