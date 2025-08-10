import GlassCard from "./GlassCard";
export default function DemoGrid(){
  const cells = [
    {title:"Connect a data source", caption:"Salesforce, SharePoint, SQL — no rip‑and‑replace."},
    {title:"Ask in natural language", caption:"“Why did margin drop last week?”"},
    {title:"Insight appears", caption:"Anomaly detected across regions and SKUs."},
    {title:"Act immediately", caption:"Trigger playbooks across your tools."},
  ];
  return (
    <section className="py-16" id="demo">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">See it in action</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cells.map((c)=>(
            <GlassCard key={c.title} className="p-4">
              <div className="aspect-[4/3] rounded-lg bg-onyx2 border border-white/10" />
              <div className="mt-3 font-medium">{c.title}</div>
              <div className="text-sm text-textSec">{c.caption}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
