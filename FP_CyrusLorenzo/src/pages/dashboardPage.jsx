import React, { useEffect, useRef } from "react";
import { navigateTo } from "../router/router";
import UIButton from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

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
    <section className="dashboard-shell">
      <div className="dashboard-wrap">
        <header className="dashboard-header">
          <div>
            <h1>Income and Expense Tracker</h1>
            <p>Take control of your finances</p>
          </div>
          <button
            className="dashboard-close"
            aria-label="Back to home"
            onClick={() => navigateTo("/")}
          >
            x
          </button>
        </header>

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="dashboard-avatar">
              <span />
            </div>
            <h2>Welcome!</h2>

            <nav className="dashboard-nav">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`dashboard-nav-item ${item.active ? "active" : ""}`}
                  type="button"
                >
                  <span className="dashboard-dot" />
                  {item.label}
                </button>
              ))}
            </nav>

            <UIButton variant="outline" className="mt-2 w-full">
              Export Data
            </UIButton>
          </aside>

          <main className="dashboard-main">
            <div className="dashboard-stats">
              {statCards.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`dashboard-stat-value ${toneClass[item.tone]}`}>{item.value}</p>
                    <CardDescription>{item.note}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="dashboard-charts">
              <Card className="dashboard-chart-card">
                <CardHeader>
                  <h3 className="dashboard-chart-title">Spending by Category</h3>
                </CardHeader>
                <CardContent className="dashboard-chart-content">
                  <div className="dashboard-donut">
                    <canvas ref={donutCanvasRef} className="dashboard-donut-canvas" />
                  </div>
                  <ul className="dashboard-legend">
                    <li><span className="food" />Food</li>
                    <li><span className="transport" />Transportation</li>
                    <li><span className="housing" />Housing</li>
                    <li><span className="entertainment" />Entertainment</li>
                    <li><span className="shopping" />Shopping</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="dashboard-chart-card">
                <CardHeader>
                  <h3 className="dashboard-chart-title">Monthly Overview</h3>
                </CardHeader>
                <CardContent>
                  <div className="dashboard-bar-legend">
                    <span><i className="income" />Income</span>
                    <span><i className="expense" />Expenses</span>
                  </div>
                  <div className="dashboard-bar-frame">
                    <canvas ref={barCanvasRef} className="dashboard-bar-canvas" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
