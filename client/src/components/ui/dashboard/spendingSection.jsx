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
    <SurfaceCard className={TW.panelPadding}>
      <Eyebrow>Spending</Eyebrow>
      <DisplayTitle className="mb-4">By Category</DisplayTitle>

      {categoryBreakdown.map(({ category, amount, percentage, color }) => (
        <div key={category} className="mb-4 sm:mb-3">
          <div className="mb-[6px] flex items-center justify-between text-[12px] sm:mb-[5px] sm:text-[10px]">
            <span className="tracking-[0.03em] text-[color:var(--dashboard-text)]">{category}</span>
            <span className="text-[color:var(--dashboard-muted)]">
              {formatCurrency(amount)} <span style={{ color }}>{totalExpenses > 0 ? percentage : 0}%</span>
            </span>
          </div>
          <div className="h-[3px] overflow-hidden rounded-[2px] bg-[color:var(--dashboard-border)]">
            <div
              className="h-full rounded-[2px] transition-[width] duration-300"
              style={{ width: `${totalExpenses > 0 ? percentage : 0}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </SurfaceCard>
  );
}
