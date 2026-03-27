import { FONTS } from "../brand";

export default function NavCta({ children, href = "#" }) {
  return (
    <a
      href={href}
      className={`delight-chip inline-flex min-h-11 items-center border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-[1.2rem] py-2 text-[0.8rem] uppercase tracking-[0.06em] text-[color:var(--brand-text)] no-underline transition-all duration-200 hover:border-[color:var(--brand-accent)] hover:bg-[linear-gradient(135deg,var(--brand-accent),var(--brand-amber))] hover:text-[color:var(--brand-bg)] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}
