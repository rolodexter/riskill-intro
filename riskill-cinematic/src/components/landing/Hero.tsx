import GlassCard from "./GlassCard";
import { motion } from "framer-motion";

export default function Hero(){
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Turn any organization into an <span className="text-accent">AI business</span> in a few clicks.
          </h1>
          <p className="mt-5 text-lg text-textSec max-w-xl">
            Synthesize every data source in real time. Deploy AI agents that think with you,
            surface non‑obvious insights, and execute actions across your stack.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#cta" className="px-5 py-3 rounded-xl bg-accent/20 border border-accent/40 hover:bg-accent/30">Request Early Access</a>
            <a href="#demo" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/10">See How It Works</a>
          </div>
        </div>
        <GlassCard className="p-4 md:p-6">
          {/* placeholder “demo square”: swap later with Lottie/GIF */}
          <motion.div initial={{scale:.96, opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:.6}} className="aspect-video rounded-xl bg-onyx2 border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="p-4 text-sm text-textSec">Command Center (mock)</div>
            <div className="grid grid-cols-3 gap-3 p-4">
              <div className="h-24 rounded bg-white/5" />
              <div className="h-24 rounded bg-white/5" />
              <div className="h-24 rounded bg-white/5" />
              <div className="col-span-3 h-40 rounded bg-white/5" />
            </div>
          </motion.div>
          <div className="mt-3 text-xs text-textSec/80">Live data mock — will be replaced with animated demo.</div>
        </GlassCard>
      </div>
    </section>
  );
}
