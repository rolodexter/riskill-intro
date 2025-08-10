import GlassCard from "./GlassCard";
export default function FinalCTA(){
  return (
    <section className="py-20" id="cta">
      <div className="mx-auto max-w-3xl px-4">
        <GlassCard className="p-8 text-center">
          <h3 className="text-2xl font-semibold">Be first to experience interface‑driven AI</h3>
          <p className="text-textSec mt-2">Get early access and turn your data into an unfair advantage.</p>
          <form className="mt-6 flex gap-3 justify-center">
            <input aria-label="Email" className="min-w-0 w-full md:w-96 rounded-xl bg-onyx2 border border-white/10 px-4 py-3" placeholder="you@company.com"/>
            <button className="px-5 py-3 rounded-xl bg-accent/25 border border-accent/40 hover:bg-accent/35">Request Invite</button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}
