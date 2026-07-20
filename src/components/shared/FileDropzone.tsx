"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, FileJson, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/json",
];

const MAX_SIZE = 10 * 1024 * 1024;

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

export function FileDropzone({ onFileSelect, file, onClear }: FileDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(csv|xlsx|xls|json)$/i)) {
      return "Invalid file type. Accepted: CSV, XLSX, XLS, JSON";
    }
    if (f.size > MAX_SIZE) {
      return "File size must be under 10MB";
    }
    return null;
  }, []);

  function handleFile(f: File) {
    const error = validate(f);
    if (error) {
      alert(error);
      return;
    }
    onFileSelect(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function formatSize(bytes: number) {
    if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  if (file) {
    const isSpreadsheet = file.name.match(/\.(csv|xlsx|xls)$/i);
    return (
      <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
            {isSpreadsheet ? <FileSpreadsheet className="size-6" /> : <FileJson className="size-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={onClear}
            className="flex size-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors",
        dragOver
          ? "border-emerald-500 bg-emerald-500/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30"
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Upload className="size-6 text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium">
        <span className="text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag and drop
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        CSV, XLSX, XLS or JSON (max 10MB)
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
