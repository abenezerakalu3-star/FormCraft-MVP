"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push(`/dashboard/forms/${data.form.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-16">
      <h1 className="mb-1 text-2xl font-bold">Create a new form</h1>
      <p className="mb-6 text-sm text-gray-500">Give your form a name — you can change it later.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoFocus
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Customer Feedback"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create form"}
        </button>
      </form>
    </div>
  );
}