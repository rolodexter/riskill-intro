import CardWidget from "./CardWidget";

export default function DataSourcesCard() {
  return (
    <CardWidget title="Data Sources">
      <ul className="text-sm space-y-2">
        {["ERP", "CRM", "Ads", "Inventory"].map((s) => (
          <li key={s} className="flex items-center justify-between">
            <span>{s}</span>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </li>
        ))}
      </ul>
    </CardWidget>
  );
}
