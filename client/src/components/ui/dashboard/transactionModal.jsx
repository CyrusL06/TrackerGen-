import { useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, COLORS, FONTS, TW, cx } from "./shared.js";
import { FieldError, FieldLabel } from "./primitives.jsx";

export default function TransactionModal({
  show,
  form,
  errors,
  editingTransaction,
  onClose,
  onSubmit,
  onFieldChange,
  onTypeChange,
}) {
  useEffect(() => {
    if (!show) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, show]);

  if (!show) return null;

  const isEditing = Boolean(editingTransaction);

  const inputClassName = (hasError) =>
    cx(
      TW.inputBase,
      "rounded-[8px]",
      hasError
        ? "border-[color:var(--dashboard-red)]"
        : "border-[color:var(--dashboard-border)]"
    );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface)] shadow-[var(--dashboard-shadow)]"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="h-[18px] w-[3px] rounded-full"
              style={{ backgroundColor: COLORS.accent }}
            />
            <span className="text-[1.1rem] font-bold tracking-[-0.01em]" style={FONTS.display}>
              {isEditing ? "Edit Transaction" : "New Transaction"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[color:var(--dashboard-muted)] transition-colors hover:bg-[color:var(--dashboard-surface)] hover:text-[color:var(--dashboard-text)]"
          >
            <X size={16} />
          </button>
        </div>

        <form
          className="p-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <p className="mb-5 text-[13px] leading-6 text-[color:var(--dashboard-muted)]">
            {isEditing
              ? "Update the details below to correct the saved amount or transaction info."
              : "Add one entry to keep the current month review accurate."}
          </p>
          <div className="mb-5">
            <FieldLabel>Type</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {["expense", "income"].map((type) => {
                const isActive = form.type === type;
                const activeColor = type === "income" ? COLORS.accent : COLORS.red;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onTypeChange(type)}
                    className={cx(
                      "rounded-[8px] border px-4 py-2.5 text-[12px] capitalize tracking-[0.06em] transition-all sm:text-[11px]",
                      isActive
                        ? "font-semibold shadow-sm"
                        : "border-[color:var(--dashboard-border)] text-[color:var(--dashboard-muted)] hover:border-[color:var(--dashboard-text)]"
                    )}
                    style={
                      isActive
                        ? {
                            color: activeColor,
                            borderColor: activeColor,
                            backgroundColor: `${activeColor}18`,
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

          <div className="mb-4">
            <FieldLabel>Description</FieldLabel>
            <input
              className={inputClassName(Boolean(errors.name))}
              placeholder="e.g. Grocery run, Salary..."
              value={form.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
            />
            <FieldError>{errors.name}</FieldError>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
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
              />
              <FieldError>{errors.date}</FieldError>
            </div>
          </div>

          <div className="mb-6">
            <FieldLabel>Category</FieldLabel>
            <select
              className={cx(
                TW.inputBase,
                "cursor-pointer appearance-none rounded-[8px] border-[color:var(--dashboard-border)]"
              )}
              value={form.cat}
              onChange={(event) => onFieldChange("cat", event.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                  style={{ backgroundColor: "var(--dashboard-surface-2)" }}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className={TW.secondaryButton}>
              Cancel
            </button>
            <button
              type="submit"
              className={cx(TW.primaryButton, "w-full sm:w-auto sm:min-w-[11rem]")}
            >
              {isEditing ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
