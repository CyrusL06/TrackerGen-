export const FONTS = {
  hero: "font-['Space_Grotesk']",
  display: "font-['Space_Grotesk']",
  body: "font-['Inter_Variable']",
  mono: "font-['DM_Mono']",
};

export const COLORS = {
  blue: "#2779a7",
  blueLight: "#3a9bd1",
  blueDark: "#1d5f83",
  bg: "oklch(0.13 0.025 260)",
  surface: "oklch(0.17 0.03 260)",
  surface2: "oklch(0.21 0.04 260)",
  border: "rgba(255,255,255,0.06)",
  text: "oklch(0.92 0.015 260)",
  muted: "oklch(0.65 0.025 260)",
  dim: "oklch(0.52 0.025 260)",
};

export const LAYOUT = {
  content: "mx-auto w-full max-w-[1200px] px-5 md:px-10",
  nav: "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-5 py-5 md:px-10",
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");
