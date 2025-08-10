import GlassCard from "./GlassCard";
export default function Solution(){
  const items = [
    {title:"Real‑Time Synthesis", body:"Unify Oracle, Microsoft, cloud apps and spreadsheets — one interface."},
    {title:"Simulated Human Agents", body:"Agents operate your SaaS like real team members — provisioned and auditable."},
    {title:"Machine‑Intelligence Insights", body:"Surface high‑leverage, non‑obvious recommendations in the flow of work."},
  ];
  return (
    <section className="py-16" id="solution">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">One AI layer to orchestrate everything</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {items.map((it)=>(
            <GlassCard key={it.title} className="p-6">
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-textSec">{it.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
