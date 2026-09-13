import { randomBytes } from "crypto";

export const FIELD_TYPES = [
  { value: "text", label: "Short text", icon: "Aa" },
  { value: "textarea", label: "Paragraph", icon: "☰" },
  { value: "email", label: "Email", icon: "@" },
  { value: "number", label: "Number", icon: "#" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "select", label: "Dropdown", icon: "▾" },
  { value: "radio", label: "Multiple choice", icon: "◉" },
  { value: "checkbox", label: "Checkboxes", icon: "☑" },
] as const;

export type FieldType = (typeof FIELD_TYPES)[number]["value"];

export function newFieldId() {
  return randomBytes(8).toString("hex");
}

export function newSlug() {
  return randomBytes(4).toString("hex");
}

export function newField(type: FieldType): {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options: string;
} {
  return { id: newFieldId(), type, label: "Untitled question", required: false, options: "" };
}

export function splitOptions(raw: string): string[] {
  return raw
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);
}