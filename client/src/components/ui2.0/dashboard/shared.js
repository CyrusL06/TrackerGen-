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
  muted: "#5a5854",
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
  pageShell: "relative mx-auto max-w-[1180px] px-4 py-5 sm:px-6 sm:py-7",
  panel: "border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)]",
  panelPadding: "px-4 py-4 sm:px-4 sm:py-[16px]",
  eyebrow: "mb-1 text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]",
  displayTitle: "text-[1.3rem] tracking-[0.04em] sm:text-[1.15rem]",
  fieldLabel:
    "mb-[4px] block text-[11px] uppercase tracking-[0.1em] text-[color:var(--dashboard-muted)]",
  fieldError: "mt-1 text-[11px] text-[color:var(--dashboard-red)]",
  inputBase:
    "w-full border bg-[color:var(--dashboard-surface-2)] px-3 py-[11px] text-[14px] tracking-[0.03em] text-[color:var(--dashboard-text)] outline-none transition-colors placeholder:text-[color:var(--dashboard-muted)] focus:border-[color:var(--dashboard-accent)] sm:text-[11px] sm:py-[9px]",
  primaryButton:
    "inline-flex min-h-11 items-center justify-center gap-1.5 bg-[color:var(--dashboard-accent)] px-[14px] py-[7px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[color:var(--dashboard-bg)] transition-opacity hover:opacity-[0.85] sm:min-h-10 sm:text-[10px]",
  secondaryButton:
    "inline-flex min-h-11 items-center justify-center gap-[5px] border border-[color:var(--dashboard-border)] bg-transparent px-[12px] py-[6px] text-[11px] tracking-[0.05em] text-[color:var(--dashboard-muted)] transition-colors hover:border-[color:var(--dashboard-accent)] hover:text-[color:var(--dashboard-accent)] sm:min-h-10 sm:px-[10px] sm:py-[5px] sm:text-[9px]",
};

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
  fontSize: 11,
  fontFamily: FONTS.mono.fontFamily,
};

export const DASHBOARD_TEXTURE = NOISE_BACKGROUND;

export const cx = (...classes) => classes.filter(Boolean).join(" ");
