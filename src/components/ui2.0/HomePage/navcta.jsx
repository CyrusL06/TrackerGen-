import { FONTS } from "../brand";

export default function NavCta({ children, href = "#" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center border border-[#222220] px-[1.2rem] py-2 text-[0.78rem] uppercase tracking-[0.06em] text-[#f2ede6] no-underline transition-all duration-200 hover:border-[#c8f135] hover:bg-[#c8f135] hover:text-[#0a0a08] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}
