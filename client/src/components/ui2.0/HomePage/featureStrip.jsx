import { FONTS } from "@/components/ui2.0/brand";

function StripItem({ children }) {
  return (
    <div
      className={`delight-chip flex items-center gap-2 whitespace-nowrap rounded-full border border-transparent px-2 py-1 text-[0.72rem] uppercase tracking-[0.05em] text-[color:var(--brand-muted)] hover:border-[color:var(--brand-border)] hover:bg-[color:var(--brand-surface)] hover:text-[color:var(--brand-text)] ${FONTS.mono}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--brand-accent)]" />
      {children}
    </div>
  );
}

export default function FeatureStrip() {
  const items = [
    "Manual transaction entry",
    "Income and expense split",
    "Month-by-month cash flow",
    "Category breakdown",
    "Recent activity feed",
    "Private preview access",
  ];
  return (
    <section
      id="product"
      className="delight-rise delight-delay-1 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 overflow-hidden border-y border-[color:var(--brand-border)] px-4 py-5 md:px-10"
    >
      {items.map((item) => (
        <StripItem key={item}>{item}</StripItem>
      ))}
    </section>
  );
}
