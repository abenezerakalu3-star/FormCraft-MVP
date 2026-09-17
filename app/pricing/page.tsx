import { getSiteSettings } from "@/lib/settings";
import PublicShell from "@/components/public-shell";
import PricingTiers from "@/components/pricing-tiers";

export const metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Formitect. Start free, then upgrade to Pro or Team as you grow.",
  robots: { index: true, follow: true },
};

const faqs = [
  {
    q: "Is there really a free plan?",
    a: "Yes. The Free plan is free forever and includes up to 3 forms and 100 responses per month. No credit card required.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. You can upgrade, downgrade, or cancel at any time. Changes take effect on your next billing cycle.",
  },
  {
    q: "What counts as a response?",
    a: "Each completed form submission counts as one response. Views and partial entries are not counted.",
  },
  {
    q: "Do you offer discounts?",
    a: "Annual billing saves you 20%. Nonprofits, students, and open-source projects can contact us for additional pricing.",
  },
  {
    q: "What happens if I exceed my limit?",
    a: "We never drop responses. We'll notify you when you're close to your limit so you can upgrade before anything is paused.",
  },
];

export default async function PricingPage() {
  const settings = await getSiteSettings();

  return (
    <PublicShell settings={settings}>
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Pricing
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Simple pricing that scales with you
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Start on the free plan and upgrade when you need more forms, responses, and collaboration.
        </p>
      </section>

      <PricingTiers />

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="text-center text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="card p-6">
              <h3 className="text-base font-bold tracking-tight">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted">
          Still have questions?{" "}
          <a
            href={`mailto:${settings.contactEmail}`}
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Get in touch
          </a>
          .
        </p>
      </section>
    </PublicShell>
  );
}
