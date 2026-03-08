import React, { useEffect, useRef } from "react";
import { navigateTo } from "../router/router";
import Button from "../sections/buttons";

const menuItems = [
  { id: 1, label: "Dashboard", active: true },
  { id: 2, label: "Transactions", active: false },
  { id: 3, label: "Budgets", active: false },
  { id: 4, label: "Reports", active: false },
  { id: 5, label: "Savings Goals", active: false },
];

const statCards = [
  { id: 1, title: "Total Balance", value: "$11150.00", note: "0% from last month", tone: "base" },
  { id: 2, title: "Monthly Income", value: "$12000.00", note: "This month", tone: "income" },
  { id: 3, title: "Monthly Expenses", value: "$850.00", note: "This month", tone: "expense" },
  { id: 4, title: "Savings Rate", value: "92.9%", note: "% of income", tone: "base" },
];

const toneClass = {
  base: "text-[#f1f5f9]",
  income: "text-[#5eead4]",
  expense: "text-[#fb7185]",
};

const riseInClass =
  "opacity-0 translate-y-[18px] [animation:rise-in_0.82s_cubic-bezier(0.22,1,0.36,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";
const panelHoverClass =
  "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(147,197,253,0.48)] hover:shadow-[0_18px_32px_rgba(2,6,23,0.36)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const cardSurfaceClass =
  "rounded-xl border border-[rgba(148,163,184,0.24)] bg-[linear-gradient(180deg,rgba(8,13,28,0.9),rgba(3,7,18,0.9))]";

const CHART_SCRIPT_ID = "chartjs-cdn-script";
const CHART_SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js";

const loadChartJs = () =>
  new Promise((resolve, reject) => {
    if (window.Chart) {
      resolve(window.Chart);
      return;
    }

    const existing = document.getElementById(CHART_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Chart), { once: true });
      existing.addEventListener("error", () => reject(new Error("Chart.js failed to load")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = CHART_SCRIPT_ID;
    script.src = CHART_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Chart);
    script.onerror = () => reject(new Error("Chart.js failed to load"));
    document.head.appendChild(script);
  });

