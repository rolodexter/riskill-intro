import CardWidget from "./CardWidget";

export default function CtaCard() {
  return (
    <CardWidget title="Request Access" subtitle="Early enterprise preview" interactive onPrimaryAction={() => {}}>
      <div className="space-y-3 text-sm">
        <p>Want the full Riskill experience? Request access and we’ll reach out.</p>
        <button className="w-full px-4 py-2 rounded-lg bg-accent/25 border border-accent/40 hover:bg-accent/35 transition">
          Request Access
        </button>
      </div>
    </CardWidget>
  );
}
