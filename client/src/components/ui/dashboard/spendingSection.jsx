import { TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard } from "./primitives.jsx";

function formatCurrency(amount) {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SpendingSection({ totalExpenses, categoryBreakdown }) {
  return (
    <SurfaceCard className={`${TW.panelPadding} h-full min-w-0 overflow-hidden`}>
      <Eyebrow>Spending</Eyebrow>
      <DisplayTitle className="mb-5">By Category</DisplayTitle>

      {categoryBreakdown.map(({ category, amount, percentage, color }) => (
        <div key={category} className="mb-4 sm:mb-3.5">
          <div className="mb-[7px] flex min-w-0 items-center justify-between gap-3 text-[13px] sm:text-[11px]">
            <span className="min-w-0 truncate font-medium tracking-[0.02em] text-[color:var(--dashboard-text)]">
              {category}
            </span>
            <span className="shrink-0 text-[color:var(--dashboard-muted)]">
              {formatCurrency(amount)}{" "}
              <span className="font-medium" style={{ color }}>
                {totalExpenses > 0 ? percentage : 0}%
              </span>
            </span>
          </div>
          <div className="h-[4px] overflow-hidden rounded-[3px] bg-[color:var(--dashboard-border)]">
            <div
              className="h-full rounded-[3px] transition-[width] duration-500 ease-out"
              style={{ width: `${totalExpenses > 0 ? percentage : 0}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </SurfaceCard>
  );
}