function StatCard({ title, value, note, tone, delay }) {
  return (
    <article className={`${cardSurfaceClass} p-4 ${panelHoverClass} ${riseInClass}`} style={{ animationDelay: delay }}>
      <header className="pb-2">
        <h3 className="text-sm font-semibold text-[#94a3b8]">{title}</h3>
      </header>

      <div>
        <p className={`mt-[0.1rem] text-[1.9rem] font-bold tracking-[-0.02em] ${toneClass[tone]}`}>{value}</p>
        <p className="mt-1 text-xs text-[#6b7f98]">{note}</p>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const donutCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);

  useEffect(() => {
    let donutChart = null;
    let barChart = null;
    let cancelled = false;

    const setupCharts = async () => {
      try {
        const Chart = await loadChartJs();
        if (cancelled) return;

        if (donutCanvasRef.current) {
          donutChart = new Chart(donutCanvasRef.current, {
            type: "doughnut",
            data: {
              labels: ["Food", "Transportation", "Housing", "Entertainment", "Shopping"],
              datasets: [
                {
                  data: [24, 7, 55, 11, 3],
                  backgroundColor: ["#f35d7f", "#3499e6", "#efc654", "#53b4b7", "#9f73ea"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              cutout: "56%",
              animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1100,
                easing: "easeOutQuart",
              },
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              maintainAspectRatio: false,
            },
          });
        }

        if (barCanvasRef.current) {
          barChart = new Chart(barCanvasRef.current, {
            type: "bar",
            data: {
              labels: ["June 25"],
              datasets: [
                {
                  label: "Income",
                  data: [12000],
                  backgroundColor: "#67e8f9",
                  borderRadius: 6,
                },
                {
                  label: "Expenses",
                  data: [850],
                  backgroundColor: "#fb7185",
                  borderRadius: 6,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1200,
                easing: "easeOutQuart",
              },
              scales: {
                y: {
                  beginAtZero: true,
                  suggestedMax: 12000,
                  ticks: { stepSize: 2000, color: "#7a8ca5" },
                  grid: { color: "rgba(148,163,184,0.16)" },
                },
                x: {
                  ticks: { color: "#7a8ca5" },
                  grid: { display: false },
                },
              },
              plugins: {
                legend: { display: false },
              },
            },
          });
        }
      } catch {
        // If CDN fails, leave static fallback structure and keep page usable.
      }
    };

    setupCharts();

    return () => {
      cancelled = true;
      if (donutChart) donutChart.destroy();
      if (barChart) barChart.destroy();
    };
  }, []);

  return (
    <section className="min-h-screen bg-[radial-gradient(900px_circle_at_12%_-8%,rgba(59,130,246,0.2)_0%,rgba(59,130,246,0)_60%),radial-gradient(800px_circle_at_88%_-6%,rgba(45,212,191,0.14)_0%,rgba(45,212,191,0)_58%),#000] p-4">
      <div className="mx-auto max-w-[1240px]">
        <header
          className={`flex items-start justify-between gap-4 border-b border-[rgba(148,163,184,0.18)] pb-[0.9rem] ${riseInClass}`}
          style={{ animationDelay: "0.06s" }}
        >
          <div>
            <h1 className="m-0 text-[clamp(1.2rem,2.5vw,2rem)] font-bold tracking-[-0.02em] text-[#f1f5f9]">
              Income and Expense Tracker
            </h1>
            <p className="mt-[0.25rem] text-[0.95rem] text-[#7a8ca5]">Take control of your finances</p>
          </div>

          <button
            className="h-10 w-10 rounded-full border border-[rgba(148,163,184,0.32)] bg-[rgba(9,14,28,0.78)] text-[1.1rem] text-[#e2e8f0] transition-[transform,background-color] duration-200 ease-out hover:rotate-90 hover:bg-[rgba(21,30,55,0.9)] motion-reduce:transition-none motion-reduce:hover:rotate-0"
            aria-label="Back to home"
            onClick={() => navigateTo("/")}
          >
            x
          </button>
        </header>

        <div className="mt-4 grid gap-4 min-[980px]:grid-cols-[210px_1fr]">
          <aside
            className={`${cardSurfaceClass} p-4 ${riseInClass}`}
            style={{ animationDelay: "0.14s" }}
          >
            <div className="grid place-items-center">
              <span className="relative h-[3.2rem] w-[3.2rem] rounded-full bg-[radial-gradient(circle_at_36%_30%,#60a5fa,#3b82f6)] before:absolute before:left-[1.2rem] before:top-[0.72rem] before:h-[0.8rem] before:w-[0.8rem] before:rounded-full before:bg-[#e0f2fe] before:content-[''] after:absolute after:left-[0.96rem] after:top-[1.58rem] after:h-[0.92rem] after:w-[1.32rem] after:rounded-[999px_999px_0.35rem_0.35rem] after:bg-[#e0f2fe] after:content-['']" />
            </div>

            <h2 className="mb-4 mt-[0.9rem] text-center text-[1.6rem] font-bold text-[#f8fafc]">Welcome!</h2>

            <nav className="mb-3 grid gap-[0.35rem]">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-[0.7rem] text-left text-[1.02rem] transition-[transform,background-color,color] duration-200 ease-out ${
                    item.active
                      ? "bg-[linear-gradient(180deg,#3b82f6,#1d4ed8)] text-[#f8fafc]"
                      : "text-[#94a3b8] hover:translate-x-1 hover:text-[#e2e8f0]"
                  }`}
                  type="button"
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {item.label}
                </button>
              ))}
            </nav>

            <Button variant="outline" size="sm" className="mt-2 w-full rounded-md">
              Export Data
            </Button>
          </aside>

          <main
            className={`${cardSurfaceClass} p-4 ${riseInClass}`}
            style={{ animationDelay: "0.22s" }}
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
              {statCards.map((item, index) => (
                <StatCard
                  key={item.id}
                  title={item.title}
                  value={item.value}
                  note={item.note}
                  tone={item.tone}
                  delay={`${0.32 + index * 0.08}s`}
                />
              ))}
            </div>

            <div className="mt-3 grid gap-3 min-[980px]:grid-cols-2">
              <article
                className={`${cardSurfaceClass} min-h-[320px] ${panelHoverClass} ${riseInClass}`}
                style={{ animationDelay: "0.72s" }}
              >
                <header className="px-4 pb-2 pt-4">
                  <h3 className="m-0 text-[1.45rem] font-bold text-[#93c5fd]">Spending by Category</h3>
                </header>

                <div className="grid gap-3 px-4 pb-4 min-[980px]:grid-cols-[1fr_auto] min-[980px]:items-center">
                  <div className="relative mx-auto aspect-square w-[min(300px,74vw)]">
                    <canvas ref={donutCanvasRef} className="h-full w-full" />
                  </div>

                  <ul className="m-0 grid list-none gap-[0.35rem] p-0 text-[0.9rem] text-[#7a8ca5]">
                    <li className="flex items-center gap-[0.45rem]"><span className="h-[0.8rem] w-[0.8rem] rounded-[0.12rem] bg-[#f35d7f]" />Food</li>
                    <li className="flex items-center gap-[0.45rem]"><span className="h-[0.8rem] w-[0.8rem] rounded-[0.12rem] bg-[#3499e6]" />Transportation</li>
                    <li className="flex items-center gap-[0.45rem]"><span className="h-[0.8rem] w-[0.8rem] rounded-[0.12rem] bg-[#efc654]" />Housing</li>
                    <li className="flex items-center gap-[0.45rem]"><span className="h-[0.8rem] w-[0.8rem] rounded-[0.12rem] bg-[#53b4b7]" />Entertainment</li>
                    <li className="flex items-center gap-[0.45rem]"><span className="h-[0.8rem] w-[0.8rem] rounded-[0.12rem] bg-[#9f73ea]" />Shopping</li>
                  </ul>
                </div>
              </article>

              <article
                className={`${cardSurfaceClass} min-h-[320px] ${panelHoverClass} ${riseInClass}`}
                style={{ animationDelay: "0.8s" }}
              >
                <header className="px-4 pb-2 pt-4">
                  <h3 className="m-0 text-[1.45rem] font-bold text-[#93c5fd]">Monthly Overview</h3>
                </header>

                <div className="px-4 pb-4">
                  <div className="flex gap-[0.9rem] text-[0.88rem] text-[#7a8ca5]">
                    <span className="inline-flex items-center gap-[0.35rem]">
                      <i className="h-[0.9rem] w-[0.9rem] rounded-[0.12rem] bg-[#67e8f9]" />
                      Income
                    </span>
                    <span className="inline-flex items-center gap-[0.35rem]">
                      <i className="h-[0.9rem] w-[0.9rem] rounded-[0.12rem] bg-[#fb7185]" />
                      Expenses
                    </span>
                  </div>

                  <div className="mt-[0.9rem] h-[260px] border-y border-[rgba(148,163,184,0.16)] px-[0.6rem] pb-[0.9rem] pt-[1.2rem]">
                    <canvas ref={barCanvasRef} className="h-full w-full" />
                  </div>
                </div>
              </article>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
