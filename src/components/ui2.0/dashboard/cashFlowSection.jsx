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

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] px-[14px] py-[10px] text-[11px]"
      style={FONTS.mono}
    >
      <div className="mb-[6px] tracking-[0.06em] text-[color:var(--dashboard-muted)]">{label}</div>
      <div className="mb-[3px] text-[color:var(--dashboard-accent)]">
        ↑ ${payload[0]?.value?.toLocaleString()}
      </div>
      <div className="text-[color:var(--dashboard-amber)]">↓ ${payload[1]?.value?.toLocaleString()}</div>
    </div>
  );
}

export default function CashFlowSection({ cashFlow }) {
  return (
    <SurfaceCard className={TW.panelPadding}>
      <div className="mb-[14px] flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>Cash Flow</Eyebrow>
          <DisplayTitle>8 Month Overview</DisplayTitle>
        </div>

        <div className="flex gap-[14px] text-[9px] text-[color:var(--dashboard-muted)]">
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

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={cashFlow} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
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
