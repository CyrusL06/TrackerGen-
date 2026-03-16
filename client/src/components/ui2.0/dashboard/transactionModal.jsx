import { X } from "lucide-react";
import { CATEGORIES, COLORS, FONTS, TW, cx } from "./shared.js";
import { FieldError, FieldLabel } from "./primitives.jsx";

export default function TransactionModal({
  show,
  form,
  errors,
  onClose,
  onSubmit,
  onFieldChange,
  onTypeChange,
}) {
  if (!show) return null;

  const inputClassName = (hasError) =>
    cx(
      TW.inputBase,
      hasError
        ? "border-[color:var(--dashboard-red)]"
        : "border-[color:var(--dashboard-border)]"
    );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[4px]">
      <div className="w-full max-w-[420px] overflow-hidden border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)]">
        <div className="flex items-center justify-between border-b border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[color:var(--dashboard-accent)]" />
            <span className="text-[1.1rem] tracking-[0.06em]" style={FONTS.display}>
              New Transaction
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex p-1 text-[color:var(--dashboard-muted)] transition-colors hover:text-[color:var(--dashboard-text)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-[18px]">
            <FieldLabel>Type</FieldLabel>
            <div className="grid grid-cols-2 gap-[6px]">
              {["expense", "income"].map((type) => {
                const isActive = form.type === type;
                const activeColor = type === "income" ? COLORS.accent : COLORS.red;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onTypeChange(type)}
                    className={cx(
                      "border px-[9px] py-[9px] text-[11px] capitalize tracking-[0.06em] transition-all",
                      isActive
                        ? ""
                        : "border-[color:var(--dashboard-border)] text-[color:var(--dashboard-muted)]"
                    )}
                    style={
                      isActive
                        ? {
                            color: activeColor,
                            borderColor: activeColor,
                            backgroundColor: `${activeColor}20`,
                          }
                        : undefined
                    }
                  >
                    {type === "income" ? "↑ Income" : "↓ Expense"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-[14px]">
            <FieldLabel>Description</FieldLabel>
            <input
              className={inputClassName(Boolean(errors.name))}
              placeholder="e.g. Grocery run, Salary..."
              value={form.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
            />
            <FieldError>{errors.name}</FieldError>
          </div>

          <div className="mb-[14px] grid gap-2.5 sm:grid-cols-2">
            <div>
              <FieldLabel>Amount ($)</FieldLabel>
              <input
                className={inputClassName(Boolean(errors.amount))}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(event) => onFieldChange("amount", event.target.value)}
              />
              <FieldError>{errors.amount}</FieldError>
            </div>

            <div>
              <FieldLabel>Date</FieldLabel>
              <input
                className={inputClassName(Boolean(errors.date))}
                type="date"
                value={form.date}
                onChange={(event) => onFieldChange("date", event.target.value)}
                style={{ colorScheme: "dark" }}
              />
              <FieldError>{errors.date}</FieldError>
            </div>
          </div>

          <div className="mb-5">
            <FieldLabel>Category</FieldLabel>
            <select
              className={cx(
                TW.inputBase,
                "cursor-pointer appearance-none border-[color:var(--dashboard-border)]"
              )}
              value={form.cat}
              onChange={(event) => onFieldChange("cat", event.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                  style={{ backgroundColor: COLORS.surface2 }}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="w-full bg-[color:var(--dashboard-accent)] px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--dashboard-bg)] transition-opacity hover:opacity-[0.88]"
          >
            Add Transaction →
          </button>
        </div>
      </div>
    </div>
  );
}
