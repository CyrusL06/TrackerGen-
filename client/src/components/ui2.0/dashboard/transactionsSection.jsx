import { Plus } from "lucide-react";
import { COLORS, TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard, Tag, TxnRow } from "./primitives.jsx";

export default function TransactionsSection({
  txns,
  onAddTransaction,
  onDeleteTransaction,
}) {
  return (
    <SurfaceCard className={TW.panelPadding}>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <Eyebrow>Activity</Eyebrow>
          <DisplayTitle>Recent Transactions</DisplayTitle>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-[color:var(--dashboard-muted)] sm:text-[12px]">
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

      <div className="max-h-[320px] overflow-y-auto">
        {txns.length === 0 ? (
          <div className="py-8 text-center text-[14px] text-[color:var(--dashboard-muted)] sm:text-[11px]">
            No transactions yet. Add one above.
          </div>
        ) : (
          txns.map((txn) => (
            <TxnRow key={txn.id} txn={txn} onDelete={onDeleteTransaction} />
          ))
        )}
      </div>
    </SurfaceCard>
  );
}
