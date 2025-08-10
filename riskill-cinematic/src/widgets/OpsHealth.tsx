import CardWidget from "./CardWidget";

export default function OpsHealth() {
  return (
    <CardWidget title="Ops Health" subtitle="Score">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10" />
        <div className="text-2xl font-semibold">—</div>
      </div>
    </CardWidget>
  );
}
