"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, Briefcase, ClipboardList, MessageSquare, Rocket, Sparkles, X } from "lucide-react";

const QUICK_STARTS = [
  { label: "Feedback form", icon: MessageSquare, title: "Customer Feedback" },
  { label: "Survey", icon: BarChart3, title: "Quick Survey" },
  { label: "Contact form", icon: ClipboardList, title: "Contact Us" },
  { label: "Job application", icon: Briefcase, title: "Job Application" },
];

export default function OnboardingModal() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    triggerRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setClosing(true);
        void fetch("/api/user/onboarding", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true }),
        })
          .catch(() => {})
          .then(() => {
            router.refresh();
            setOpen(false);
          });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  async function finish() {
    try {
      await fetch("/api/user/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
    } finally {
      router.refresh();
    }
  }

  async function close() {
    setClosing(true);
    await finish();
    setOpen(false);
  }

  function startFromTemplate(template?: (typeof QUICK_STARTS)[number]) {
    router.push(
      template ? `/dashboard/forms/new?title=${encodeURIComponent(template.title)}` : "/dashboard/forms/new"
    );
    finish();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to Formitect"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={triggerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Welcome to Formitect"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl outline-none"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-1.5 bg-accent" />
            <div className="p-6 sm:p-8">
              {step === 0 && (
                <div className="animate-fade-in">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Welcome to Formitect!</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Build beautiful forms, share them anywhere, and collect responses — all in about a
                    minute. Let&apos;s set you up.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="btn-primary mt-6 w-full"
                  >
                    Get started <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold tracking-tight">What will you create first?</h2>
                  <p className="mt-2 text-sm text-muted">
                    Pick a starting point — you can always change everything later.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {QUICK_STARTS.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => startFromTemplate(t)}
                        className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-3 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <t.icon className="h-4 w-4" />
                        </span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => startFromTemplate()}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-indigo-300 hover:text-foreground"
                  >
                    <Rocket className="h-4 w-4" /> Start from a blank form
                  </button>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {[0, 1].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        step === i ? "w-5 bg-indigo-500" : "w-1.5 bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={close}
                  disabled={closing}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-50"
                >
                  <X className="h-4 w-4" /> {step === 0 ? "Skip for now" : "Not now"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}