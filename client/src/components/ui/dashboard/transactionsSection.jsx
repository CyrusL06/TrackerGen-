import { Plus, Receipt } from "lucide-react";
import { COLORS, TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard, Tag, TxnRow } from "./primitives.jsx";

export default function TransactionsSection({
  txns,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) {
  return (
    <SurfaceCard className={TW.panelPadding}>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <Eyebrow>Activity</Eyebrow>
          <DisplayTitle>Recent Transactions</DisplayTitle>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-[color:var(--dashboard-muted)]">
            Manual entries update the current month review and recent activity list.
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <Tag color={COLORS.accent}>{txns.length} total</Tag>
          <button type="button" onClick={onAddTransaction} className={TW.secondaryButton}>
            <Plus size={12} />
            Add
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {txns.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)]">
              <Receipt size={20} className="text-[color:var(--dashboard-muted)]" />
            </div>
             <p className="text-[14px] font-medium text-[color:var(--dashboard-muted)]">
              No transactions yet
            </p>
             <p className="text-[12px] text-[color:var(--dashboard-muted)]">
              Add your first transaction to start tracking.
            </p>
          </div>
        ) : (
          txns.map((txn) => (
            <TxnRow
              key={txn.id}
              txn={txn}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </SurfaceCard>
  );
}
