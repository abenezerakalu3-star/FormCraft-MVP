import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";
import { FORM_TEMPLATES } from "@/lib/templates";
import PublicShell from "@/components/public-shell";
import FadeIn from "@/components/motion/fade-in";
import { ArrowRight, CheckCircle2, ChevronLeft, Type, AlignLeft, Mail, Hash, List, CheckSquare, Calendar, File } from "lucide-react";

export async function generateStaticParams() {
  return FORM_TEMPLATES.map((t) => ({ slug: t.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = FORM_TEMPLATES.find((t) => t.key === slug);
  if (!template) return { title: "Template not found" };
  
  const settings = await getSiteSettings();
  return {
    title: `${template.title} Template — ${settings.siteName}`,
    description: `Free ${template.title.toLowerCase()} form template. ${template.description} Customize and share in minutes.`,
    alternates: { canonical: `/templates/${slug}` },
  };
}

const ICONS: Record<string, any> = {
  text: Type,
  textarea: AlignLeft,
  email: Mail,
  number: Hash,
  select: List,
  radio: CheckCircle2,
  checkbox: CheckSquare,
  date: Calendar,
  file: File,
};

export default async function TemplateLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = FORM_TEMPLATES.find((t) => t.key === slug);
  if (!template) notFound();

  const settings = await getSiteSettings();

  return (
    <PublicShell settings={settings}>
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <Link href="/templates" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-10">
          <ChevronLeft className="h-4 w-4" /> Back to templates
        </Link>
        
        <div className="grid gap-12 md:grid-cols-[1fr_400px]">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{template.title} Template</h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              {template.description} Use this free template to get started instantly with {settings.siteName}. You can customize all the fields, add your own branding, and share it with your audience in just a few clicks.
            </p>
            
            <div className="mt-10">
              <h2 className="text-lg font-bold tracking-tight mb-4">What's included in this template?</h2>
              <ul className="space-y-3">
                {template.fields.map((f, i) => {
                  const Icon = ICONS[f.type] || Type;
                  return (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-canvas text-muted">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{f.label}</p>
                      </div>
                      {f.required && (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                          Required
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="mt-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 p-8 text-center border border-indigo-100 dark:border-indigo-500/20">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Build your {template.title.toLowerCase()} now</h3>
              <p className="mt-2 text-indigo-700/80 dark:text-indigo-200/80 mb-6">
                No credit card required. Free forever.
              </p>
              <Link href="/register" className="btn-primary shadow-lg shadow-indigo-500/20">
                Use this template <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2} className="hidden md:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6 shadow-xl shadow-black/5">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-1">{template.title}</h3>
              <p className="text-xs text-muted text-center mb-8">formitect.vercel.app</p>
              
              <div className="space-y-5 opacity-70 pointer-events-none grayscale-[0.5]">
                {template.fields.slice(0, 4).map((f, i) => (
                  <div key={i}>
                    <label className="mb-1.5 block text-xs font-semibold">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="h-9 w-full rounded-md border border-line bg-canvas" />
                  </div>
                ))}
                {template.fields.length > 4 && (
                  <div className="text-center text-xs text-muted font-medium pt-2">
                    + {template.fields.length - 4} more fields
                  </div>
                )}
                <div className="mt-6 h-10 w-full rounded-md bg-indigo-600 opacity-50" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </PublicShell>
  );
}
