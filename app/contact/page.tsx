import { Mail, MessageSquareText, Send } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import PublicShell from "@/components/public-shell";
import ContactForm from "@/components/contact-form";

export const metadata = {
  title: "Contact",
  description: "Have a question, idea, or feedback? Get in touch with the FormCraft team.",
  robots: { index: true, follow: true },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <PublicShell settings={settings}>
      <div className="mx-auto grid max-w-4xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-3 leading-relaxed text-muted">
            Questions, feedback, or a bug to report? Send us a note and we&apos;ll get back to you
            within a few business days.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Email us</p>
                <p className="text-sm text-muted">{settings.contactEmail}</p>
              </div>
            </a>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MessageSquareText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Response time</p>
                <p className="text-sm text-muted">Usually within 48 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Send className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Product feedback</p>
                <p className="text-sm text-muted">We read every message</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold tracking-tight">Send a message</h2>
          <p className="mt-1 mb-6 text-sm text-muted">
            Fill out the form and it lands directly on our admin dashboard.
          </p>
          <ContactForm />
        </div>
      </div>
    </PublicShell>
  );
}