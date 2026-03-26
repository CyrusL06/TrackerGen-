import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--brand-border)]">
      <div
        className={`${LAYOUT.footer} delight-rise flex flex-col gap-2 text-[0.72rem] text-[color:var(--brand-muted)] sm:flex-row sm:items-center sm:justify-between ${FONTS.mono}`}
      >
        <span>© 2026 TrackerGen</span>
        <span>Private preview for people who want a calmer read on their monthly money.</span>
      </div>
    </footer>
  );
}
