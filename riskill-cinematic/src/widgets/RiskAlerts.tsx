import CardWidget from "./CardWidget";

export default function RiskAlerts() {
  return (
    <CardWidget title="Risk Alerts" subtitle="Last alert">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">0</span>
        <div className="h-4 w-28 rounded bg-white/5" />
      </div>
    </CardWidget>
  );
}
