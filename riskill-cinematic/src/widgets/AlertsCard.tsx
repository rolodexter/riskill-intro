import CardWidget from "./CardWidget";

export default function AlertsCard() {
  return (
    <CardWidget title="Alerts" subtitle="Recent">
      <ol className="text-sm space-y-2">
        {["Invoice mismatch detected", "High bounce rate", "Supplier delay"].map((t, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </CardWidget>
  );
}
