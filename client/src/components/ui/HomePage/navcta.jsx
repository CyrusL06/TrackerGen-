import { FONTS } from "../pudgy-brand";

export default function NavCta({ children, href = "/login" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-[#2779a7] px-5 py-2.5 text-[0.88rem] font-medium text-white no-underline transition-all duration-200 hover:bg-[#1d5f83] ${FONTS.body}`}
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}
