import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CashFlowSection from "@/components/ui/dashboard/cashFlowSection";
import {
  createTransaction,
  createTelegramLinkCode,
  deleteTransactionById,
  fetchTelegramProfile,
  fetchTransactions,
  logout,
  updateTransactionById,
} from "@/lib/auth";

import SpendingSection from "../components/ui/dashboard/spendingSection";
import StatsSection from "../components/ui/dashboard/statsSection";
import TelegramConnect from "../components/ui/dashboard/telegramConnect";
import TopNav from "../components/ui/dashboard/topNav";
import TransactionModal from "../components/ui/dashboard/transactionModal";
import TransactionsSection from "../components/ui/dashboard/transactionsSection";
import {
  COLORS,
  DASHBOARD_TEXTURE,
  EXPENSE_CATEGORIES,
  FONTS,
  PAGE_VARS,
  SPENDING_CATEGORY_COLORS,
  SPENDING_FALLBACK_COLOR,
  TW,
} from "../components/ui/dashboard/shared.js";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const rangeConfig = {
  "6m": 6,
  "12m": 12,
};

const formatWholeDollars = (value) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

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

function parseIsoDate(rawDate) {
  if (typeof rawDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return null;
  }

  const parsed = new Date(`${rawDate}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDashboardTxn(txn) {
  const rawDate = txn.rawDate ?? txn.date;

  return {
    id: txn._id ?? txn.id,
    name: txn.name,
    cat: txn.category ?? txn.cat,
    amount: Number(txn.amount),
    rawDate,
    date: formatTxnDate(rawDate),
  };
}

function normalizeFetchedTransactions(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) =>
    toDashboardTxn({
      ...item,
      rawDate: item.date,
    }),
  );
}

function buildCashFlowFromTransactions(transactions, selectedRange) {
  const monthsToShow = rangeConfig[selectedRange] ?? rangeConfig["6m"];
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const buckets = Array.from({ length: monthsToShow }, (_, index) => {
    const monthDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - (monthsToShow - 1 - index),
      1,
    );

    return {
      month: monthLabels[monthDate.getMonth()],
      monthKey: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`,
      income: 0,
      expenses: 0,
      net: 0,
    };
  });

  const bucketLookup = new Map(buckets.map((bucket) => [bucket.monthKey, bucket]));

  transactions.forEach((txn) => {
    const txnDate = parseIsoDate(txn.rawDate);
    if (!txnDate) return;

    const monthKey = `${txnDate.getFullYear()}-${String(txnDate.getMonth() + 1).padStart(2, "0")}`;
    const bucket = bucketLookup.get(monthKey);
    if (!bucket) return;

    if (txn.amount > 0) {
      bucket.income += Math.abs(txn.amount);
    } else if (txn.amount < 0) {
      bucket.expenses += Math.abs(txn.amount);
    }
  });

  return buckets.map((bucket) => ({
    ...bucket,
    net: bucket.income - bucket.expenses,
  }));
}

