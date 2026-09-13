"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Save } from "lucide-react";
import { SiteSettings } from "@/lib/settings";

const FIELDS: { key: keyof SiteSettings; label: string; hint?: string; type?: "text" | "email" | "textarea" }[] = [
  { key: "siteName", label: "Site name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text", hint: "Short description shown near the brand." },
  { key: "heroTitle", label: "Hero headline", type: "text" },
  { key: "heroSubtitle", label: "Hero subheadline", type: "textarea" },
  { key: "heroCta", label: "Primary call-to-action text", type: "text", hint: "e.g. Get started — it's free" },
  { key: "announcement", label: "Announcement bar", type: "textarea", hint: "Shown at the very top of the website. Leave empty to hide it." },
  { key: "footerNote", label: "Footer note", type: "text" },
  { key: "contactEmail", label: "Contact email", type: "email" },
];

export default function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        alert("Failed to save settings");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Website content</h2>
          <p className="mt-1 text-sm text-muted">
            These values are used across the public website. Empty fields fall back to defaults.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saved ? <Check className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="card p-5">
            <label className="mb-1.5 block text-sm font-medium" htmlFor={`s-${f.key}`}>
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={`s-${f.key}`}
                rows={3}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value as never)}
                className="input-field resize-none"
              />
            ) : (
              <input
                id={`s-${f.key}`}
                type={f.type || "text"}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value as never)}
                className="input-field"
              />
            )}
            {f.hint && <p className="mt-1.5 text-xs text-gray-400">{f.hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}