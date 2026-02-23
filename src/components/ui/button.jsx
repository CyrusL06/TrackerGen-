import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  default:
    "border border-[rgba(96,165,250,0.4)] bg-[linear-gradient(180deg,#3b82f6,#1d4ed8)] text-white shadow-[0_10px_25px_rgba(29,78,216,0.35)] hover:bg-[linear-gradient(180deg,#60a5fa,#2563eb)]",
  ghost:
    "bg-transparent text-[#94a3b8] hover:bg-[rgba(148,163,184,0.1)] hover:text-[#e2e8f0]",
  outline:
    "border border-[rgba(148,163,184,0.3)] bg-[rgba(8,14,30,0.75)] text-[#e2e8f0] hover:bg-[rgba(14,22,42,0.95)]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export default function UIButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.md,
        className,
      )}
    >
      {children}
    </button>
  );
}
