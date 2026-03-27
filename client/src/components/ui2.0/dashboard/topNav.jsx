import { MoonStar, Plus, SunMedium } from "lucide-react";
import { COLORS, FONTS, NAV_TABS, TW } from "./shared.js";
import { NavTab, Tag } from "./primitives.jsx";

function ThemeToggle({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="delight-chip inline-flex min-h-11 items-center gap-2 border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-[color:var(--dashboard-text)] transition-colors hover:border-[color:var(--dashboard-accent)] hover:text-[color:var(--dashboard-accent)]"
    >
      {isDark ? <SunMedium size={13} /> : <MoonStar size={13} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default function TopNav({ activeTab, onTabChange, onAddTransaction, theme, onToggleTheme }) {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-[color:var(--dashboard-border)] backdrop-blur-sm"
      style={{ backgroundColor: "color-mix(in srgb, var(--dashboard-bg) 92%, transparent)" }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-[0.9rem] sm:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="delight-rise flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--dashboard-accent)] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 10 L5 6 L8 8 L12 3"
                  stroke={COLORS.bg}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[1.1rem] tracking-[0.06em]" style={FONTS.display}>
              TRACKERGEN
            </span>
            <Tag color={COLORS.accent}>Preview</Tag>
          </div>
        </div>

        <div className={`${TW.tabGroup} delight-rise delight-delay-1`}>
          {NAV_TABS.map((tab) => (
            <NavTab key={tab} active={activeTab === tab} onClick={() => onTabChange(tab)}>
              {tab}
            </NavTab>
          ))}
        </div>

        <div className="delight-rise delight-delay-2 flex flex-wrap items-center gap-2.5 xl:justify-end">
          <span className="text-[11px] tracking-[0.04em] text-[color:var(--dashboard-muted)]">
            March snapshot
          </span>
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          <button type="button" onClick={onAddTransaction} className={TW.primaryButton}>
            <Plus size={12} />
            Add Transaction
          </button>
        </div>
      </div>
    </nav>
  );
}
