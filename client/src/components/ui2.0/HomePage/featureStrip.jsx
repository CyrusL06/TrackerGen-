import { FONTS } from "@/components/ui2.0/brand";

function StripItem({ children }) {
  return (
    <div
      className={`flex items-center gap-2 whitespace-nowrap text-[0.72rem] uppercase tracking-[0.05em] text-[#6b6860] ${FONTS.mono}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c8f135]" />
      {children}
    </div>
  );
}

export default function FeatureStrip() {
  const items = ["Real-time sync","Bank-level security","Portfolio tracking","Budget goals","Export to CSV","Multi-currency"];
  return (
    <section
      id="product"
      className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 overflow-hidden border-y border-[#222220] px-4 py-5 md:px-10"
    >
      {items.map((item) => (
        <StripItem key={item}>{item}</StripItem>
      ))}
    </section>
  );
}
