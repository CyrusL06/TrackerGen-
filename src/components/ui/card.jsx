import React from "react";
import { cn } from "../../lib/utils";

export function Card({ children, className = "", style }) {
  return (
    <article
      style={style}
      className={cn(
        "rounded-xl border border-[rgba(148,163,184,0.2)] bg-[linear-gradient(180deg,rgba(9,14,28,0.9),rgba(4,8,20,0.9))] shadow-[0_12px_28px_rgba(2,6,23,0.35)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function CardHeader({ children, className = "" }) {
  return <header className={cn("px-4 pb-2 pt-4", className)}>{children}</header>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={cn("text-sm font-semibold text-[#94a3b8]", className)}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={cn("mt-1 text-xs text-[#6b7f98]", className)}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
}
