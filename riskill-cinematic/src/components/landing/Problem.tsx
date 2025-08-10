import GlassCard from "./GlassCard"; import {fadeUp} from "../../core/motion/variants";
export default function Problem(){
  return (
    <section className="py-16" id="problem">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">Data is abundant. Actionable intelligence isn’t.</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            "Disconnected systems create fragmented truth.",
            "Manual workflows slow decisions to a crawl.",
            "Non‑obvious opportunities remain hidden."
          ].map((t,i)=>(
            <GlassCard key={i} className="p-5" {...fadeUp(i*.05)}>
              <p className="text-textSec">{t}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
