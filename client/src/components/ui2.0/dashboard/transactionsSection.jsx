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
      <div className="mb-1 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>Activity</Eyebrow>
          <DisplayTitle>Recent Transactions</DisplayTitle>
        </div>

        <div className="flex items-center gap-2">
          <Tag color={COLORS.accent}>{txns.length} total</Tag>
          <button type="button" onClick={onAddTransaction} className={TW.secondaryButton}>
            <Plus size={10} />
            Add
          </button>
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto">
        {txns.length === 0 ? (
          <div className="py-8 text-center text-[11px] text-[color:var(--dashboard-muted)]">
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
