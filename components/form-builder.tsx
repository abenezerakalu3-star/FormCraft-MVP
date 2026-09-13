"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  Copy,
  Link2,
  MousePointerClick,
  Rocket,
  Save,
  Trash2,
} from "lucide-react";
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
        <div className="mt-2 h-20 cursor-not-allowed rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-100/10">
          Long answer text
        </div>
      );
    case "select":
      return (
        <div className="mt-2 flex h-9 cursor-not-allowed items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-100/10 dark:border-gray-600 dark:bg-gray-100/10">
          {options[0] || "Select an option"} <ChevronDown className="h-4 w-4" />
        </div>
      );
    case "radio":
      return (
        <div className="mt-2 space-y-1.5">
          {(options.length ? options : ["Option 1"]).map((o) => (
            <div key={o} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-4 w-4 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" /> {o}
            </div>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="mt-2 space-y-1.5">
          {(options.length ? options : ["Option 1"]).map((o) => (
            <div key={o} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-4 w-4 rounded border-2 border-dashed border-gray-300 dark:border-gray-600" /> {o}
            </div>
          ))}
        </div>
      );
    case "number":
      return (
        <div className="mt-2 flex h-9 cursor-not-allowed items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-100/10">
          0
        </div>
      );
    case "date":
      return (
        <div className="mt-2 flex h-9 cursor-not-allowed items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-100/10">
          MM/DD/YYYY
        </div>
      );
    default:
      return (
        <div className="mt-2 flex h-9 cursor-not-allowed items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-100/10">
          {field.type === "email" ? "user@example.com" : "Short answer text"}
        </div>
      );
  }
}

export default function FormBuilder({ form }: { form: FormData }) {
  const router = useRouter();
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [published, setPublished] = useState(form.published);
  const [fields, setFields] = useState<FieldData[]>(form.fields);
  const [dirty, setDirty] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(form.fields[0]?.id ?? null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const selected = fields.find((f) => f.id === selectedId);
  const selectedIdx = selected ? fields.findIndex((f) => f.id === selectedId) : -1;

  function notify(msg: string, error = false) {
    setToast({ msg, error });
    window.setTimeout(() => setToast(null), 2600);
  }

  function updateField(idToUpdate: string, patch: Partial<FieldData>) {
    setFields((prev) => prev.map((f) => (f.id === idToUpdate ? { ...f, ...patch } : f)));
    setDirty(true);
  }

  function updateMeta(fn: () => void) {
    fn();
    setDirty(true);
  }

  function addField(type: FieldType) {
    const field = newField(type);
    setFields((prev) => [...prev, field]);
    setSelectedId(field.id);
    setDirty(true);
  }

  function duplicateField(idToDup: string) {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === idToDup);
      if (idx === -1) return prev;
      const copy = {
        ...prev[idx],
        id: `${prev[idx].id}-${Math.random().toString(36).slice(2, 7)}`,
        label: `${prev[idx].label} (copy)`,
      };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setDirty(true);
  }

  function removeField(idToRemove: string) {
    setFields((prev) => prev.filter((f) => f.id !== idToRemove));
    if (selectedId === idToRemove) setSelectedId(null);
    setDirty(true);
  }

  function moveField(from: number, to: number) {
    setFields((prev) => {
      const next = [...prev];
      if (to < 0 || to >= next.length) return prev;
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDirty(true);
  }

  function handleDrop(from: number, to: number) {
    setDragIndex(null);
    setOverIndex(null);
    moveField(from, to);
  }

  async function saveFields() {
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}/fields`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      const data = await res.json();
      if (!res.ok) return notify(data.error || "Failed to save", true);
      setDirty(false);
      notify("Saved ✓");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, published: !published }),
      });
      const data = await res.json();
      if (!res.ok) return notify(data.error || "Failed to publish", true);
      setPublished(!published);
      notify(!published ? "Form published — share it!" : "Form unpublished");
      router.refresh();
    } finally {
      setPublishing(false);
    }
  }

  function handleCopy() {
    navigator.clipboard
      .writeText(`${window.location.origin}/form/${form.slug}`)
      .then(() => notify("Link copied!"));
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 mb-6 -mx-2 flex flex-wrap items-center gap-2 border-b border-line bg-canvas/95 px-2 py-3 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-200/70 hover:text-foreground dark:hover:bg-gray-100/10">
          <ArrowLeft className="h-4 w-4" /> Forms
        </Link>
        <div className="mx-1 h-5 w-px bg-line" />
        <span className="max-w-[10rem] truncate rounded-lg px-2 py-1 text-sm font-semibold">{title}</span>

        <span className="mx-2 h-5 w-px bg-line" />

        <Link
          href={`/dashboard/forms/${form.id}/submissions`}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-200/70 hover:text-foreground dark:hover:bg-gray-100/10"
        >
          Responses
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {dirty && !saving && (
            <span className="chip bg-amber-500/10 text-amber-600 dark:text-amber-400">Unsaved changes</span>
          )}
          {published ? (
            <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
            </span>
          ) : (
            <span className="chip bg-gray-100 text-muted dark:bg-gray-100/10">Draft</span>
          )}
          <button onClick={saveFields} disabled={!dirty || saving} className="btn-primary !py-2 disabled:opacity-40">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={togglePublish}
            disabled={publishing}
            className={published ? "btn-primary !py-2 !bg-gray-700 hover:!bg-gray-800 dark:!bg-gray-400" : "btn-primary !py-2"}
          >
            <Rocket className="h-4 w-4" /> {published ? "Unpublish" : "Publish"}
          </button>
          {published && (
            <button onClick={handleCopy} className="btn-secondary !py-2">
              <Link2 className="h-4 w-4" /> Copy link
            </button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-6">
        {/* Palette */}
        <aside className="sticky top-36 w-48 shrink-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Add a field
          </p>
          <div className="space-y-1.5">
            {FIELD_TYPES.map((ft) => {
              const Icon = ft.icon;
              return (
                <button
                  key={ft.value}
                  onClick={() => addField(ft.value)}
                  className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-left text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  {ft.label}
                </button>
              );
            })}
          </div>
          <p className="mt-6 rounded-xl border border-dashed border-line p-3 text-xs leading-relaxed text-gray-400">
            Tip: drag any field card to reorder it on the canvas.
          </p>
        </aside>

        {/* Canvas */}
        <div className="min-w-0 flex-1 space-y-4">
          <div className="card overflow-hidden animate-fade-in">
            <div className="h-1.5 bg-accent" />
            <div className="p-6">
              <input
                value={title}
                onChange={(e) => updateMeta(() => setTitle(e.target.value))}
                className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none placeholder:text-gray-300"
                aria-label="Form title"
              />
              <input
                value={description}
                onChange={(e) => updateMeta(() => setDescription(e.target.value))}
                placeholder="Add a description (optional)"
                className="mt-1 w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-300"
                aria-label="Form description"
              />
              <p className="mt-3 text-xs text-gray-400">
                {fields.length} field{fields.length === 1 ? "" : "s"} · {fields.filter((f) => f.required).length} required
              </p>
            </div>
          </div>

          {fields.length === 0 && (
            <div className="card border-dashed p-12 text-center text-sm text-gray-400 animate-fade-in">
              <div className="mb-3 flex justify-center">
                <MousePointerClick className="h-7 w-7 text-gray-400" />
              </div>
              Add your first field from the left panel.
            </div>
          )}

          {fields.map((field, index) => {
            const isSelected = field.id === selectedId;
            const typeInfo = FIELD_TYPES.find((t) => t.value === field.type)!;
            const isOver = overIndex === index && dragIndex !== index;

            return (
              <div
                key={field.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (overIndex !== index) setOverIndex(index);
                }}
                onDrop={() => handleDrop(dragIndex!, index)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onClick={() => setSelectedId(field.id)}
                className={`group card cursor-pointer p-6 transition-all duration-200 animate-fade-up ${
                  isSelected
                    ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg shadow-indigo-900/5"
                    : "hover:-translate-y-0.5 hover:shadow-md"
                } ${isOver ? "scale-[1.01] border-indigo-400 ring-4 ring-indigo-400/20" : ""} ${
                  dragIndex === index ? "opacity-40" : ""
                }`}
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {typeInfo.label}
                  </span>
                  {field.required && (
                    <span className="chip bg-red-500/10 text-red-600 dark:text-red-400">Required</span>
                  )}
                  <div
                    className={`ml-auto flex items-center gap-0.5 transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(index, index - 1);
                      }}
                      disabled={index === 0}
                      title="Move up"
                      className="rounded-lg px-2 py-1.5 text-gray-400 hover:bg-gray-100 hover:text-foreground disabled:opacity-30 dark:hover:bg-gray-100/10"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(index, index + 1);
                      }}
                      disabled={index === fields.length - 1}
                      title="Move down"
                      className="rounded-lg px-2 py-1.5 text-gray-400 hover:bg-gray-100 hover:text-foreground disabled:opacity-30 dark:hover:bg-gray-100/10"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateField(field.id);
                      }}
                      title="Duplicate"
                      className="rounded-lg px-2 py-1.5 text-gray-400 hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-100/10"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id);
                      }}
                      title="Delete"
                      className="rounded-lg px-2 py-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="w-full bg-transparent font-medium outline-none"
                    aria-label="Field label"
                  />
                  {isSelected && <span className="mt-0.5 shrink-0 text-xs font-semibold text-indigo-500">Editing…</span>}
                </div>
                <PreviewControl field={field} />
              </div>
            );
          })}
        </div>

        {/* Inspector */}
        <aside className="sticky top-36 w-64 shrink-0">
          <div className="card p-5">
            {selected ? (
              <div key={selected.id} className="animate-scale-in">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Field settings
                  </p>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-xs font-medium text-gray-400 hover:text-foreground"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <span className="chip bg-indigo-50 text-indigo-600">
                    {FIELD_TYPES.find((t) => t.value === selected.type)?.label}
                  </span>
                  <span className="text-xs text-gray-400">Field {selectedIdx + 1}</span>
                </div>

                <label className="mb-1.5 block text-sm font-medium">Label</label>
                <input
                  value={selected.label}
                  onChange={(e) => updateField(selected.id, { label: e.target.value })}
                  className="input-field"
                />

                <label className="mt-4 mb-1.5 block text-sm font-medium">Required</label>
                <button
                  onClick={() => updateField(selected.id, { required: !selected.required })}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    selected.required
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-line bg-white text-muted hover:border-gray-300"
                  }`}
                >
                  <span>{selected.required ? "Required" : "Optional"}</span>
                  <span
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      selected.required ? "bg-indigo-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                        selected.required ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>

                {(selected.type === "select" ||
                  selected.type === "radio" ||
                  selected.type === "checkbox") && (
                  <div>
                    <label className="mt-4 mb-1.5 block text-sm font-medium">
                      Options <span className="font-normal text-gray-400">(one per line)</span>
                    </label>
                    <textarea
                      value={selected.options}
                      onChange={(e) => updateField(selected.id, { options: e.target.value })}
                      rows={4}
                      placeholder={"Option 1\nOption 2\nOption 3"}
                      className="input-field resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      {splitOptions(selected.options).length} option
                      {splitOptions(selected.options).length === 1 ? "" : "s"}
                    </p>
                  </div>
                )}

                <div className="mt-5 border-t border-line pt-4">
                  <button
                    onClick={() => duplicateField(selected.id)}
                    className="btn-secondary w-full"
                  >
                    <Copy className="h-4 w-4" /> Duplicate field
                  </button>
                  <button
                    onClick={() => removeField(selected.id)}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98] dark:border-red-500/40 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" /> Delete field
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-sm text-gray-400">
                <div className="mb-2 flex justify-center">
                  <MousePointerClick className="h-6 w-6" />
                </div>
                Select a field to edit its settings.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-scale-in rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${
            toast.error ? "bg-red-600" : "bg-foreground"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}