"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FIELD_TYPES, newField, splitOptions } from "@/lib/fields";
import type { FieldType } from "@/lib/fields";

interface FieldData {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: string;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  slug: string;
  published: boolean;
  fields: FieldData[];
}

function PreviewControl({ field }: { field: FieldData }) {
  const options = splitOptions(field.options);
  switch (field.type) {
    case "textarea":
      return (
        <div className="mt-2 h-20 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400">
          Long answer text
        </div>
      );
    case "select":
      return (
        <div className="mt-2 flex h-9 items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-400">
          {options[0] || "Select an option"} <span>▾</span>
        </div>
      );
    case "radio":
      return (
        <div className="mt-2 space-y-1.5">
          {(options.length ? options : ["Option 1"]).map((o) => (
            <div key={o} className="flex items-center gap-2 text-sm text-gray-500">
              <span className="h-4 w-4 rounded-full border border-gray-300" /> {o}
            </div>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="mt-2 space-y-1.5">
          {(options.length ? options : ["Option 1"]).map((o) => (
            <div key={o} className="flex items-center gap-2 text-sm text-gray-500">
              <span className="h-4 w-4 rounded border border-gray-300" /> {o}
            </div>
          ))}
        </div>
      );
    case "number":
      return (
        <div className="mt-2 flex h-9 items-center rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-400">
          0
        </div>
      );
    case "date":
      return (
        <div className="mt-2 flex h-9 items-center rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-400">
          MM/DD/YYYY
        </div>
      );
    default:
      return (
        <div className="mt-2 flex h-9 items-center rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-400">
          {field.type === "email" ? "user@example.com" : "Short answer text"}
        </div>
      );
  }
}

export default function FormBuilder({ form }: { form: FormData }) {
  const router = useRouter();
  const [id] = useState(form.id);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [slug] = useState(form.slug);
  const [published, setPublished] = useState(form.published);
  const [fields, setFields] = useState<FieldData[]>(form.fields);
  const [selectedId, setSelectedId] = useState<string | null>(form.fields[0]?.id ?? null);
  const [status, setStatus] = useState<{ message: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  function updateField(idToUpdate: string, patch: Partial<FieldData>) {
    setFields((prev) => prev.map((f) => (f.id === idToUpdate ? { ...f, ...patch } : f)));
  }

  function addField(type: FieldType) {
    const field = newField(type);
    setFields((prev) => [...prev, field]);
    setSelectedId(field.id);
  }

  function removeField(idToRemove: string) {
    setFields((prev) => prev.filter((f) => f.id !== idToRemove));
    if (selectedId === idToRemove) setSelectedId(null);
  }

  function moveField(index: number, dir: -1 | 1) {
    setFields((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function saveFields() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/forms/${id}/fields`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ message: data.error || "Failed to save", error: true });
        return;
      }
      setStatus({ message: "Saved" });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    const next = !published;
    const res = await fetch(`/api/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, published: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus({ message: data.error || "Failed to publish", error: true });
      return;
    }
    setPublished(next);
    setStatus({
      message: next ? "Form is live" : "Form unpublished",
      error: false,
    });
    router.refresh();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/form/${slug}`);
    setStatus({ message: "Link copied!" });
  }

  const showStatus = status && !saving;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black">
          &larr; Dashboard
        </Link>
        <div className="mx-2 h-5 w-px bg-gray-300" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-lg font-semibold outline-none hover:border-gray-200 focus:border-black"
        />
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {published ? "Live" : "Draft"}
        </span>
        <Link
          href={`/dashboard/forms/${id}/submissions`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Responses
        </Link>
        <button
          onClick={saveFields}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={togglePublish}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
            published ? "bg-gray-700 hover:bg-gray-800" : "bg-black hover:bg-gray-800"
          }`}
        >
          {published ? "Unpublish" : "Publish"}
        </button>
        {published && (
          <button
            onClick={copyLink}
            className="rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Copy link
          </button>
        )}
      </div>

      {showStatus && (
        <p className={`mb-4 text-sm ${status.error ? "text-red-600" : "text-emerald-600"}`}>
          {status.message}
        </p>
      )}

      <div className="flex">
        {/* Palette */}
        <aside className="mr-6 w-44 shrink-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Add a field
          </p>
          <div className="space-y-1.5">
            {FIELD_TYPES.map((ft) => (
              <button
                key={ft.value}
                onClick={() => addField(ft.value)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left text-sm font-medium hover:border-black"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs">
                  {ft.icon}
                </span>
                {ft.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 space-y-4">
          {/* Form header card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold outline-none"
              aria-label="Form title"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="mt-1 w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-300"
              aria-label="Form description"
            />
          </div>

          {fields.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
              Add your first field from the left panel.
            </div>
          )}

          {fields.map((field, index) => {
            const isSelected = field.id === selectedId;
            const typeInfo = FIELD_TYPES.find((t) => t.value === field.type)!;
            return (
              <div
                key={field.id}
                onClick={() => setSelectedId(field.id)}
                className={`rounded-2xl border bg-white p-6 shadow-sm transition-colors cursor-pointer ${
                  isSelected ? "border-black" : "border-gray-200"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {typeInfo.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(index, -1);
                      }}
                      disabled={index === 0}
                      className="rounded px-1.5 py-0.5 hover:bg-gray-100 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(index, 1);
                      }}
                      disabled={index === fields.length - 1}
                      className="rounded px-1.5 py-0.5 hover:bg-gray-100 disabled:opacity-30"
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id);
                      }}
                      className="rounded px-1.5 py-0.5 text-red-500 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  className="w-full bg-transparent font-medium outline-none"
                  aria-label="Field label"
                />
                {field.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
                <PreviewControl field={field} />

                {isSelected && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(field.id, { required: e.target.checked })
                        }
                      />
                      Required
                    </label>

                    {(field.type === "select" ||
                      field.type === "radio" ||
                      field.type === "checkbox") && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                          Options (one per line)
                        </label>
                        <textarea
                          value={field.options}
                          onChange={(e) => updateField(field.id, { options: e.target.value })}
                          rows={4}
                          placeholder={"Option 1\nOption 2\nOption 3"}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                        />
                        <p className="mt-1 text-xs text-gray-400">
                          {splitOptions(field.options).length} option
                          {splitOptions(field.options).length === 1 ? "" : "s"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}