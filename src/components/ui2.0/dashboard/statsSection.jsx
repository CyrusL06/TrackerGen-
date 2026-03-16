import { StatCard } from "./primitives.jsx";

export default function StatsSection({ cards }) {
  return (
    <div className="mb-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
