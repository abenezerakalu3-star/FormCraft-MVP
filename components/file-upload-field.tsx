"use client";

import { useRef, useState } from "react";
import { FileCheck2, FileUp, Loader2, X } from "lucide-react";
import { formatBytes, IMAGE_MIMES, parseFileValue } from "@/lib/files";

export default function FileUploadField({
  required,
  value,
  onChange,
}: {
  required: boolean;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const file = value ? parseFileValue(value) : null;

  async function handleFile(selected: File) {
    if (!selected) return;
    setUploadError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", selected);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }
      onChange(JSON.stringify(data));
    } catch {
      setUploadError("Upload failed — please try again");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (file) {
    const isImage = IMAGE_MIMES.includes(file.mime);
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          {isImage && file.url.startsWith("/uploads/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.url}
              alt={file.name}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            >
              {file.name}
            </a>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
              {formatBytes(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            title="Remove file"
            className="rounded-lg p-1.5 text-emerald-700/70 transition-colors hover:bg-emerald-100 hover:text-emerald-800 dark:text-emerald-300/70 dark:hover:bg-emerald-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-7 text-sm font-medium transition-colors disabled:opacity-60 ${
          uploadError
            ? "border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10"
            : "border-gray-300 bg-gray-50 text-gray-500 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-100/5 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <FileUp className="h-5 w-5" />
            <span>
              {uploadError ? uploadError : "Click to upload"}
              {!uploadError && (
                <span className="mt-0.5 block text-xs font-normal opacity-70">
                  Images, PDF, docs, spreadsheets · up to 10 MB
                </span>
              )}
            </span>
          </>
        )}
      </button>
      {uploadError && (
        <p className="mt-2 text-xs text-red-500">{uploadError} — tap to try again.</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.gif,.webp,.svg,.avif,.bmp,.ico,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx,.zip"
        required={required && !value}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}