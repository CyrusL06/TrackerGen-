import React from "react";

export default function NavTextMenu({ text, href }) {
  return (
    <a
      href={href}
      className="text-lg font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-main)]"
    >
      {text}
    </a>
  );
}
