import { FONTS } from "../pudgy-brand";

export default function NavCta({ children, href = "/login" }) {
  return (
    <a
      href={href}
      className={`inline-flex h-10 items-center gap-1.5 rounded-xl border border-[var(--home-border-strong)] bg-[var(--action-primary)] px-4 text-body-sm font-semibold text-white no-underline transition-colors duration-150 hover:bg-[var(--action-primary-hover)] ${FONTS.body}`}
    >
      {children}
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}
