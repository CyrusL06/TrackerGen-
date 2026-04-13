import { SPENDING_BREAKDOWN, TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard } from "./primitives.jsx";

export default function SpendingSection({ totalExpenses }) {
  return (
    <SurfaceCard className={TW.panelPadding}>
      <Eyebrow>Spending</Eyebrow>
      <DisplayTitle className="mb-4">By Category</DisplayTitle>

      {SPENDING_BREAKDOWN.map(([category, amount, color]) => {
        const percentage = Math.round((amount / totalExpenses) * 100) || 0;

        return (
          <div key={category} className="mb-4 sm:mb-3">
            <div className="mb-[6px] flex items-center justify-between text-[12px] sm:mb-[5px] sm:text-[10px]">
              <span className="tracking-[0.03em] text-[color:var(--dashboard-text)]">{category}</span>
              <span className="text-[color:var(--dashboard-muted)]">
                ${amount} <span style={{ color }}>{percentage}%</span>
              </span>
            </div>
            <div className="h-[3px] overflow-hidden rounded-[2px] bg-[color:var(--dashboard-border)]">
              <div
                className="h-full rounded-[2px] transition-[width] duration-300"
                style={{ width: `${percentage}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </SurfaceCard>
  );
}
