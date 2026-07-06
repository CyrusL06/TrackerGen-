import { FONTS } from "../pudgy-brand";

export default function MarqueeStrip() {
  return (
    <div className="relative z-20 w-full overflow-hidden border-b border-[rgba(255,255,255,0.05)] py-2.5" style={{ background: "var(--bg-page)" }}>
      <div className="animate-marquee whitespace-nowrap">
        <span className={`inline-block text-caption font-medium uppercase tracking-[0.15em] text-[#2779a7] ${FONTS.mono}`}>
          Tracki — your finance tracker on Telegram&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;Tracki — your finance tracker on Telegram&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;Tracki — your finance tracker on Telegram&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;Tracki — your finance tracker on Telegram
        </span>
      </div>
    </div>
  );
}
