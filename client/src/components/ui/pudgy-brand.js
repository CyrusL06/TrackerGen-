export const FONTS = {
  display: "font-['Geist_Variable'] font-['sans-serif']",
  body: "font-['Geist_Variable'] font-['sans-serif']",
  mono: "font-['DM_Mono']",
};

export const COLORS = {
  blue: "#2779a7",
  blueLight: "#3a9bd1",
  blueDark: "#1d5f83",
  bg: "#000000",
  surface: "#0a0a0a",
  surface2: "#141414",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  muted: "#9ca3af",
  dim: "#6b7280",
};

export const LAYOUT = {
  content: "mx-auto w-full max-w-[1200px] px-5 md:px-10",
  nav: "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-5 py-5 md:px-10",
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");
