import React from "react";
import { navigations } from "../contents";
import NavTextMenu from "./navTextMenu";
import Button from "./buttons";

const riseInClass =
  "opacity-0 translate-y-[18px] [animation:rise-in_0.82s_cubic-bezier(0.22,1,0.36,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";

export default function Navbar() {
  return (
    <header
      className={`mx-auto w-full max-w-7xl px-4 pt-6 md:px-8 md:pt-8 ${riseInClass}`}
      style={{ animationDelay: "0.06s" }}
    >
      <nav className="grid items-center gap-4 md:grid-cols-3">
        <a href="#hero" className="flex items-center gap-3 text-[1.85rem] font-medium">
          <span
            className="h-[2.35rem] w-[2.35rem] rounded-full border border-white/35 bg-[radial-gradient(circle_at_34%_34%,rgba(255,255,255,0.5),rgba(156,163,175,0.15)_52%,rgba(2,6,23,0.12)_100%)] shadow-[0_0_20px_rgba(255,255,255,0.18)] [animation:dot-glow_3.8s_ease-in-out_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span>TrackerGen</span>
        </a>

        <div className="hidden items-center justify-center gap-10 md:flex">
          {navigations.map((nav, index) => (
            <NavTextMenu
              text={nav.name}
              href={nav.href}
              key={nav.id}
              className={riseInClass}
              style={{ animationDelay: `${0.12 + index * 0.08}s` }}
            />
          ))}
        </div>

        <Button
          to="/dashboard"
          size="sm"
          style={{ animationDelay: "0.22s" }}
          className={`ml-auto md:justify-self-end ${riseInClass}`}
        >
          Get Started Now
        </Button>
      </nav>
    </header>
  );
}
