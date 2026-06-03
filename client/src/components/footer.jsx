import { FONTS, LAYOUT } from "@/components/ui/pudgy-brand";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)]">
      <div className={`${LAYOUT.content} flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:justify-between sm:text-left ${FONTS.body}`}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#2779a7]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="text-[0.82rem] font-medium text-[#6b7280]">
            Tracki <span className="text-[#4b5563]">—</span> <span className="font-normal">© 2026</span>
          </span>
        </div>
        <span className="text-[0.82rem] text-[#6b7280]">
          Built for people who care about their money.
        </span>
      </div>
    </footer>
  );
}
