import { ArrowUpRight, ArrowDownRight, X, Coffee } from "lucide-react";
import { CATEGORY_ICONS, COLORS, FONTS, TW, cx } from "./shared.js";

export function SurfaceCard({ className = "", children }) {
  return <div className={cx(TW.panel, className)}>{children}</div>;
}

export function Eyebrow({ children, className = "" }) {
  return <div className={cx(TW.eyebrow, className)}>{children}</div>;
}

export function DisplayTitle({ children, className = "" }) {
  return (
    <div className={cx(TW.displayTitle, className)} style={FONTS.display}>
      {children}
    </div>
  );
}

export function Tag({ children, color = COLORS.accent }) {
  return (
    <span
      className="inline-block border px-[6px] py-[3px] text-[10px] uppercase tracking-[0.1em] sm:text-[8px]"
      style={{
        ...FONTS.mono,
        color,
        backgroundColor: `${color}18`,
        borderColor: `${color}30`,
      }}
    >
      {children}
    </span>
  );
}

export function FieldLabel({ children }) {
  return <label className={TW.fieldLabel}>{children}</label>;
}

export function FieldError({ children }) {
  if (!children) return null;
  return <div className={TW.fieldError}>{children}</div>;
}

export function StatCard({ label, value, change, up, accent, sub }) {
  return (
    <SurfaceCard className="relative overflow-hidden px-4 py-4 sm:py-[15px]">
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: accent }} />
      <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
        {label}
      </div>
      <div className="mb-1.5 text-[1.9rem] font-bold tracking-[-0.01em] sm:text-[22px]" style={{ color: accent }}>
        {value}
      </div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[12px] sm:text-[10px]">
        {up ? (
          <ArrowUpRight size={12} color={COLORS.accent} />
        ) : (
          <ArrowDownRight size={12} color={COLORS.red} />
        )}
        <span style={{ color: up ? COLORS.accent : COLORS.red }}>{change}</span>
        <span className="text-[color:var(--dashboard-muted)]">{sub}</span>
      </div>
    </SurfaceCard>
  );
}

export function TxnRow({ txn, onDelete }) {
  const Icon = CATEGORY_ICONS[txn.cat] || Coffee;
  const isPositive = txn.amount > 0;

  return (
    <div className="flex flex-col gap-3 border-b border-[color:var(--dashboard-border)] py-3 transition-colors hover:bg-[color:var(--dashboard-surface-2)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] sm:h-7 sm:w-7">
          <Icon size={13} color={isPositive ? COLORS.accent : COLORS.muted} />
        </div>
        <div>
          <div className="mb-[2px] text-[14px] text-[color:var(--dashboard-text)] sm:text-[11px]">{txn.name}</div>
          <div className="text-[12px] tracking-[0.04em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
            {txn.cat} · {txn.date}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
        <div
          className="text-[14px] font-semibold sm:text-[11px]"
          style={{ color: isPositive ? COLORS.accent : COLORS.red }}
        >
          {isPositive ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
        </div>
        <button
          type="button"
          onClick={() => onDelete(txn.id)}
          className="flex min-h-11 items-center gap-1 px-1 py-1 text-[11px] uppercase tracking-[0.06em] text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-red)] sm:min-h-9 sm:text-[9px]"
        >
          <X size={12} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
