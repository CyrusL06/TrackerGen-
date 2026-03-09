import React from "react";
import Button from "./buttons";

const riseInClass =
  "opacity-0 translate-y-[18px] [animation:rise-in_0.82s_cubic-bezier(0.22,1,0.36,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";
const panelHoverClass =
  "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(147,197,253,0.48)] hover:shadow-[0_18px_32px_rgba(2,6,23,0.36)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const metricPanelClass =
  "rounded-[14px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(4,5,12,0.92),rgba(2,3,8,0.92))] px-[1.1rem] py-4";

const lineChartHeights = ["14%", "24%", "35%", "28%", "30%", "26%", "40%", "44%", "90%"];
const barChartHeights = ["54%", "66%", "46%", "62%", "43%", "56%", "64%", "45%"];
const sparkBarHeights = [60, 48, 35, 56, 38, 52, 34, 44, 58, 36, 51, 32, 64];

export default function CardHero() {
  return (
    <section id="hero" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1
          className={`m-0 bg-[linear-gradient(180deg,#f3f4f6_0%,#9ca3af_100%)] bg-clip-text font-['Sora'] text-[clamp(2rem,6.4vw,4.9rem)] font-bold leading-[1.06] tracking-[-0.04em] text-transparent ${riseInClass}`}
          style={{ animationDelay: "0.14s" }}
        >
          Your All-in-One
          <br />
          Saving Companion
        </h1>

        <p
          className={`mx-auto mt-[1.3rem] max-w-[36rem] text-[clamp(0.92rem,1.3vw,1.28rem)] leading-[1.52] text-[#6b7280] ${riseInClass}`}
          style={{ animationDelay: "0.22s" }}
        >
          Simplify expense and portfolio management with cutting-edge tools designed for everyone from
          beginners to pros.
        </p>

        <div className={`mt-6 ${riseInClass}`} style={{ animationDelay: "0.3s" }}>
          <Button to="/login">Get Started</Button>
        </div>
      </div>

      <div
        id="product"
        className={`mt-14 rounded-[28px] border border-white/[0.06] bg-[#06070d] p-4 md:p-7 ${riseInClass}`}
        style={{ animationDelay: "0.38s" }}
      >
        <div className="grid gap-[0.85rem] min-[900px]:[grid-template-columns:1.2fr_1.2fr_1.2fr]">
          <article
            className={`${metricPanelClass} ${panelHoverClass} ${riseInClass}`}
            style={{ animationDelay: "0.52s" }}
          >
            <p className="text-[0.84rem] font-medium text-[#d1d5db]">Total Revenue</p>
            <p className="mt-[0.2rem] text-[2rem] font-bold tracking-[-0.02em] text-[#f3f4f6]">$15,231.89</p>
            <p className="mt-[0.12rem] text-[0.85rem] text-[#6b7280]">+20.1% from last month</p>

            <div className="mt-8 grid h-[72px] grid-cols-9 items-end gap-[0.45rem]">
              {lineChartHeights.map((height) => (
                <span
                  key={height}
                  className="rounded-full bg-[linear-gradient(180deg,rgba(209,213,219,0.78),rgba(209,213,219,0.36))]"
                  style={{ height }}
                />
              ))}
            </div>
          </article>

          <article
            className={`${metricPanelClass} ${panelHoverClass} ${riseInClass}`}
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-[0.84rem] font-medium text-[#d1d5db]">Subscriptions</p>
            <p className="mt-[0.2rem] text-[2rem] font-bold tracking-[-0.02em] text-[#f3f4f6]">+2350</p>
            <p className="mt-[0.12rem] text-[0.85rem] text-[#6b7280]">+180.1% from last month</p>

            <div className="mt-8 grid h-[78px] grid-cols-8 items-end gap-[0.48rem]">
              {barChartHeights.map((height) => (
                <span
                  key={height}
                  className="rounded-[5px] bg-[linear-gradient(180deg,rgba(249,250,251,0.9),rgba(209,213,219,0.8))]"
                  style={{ height }}
                />
              ))}
            </div>
          </article>

          <article
            id="pricing"
            className={`${metricPanelClass} ${panelHoverClass} ${riseInClass}`}
            style={{ animationDelay: "0.76s" }}
          >
            <p className="text-[1.05rem] font-bold text-[#e5e7eb]">Move Goal</p>
            <p className="mt-[0.12rem] text-[0.85rem] text-[#6b7280]">Set your daily activity goal.</p>

            <div className="mt-[0.8rem] flex items-center justify-between">
              <button
                type="button"
                aria-label="Decrease goal"
                className="h-8 w-8 rounded-full border border-white/15 bg-transparent text-[#9ca3af]"
              >
                -
              </button>

              <p className="m-0 text-center text-[2.2rem] font-bold leading-none text-[#f9fafb]">
                350
                <span className="mt-[0.28rem] block text-[0.62rem] font-medium tracking-[0.08em] text-[#6b7280]">
                  CALORIES/DAY
                </span>
              </p>

              <button
                type="button"
                aria-label="Increase goal"
                className="h-8 w-8 rounded-full border border-white/15 bg-transparent text-[#9ca3af]"
              >
                +
              </button>
            </div>

            <div className="mt-4 grid h-16 grid-cols-13 items-end gap-[0.35rem]">
              {sparkBarHeights.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-[4px] bg-[linear-gradient(180deg,rgba(229,231,235,0.88),rgba(209,213,219,0.68))]"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
