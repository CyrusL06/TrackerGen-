import { useState } from "react";
import CashFlowSection from "@/components/ui2.0/dashboard/cashFlowSection";
import SpendingSection from "../components/ui2.0/dashboard/spendingSection";
import StatsSection from "../components/ui2.0/dashboard/statsSection";
import TopNav from "../components/ui2.0/dashboard/topNav";
import TransactionModal from "../components/ui2.0/dashboard/transactionModal";
import TransactionsSection from "../components/ui2.0/dashboard/transactionsSection";
import {
  COLORS,
  DASHBOARD_TEXTURE,
  FONTS,
  PAGE_VARS,
  TW,
} from "../components/ui2.0/dashboard/shared.js";

const initialCashFlow = [
  { month: "Aug", income: 5800, expenses: 2100 },
  { month: "Sep", income: 6100, expenses: 2400 },
  { month: "Oct", income: 5600, expenses: 1900 },
  { month: "Nov", income: 6400, expenses: 2600 },
  { month: "Dec", income: 7200, expenses: 3100 },
  { month: "Jan", income: 6000, expenses: 2200 },
  { month: "Feb", income: 6400, expenses: 2050 },
  { month: "Mar", income: 6400, expenses: 2180 },
];

const initialTxns = [
  { id: 1, name: "Blue Bottle Coffee", cat: "Food & Drink", amount: -6.5, date: "Mar 12" },
  { id: 2, name: "Freelance Payment", cat: "Income", amount: 1200, date: "Mar 12" },
  { id: 3, name: "Rent - March", cat: "Housing", amount: -1400, date: "Mar 1" },
  { id: 4, name: "Uniqlo", cat: "Shopping", amount: -89, date: "Feb 28" },
  { id: 5, name: "Electricity Bill", cat: "Utilities", amount: -142, date: "Feb 27" },
  { id: 6, name: "Grab Ride", cat: "Transport", amount: -18.5, date: "Feb 26" },
];

