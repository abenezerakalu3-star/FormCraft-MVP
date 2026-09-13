"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400 active:scale-95"
      title="Copy share link"
      onClick={async () => {
        await navigator.clipboard.writeText(
          `${window.location.origin}/form/${slug}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}