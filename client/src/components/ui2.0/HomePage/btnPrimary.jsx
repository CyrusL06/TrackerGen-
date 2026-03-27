import { FONTS } from "@/components/ui2.0/brand";

export default function BtnPrimary({ children, href = "/login" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center bg-[#c8f135] px-8 py-[0.85rem] 
                  text-[0.82rem] font-medium uppercase tracking-[0.06em] text-[#000000] 
                  no-underline transition-all duration-200 hover:-translate-y-px hover:opacity-[0.85] ${FONTS.mono}`}
    >
      {children}
    </a>
  );
}
