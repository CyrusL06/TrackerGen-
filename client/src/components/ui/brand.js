export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap";

export const PREVIEW_ACCESS_KEY = "trackergen-preview-access";

export const NOISE_BACKGROUND =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")';

export const FONTS = {
  mono: "font-['DM_Mono']",
  display: "font-['Geist_Variable'] font-['sans-serif']",
};

export const FONT_FAMILIES = {
  mono: "'DM Mono', monospace",
  display: "'Geist Variable', sans-serif",
};

export const LAYOUT = {
  content: "mx-auto w-full max-w-[1200px] px-5 md:px-10",
  nav: "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-5 py-5 md:px-10",
};

export const COLORS = {
  bg: "#000000",
  surface: "#0a0a0a",
  surface2: "#141414",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  muted: "#9ca3af",
  accent: "#2779a7",
  dim: "#6b7280",
  amber: "#f1a935",
  danger: "#ff6b6b",
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");
