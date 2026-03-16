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

export default function Dashboard() {
  const [txns, setTxns] = useState(initialTxns);
  const [cashFlow, setCashFlow] = useState(initialCashFlow);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({
    name: "",
    amount: "",
    cat: "Food & Drink",
    type: "expense",
    date: "",
  });
  const [errors, setErrors] = useState({});

  const totalIncome = txns.filter((txn) => txn.amount > 0).reduce((sum, txn) => sum + txn.amount, 0);
  const totalExpenses = txns
    .filter((txn) => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
  const netWorth = 48320 + (totalIncome - totalExpenses);
  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const statCards = [
    {
      label: "Net Worth",
      value: `$${netWorth.toLocaleString()}`,
      change: "+3.2%",
      up: true,
      accent: COLORS.text,
      sub: "vs last month",
    },
    {
      label: "Income",
      value: formatWholeDollars(totalIncome),
      change: "+$400",
      up: true,
      accent: COLORS.accent,
      sub: "vs last month",
    },
    {
      label: "Expenses",
      value: formatWholeDollars(totalExpenses),
      change: "+$120",
      up: false,
      accent: COLORS.amber,
      sub: "vs last month",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      change: "+2.1%",
      up: true,
      accent: COLORS.accent,
      sub: "this month",
    },
  ];

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Required";
    if (!form.amount || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      nextErrors.amount = "Enter a valid amount";
    }
    if (!form.date) nextErrors.date = "Required";

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
      name: form.name,
      cat: form.cat,
      amount,
      date: form.date,
    };

    setTxns((prev) => [newTxn, ...prev]);
    setCashFlow((prev) =>
      prev.map((month, index) =>
        index === prev.length - 1
          ? {
              ...month,
              income: form.type === "income" ? month.income + Math.abs(amount) : month.income,
              expenses:
                form.type === "expense" ? month.expenses + Math.abs(amount) : month.expenses,
            }
          : month
      )
    );

    setForm({ name: "", amount: "", cat: "Food & Drink", type: "expense", date: "" });
    setErrors({});
    setShowForm(false);
  }

  function resetFormState() {
    setShowForm(false);
    setErrors({});
  }

  function deleteTxn(id) {
    setTxns((prev) => prev.filter((txn) => txn.id !== id));
  }

  function openForm() {
    setShowForm(true);
  }

  function updateFormField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateFormType(type) {
    setForm((prev) => ({ ...prev, type }));
  }

  return (
    <div className={TW.page} style={{ ...FONTS.mono, ...PAGE_VARS }}>
      <div
        className={TW.pageTexture}
        style={{ backgroundImage: DASHBOARD_TEXTURE }}
      />
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTransaction={openForm}
      />

      <div className={TW.pageShell}>
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
