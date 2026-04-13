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
  const items = [
    "Manual transaction entry",
    "Income and expense split",
    "Month-by-month cash flow",
    "Category breakdown",
    "Recent activity log",
    "Early access preview",
  ];
  return (
    <section
      id="product"
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 overflow-hidden border-y border-[#222220] px-4 py-4 md:gap-x-12 md:gap-y-4 md:px-10 md:py-5"
    >
      {items.map((item, index) => (
        <div key={item} className={index > 2 ? "hidden md:block" : ""}>
          <StripItem>{item}</StripItem>
        </div>
      ))}
    </section>
  );
}
