import {
  Home,
  ShoppingBag,
  Zap,
  Coffee,
  Briefcase,
  Car,
  Pizza,
  Wifi,
} from "lucide-react";
import { DASHBOARD_COLORS, FONT_FAMILIES, NOISE_BACKGROUND } from "../brand";

export const COLORS = {
  ...DASHBOARD_COLORS,
  red: DASHBOARD_COLORS.danger,
};

export const FONTS = {
  mono: { fontFamily: FONT_FAMILIES.mono },
  display: { fontFamily: FONT_FAMILIES.display },
};

export const TW = {
  page: "relative min-h-screen overflow-hidden bg-[color:var(--dashboard-bg)] text-[color:var(--dashboard-text)]",
  pageTexture: "pointer-events-none absolute inset-0 opacity-40",
  pageShell: "relative mx-auto max-w-[1100px] px-4 py-8 sm:p-8",
  panel: "border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)]",
  panelPadding: "px-5 py-5",
  eyebrow: "mb-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]",
  displayTitle: "text-[1.45rem] tracking-[0.04em]",
  fieldLabel:
    "mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]",
  fieldError: "mt-1 text-[11px] text-[color:var(--dashboard-red)]",
  inputBase:
    "w-full min-h-11 border bg-[color:var(--dashboard-surface-2)] px-3 py-2.5 text-[13px] tracking-[0.03em] text-[color:var(--dashboard-text)] transition-colors placeholder:text-[color:var(--dashboard-muted)] focus:border-[color:var(--dashboard-accent)] focus-visible:outline-none",
  primaryButton:
    "delight-chip inline-flex min-h-11 items-center gap-1.5 border border-[color:var(--dashboard-border)] bg-[linear-gradient(135deg,var(--dashboard-accent),var(--dashboard-amber))] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--dashboard-bg)] shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-[0.95] disabled:cursor-not-allowed disabled:opacity-60",
  secondaryButton:
    "delight-chip inline-flex min-h-11 items-center gap-[5px] border border-[color:var(--dashboard-border)] bg-transparent px-3 py-2 text-[11px] tracking-[0.07em] text-[color:var(--dashboard-muted)] transition-colors hover:border-[color:var(--dashboard-accent)] hover:text-[color:var(--dashboard-accent)]",
  tabGroup:
    "flex flex-wrap gap-1 rounded-[4px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] p-1",
  tabButton:
    "rounded-[3px] border px-4 py-2 text-[11px] uppercase tracking-[0.08em] transition-all",
};

export const NAV_TABS = ["overview", "activity"];

export const CATEGORY_ICONS = {
  Housing: Home,
  Shopping: ShoppingBag,
  Utilities: Zap,
  "Food & Drink": Coffee,
  Income: Briefcase,
  Transport: Car,
  Dining: Pizza,
  Subscriptions: Wifi,
};

export const CATEGORIES = Object.keys(CATEGORY_ICONS);

export const SPENDING_BREAKDOWN = [
  ["Housing", 1400, COLORS.amber],
  ["Food & Drink", 380, COLORS.accent],
  ["Utilities", 142, COLORS.sage],
  ["Shopping", 89, COLORS.muted],
  ["Transport", 37, COLORS.muted],
];

export const chartTick = {
  fill: COLORS.muted,
  fontSize: 10,
  fontFamily: FONTS.mono.fontFamily,
};

export const DASHBOARD_TEXTURE = NOISE_BACKGROUND;

export const cx = (...classes) => classes.filter(Boolean).join(" ");
