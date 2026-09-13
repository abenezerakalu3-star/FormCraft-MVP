"use client";

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { FileText } from "lucide-react";
import {
  exportFilename,
  exportHeader,
  exportRowValues,
  ExportField,
  ExportRow,
} from "@/lib/export";

export default function ExportPdf({
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
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.text(title, 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      `${rows.length} response${rows.length === 1 ? "" : "s"} · generated ${new Date().toLocaleString()}`,
      14,
      22
    );

    autoTable(doc, {
      startY: 27,
      head: [header],
      body: rows.map((r) => exportRowValues(r, fields)),
      styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 246, 248] },
    });

    doc.save(`${exportFilename(title)}.pdf`);
  }

  return (
    <button onClick={download} className="btn-secondary">
      <FileText className="h-4 w-4" /> Export PDF
    </button>
  );
}