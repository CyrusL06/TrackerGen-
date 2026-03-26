import { Plus } from "lucide-react";
import { COLORS, TW } from "./shared.js";
import { DisplayTitle, Eyebrow, SurfaceCard, Tag, TxnRow } from "./primitives.jsx";

export default function TransactionsSection({
  txns,
  onAddTransaction,
  onDeleteTransaction,
  title = "Recent Transactions",
  summary = "Track what changed most recently.",
  showCount = true,
}) {
  return (
    <SurfaceCard className={`${TW.panelPadding} delight-rise delight-delay-2`}>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow>Activity</Eyebrow>
          <DisplayTitle>{title}</DisplayTitle>
          <p className="mt-2 max-w-md text-[12px] leading-6 text-[color:var(--dashboard-muted)]">
            {summary}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showCount ? <Tag color={COLORS.accent}>{txns.length} total</Tag> : null}
          <button type="button" onClick={onAddTransaction} className={TW.secondaryButton}>
            <Plus size={10} />
            Add
          </button>
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto">
        {txns.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="delight-orbit flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-surface-2)] text-[color:var(--dashboard-accent)]">
              <Plus size={16} />
            </div>
            <div className="max-w-sm text-[12px] leading-6 text-[color:var(--dashboard-muted)]">
              No transactions yet. Add your first income or expense to start the monthly snapshot.
            </div>
            <button type="button" onClick={onAddTransaction} className={TW.primaryButton}>
              <Plus size={11} />
              Add your first entry
            </button>
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
