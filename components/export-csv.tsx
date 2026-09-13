"use client";

import { Download } from "lucide-react";

interface ExportField {
  id: string;
  label: string;
}

interface ExportRow {
  id: string;
  createdAt: string;
  data: Record<string, string>;
}

function escapeCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export default function ExportCsv({
  title,
  fields,
  rows,
}: {
  title: string;
  fields: ExportField[];
  rows: ExportRow[];
}) {
  function download() {
    const header = ["submitted_at", ...fields.map((f) => f.label)];
    const lines = rows.map((r) => {
      const values = fields.map((f) => r.data[f.id] ?? "");
      return [new Date(r.createdAt).toISOString(), ...values].map(escapeCell).join(",");
    });
    const csv = [header.map(escapeCell).join(","), ...lines].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "form"}-responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={download} className="btn-secondary">
      <Download className="h-4 w-4" /> Export CSV
    </button>
  );
}