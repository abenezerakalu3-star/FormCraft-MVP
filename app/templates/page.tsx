import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { FORM_TEMPLATES } from "@/lib/templates";
import PublicShell from "@/components/public-shell";
import FadeIn from "@/components/motion/fade-in";
import TiltCard from "@/components/motion/tilt-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ArrowRight, LayoutTemplate } from "lucide-react";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Form Templates — ${settings.siteName}`,
    description: `Browse free, ready-to-use form templates for ${settings.siteName}. Contact forms, surveys, registrations, and more.`,
    alternates: { canonical: "/templates" },
  };
}

export default async function TemplatesIndexPage() {
  const settings = await getSiteSettings();

  return (
    <PublicShell settings={settings}>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <FadeIn>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <LayoutTemplate className="h-3.5 w-3.5" /> Template Gallery
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Ready-to-use form templates</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted">
              Stop starting from scratch. Grab one of our pre-built templates for your next project, customize it in seconds, and start collecting responses instantly.
            </p>
          </div>
        </FadeIn>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FORM_TEMPLATES.map((t) => (
            <StaggerItem key={t.key}>
              <Link href={`/templates/${t.key}`} className="group block h-full">
                <TiltCard className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-sm transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-900/5">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {t.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">
                      {t.fields.length} fields
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-transform group-hover:translate-x-1 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </PublicShell>
  );
}
