import { FONTS, LAYOUT } from "@/components/ui2.0/brand";

export default function Footer() {
  return (
    <footer className="border-t border-[#222220]">
      <div
        className={`${LAYOUT.footer} flex flex-col gap-2 text-[0.72rem] text-[#6b6860] sm:flex-row sm:items-center sm:justify-between ${FONTS.mono}`}
      >
        <span>© 2026 TrackerGen</span>
        <span>Built for people who care about their money.</span>
      </div>
    </footer>
  );
}
