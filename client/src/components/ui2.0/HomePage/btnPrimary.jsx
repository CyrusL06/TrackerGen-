import { FONTS } from "@/components/ui2.0/brand";

export default function BtnPrimary({ children, href = "#"}) {
  return (
    <a
      href={href}
      className={`delight-chip inline-flex items-center bg-[color:var(--brand-accent)] px-8 py-[0.85rem]
                  text-[0.82rem] font-medium uppercase tracking-[0.06em] text-[color:var(--brand-bg)]
                  no-underline shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-all duration-200 hover:opacity-[0.9] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}
