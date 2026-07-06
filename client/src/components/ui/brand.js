export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap";

export const PREVIEW_ACCESS_KEY = "trackergen-preview-access";

export const NOISE_BACKGROUND =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")';

export const FONTS = {
  hero: "font-['Space_Grotesk']",
  mono: "font-['DM_Mono']",
  display: "font-['Space_Grotesk']",
  body: "font-['Inter_Variable']",
};

export const FONT_FAMILIES = {
  hero: "'Space Grotesk', system-ui, -apple-system, sans-serif",
  mono: "'DM Mono', monospace",
  display: "'Space Grotesk', system-ui, -apple-system, sans-serif",
  body: "'Inter Variable', system-ui, -apple-system, sans-serif",
};

export const LAYOUT = {
  content: "mx-auto w-full max-w-[1200px] px-5 md:px-10",
  nav: "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-5 py-5 md:px-10",
};

export const COLORS = {
  bg: "oklch(0.13 0.025 260)",
  surface: "oklch(0.17 0.03 260)",
  surface2: "oklch(0.21 0.04 260)",
  border: "rgba(255,255,255,0.06)",
  text: "oklch(0.92 0.015 260)",
  muted: "oklch(0.65 0.025 260)",
  accent: "#2779a7",
  dim: "oklch(0.52 0.025 260)",
  amber: "#f1a935",
  danger: "#ff6b6b",
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");
