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
import { COLORS as BRAND_COLORS, FONT_FAMILIES } from "../brand";

export const COLORS = {
  bg: BRAND_COLORS.bg,
  surface: BRAND_COLORS.surface,
  surface2: BRAND_COLORS.surface2,
  border: BRAND_COLORS.border,
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
  "--dashboard-nav": "oklch(0.13 0.025 260 / 0.94)",
  "--dashboard-shadow": "0 18px 48px rgba(0,0,0,0.2)",
  "--dashboard-grid-line": "rgba(255,255,255,0.025)",
};

const LIGHT_PAGE_VARS = {
  "--dashboard-bg": "oklch(0.975 0.008 240)",
  "--dashboard-surface": "oklch(0.995 0.003 240)",
  "--dashboard-surface-2": "oklch(0.955 0.015 240)",
  "--dashboard-border": "oklch(0.84 0.018 240 / 0.85)",
  "--dashboard-text": "oklch(0.24 0.04 255)",
  "--dashboard-muted": "oklch(0.43 0.035 250)",
  "--dashboard-accent": "#2779a7",
  "--dashboard-amber": "#b56d08",
  "--dashboard-red": "#c64141",
  "--dashboard-nav": "oklch(0.985 0.006 240 / 0.92)",
  "--dashboard-shadow": "0 16px 42px rgba(28,55,75,0.1)",
  "--dashboard-grid-line": "rgba(28,75,105,0.045)",
};

export const getDashboardPageVars = (theme) =>
  theme === "light" ? LIGHT_PAGE_VARS : PAGE_VARS;

export const FONTS = {
  mono: { fontFamily: FONT_FAMILIES.mono },
  display: { fontFamily: FONT_FAMILIES.display },
  body: { fontFamily: FONT_FAMILIES.body },
};

export const TW = {
  page: "dashboard-root relative min-h-screen overflow-hidden bg-[color:var(--dashboard-bg)] text-[color:var(--dashboard-text)]",
  pageTexture: "pointer-events-none absolute inset-0",
  pageShell: "relative mx-auto max-w-[1200px] px-5 py-7 sm:px-6 sm:py-9",
  panel: "border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] shadow-[var(--dashboard-shadow)]",
  panelPadding: "px-5 py-5 sm:px-6 sm:py-6",
  eyebrow: "mb-1.5 text-[12px] font-medium text-[color:var(--dashboard-muted)]",
  displayTitle: "text-[1.35rem] font-bold tracking-[-0.025em]",
  fieldLabel:
    "mb-1.5 block text-[12px] font-medium text-[color:var(--dashboard-muted)]",
  fieldError: "mt-1 text-[11px] text-[color:var(--dashboard-red)]",
  inputBase:
    "w-full border bg-[color:var(--dashboard-surface-2)] px-3.5 py-3 text-[14px] text-[color:var(--dashboard-text)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[color:var(--dashboard-muted)] focus:border-[color:var(--dashboard-accent)] focus:bg-[color:var(--dashboard-surface)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--dashboard-accent)_14%,transparent)]",
  primaryButton:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--dashboard-accent)] px-4 py-2.5 text-[13px] font-semibold text-white transition-[background-color,transform,box-shadow] duration-150 hover:bg-[#226b93] hover:shadow-[0_10px_24px_rgba(39,121,167,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
  secondaryButton:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] px-4 py-2.5 text-[13px] font-medium text-[color:var(--dashboard-muted)] transition-[border-color,color,background-color,transform] duration-150 hover:border-[color:var(--dashboard-accent)] hover:bg-[color:color-mix(in_srgb,var(--dashboard-accent)_7%,var(--dashboard-surface))] hover:text-[color:var(--dashboard-accent)] active:scale-[0.98]",
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
  Housing: "#c98016",
  "Food & Drink": COLORS.accent,
  Utilities: "#71879a",
  Shopping: "#60798b",
  Transport: "#d99a2b",
  Dining: "#358fbd",
  Subscriptions: "#486d83",
};

export const SPENDING_FALLBACK_COLOR = COLORS.muted;

export const chartTick = {
  fill: "var(--dashboard-muted)",
  fontSize: 11,
  fontFamily: FONTS.body.fontFamily,
};

export const DASHBOARD_TEXTURE =
  "linear-gradient(135deg, var(--dashboard-grid-line) 1px, transparent 1px)";

export const cx = (...classes) => classes.filter(Boolean).join(" ");
