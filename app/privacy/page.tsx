import { getSiteSettings } from "@/lib/settings";
import PublicShell from "@/components/public-shell";

export const metadata = {
  title: "Privacy Policy",
  description: "How FormCraft collects, uses, and protects your personal data.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "Information we collect",
    body: "We collect the details you provide when creating an account (name, email address) and the forms, fields, and responses you create while using the service. When you sign in with Google, we store the name and email associated with your Google account.",
  },
  {
    title: "How we use your information",
    body: "Your information is used to run your account, display and share your forms, deliver the features you ask for, and contact you when necessary. We never sell your personal data.",
  },
  {
    title: "Form responses",
    body: "Responses submitted to your forms belong to you. We store them so you can view and export them, and we only access them to keep the service working or if we are legally required to.",
  },
  {
    title: "Sessions, cookies, and emails",
    body: "We use a secure, encrypted session cookie to keep you signed in. We may send you transactional emails (for example, account notices). We do not use third-party advertising trackers.",
  },
  {
    title: "Data retention and deletion",
    body: "You can delete your forms at any time. To delete your account and all associated data, contact us at the email address in the footer and we will remove it promptly.",
  },
  {
    title: "Third parties",
    body: "Sign-in via Google uses Google's OAuth service. By choosing it, you agree to Google's privacy practices for the authentication step. We do not receive more than the profile details you authorize.",
  },
  {
    title: "Children",
    body: "The service is not directed at children under 13. We do not knowingly collect their information.",
  },
  {
    title: "Changes to this policy",
    body: "We may update this policy from time to time. Material changes will be reflected here and, where appropriate, notified via email.",
  },
  {
    title: "Contact",
    body: "Questions about your privacy? Reach us at the contact email in the footer — we reply within a few business days.",
  },
];

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const updated = "September 13, 2026";

  return (
    <PublicShell settings={settings}>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Legal
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>

        <p className="mt-8 leading-relaxed text-muted">
          This policy explains what {settings.siteName} collects, why we collect it, and how you can
          control your data. By using the service you agree to the practices described here.
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