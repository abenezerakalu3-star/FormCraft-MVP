import Link from "next/link";
import { Heart, Mail } from "lucide-react";
import { SiteSettings } from "@/lib/settings";
import BuyMeCoffeeButton from "@/components/buy-me-coffee-button";

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  const links = [
    {
      heading: "Product",
      items: [
        { label: "Features", href: "/#features" },
        { label: "How it works", href: "/#how" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      heading: "Support",
      items: [
        { label: "Contact us", href: "/contact" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Terms of service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-black text-surface dark:text-background">
                F
              </span>
              {settings.siteName}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{settings.tagline}</p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Mail className="h-4 w-4 text-muted" /> {settings.contactEmail}
            </a>
          </div>

          {links.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {settings.siteName}. {settings.footerNote}
          </p>
          <BuyMeCoffeeButton />
          <p className="flex items-center gap-1.5 text-xs text-muted">
            Built with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> for people who love
            good forms.
          </p>
        </div>
      </div>
    </footer>
  );
}