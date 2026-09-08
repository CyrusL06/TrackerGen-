import { LogOut, Moon, Plus, Sun } from "lucide-react";
import { COLORS, FONTS, TW } from "./shared.js";
import { Tag } from "./primitives.jsx";

export default function TopNav({ theme, onThemeChange, onAddTransaction, onLogout }) {
  const isLight = theme === "light";
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-nav)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--dashboard-accent)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 10 L5 6 L8 8 L12 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[1.05rem] font-bold tracking-[-0.025em]" style={FONTS.display}>
            TrackerGen
          </span>
          <Tag color={COLORS.accent}>Dashboard</Tag>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto lg:justify-end">
          <span className="mr-auto hidden text-[12px] text-[color:var(--dashboard-muted)] sm:inline lg:mr-2">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => onThemeChange?.(isLight ? "dark" : "light")}
            aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-muted)] transition-colors hover:border-[color:var(--dashboard-accent)] hover:text-[color:var(--dashboard-accent)]"
          >
            {isLight ? <Moon aria-hidden="true" size={17} /> : <Sun aria-hidden="true" size={17} />}
          </button>
          <button type="button" onClick={onLogout} className={TW.secondaryButton}>
            <LogOut size={12} />
            <span className="hidden sm:inline">Log out</span>
          </button>
          <button type="button" onClick={onAddTransaction} className={`${TW.primaryButton} ml-auto sm:ml-0`}>
            <Plus size={12} />
            Add transaction
          </button>
        </div>
      </div>
    </nav>
  );
}