const formatWholeDollars = (value) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCurrencyDelta(value) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}${formatWholeDollars(Math.abs(value))}`;
}

function formatTxnDate(rawDate) {
  if (!rawDate) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [, month, day] = rawDate.split("-");
    const label = monthLabels[Number(month) - 1];
    return `${label} ${Number(day)}`;
  }

  return rawDate;
}

function getMonthLabel(rawDate) {
  if (!rawDate) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [, month] = rawDate.split("-");
    return monthLabels[Number(month) - 1] ?? null;
  }

  return rawDate.slice(0, 3);
}

function applyAmountToCashFlow(snapshot, txn, direction) {
  const monthLabel = getMonthLabel(txn.date);
  if (!monthLabel) return snapshot;

  return snapshot.map((month) => {
    if (month.month !== monthLabel) return month;

    if (txn.amount > 0) {
      return {
        ...month,
        income: Math.max(0, month.income + Math.abs(txn.amount) * direction),
      };
    }

    return {
      ...month,
      expenses: Math.max(0, month.expenses + Math.abs(txn.amount) * direction),
    };
  });
}

export default function Dashboard() {
  const [txns, setTxns] = useState(initialTxns);
  const [cashFlow, setCashFlow] = useState(initialCashFlow);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    cat: "Food & Drink",
    type: "expense",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [lastRemoved, setLastRemoved] = useState(null);

  const totalIncome = txns.filter((txn) => txn.amount > 0).reduce((sum, txn) => sum + txn.amount, 0);
  const totalExpenses = txns
    .filter((txn) => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
  const netChange = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const incomeEntries = txns.filter((txn) => txn.amount > 0).length;
  const expenseEntries = txns.filter((txn) => txn.amount < 0).length;

  const statCards = [
    {
      label: "Net Change",
      value: formatCurrencyDelta(netChange),
      change: `${txns.length} entries`,
      up: netChange >= 0,
      accent: COLORS.text,
      sub: "current snapshot",
    },
    {
      label: "Income",
      value: formatWholeDollars(totalIncome),
      change: `${incomeEntries} entries`,
      up: true,
      accent: COLORS.accent,
      sub: "tracked income",
    },
    {
      label: "Expenses",
      value: formatWholeDollars(totalExpenses),
      change: `${expenseEntries} entries`,
      up: false,
      accent: COLORS.amber,
      sub: "tracked spend",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      change: totalIncome > 0 ? formatCurrencyDelta(totalIncome - totalExpenses) : "$0",
      up: totalIncome - totalExpenses >= 0,
      accent: COLORS.accent,
      sub: "left after spend",
    },
  ];

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Add a short description";
    if (!form.amount || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      nextErrors.amount = "Enter a valid amount greater than 0";
    }
    if (!form.date) nextErrors.date = "Choose a date";

    return nextErrors;
  }

  function handleSubmit() {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const amount =
      form.type === "expense" ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount));
    const newTxn = {
      id: Date.now(),
      name: form.name.trim(),
      cat: form.cat,
      amount,
      date: formatTxnDate(form.date),
    };

    setTxns((prev) => [newTxn, ...prev]);
    setCashFlow((prev) => applyAmountToCashFlow(prev, newTxn, 1));

    setForm({ name: "", amount: "", cat: "Food & Drink", type: "expense", date: "" });
    setErrors({});
    setShowForm(false);
    setLastRemoved(null);
    setStatusMessage({
      tone: "success",
      text: `${newTxn.name} was added to the current month review.`,
    });
  }

  function resetFormState() {
    setShowForm(false);
    setErrors({});
  }

  function deleteTxn(id) {
    const removedTxn = txns.find((txn) => txn.id === id);
    if (!removedTxn) return;

    setTxns((prev) => prev.filter((txn) => txn.id !== id));
    setCashFlow((prev) => applyAmountToCashFlow(prev, removedTxn, -1));
    setLastRemoved(removedTxn);
    setStatusMessage({
      tone: "warning",
      text: `${removedTxn.name} was removed from the month review.`,
      action: "Undo",
    });
  }

  function openForm() {
    setShowForm(true);
    setStatusMessage(null);
  }

  function updateFormField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  }

  function updateFormType(type) {
    setForm((prev) => ({ ...prev, type }));
  }

  function undoRemove() {
    if (!lastRemoved) return;

    setTxns((prev) => [lastRemoved, ...prev]);
    setCashFlow((prev) => applyAmountToCashFlow(prev, lastRemoved, 1));
    setStatusMessage({
      tone: "success",
      text: `${lastRemoved.name} was restored to the month review.`,
    });
    setLastRemoved(null);
  }

  return (
    <div className={TW.page} style={{ ...FONTS.mono, ...PAGE_VARS }}>
      <div
        className={TW.pageTexture}
        style={{ backgroundImage: DASHBOARD_TEXTURE }}
      />
      <TopNav onAddTransaction={openForm} />

      <div className={TW.pageShell}>
        {statusMessage ? (
          <div
            className={`mb-4 flex flex-col gap-3 border px-4 py-3 text-[12px] leading-6 sm:flex-row sm:items-center sm:justify-between ${
              statusMessage.tone === "warning"
                ? "border-[color:color-mix(in_srgb,var(--dashboard-amber)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--dashboard-amber)_8%,transparent)]"
                : "border-[color:color-mix(in_srgb,var(--dashboard-accent)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--dashboard-accent)_8%,transparent)]"
            }`}
            role="status"
          >
            <span>{statusMessage.text}</span>
            {statusMessage.action === "Undo" ? (
              <button type="button" onClick={undoRemove} className={TW.secondaryButton}>
                Undo remove
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mb-4 border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] px-4 py-3 text-[12px] leading-6 text-[color:var(--dashboard-muted)]">
          Preview build: manual entries update the current month snapshot on this screen.
        </div>

        <StatsSection cards={statCards} />

        <div className="mb-2.5 grid gap-2.5 lg:grid-cols-[1.4fr_1fr]">
          <CashFlowSection cashFlow={cashFlow} />
          <SpendingSection totalExpenses={totalExpenses} />
        </div>

        <TransactionsSection
          txns={txns}
          onAddTransaction={openForm}
          onDeleteTransaction={deleteTxn}
        />
      </div>

      <TransactionModal
        show={showForm}
        form={form}
        errors={errors}
        onClose={resetFormState}
        onSubmit={handleSubmit}
        onFieldChange={updateFormField}
        onTypeChange={updateFormType}
      />
    </div>
  );
}
