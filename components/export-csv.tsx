"use client";

import { Download } from "lucide-react";
import {
  escapeCsvCell,
  exportFilename,
  exportHeader,
  exportRowValues,
  ExportField,
  ExportRow,
} from "@/lib/export";

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
    const header = exportHeader(fields);
    const lines = rows.map((r) => exportRowValues(r, fields).map(escapeCsvCell).join(","));
    const csv = [header.map(escapeCsvCell).join(","), ...lines].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename(title)}.csv`;
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