import React from "react";
import { navigateTo } from "../router/router";

const STYLES = {
  primary:
    "border border-[rgba(255,255,255,0.28)] bg-[linear-gradient(180deg,#2a2b30_0%,#121317_100%)] text-[var(--text-main)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.28),0_12px_28px_rgba(0,0,0,0.5)] hover:border-[rgba(255,255,255,0.42)]",
  secondary:
    "border border-[rgba(255,255,255,0.2)] bg-[rgba(9,10,13,0.85)] text-[var(--text-main)] hover:border-[rgba(255,255,255,0.35)]",
  outline:
    "border border-[rgba(255,255,255,0.3)] bg-transparent text-[var(--text-main)] hover:bg-[rgba(255,255,255,0.06)]",
  ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]",
};

const SIZES = {
  md: "px-10 py-3 text-lg",
  sm: "px-6 py-2 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  style,
  onClick,
  href,
  to,
  type = "button",
}) {
  const classes = `inline-flex items-center justify-center rounded-full font-semibold tracking-normal transition-all duration-200 ${SIZES[size] ?? SIZES.md} ${STYLES[variant] ?? STYLES.primary} ${className}`;

  if (to) {
    return (
      <button
        type="button"
        onClick={() => navigateTo(to)}
        className={classes}
        style={style}
      >
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} style={style}>
      {children}
    </button>
  );
}
