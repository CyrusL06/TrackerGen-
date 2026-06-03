import { ArrowUpRight, ArrowDownRight, X, Coffee, Pencil } from "lucide-react";
import { CATEGORY_ICONS, COLORS, FONTS, TW, cx } from "./shared.js";

export function SurfaceCard({ className = "", children }) {
  return <div className={cx(TW.panel, "rounded-[10px]", className)}>{children}</div>;
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
      className="inline-block rounded-[3px] border px-[7px] py-[3px] text-[10px] uppercase tracking-[0.12em] sm:text-[8px]"
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
    <SurfaceCard className="relative overflow-hidden px-5 py-5 sm:py-[18px]">
      <div
        className="absolute inset-x-0 top-0 h-[2px] shadow-[0_0_10px_-1px]"
        style={{ backgroundColor: accent, boxShadow: `0 0 10px -1px ${accent}` }}
      />
      <div className="mb-2.5 text-[10px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
        {label}
      </div>
      <div
        className="mb-2 text-[2rem] font-bold tracking-[-0.02em] sm:text-[24px]"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] sm:text-[10px]">
        {up ? (
          <ArrowUpRight size={13} color={COLORS.accent} />
        ) : (
          <ArrowDownRight size={13} color={COLORS.red} />
        )}
        <span style={{ color: up ? COLORS.accent : COLORS.red }}>{change}</span>
        <span className="text-[color:var(--dashboard-muted)]">{sub}</span>
      </div>
    </SurfaceCard>
  );
}

export function TxnRow({ txn, onEdit, onDelete }) {
  const Icon = CATEGORY_ICONS[txn.cat] || Coffee;
  const isPositive = txn.amount > 0;
  const iconColor = isPositive ? COLORS.accent : COLORS.amber;

  return (
    <div className="group flex flex-col gap-3 border-b border-[color:var(--dashboard-border)] py-3.5 transition-colors hover:bg-[color:color-mix(in_srgb,var(--dashboard-accent)_3%,transparent)] sm:flex-row sm:items-center sm:justify-between sm:px-2 sm:hover:rounded-[6px]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border sm:h-8 sm:w-8"
          style={{
            borderColor: `${iconColor}30`,
            backgroundColor: `${iconColor}12`,
          }}
        >
          <Icon size={14} color={iconColor} />
        </div>
        <div>
          <div className="mb-[3px] text-[14px] font-medium text-[color:var(--dashboard-text)] sm:text-[12px]">
            {txn.name}
          </div>
          <div className="text-[12px] tracking-[0.04em] text-[color:var(--dashboard-muted)] sm:text-[10px]">
            {txn.cat} <span className="opacity-40">·</span> {txn.date}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
        <div
          className="text-[15px] font-semibold sm:text-[13px]"
          style={{ color: isPositive ? COLORS.accent : COLORS.red }}
        >
          {isPositive ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
        </div>
        <div className="flex items-center gap-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(txn)}
            className="flex min-h-9 items-center gap-1 rounded-[4px] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-accent)] sm:min-h-8 sm:text-[9px]"
          >
            <Pencil size={11} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(txn.id)}
            className="flex min-h-9 items-center gap-1 rounded-[4px] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-red)] sm:min-h-8 sm:text-[9px]"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
