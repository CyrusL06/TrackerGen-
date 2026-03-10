import React from "react";

export default function NavTextMenu({ text, className = "", style }) {
  return (
    <a
      
      href="../"
      style={style}
      className={`text-[16px]  text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)] ${className}`}
    >
      {text}
    </a>
  );
}
