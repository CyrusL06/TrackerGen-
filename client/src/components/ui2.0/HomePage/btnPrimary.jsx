import { FONTS } from "@/components/ui2.0/brand";

export default function BtnPrimary({ children, href = "#"}) {
  return (
    <a
      href={href}
      className={`delight-chip inline-flex min-h-11 items-center border border-[color:var(--brand-border)] bg-[linear-gradient(135deg,var(--brand-accent),var(--brand-amber))] px-8 py-[0.85rem]
                  text-[0.84rem] font-medium uppercase tracking-[0.06em] text-[color:var(--brand-bg)]
                  no-underline shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-all duration-200 hover:opacity-[0.95] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}
