import { LogOut, Plus } from "lucide-react";
import { COLORS, FONTS, TW } from "./shared.js";
import { Tag } from "./primitives.jsx";

export default function TopNav({ onAddTransaction, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--dashboard-border)] bg-[rgba(10,10,8,0.95)] backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--dashboard-accent)]">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 10 L5 6 L8 8 L12 3"
                stroke={COLORS.bg}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[1.05rem] tracking-[0.06em]" style={FONTS.display}>
            TRACKERGEN
          </span>
          <Tag color={COLORS.accent}>Preview</Tag>
        </div>

        <div className="flex w-full items-center justify-between gap-3 xl:w-auto xl:justify-end">
          <span className="text-[11px] tracking-[0.04em] text-[color:var(--dashboard-muted)] sm:text-[9px]">
            March 2026
          </span>
          <button type="button" onClick={onLogout} className={TW.secondaryButton}>
            <LogOut size={12} />
            Log out
          </button>
          <button type="button" onClick={onAddTransaction} className={TW.primaryButton}>
            <Plus size={12} />
            Add Transaction
          </button>
        </div>
      </div>
    </nav>
  );
}
