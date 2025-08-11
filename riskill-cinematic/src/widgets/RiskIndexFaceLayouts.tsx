import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export type SplitScoreboardRow = {
  key: string;
  name: ReactNode;
  m1Label: string;
  m1: string | number;
  m2Label: string;
  m2: string | number;
};

export function SplitScoreboard({ rows, className = '' }: { rows: SplitScoreboardRow[]; className?: string }) {
  return (
    <div className={`grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1 text-[12.5px] leading-5 ${className}`}>
      {rows.map(r => (
        <React.Fragment key={r.key}>
          <div className="truncate">{r.name}</div>
          <div className="tabular-nums text-right whitespace-nowrap">{r.m1Label}:{r.m1}</div>
          <div className="tabular-nums text-right whitespace-nowrap">{r.m2Label}:{r.m2}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

export type PillMetric = {
  key: string;
  name: ReactNode;
  score: number;
  trendSymbol?: string; // ▲ ▼ —
  level: 'low' | 'med' | 'high';
};

function pillTint(level: 'low'|'med'|'high') {
  return level === 'high' ? 'bg-rose-400/15 text-rose-200 ring-rose-400/30'
       : level === 'med'  ? 'bg-amber-400/15 text-amber-200 ring-amber-400/30'
       : 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/30';
}

export function PillMetrics({ items, className = '' }: { items: PillMetric[]; className?: string }) {
  const iconForTrend = (sym?: string) => sym === '▲' ? <ArrowUpRight className="w-3.5 h-3.5" /> : sym === '▼' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />;
  return (
    <motion.div
      className={`grid grid-cols-2 gap-2 text-[12.5px] ${className}`}
      initial="hidden" animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
    >
      {items.map(d => (
        <motion.div key={d.key} className="flex items-center justify-between gap-2" variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
          <div className="truncate">{d.name}</div>
          <motion.span
            layout
            className={`px-2 py-0.5 rounded-full ring-1 tabular-nums inline-flex items-center gap-1 ${pillTint(d.level)}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {d.score}
            <motion.i className="inline-flex" initial={{ y: 0 }} animate={{ y: [0, -1, 0] }} transition={{ duration: 0.9 }} aria-hidden>
              {iconForTrend(d.trendSymbol)}
            </motion.i>
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export type IconInlineItem = {
  key: string;
  icon: ReactNode; // vector icon node (Lucide or similar)
  name: ReactNode;
  stats: Array<{ label: string; value: string | number }>;
};

export function IconInlineStats({ items, className = '' }: { items: IconInlineItem[]; className?: string }) {
  return (
    <motion.div
      className={`space-y-1.5 text-[12.5px] leading-5 ${className}`}
      initial="hidden" animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
    >
      {items.map(it => (
        <motion.div key={it.key} className="flex items-center gap-3" variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
          <span className="inline-flex w-4 h-4 items-center justify-center text-white/70" aria-hidden>{it.icon}</span>
          <div className="flex-1 truncate">{it.name}:</div>
          {it.stats.map((s, i) => (
            <div key={i} className="tabular-nums whitespace-nowrap">{s.label}{s.value}</div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}

export type TrendRow = {
  key: string;
  name: ReactNode;
  score: number;
  trendSymbol?: string; // ▲ ▼ —
};

export function TabularMicroChart({ rows, className = '', onRowClick }: { rows: TrendRow[]; className?: string; onRowClick?: (row: TrendRow) => void }) {
  return (
    <table className={`w-full text-[12px] ${className}`}>
      <tbody className="[&_td]:py-1.5">
        {rows.map(r => (
          <tr
            key={r.key}
            className={onRowClick ? 'cursor-pointer hover:bg-white/5 focus:bg-white/10 outline-none' : ''}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : -1}
            onClick={onRowClick ? () => onRowClick(r) : undefined}
            onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(r); } } : undefined}
          >
            <td className="truncate align-middle">{r.name}</td>
            <td className="tabular-nums text-right align-middle">{r.score}</td>
            <td className="text-center align-middle">{r.trendSymbol ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
