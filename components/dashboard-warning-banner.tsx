"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function DashboardWarningBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-center dark:border-amber-500/30 dark:bg-amber-500/10">
      <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Warning: {message}
      </p>
      <button
        type="button"
        title="Dismiss this banner for now"
        onClick={() => setVisible(false)}
        className="ml-3 text-xs font-semibold text-amber-700/70 transition-colors hover:text-amber-800 dark:text-amber-400/80"
      >
        Dismiss
      </button>
    </div>
  );
}