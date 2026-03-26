export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap";

export const NOISE_BACKGROUND =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")';

export const FONTS = {
  mono: "font-['DM_Mono']",
  display: "font-['Bebas_Neue']",
  serif: "font-['Instrument_Serif'] italic",
};

export const FONT_FAMILIES = {
  mono: "'DM Mono', monospace",
  display: "'Bebas Neue', sans-serif",
  serif: "'Instrument Serif', serif",
};

export const LAYOUT = {
  content: "mx-auto w-full max-w-[1100px] px-4 md:px-10",
  nav: "mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-4 py-5 md:px-10",
  footer: "w-full px-4 py-8 md:px-10",
};

export const COLORS = {
  bg: "#12100d",
  surface: "#1a1713",
  surface2: "#211d18",
  border: "#312a24",
  text: "#f5efe6",
  muted: "#b6ab9c",
  accent: "#c9a86a",
  amber: "#d6804d",
  danger: "#dd6b5f",
};

export const BRAND_VARS = {
  "--brand-bg": COLORS.bg,
  "--brand-surface": COLORS.surface,
  "--brand-surface-2": COLORS.surface2,
  "--brand-border": COLORS.border,
  "--brand-text": COLORS.text,
  "--brand-muted": COLORS.muted,
  "--brand-accent": COLORS.accent,
  "--brand-amber": COLORS.amber,
  "--brand-danger": COLORS.danger,
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");
