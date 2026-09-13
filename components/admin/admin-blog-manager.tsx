"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/slugify";

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const EMPTY = { title: "", slug: "", excerpt: "", content: "", published: false };

export default function AdminBlogManager({ posts }: { posts: AdminBlogPost[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<{ id: string | null; slugEdited: boolean }>({
    id: null,
    slugEdited: false,
  });
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  function openNew() {
    setForm(EMPTY);
    setEditing({ id: null, slugEdited: false });
    setError("");
  }

  function openPost(p: AdminBlogPost) {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, published: p.published });
    setEditing({ id: p.id, slugEdited: true });
    setError("");
  }

  function setTitle(value: string) {
    setForm((prev) => {
      if (editing.slugEdited) return { ...prev, title: value };
      return { ...prev, title: value, slug: slugify(value) };
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editing.id ? `/api/admin/blog/${editing.id}` : "/api/admin/blog", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save post");
        return;
      }
      setEditing({ id: null, slugEdited: false });
      setForm(EMPTY);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(p: AdminBlogPost) {
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/blog/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, published: !p.published }),
      });
      if (!res.ok) alert("Failed to update post");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(p: AdminBlogPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/blog/${p.id}`, { method: "DELETE" });
      if (!res.ok) alert("Failed to delete post");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const open = editing.id !== null;

  return (
    <div className="animate-fade-up">
      {/* Compose / edit */}
      <div id="new" className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Newspaper className="h-5 w-5 text-indigo-500" />
            {open ? "Edit post" : "Write a new post"}
          </h2>
          <button type="button" onClick={openNew} className="btn-secondary !py-2">
            <Plus className="h-4 w-4" /> New
          </button>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="How to collect better feedback"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                onFocus={() => setEditing((prev) => ({ ...prev, slugEdited: true }))}
                className="input-field font-mono text-xs"
                placeholder="auto-filled"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Excerpt</label>
            <input
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              className="input-field"
              placeholder="One-line summary shown on the blog list (SEO)."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={9}
              className="input-field resize-y"
              placeholder="Write the article here. Blank lines create new paragraphs."
              required
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                className="h-4 w-4 accent-indigo-600"
              />
              Publish immediately
            </label>
            <div className="flex items-center gap-3">
              {error && <span className="text-sm text-red-500">{error}</span>}
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {open ? "Save changes" : "Publish post"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-line p-4">
          <h2 className="text-base font-bold tracking-tight">All posts ({posts.length})</h2>
        </div>
        {posts.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">
            No posts yet — write your first one above.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="truncate text-xs text-muted">
                    /blog/{p.slug} · {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`chip ${
                    p.published
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-gray-100 text-muted dark:bg-gray-100/10"
                  }`}
                >
                  {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {p.published ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => togglePublish(p)}
                    disabled={busy === p.id}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => openPost(p)}
                    disabled={busy === p.id}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:hover:border-indigo-500/50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    disabled={busy === p.id}
                    className="rounded-lg border border-transparent px-2.5 py-1.5 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}