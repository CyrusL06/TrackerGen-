import { FONTS } from "../pudgy-brand";

export default function BtnPrimary({ children, href = "/login" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg bg-[#2779a7] px-7 py-3 text-[0.9rem] font-medium text-white no-underline transition-all duration-200 hover:bg-[#1d5f83] hover:-translate-y-0.5 ${FONTS.body}`}
    >
      {children}
    </a>
  );
}
