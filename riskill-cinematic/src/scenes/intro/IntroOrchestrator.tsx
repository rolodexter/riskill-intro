import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { micro, section, ease } from '../../core/motion/timings';

type Stage = 0 | 1 | 2 | 3; // S0 Initial, S1 Data Awakening, S2 Insight, S3 Onboarding

export default function IntroOrchestrator() {
  const [stage, setStage] = useState<Stage>(0);
  const [role, setRole] = useState('');

  // Simple timed progression for Phase 1; later can be driven by scroll or user intent
  useEffect(() => {
    const timers: number[] = [];
    // S0 → S1 at ~2s
    timers.push(window.setTimeout(() => setStage(1), 2000));
    // S1 → S2 at ~4s
    timers.push(window.setTimeout(() => setStage(2), 4000));
    // S2 → S3 at ~6s
    timers.push(window.setTimeout(() => setStage(3), 6000));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Deterministic mini network (no heavy libs). Kept minimal for perf.
  const network = useMemo(() => {
    const points = [
      { x: 20, y: 30 },
      { x: 80, y: 25 },
      { x: 35, y: 70 },
      { x: 65, y: 75 },
      { x: 50, y: 45 },
      { x: 15, y: 55 },
      { x: 88, y: 60 },
    ];
    const links = [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [5, 2],
      [6, 1],
    ];
    return { points, links };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '70vh' }}>
      {/* Skip Intro (a11y-visible) */}
      <button
        onClick={() => setStage(3)}
        style={{
          position: 'absolute', right: 0, top: 0,
          padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6,
          background: 'white', color: '#111827', cursor: 'pointer'
        }}
        aria-label="Skip intro and go to onboarding"
      >
        Skip Intro
      </button>

      {/* Scene title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ...micro, ease } }}
        style={{ marginBottom: 12 }}
      >
        Riskill cinematic intro
      </motion.h1>

      {/* S0 — Initial Fade-In (background gradient block) */}
      <AnimatePresence>
        {stage >= 0 && stage < 3 && (
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { ...section, ease } }}
            exit={{ opacity: 0, transition: { ...micro, ease } }}
            aria-hidden
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* S1 — Data Awakening: abstract network */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence>
          {stage >= 1 && stage < 3 && (
            <motion.svg
              key="network"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', maxWidth: 760, height: '240px' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { ...section, ease } }}
              exit={{ opacity: 0, y: -6, transition: { ...micro, ease } }}
              aria-label="Abstract data network"
            >
              <g stroke="#93c5fd" strokeWidth="0.6" opacity={0.6}>
                {network.links.map(([a, b], i) => (
                  <line key={i}
                        x1={network.points[a].x} y1={network.points[a].y}
                        x2={network.points[b].x} y2={network.points[b].y} />
                ))}
              </g>
              <g fill="#0ea5e9">
                {network.points.map((p, i) => (
                  <motion.circle key={i} cx={p.x} cy={p.y} r={1.8}
                                 initial={{ opacity: 0, scale: 0.6 }}
                                 animate={{ opacity: 1, scale: 1, transition: { delay: 0.05 * i, ...micro, ease } }} />
                ))}
              </g>
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* S2 — Insight Emergence badge */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence>
          {stage >= 2 && stage < 3 && (
            <motion.div
              key="insight"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { ...micro, ease } }}
              exit={{ opacity: 0, scale: 0.98, transition: { ...micro, ease } }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 9999,
                background: '#ecfeff', color: '#0e7490', border: '1px solid #a5f3fc'
              }}
              role="status" aria-live="polite"
            >
              <span style={{ fontWeight: 700 }}>INSIGHT DETECTED</span>
              <span style={{ fontSize: 12 }}>(Move37 candidate)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* S3 — Human Integration: Onboarding panel */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { ...section, ease } }}
            exit={{ opacity: 0, y: -8, transition: { ...micro, ease } }}
            style={{
              marginTop: 16,
              border: '1px solid #e5e7eb', borderRadius: 8, padding: 16,
              background: 'white', color: '#111827'
            }}
            aria-describedby="intro-copy"
          >
            <p id="intro-copy" style={{ margin: 0, fontWeight: 600 }}>🤖 Riskill AI Agent</p>
            <p style={{ marginTop: 8 }}>
              Welcome to Riskill. Let’s calibrate your intelligence streams.
            </p>
            <label htmlFor="mvh-role" style={{ display: 'block', marginTop: 12, fontWeight: 500 }}>
              What’s your primary role in the organization?
            </label>
            <input
              id="mvh-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Director of Operations"
              style={{
                marginTop: 6, width: '100%', maxWidth: 520,
                padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6
              }}
            />
            <small style={{ display: 'block', marginTop: 8, color: '#6b7280' }}>
              (Simulated Human onboarding flow)
            </small>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
