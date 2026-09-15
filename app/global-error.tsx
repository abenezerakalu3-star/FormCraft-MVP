"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        style={{
          fontFamily:
            "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          background: "#f5f6f8",
          color: "#0b0c0e",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 448,
              borderRadius: 16,
              border: "1px solid #e4e7ec",
              background: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              padding: "56px 32px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                height: 64,
                width: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                background: "#f5f6f8",
                border: "1px solid #e4e7ec",
              }}
            >
              <TriangleAlert style={{ height: 32, width: 32, color: "#4f46e5" }} />
            </span>
            <p
              style={{
                marginTop: 24,
                fontSize: 60,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              500
            </p>
            <h1 style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>
              Something went wrong
            </h1>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1.6,
                color: "#667085",
              }}
            >
              A critical error occurred. Try again, or go back to the home page.
            </p>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={reset}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: "#0b0c0e",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1px solid #e4e7ec",
                  background: "#ffffff",
                  color: "#0b0c0e",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}