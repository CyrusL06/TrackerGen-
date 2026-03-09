import React from "react";
import { trustedLogos } from "../assets/contents";

const riseInClass =
  "opacity-0 translate-y-[18px] [animation:rise-in_0.82s_cubic-bezier(0.22,1,0.36,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";
const panelHoverClass =
  "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(147,197,253,0.48)] hover:shadow-[0_18px_32px_rgba(2,6,23,0.36)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const iconBaseClass =
  "relative inline-block h-[clamp(1.75rem,2.2vw,2.8rem)] w-[clamp(1.75rem,2.2vw,2.8rem)] shrink-0 [animation:icon-float_4.6s_ease-in-out_infinite] motion-reduce:animate-none";

const iconClassMap = {
  aceternity:
    "rounded-[0.78rem] bg-[linear-gradient(180deg,#ffffff,#e4e4e7)] before:absolute before:inset-0 before:grid before:place-items-center before:content-['A'] before:text-[1.15rem] before:font-black before:text-[#09090b]",
  gamity:
    "rounded-full bg-[conic-gradient(from_120deg,#16a34a,#0ea5e9,#f97316,#16a34a)] after:absolute after:inset-[26%] after:rounded-full after:bg-[#020617] after:content-['']",
  host:
    "rounded-full bg-[radial-gradient(circle_at_35%_35%,#67e8f9_0%,#2563eb_42%,#0c4a6e_80%)] before:absolute before:inset-[20%] before:rounded-full before:border-[3px] before:border-white/55 before:content-['']",
  asteroid:
    "before:absolute before:inset-[8%_10%] before:bg-[linear-gradient(180deg,#22d3ee,#0891b2)] before:[clip-path:polygon(50%_0%,100%_100%,0%_100%)] before:content-[''] after:absolute after:bottom-[16%] after:left-[calc(50%-0.2rem)] after:h-[0.4rem] after:w-[0.4rem] after:rounded-full after:bg-[#d1d5db] after:content-['']",
};

export default function TrustedSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-14 md:px-8 md:pt-20">
      <div className="text-center">
        <h2
          className={`m-0 bg-[linear-gradient(180deg,#f8fafc_0%,#9ca3af_95%)] bg-clip-text font-['Sora'] text-[clamp(1.85rem,4vw,3.8rem)] leading-[1.12] tracking-[-0.03em] text-transparent ${riseInClass}`}
          style={{ animationDelay: "0.06s" }}
        >
          Trusted by Industry Leaders
        </h2>

        <p
          className={`mx-auto mt-[1.1rem] max-w-[44rem] text-[clamp(0.95rem,1.55vw,1.5rem)] leading-[1.5] text-[#52525b] ${riseInClass}`}
          style={{ animationDelay: "0.14s" }}
        >
          Join the ranks of forward-thinking companies already leveraging our AI technology
        </p>
      </div>

      <div className="mt-[3.3rem] grid gap-x-[1.6rem] gap-y-4 min-[950px]:grid-cols-4">
        {trustedLogos.map((logo, index) => (
          <article
            key={logo.id}
            className={`flex items-center justify-center gap-[0.9rem] ${panelHoverClass} ${riseInClass}`}
            style={{ animationDelay: `${0.24 + index * 0.08}s` }}
          >
            <span className={`${iconBaseClass} ${iconClassMap[logo.kind]}`} aria-hidden="true" />
            <p className="m-0 text-[clamp(1.05rem,1.55vw,1.85rem)] font-semibold leading-none tracking-[-0.02em] text-[#fafafa]">
              {logo.name}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
