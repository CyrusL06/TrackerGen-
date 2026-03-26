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
import { COLORS as BRAND_COLORS, FONT_FAMILIES, NOISE_BACKGROUND } from "../brand";

export const COLORS = {
  bg: BRAND_COLORS.bg,
  surface: "#0f0f0d",
  surface2: "#141412",
  border: "#1e1e1c",
  text: BRAND_COLORS.text,
  muted: BRAND_COLORS.muted,
  accent: BRAND_COLORS.accent,
  amber: BRAND_COLORS.amber,
  red: BRAND_COLORS.danger,
};

export const PAGE_VARS = {
  "--dashboard-bg": COLORS.bg,
  "--dashboard-surface": COLORS.surface,
  "--dashboard-surface-2": COLORS.surface2,
  "--dashboard-border": COLORS.border,
  "--dashboard-text": COLORS.text,
  "--dashboard-muted": COLORS.muted,
  "--dashboard-accent": COLORS.accent,
  "--dashboard-amber": COLORS.amber,
  "--dashboard-red": COLORS.red,
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
  eyebrow: "mb-1 text-[10px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]",
  displayTitle: "text-[1.45rem] tracking-[0.04em]",
  fieldLabel:
    "mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]",
  fieldError: "mt-1 text-[10px] text-[color:var(--dashboard-red)]",
  inputBase:
    "w-full border bg-[color:var(--dashboard-surface-2)] px-3 py-2.5 text-[12px] tracking-[0.03em] text-[color:var(--dashboard-text)] outline-none transition-colors placeholder:text-[color:var(--dashboard-muted)] focus:border-[color:var(--dashboard-accent)]",
  primaryButton:
    "delight-chip inline-flex items-center gap-1.5 bg-[color:var(--dashboard-accent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--dashboard-bg)] shadow-[0_10px_22px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-[0.88] disabled:cursor-not-allowed disabled:opacity-60",
  secondaryButton:
    "delight-chip inline-flex items-center gap-[5px] border border-[color:var(--dashboard-border)] bg-transparent px-3 py-2 text-[10px] tracking-[0.07em] text-[color:var(--dashboard-muted)] transition-colors hover:border-[color:var(--dashboard-accent)] hover:text-[color:var(--dashboard-accent)]",
  tabGroup:
    "flex flex-wrap gap-1 rounded-[4px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] p-1",
  tabButton:
    "rounded-[3px] border px-4 py-2 text-[10px] uppercase tracking-[0.08em] transition-all",
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
  ["Utilities", 142, COLORS.text],
  ["Shopping", 89, COLORS.muted],
  ["Transport", 37, COLORS.muted],
];

export const chartTick = {
  fill: COLORS.muted,
  fontSize: 9,
  fontFamily: FONTS.mono.fontFamily,
};

export const DASHBOARD_TEXTURE = NOISE_BACKGROUND;

export const cx = (...classes) => classes.filter(Boolean).join(" ");
