import { FONTS } from "../pudgy-brand";

const features = [
  "Manual Entry",
  "Income & Expenses",
  "Cash Flow View",
  "Category Breakdown",
  "Activity Log",
  "Telegram Bot",
];

export default function FeatureStrip() {
  return (
    <section id="product" className="overflow-hidden border-y border-[rgba(255,255,255,0.05)] py-4" style={{ background: "#000" }}>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 md:gap-x-12 md:px-10">
        {features.map((label) => (
          <div key={label} className={`inline-flex items-center gap-2 text-[0.78rem] font-medium text-[#6b7280] ${FONTS.body}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2779a7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
