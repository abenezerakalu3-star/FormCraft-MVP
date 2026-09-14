import { randomBytes } from "crypto";
import {
  AlignLeft,
  Calendar,
  ChevronDown,
  Hash,
  ListChecks,
  Mail,
  Paperclip,
  Radio,
  Type,
} from "lucide-react";

export const FIELD_TYPES = [
  { value: "text", label: "Short text", icon: Type },
  { value: "textarea", label: "Paragraph", icon: AlignLeft },
  { value: "email", label: "Email", icon: Mail },
  { value: "number", label: "Number", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
  { value: "select", label: "Dropdown", icon: ChevronDown },
  { value: "radio", label: "Multiple choice", icon: Radio },
  { value: "checkbox", label: "Checkboxes", icon: ListChecks },
  { value: "file", label: "File upload", icon: Paperclip },
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