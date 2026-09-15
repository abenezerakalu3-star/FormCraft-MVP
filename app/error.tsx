"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-foreground">
      <div className="card animate-fade-up flex w-full max-w-md flex-col items-center px-8 py-14 text-center sm:px-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas ring-1 ring-line">
          <TriangleAlert className="h-8 w-8 text-accent" />
        </span>
        <p className="mt-6 text-6xl font-black tracking-tight">500</p>
        <h1 className="mt-3 text-xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          An unexpected error occurred while loading this page. Try again, or go
          back to the home page.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary flex-1">
            Try again
          </button>
          <Link href="/" className="btn-secondary flex-1">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}