function buildCategoryBreakdown(transactions) {
  const totalsByCategory = new Map();

  transactions.forEach((txn) => {
    if (txn.amount >= 0) return;

    const category = txn.cat?.trim() || "Other";
    totalsByCategory.set(category, (totalsByCategory.get(category) ?? 0) + Math.abs(txn.amount));
  });

  const unknownCategories = Array.from(totalsByCategory.keys())
    .filter((category) => !EXPENSE_CATEGORIES.includes(category))
    .sort((left, right) => left.localeCompare(right));

  const orderedCategories = [...EXPENSE_CATEGORIES, ...unknownCategories];
  const totalExpenses = Array.from(totalsByCategory.values()).reduce((sum, amount) => sum + amount, 0);

  return orderedCategories.map((category) => {
    const amount = totalsByCategory.get(category) ?? 0;

    return {
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      color: SPENDING_CATEGORY_COLORS[category] ?? SPENDING_FALLBACK_COLOR,
    };
  });
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [txns, setTxns] = useState([]);
  const [selectedRange, setSelectedRange] = useState("6m");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
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
  const [telegram, setTelegram] = useState(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState("");
  const onboardingSummary = location.state?.onboardingSummary ?? null;
  const cashFlowData = buildCashFlowFromTransactions(txns, selectedRange);
  const categoryBreakdown = buildCategoryBreakdown(txns);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchTransactions(), fetchTelegramProfile()])
      .then(([items, telegramProfile]) => {
        if (cancelled) return;
        setTxns(normalizeFetchedTransactions(items));
        setTelegram(telegramProfile);
      })
      .catch((error) => {
        console.log("Failed to load dashboard data:", error);
        if (!cancelled) {
          setTxns([]);
          setTelegramError("Telegram setup could not be loaded.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshTransactions() {
    try {
      const items = await fetchTransactions();
      setTxns(normalizeFetchedTransactions(items));
    } catch (error) {
      console.log("Failed to refresh transactions:", error);
    }
  }

  async function handleCreateTelegramCode() {
    setTelegramLoading(true);
    setTelegramError("");

    try {
      const nextTelegram = await createTelegramLinkCode();
      setTelegram(nextTelegram);
    } catch (error) {
      console.log("Failed to create Telegram code:", error);
      setTelegramError("Could not create a Telegram link code yet.");
    } finally {
      setTelegramLoading(false);
    }
  }

  async function handleCopyTelegramCommand() {
    if (!telegram?.linkCommand) return;

    try {
      await navigator.clipboard.writeText(telegram.linkCommand);
      setStatusMessage({
        tone: "success",
        text: "Telegram link command copied.",
      });
    } catch {
      setTelegramError("Copy failed. Select the command and copy it manually.");
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshTransactions();
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (telegram?.linked) return undefined;

    const intervalId = window.setInterval(() => {
      fetchTelegramProfile()
      .then((items) => {
        setTelegram(items);
        if (items.linked) {
          setStatusMessage({
            tone: "success",
            text: "Telegram is connected. Bot entries will appear in the dashboard.",
          });
        }
      })
      .catch((error) => {
        console.log("Failed to refresh Telegram setup:", error);
      });
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [telegram?.linked]);

  const totalIncome = txns
    .filter((txn) => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);
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

  async function handleSubmit() {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const amount =
      form.type === "expense"
        ? -Math.abs(Number(form.amount))
        : Math.abs(Number(form.amount));

    const payload = {
      name: form.name.trim(),
      category: form.cat,
      amount,
      date: form.date,
    };

    try {
      if (editingTransaction) {
        const updated = await updateTransactionById(editingTransaction.id, payload);
        const updatedTxn = toDashboardTxn({
          ...updated,
          rawDate: updated?.date ?? payload.date,
          date: updated?.date ?? payload.date,
        });

        setTxns((prev) =>
          prev.map((txn) => (txn.id === editingTransaction.id ? updatedTxn : txn)),
        );
        setStatusMessage({
          tone: "success",
          text: `${updatedTxn.name} was updated in the cash flow view.`,
        });
      } else {
        const created = await createTransaction(payload);
        const newTxn = toDashboardTxn({
          ...created,
          rawDate: created?.date ?? payload.date,
          date: created?.date ?? payload.date,
        });

        setTxns((prev) => [newTxn, ...prev]);
        setStatusMessage({
          tone: "success",
          text: `${newTxn.name} was added to the cash flow view.`,
        });
      }

      setForm({ name: "", amount: "", cat: "Food & Drink", type: "expense", date: "" });
      setErrors({});
      setShowForm(false);
      setEditingTransaction(null);
      setLastRemoved(null);
    } catch (error) {
      console.log("Failed to create transaction:", error);
    }
  }

  function resetFormState() {
    setShowForm(false);
    setErrors({});
    setEditingTransaction(null);
  }

  async function deleteTxn(id) {
    const removedTxn = txns.find((txn) => txn.id === id);
    if (!removedTxn) return;

    try {
      await deleteTransactionById(id);
      setTxns((prev) => prev.filter((txn) => txn.id !== id));
      setLastRemoved(removedTxn);
      setStatusMessage({
        tone: "warning",
        text: `${removedTxn.name} was removed from the cash flow view.`,
        action: "Undo",
      });
    } catch (error) {
      console.log("Failed to delete transaction:", error);
    }
  }

  function openForm() {
    setEditingTransaction(null);
    setForm({ name: "", amount: "", cat: "Food & Drink", type: "expense", date: "" });
    setShowForm(true);
    setStatusMessage(null);
  }

  function openEditForm(txn) {
    setEditingTransaction(txn);
    setForm({
      name: txn.name,
      amount: String(Math.abs(txn.amount)),
      cat: txn.cat,
      type: txn.amount < 0 ? "expense" : "income",
      date: txn.rawDate ?? "",
    });
    setErrors({});
    setShowForm(true);
    setStatusMessage(null);
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
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
    setStatusMessage({
      tone: "success",
      text: `${lastRemoved.name} was restored to the cash flow view.`,
    });
    setLastRemoved(null);
  }

  return (
    <div className={TW.page} style={{ ...FONTS.mono, ...PAGE_VARS }}>
      <div
        className={TW.pageTexture}
        style={{ backgroundImage: DASHBOARD_TEXTURE }}
      />
      <TopNav onAddTransaction={openForm} onLogout={handleLogout} />

      <div className={TW.pageShell}>
        {statusMessage ? (
          <div
            className={`mb-4 flex flex-col gap-3 border px-4 py-3 text-[14px] leading-6 sm:flex-row sm:items-center sm:justify-between sm:text-[12px] ${
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

        {onboardingSummary ? (
          <div className="mb-4 border border-[color:color-mix(in_srgb,var(--dashboard-accent)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--dashboard-accent)_7%,transparent)] px-4 py-3 text-[14px] leading-6 text-[color:var(--dashboard-text)] sm:text-[12px]">
            {onboardingSummary.text}
          </div>
        ) : null}

        <div className="mb-4 border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] px-4 py-3 text-[14px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[12px]">
          Preview build: the chart reflects your saved transactions and updates as entries change.
        </div>

        <StatsSection cards={statCards} />

        <div className="mb-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <CashFlowSection
            cashFlow={cashFlowData}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
          <SpendingSection
            totalExpenses={totalExpenses}
            categoryBreakdown={categoryBreakdown}
          />
        </div>

        <div className="mb-3">
          <TelegramConnect
            telegram={telegram}
            loading={telegramLoading}
            error={telegramError}
            onCreateCode={handleCreateTelegramCode}
            onCopyCommand={handleCopyTelegramCommand}
          />
        </div>

        <TransactionsSection
          txns={txns}
          onAddTransaction={openForm}
          onEditTransaction={openEditForm}
          onDeleteTransaction={deleteTxn}
        />
      </div>

      <TransactionModal
        show={showForm}
        form={form}
        errors={errors}
        editingTransaction={editingTransaction}
        onClose={resetFormState}
        onSubmit={handleSubmit}
        onFieldChange={updateFormField}
        onTypeChange={updateFormType}
      />
    </div>
  );
}
