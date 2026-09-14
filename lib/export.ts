import { formatFileCell, isFileValue } from "@/lib/files";

export interface ExportField {
  id: string;
  label: string;
}

export interface ExportRow {
  id: string;
  createdAt: string;
  data: Record<string, string>;
}

export function exportFilename(title: string) {
  const base = title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return (base || "form") + "-responses";
}

export function exportHeader(fields: ExportField[]) {
  return ["submitted_at", ...fields.map((f) => f.label)];
}

export function exportRowValues(r: ExportRow, fields: ExportField[]) {
  return [
    new Date(r.createdAt).toISOString(),
    ...fields.map((f) => {
      const v = r.data[f.id];
      if (v === undefined || v === null) return "";
      return isFileValue(v) ? formatFileCell(v) : v;
    }),
  ];
}

export function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}