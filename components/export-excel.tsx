"use client";

import { FileSpreadsheet } from "lucide-react";
import {
  escapeXml,
  exportFilename,
  exportHeader,
  exportRowValues,
  ExportField,
  ExportRow,
} from "@/lib/export";

function cell(value: string) {
  return `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function buildXls(title: string, fields: ExportField[], rows: ExportRow[]) {
  const header = exportHeader(fields);
  const xml =
    '<?xml version="1.0"?>' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
    'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
    'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
    'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
    '<Worksheet ss:Name="Responses">' +
    "<Table>" +
    `<Row>${header.map(cell).join("")}</Row>` +
    rows
      .map((r) => `<Row>${exportRowValues(r, fields).map(cell).join("")}</Row>`)
      .join("") +
    "</Table></Worksheet></Workbook>";
  return xml;
}

export default function ExportExcel({
  title,
  fields,
  rows,
}: {
  title: string;
  fields: ExportField[];
  rows: ExportRow[];
}) {
  function download() {
    const blob = new Blob(["\uFEFF" + buildXls(title, fields, rows)], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename(title)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={download} className="btn-secondary">
      <FileSpreadsheet className="h-4 w-4" /> Export Excel
    </button>
  );
}