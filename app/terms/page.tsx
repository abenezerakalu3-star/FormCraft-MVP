import { getSiteSettings } from "@/lib/settings";
import PublicShell from "@/components/public-shell";

const sections = [
  {
    title: "The service",
    body: "FormCraft lets you create forms, share them, and collect responses. You are responsible for the content you put in your forms and how you use the responses you collect.",
  },
  {
    title: "Your account",
    body: "You agree to provide accurate information and keep your login credentials secure. You are responsible for everything that happens on your account. If you suspect unauthorized access, contact us immediately.",
  },
  {
    title: "Acceptable use",
    body: "You may not use the service to collect data in violation of any law, to send spam, to impersonate others, to distribute malware, or to interfere with the service or other users. We may suspend accounts that violate these rules.",
  },
  {
    title: "Your content and data",
    body: "You retain ownership of your forms and the responses you collect. We process that data only to provide the service. It is your responsibility to obtain any consent required from the people who fill out your forms.",
  },
  {
    title: "Google sign-in",
    body: "Signing in with Google is optional. By using it you authorize us to receive and store the name and email associated with your Google account, as described in our Privacy Policy.",
  },
  {
    title: "Billing and subscriptions",
    body: "Paid plans are billed in advance and may be cancelled at any time. Usage continue until the end of the current billing period. Fees are non-refundable unless required by law.",
  },
  {
    title: "Uptime and availability",
    body: "We aim to keep the service fast and reliable but do not guarantee uninterrupted availability. We are not liable for damages related to downtime, data loss, or interruption of service beyond what the law requires.",
  },
  {
    title: "Limitation of liability",
    body: "To the maximum extent permitted by law, FormCraft is not liable for indirect, incidental, or consequential damages arising from your use of the service.",
  },
  {
    title: "Termination",
    body: "You may stop using the service at any time and delete your data. We may suspend or terminate accounts that breach these terms. Sections that should survive termination (like limitation of liability) remain in effect.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms. Continued use of the service after changes are posted means you accept the updated terms.",
  },
  {
    title: "Contact",
    body: "Questions about these terms? Reach us at the contact email in the footer.",
  },
];

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const updated = "September 13, 2026";

  return (
    <PublicShell settings={settings}>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Legal
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>

        <p className="mt-8 leading-relaxed text-muted">
          By accessing or using {settings.siteName} you agree to these terms. Read them carefully —
          they govern your use of the service.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold tracking-tight">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </PublicShell>
  );
}