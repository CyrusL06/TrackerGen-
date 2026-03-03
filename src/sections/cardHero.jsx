import React from "react";
import Button from "./buttons";


export default function CardHero() {
  return (
    <section id="hero" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="hero-title motion-rise motion-delay-2">
          Your All-in-One
          <br />
          Saving Companion
        </h1>
        <p className="hero-subtitle motion-rise motion-delay-3">
          Simplify expense and portfolio management with cutting-edge tools
          designed for everyone from beginners to pros.
        </p>
        <div className="mt-6 motion-rise motion-delay-4">
          <Button to="/dashboard">Get Started</Button>
        </div>
      </div>

      <div id="product" className="metrics-shell mt-14 rounded-[28px] p-4 md:p-7 motion-rise motion-delay-5">
        <div className="metrics-grid">
          
          <article className="metric-panel panel-hover motion-rise" style={{ animationDelay: "0.52s" }}>
            <p className="metric-label">Total Revenue</p>
            <p className="metric-value">$15,231.89</p>
            <p className="metric-change">+20.1% from last month</p>
            <div className="line-chart mt-8">
              <span style={{ height: "14%" }} />
              <span style={{ height: "24%" }} />
              <span style={{ height: "35%" }} />
              <span style={{ height: "28%" }} />
              <span style={{ height: "30%" }} />
              <span style={{ height: "26%" }} />
              <span style={{ height: "40%" }} />
              <span style={{ height: "44%" }} />
              <span style={{ height: "90%" }} />
            </div>
          </article>

          <article className="metric-panel panel-hover motion-rise" style={{ animationDelay: "0.6s" }}>
            <p className="metric-label">Subscriptions</p>
            <p className="metric-value">+2350</p>
            <p className="metric-change">+180.1% from last month</p>
            <div className="bar-chart mt-8">
              <span style={{ height: "54%" }} />
              <span style={{ height: "66%" }} />
              <span style={{ height: "46%" }} />
              <span style={{ height: "62%" }} />
              <span style={{ height: "43%" }} />
              <span style={{ height: "56%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "45%" }} />
            </div>
          </article>

          <article className="metric-panel panel-hover motion-rise" style={{ animationDelay: "0.68s" }}>
            <div className="calendar-head">
              <button aria-label="Previous month">&lt;</button>
              <p>June 2023</p>
              <button aria-label="Next month">&gt;</button>
            </div>
            <div className="calendar-grid">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="calendar-day">
                  {day}
                </span>
              ))}
              {[28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
                (date) => (
                  <span key={date} className={date === 13 ? "calendar-date active" : "calendar-date"}>
                    {date}
                  </span>
                ),
              )}
            </div>
          </article>

          <article id="pricing" className="metric-panel panel-hover motion-rise" style={{ animationDelay: "0.76s" }}>
            <p className="metric-title">Move Goal</p>
            <p className="metric-change">Set your daily activity goal.</p>
            <div className="goal-wrap">
              <button aria-label="Decrease goal">-</button>
              <p>
                350
                <span>CALORIES/DAY</span>
              </p>
              <button aria-label="Increase goal">+</button>
            </div>
            <div className="spark-bars">
              {[60, 48, 35, 56, 38, 52, 34, 44, 58, 36, 51, 32, 64].map((value) => (
                <span key={value} style={{ height: `${value}%` }} />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
