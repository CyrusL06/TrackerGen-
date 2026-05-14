export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap";

export const PREVIEW_ACCESS_KEY = "trackergen-preview-access";

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
  bg: "#0a0a08",
  surface: "#111110",
  surface2: "#161615",
  border: "#222220",
  text: "#f2ede6",
  muted: "#6b6860",
  accent: "#c8f135",
  amber: "#f1a935",
  danger: "#ff6b6b",
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");
