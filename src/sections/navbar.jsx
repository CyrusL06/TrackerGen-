import React from "react";
import { navigations } from "../contents";
import NavTextMenu from "./navTextMenu";
import Button from "./buttons";

export default function Navbar() {
  return (
    <header className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8 md:pt-8 motion-rise motion-delay-1">
      <nav className="grid items-center gap-4 md:grid-cols-3">
        <a href="#hero" className="flex items-center gap-3 text-[1.85rem] font-medium text-[var(--text-main)]">
          <span className="logo-dot" aria-hidden="true" />
          <span>TrackerGen</span>
        </a>

        <div className="hidden items-center justify-center gap-10 md:flex">
          {navigations.map((nav, index) => (
            <NavTextMenu
              text={nav.name}
              href={nav.href}
              key={nav.id}
              className="motion-rise"
              style={{ animationDelay: `${0.12 + index * 0.08}s` }}
            />
          ))}
        </div>

        <Button to="/dashboard" size="sm" className="ml-auto md:justify-self-end motion-rise motion-delay-3">
          Get Started Now
        </Button>
      </nav>
    </header>
  );
}
