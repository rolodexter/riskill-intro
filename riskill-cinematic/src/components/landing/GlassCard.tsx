import { motion } from "framer-motion";
import type React from "react";

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  elevation?: "normal" | "high"; // kept for compatibility
}

export default function GlassCard({ children, className = "", elevation: _elevation = "normal" }: GlassCardProps) {
  // elevation prop retained but minimal visual difference to keep skeleton simple
  const borderClass = "border border-white/10";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className={`relative rounded-2xl ${borderClass} shadow-glass bg-white/5 md:bg-white/6 backdrop-blur-xs md:backdrop-blur-xl overflow-hidden ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sheen opacity-15" />
      {children}
    </motion.div>
  );
}
