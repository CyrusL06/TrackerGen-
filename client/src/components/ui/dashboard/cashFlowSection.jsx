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

  const netTone =
    row.net >= 0 ? "text-[color:var(--dashboard-accent)]" : "text-[color:var(--dashboard-amber)]";

  return (
    <div
      className="border border(--dashboard-border) bg-(--dashboard-surface-2) px-3.5 py-2.5 text-[11px]"
      style={FONTS.mono}
    >
      <div className="mb-[6px] tracking-[0.06em] text-[color:var(--dashboard-muted)]">{label}</div>
      <div className="mb-[3px] text-[color:var(--dashboard-accent)]">
        Income {formatWholeDollars(row.income)}
      </div>
      <div className="mb-[3px] text-[color:var(--dashboard-amber)]">
        Expenses {formatWholeDollars(row.expenses)}
      </div>
      <div className={netTone}>Net {row.net >= 0 ? "+" : "-"}{formatWholeDollars(Math.abs(row.net))}</div>
    </div>
  );
}

export default function CashFlowSection({ cashFlow, selectedRange, onRangeChange }) {
  const monthCount = selectedRange === "12m" ? 12 : 6;

  return (
    <SurfaceCard className={TW.panelPadding}>
      <div className="mb-[14px] flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>Cash Flow</Eyebrow>
          <DisplayTitle>{monthCount} Month Overview</DisplayTitle>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-1">
            {RANGE_OPTIONS.map((option) => {
              const active = selectedRange === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRangeChange(option.value)}
                  className={`min-w-11 rounded-full px-3 py-1 text-[10px] tracking-[0.08em] transition-colors ${
                    active
                      ? "bg-[color:var(--dashboard-accent)] text-[color:var(--dashboard-bg)]"
                      : "text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)]"
                  }`}
                  style={FONTS.mono}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-[14px] text-[11px] text-[color:var(--dashboard-muted)] sm:text-[9px]">
            {[
              [COLORS.accent, "Income"],
              [COLORS.amber, "Expenses"],
            ].map(([color, label]) => (
              <span key={label} className="flex items-center gap-[5px]">
                <span
                  className="inline-block h-[2px] w-2 rounded-[1px]"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={184}>
        <AreaChart data={cashFlow} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.15} />
              <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.12} />
              <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#181816" vertical={false} />
          <XAxis dataKey="month" tick={chartTick} axisLine={false} tickLine={false} />
          <YAxis tick={chartTick} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: COLORS.border, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="income"
            stroke={COLORS.accent}
            strokeWidth={1.5}
            fill="url(#gI)"
            dot={false}
            activeDot={{ r: 3, fill: COLORS.accent, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={COLORS.amber}
            strokeWidth={1.5}
            fill="url(#gE)"
            dot={false}
            activeDot={{ r: 3, fill: COLORS.amber, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </SurfaceCard>
  );
}
