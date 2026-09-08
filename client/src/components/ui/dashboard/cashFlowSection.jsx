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
const CHART_INCOME = "var(--dashboard-accent)";
const CHART_EXPENSES = "var(--dashboard-amber)";

function formatWholeDollars(value) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div
      className="max-w-[190px] rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] px-4 py-3 text-[12px] shadow-[var(--dashboard-shadow)]"
      style={FONTS.body}
    >
      <div className="mb-2 text-[11px] font-semibold text-[color:var(--dashboard-muted)]">
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
          <div className="flex rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] p-1">
            {RANGE_OPTIONS.map((option) => {
              const active = selectedRange === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRangeChange(option.value)}
                  className={`min-h-9 min-w-[44px] rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-[color:var(--dashboard-accent)] font-semibold text-white shadow-sm"
                      : "text-[color:var(--dashboard-muted)] hover:text-[color:var(--dashboard-text)]"
                  }`}
                  style={FONTS.body}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 text-[12px] text-[color:var(--dashboard-muted)]">
            {[
              [CHART_INCOME, "Income"],
              [CHART_EXPENSES, "Expenses"],
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
                <stop offset="5%" stopColor={CHART_INCOME} stopOpacity={0.2} />
                <stop offset="95%" stopColor={CHART_INCOME} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_EXPENSES} stopOpacity={0.15} />
                <stop offset="95%" stopColor={CHART_EXPENSES} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-border)" vertical={false} />
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
              stroke={CHART_INCOME}
              strokeWidth={2}
              fill="url(#gI)"
              dot={false}
              activeDot={{ r: 4, fill: CHART_INCOME, stroke: "var(--dashboard-surface)", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={CHART_EXPENSES}
              strokeWidth={2}
              fill="url(#gE)"
              dot={false}
              activeDot={{ r: 4, fill: CHART_EXPENSES, stroke: "var(--dashboard-surface)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
