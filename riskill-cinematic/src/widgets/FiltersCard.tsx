import CardWidget from "./CardWidget";

export default function FiltersCard() {
  return (
    <CardWidget title="Filters">
      <div className="space-y-3">
        <input placeholder="Search" className="w-full px-3 py-2 rounded-lg bg-white/6 border border-white/10 outline-none focus:ring-2 ring-accent/40" />
        <div className="flex flex-wrap gap-2 text-xs">
          {["Critical", "Ops", "Finance", "Last 24h"].map((t) => (
            <button key={t} className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10 transition">{t}</button>
          ))}
        </div>
      </div>
    </CardWidget>
  );
}
