import { FONTS, LAYOUT } from "@/components/ui/pudgy-brand";

const footerLinks = [
  { href: "#product", label: "See it work" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
  { href: "https://github.com/CyrusL06/TrackerGen-", label: "GitHub", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--home-border)]">
      <div className={`${LAYOUT.content} grid gap-8 py-10 text-center sm:grid-cols-[1fr_auto] sm:items-center sm:text-left ${FONTS.body}`}>
        <div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#2779a7]">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-body-sm font-medium text-[var(--home-muted)]">
              TrackerGen <span className="text-[var(--home-dim)]">—</span> <span className="font-normal">© 2026</span>
            </span>
          </div>
          <p className="mt-3 text-body-sm text-[var(--home-dim)]">A simpler way to keep your month in view.</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-end">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}
                  className="inline-flex min-h-11 items-center text-body-sm font-medium text-[var(--home-muted)] no-underline transition-colors hover:text-[var(--home-text)]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
