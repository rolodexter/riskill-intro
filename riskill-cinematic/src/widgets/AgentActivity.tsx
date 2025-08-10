import CardWidget from "./CardWidget";

export default function AgentActivity() {
  return (
    <CardWidget title="Agent Activity" subtitle="Online">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">—</span>
        <div className="h-4 w-24 rounded bg-white/5" />
      </div>
    </CardWidget>
  );
}
