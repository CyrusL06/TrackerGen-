import { StatCard } from "./primitives.jsx";

export default function StatsSection({ cards }) {
  return (
    <div className="mb-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`delight-rise ${index === 0 ? "" : index === 1 ? "delight-delay-1" : index === 2 ? "delight-delay-2" : "delight-delay-3"}`}
        >
          <StatCard {...card} />
        </div>
      ))}
    </div>
  );
}
