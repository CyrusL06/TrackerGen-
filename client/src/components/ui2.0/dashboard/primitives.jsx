import { ArrowUpRight, ArrowDownRight, X, Coffee } from "lucide-react";
import { CATEGORY_ICONS, COLORS, FONTS, TW, cx } from "./shared.js";

const mixWithTransparent = (color, amount) =>
  `color-mix(in srgb, ${color} ${amount}%, transparent)`;

export function SurfaceCard({ className = "", children }) {
  return <div className={cx(TW.panel, "delight-card", className)}>{children}</div>;
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
      className="inline-block border px-2 py-1 text-[11px] uppercase tracking-[0.12em]"
      style={{
        ...FONTS.mono,
        color,
        backgroundColor: mixWithTransparent(color, 10),
        borderColor: mixWithTransparent(color, 18),
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

export function NavTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "delight-chip",
        TW.tabButton,
        active
          ? "border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] text-[color:var(--dashboard-text)]"
          : "border-transparent bg-transparent text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)]"
      )}
    >
      {children}
    </button>
  );
}

export function StatCard({ label, value, change, up, accent, sub }) {
  return (
    <SurfaceCard className="relative overflow-hidden px-5 py-[18px]">
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: accent }} />
      <div className="mb-2.5 text-[11px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]">
        {label}
      </div>
      <div className="mb-2 text-[26px] font-bold tracking-[-0.01em]" style={{ color: accent }}>
        {value}
      </div>
      <div className="flex items-center gap-1 text-[11px]">
        {up ? (
          <ArrowUpRight size={11} color={COLORS.sage} />
        ) : (
          <ArrowDownRight size={11} color={COLORS.red} />
        )}
        <span style={{ color: up ? COLORS.sage : COLORS.red }}>{change}</span>
        <span className="text-[color:var(--dashboard-muted)]">{sub}</span>
      </div>
    </SurfaceCard>
  );
}

export function TxnRow({ txn, onDelete }) {
  const Icon = CATEGORY_ICONS[txn.cat] || Coffee;
  const isPositive = txn.amount > 0;

  return (
    <div className="flex items-center justify-between border-b border-[color:var(--dashboard-border)] py-2.5 transition-colors hover:bg-[color:var(--dashboard-surface-2)]">
      <div className="flex items-center gap-3">
        <div className="delight-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)]">
          <Icon size={13} color={isPositive ? COLORS.sage : COLORS.accent} />
        </div>
        <div>
          <div className="mb-[2px] text-[11px] text-[color:var(--dashboard-text)]">{txn.name}</div>
          <div className="text-[11px] tracking-[0.04em] text-[color:var(--dashboard-muted)]">
            {txn.cat} · {txn.date}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="text-[13px] font-semibold"
          style={{ color: isPositive ? COLORS.sage : COLORS.red }}
        >
          {isPositive ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
        </div>
        <button
          type="button"
          onClick={() => onDelete(txn.id)}
          aria-label={`Remove ${txn.name}`}
          className="flex min-h-11 items-center gap-1 rounded-[3px] px-1.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-red)]"
        >
          <X size={11} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
