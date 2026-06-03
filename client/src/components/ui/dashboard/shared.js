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
  surface: "#0a0a0a",
  surface2: "#141414",
  border: "rgba(255,255,255,0.08)",
  text: BRAND_COLORS.text,
  muted: "#9ca3af",
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
  pageShell: "relative mx-auto max-w-[1200px] px-5 py-6 sm:px-6 sm:py-8",
  panel: "border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] shadow-[0_1px_3px_0_rgba(0,0,0,0.4)]",
  panelPadding: "px-5 py-5 sm:px-6 sm:py-[18px]",
  eyebrow: "mb-1.5 text-[10px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]",
  displayTitle: "text-[1.35rem] font-semibold tracking-[-0.01em] sm:text-[1.2rem]",
  fieldLabel:
    "mb-[5px] block text-[10px] uppercase tracking-[0.12em] text-[color:var(--dashboard-muted)]",
  fieldError: "mt-1 text-[11px] text-[color:var(--dashboard-red)]",
  inputBase:
    "w-full border bg-[color:var(--dashboard-surface-2)] px-3 py-[11px] text-[14px] text-[color:var(--dashboard-text)] outline-none transition-all placeholder:text-[color:var(--dashboard-muted)] focus:border-[color:var(--dashboard-accent)] focus:shadow-[0_0_0_1px_var(--dashboard-accent)] sm:text-[12px] sm:py-[9px]",
  primaryButton:
    "inline-flex min-h-11 items-center justify-center gap-1.5 bg-[color:var(--dashboard-accent)] px-[16px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.07em] text-[color:var(--dashboard-bg)] transition-all hover:opacity-[0.9] hover:shadow-[0_0_16px_-2px_var(--dashboard-accent)] active:scale-[0.97] sm:min-h-10 sm:text-[10px]",
  secondaryButton:
    "inline-flex min-h-11 items-center justify-center gap-[5px] border border-[color:var(--dashboard-border)] bg-transparent px-[14px] py-[7px] text-[11px] tracking-[0.06em] text-[color:var(--dashboard-muted)] transition-all hover:border-[color:var(--dashboard-accent)] hover:text-[color:var(--dashboard-accent)] hover:bg-[color:color-mix(in_srgb,var(--dashboard-accent)_6%,transparent)] active:scale-[0.97] sm:min-h-10 sm:px-[12px] sm:py-[6px] sm:text-[10px]",
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

export const EXPENSE_CATEGORIES = CATEGORIES.filter((category) => category !== "Income");

export const SPENDING_CATEGORY_COLORS = {
  Housing: COLORS.amber,
  "Food & Drink": COLORS.accent,
  Utilities: COLORS.text,
  Shopping: COLORS.muted,
  Transport: COLORS.amber,
  Dining: COLORS.accent,
  Subscriptions: COLORS.text,
};

export const SPENDING_FALLBACK_COLOR = COLORS.muted;

export const chartTick = {
  fill: COLORS.muted,
  fontSize: 11,
  fontFamily: FONTS.mono.fontFamily,
};

export const DASHBOARD_TEXTURE = NOISE_BACKGROUND;

export const cx = (...classes) => classes.filter(Boolean).join(" ");
