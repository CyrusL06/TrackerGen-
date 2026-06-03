import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { chartTick, COLORS, FONTS, TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard } from "./primitives.jsx";

const RANGE_OPTIONS = [
  { value: "6m", label: "6M" },
  { value: "12m", label: "12M" },
];

function formatWholeDollars(value) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div
      className="max-w-[180px] rounded-[8px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] px-4 py-3 text-[11px] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]"
      style={FONTS.mono}
    >
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]">
        {label}
      </div>
      <div className="mb-1.5 flex items-center gap-2 text-[color:var(--dashboard-accent)]">
        <span className="inline-block h-[2px] w-3 rounded-[1px] bg-[color:var(--dashboard-accent)]" />
        Income {formatWholeDollars(row.income)}
      </div>
      <div className="mb-1.5 flex items-center gap-2 text-[color:var(--dashboard-amber)]">
        <span className="inline-block h-[2px] w-3 rounded-[1px] bg-[color:var(--dashboard-amber)]" />
        Expenses {formatWholeDollars(row.expenses)}
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-[color:var(--dashboard-border)] pt-2 text-[color:var(--dashboard-text)]">
        Net {row.net >= 0 ? "+" : "-"}{formatWholeDollars(Math.abs(row.net))}
      </div>
    </div>
  );
}

export default function CashFlowSection({ cashFlow, selectedRange, onRangeChange }) {
  const monthCount = selectedRange === "12m" ? 12 : 6;

  return (
    <SurfaceCard className={`${TW.panelPadding} flex h-full min-w-0 flex-col overflow-hidden`}>
      <div className="mb-[18px] flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <Eyebrow>Cash Flow</Eyebrow>
          <DisplayTitle>{monthCount} Month Overview</DisplayTitle>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
          <div className="flex rounded-[8px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-0.5">
            {RANGE_OPTIONS.map((option) => {
              const active = selectedRange === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRangeChange(option.value)}
                  className={`min-w-[42px] rounded-[6px] px-3 py-1.5 text-[10px] tracking-[0.08em] transition-all ${
                    active
                      ? "bg-[color:var(--dashboard-accent)] font-semibold text-[color:var(--dashboard-bg)] shadow-sm"
                      : "text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)]"
                  }`}
                  style={FONTS.mono}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 text-[11px] text-[color:var(--dashboard-muted)] sm:text-[10px]">
            {[
              [COLORS.accent, "Income"],
              [COLORS.amber, "Expenses"],
            ].map(([color, label]) => (
              <span key={label} className="flex items-center gap-[6px]">
                <span
                  className="inline-block h-[2px] w-3 rounded-[1px]"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[200px] min-w-0 flex-1 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlow} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.15} />
                <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#181816" vertical={false} />
            <XAxis dataKey="month" tick={chartTick} axisLine={false} tickLine={false} />
            <YAxis tick={chartTick} axisLine={false} tickLine={false} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: COLORS.border, strokeWidth: 1 }}
              wrapperStyle={{ outline: "none" }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke={COLORS.accent}
              strokeWidth={2}
              fill="url(#gI)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.accent, stroke: COLORS.surface, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={COLORS.amber}
              strokeWidth={2}
              fill="url(#gE)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.amber, stroke: COLORS.surface, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
