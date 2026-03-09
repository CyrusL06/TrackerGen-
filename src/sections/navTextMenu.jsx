import React from "react";

export default function NavTextMenu({ text, href, className = "", style }) {
  return (
    <a
      href={href}
      style={style}
      className={`text-lg font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)] ${className}`}
    >
      {text}
    </a>
  );
}
