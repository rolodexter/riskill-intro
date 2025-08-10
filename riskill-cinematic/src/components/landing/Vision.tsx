import GlassCard from "./GlassCard";
export default function Vision(){
  return (
    <section className="py-16" id="vision">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold">Interface Intelligence: our long‑term model</h2>
          <p className="mt-4 text-textSec">
            We’re building a large AI model that specializes in UI intelligence — a system that understands interfaces
            so deeply it can render the one you use and operate others like a human. That same model powers simulated‑human agents
            across your SaaS stack.
          </p>
        </div>
        <GlassCard className="p-6">
          <div className="aspect-video rounded-xl bg-onyx2 border border-white/10" />
          <div className="mt-3 text-sm text-textSec">Concept diagram placeholder — replace with animated graphic.</div>
        </GlassCard>
      </div>
    </section>
  );
}
