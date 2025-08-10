import CardWidget from "./CardWidget";

export default function InsightStreamCard() {
  return (
    <CardWidget title="Insight Stream">
      <div className="flex flex-wrap gap-2 text-xs">
        {["Lead time rising", "Stockout risk", "Spend spike", "Conversion dip"].map((t) => (
          <span key={t} className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/10">{t}</span>
        ))}
      </div>
    </CardWidget>
  );
}
