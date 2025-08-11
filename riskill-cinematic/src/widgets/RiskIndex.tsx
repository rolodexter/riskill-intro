import CardWidget from "./CardWidget";
import { useEffect, useMemo, useRef, useState } from "react";
import { useResizeDensity } from "./useResizeDensity";
import { KPIIcon } from "../components/icons/KPI";
import { emit } from "../utils/telemetry";
import InlineDisclosureLink from "../ui/InlineDisclosureLink";
import { getMockRiskIndexPayload, labelForComposite } from "../content/risks";
import type { RiskDomain, RiskIndexPayload } from "../content/risks";
import { sub } from "./bus";
import { messengerHandoff } from "../utils/messenger";
import { SplitScoreboard, PillMetrics, IconInlineStats, TabularMicroChart } from "./RiskIndexFaceLayouts";
import { FolderKanban, GitBranch, Server } from "lucide-react";

function clampDelta(v: number) {
  if (v > 20) return 20;
  if (v < -20) return -20;
  return Math.round(v);
}

// Build stacked faces for the Risk Index card
function buildFaces(data: RiskIndexPayload, anchorEl: Element | null) {
  const label = labelForComposite(data.composite);
  const sorted = sortByMovement(data.domains);
  const top2 = sorted.slice(0, 2);
  const delta = clampDelta(data.trend7d);
  return [
    {
      id: 'overview',
      descriptor: 'Composite posture',
      render: () => (
        <div className="flex flex-col gap-2">
          <div className="text-base sm:text-[15px] font-semibold tabular-nums">{data.composite} <span className="text-[13px] font-medium align-baseline">Risk Index — {label}</span></div>
          <div className="text-[12px] text-white/85 truncate">
            {top2.map((d, i) => (
              <span key={d.id}>
                <InlineDisclosureLink
                  glossaryKey={`ops.risk.${d.id}` as any}
                  className="px-0.5"
                  ariaLabel={`${titleCaseDomain(d.id)} ${trendWord(d.trend7d)}`}
                  faceId="overview"
                  handoffSource="risk-index"
                  handoffMeta={{ domainId: d.id, from: 'overview' }}
                >
                  {titleCaseDomain(d.id)} {arrowForTrend(d.trend7d)}
                </InlineDisclosureLink>
                {i === 0 ? <span>, </span> : null}
              </span>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-white/75">
            <span className="font-medium">{delta >= 0 ? `+${delta}` : `${delta}`}</span>
            <span className="text-white/60">v. prior 7 days</span>
          </div>
        </div>
      )
    },
    {
      id: 'domains',
      descriptor: 'Domain movement',
      render: () => {
        const items = data.domains.map((d) => ({
          key: d.id,
          name: (
            <InlineDisclosureLink
              glossaryKey={`ops.risk.${d.id}` as any}
              className="px-0.5"
              faceId="domains"
              handoffSource="risk-index"
              handoffMeta={{ domainId: d.id, from: 'domains' }}
            >
              {titleCaseDomain(d.id)}
            </InlineDisclosureLink>
          ),
          score: domainScore(d),
          trendSymbol: trendSymbol(d.trend7d),
          level: pillLevelForScore(domainScore(d)),
        }));
        return <PillMetrics items={items} />;
      }
    },
    {
      id: 'bottlenecks',
      descriptor: 'Top bottlenecks',
      render: () => {
        const rows = [
          { key: 'jira', name: (
            <InlineDisclosureLink glossaryKey={'ops.risk.jira' as any} className="px-0.5" faceId="bottlenecks" handoffSource="risk-index" handoffMeta={{ service: 'jira', from: 'bottlenecks' }}>Jira</InlineDisclosureLink>
          ), m1Label: 'Pndg', m1: 3, m2Label: 'Unasg', m2: 2 },
          { key: 'azure', name: (
            <InlineDisclosureLink glossaryKey={'ops.risk.azure' as any} className="px-0.5" faceId="bottlenecks" handoffSource="risk-index" handoffMeta={{ service: 'azure-devops', from: 'bottlenecks' }}>Azure DevOps</InlineDisclosureLink>
          ), m1Label: 'Blck', m1: 1, m2Label: 'Aging', m2: 4 },
          { key: 'sn', name: (
            <InlineDisclosureLink glossaryKey={'ops.risk.servicenow' as any} className="px-0.5" faceId="bottlenecks" handoffSource="risk-index" handoffMeta={{ service: 'servicenow', from: 'bottlenecks' }}>ServiceNow</InlineDisclosureLink>
          ), m1Label: 'MI', m1: 0, m2Label: 'Freeze', m2: 'off' },
        ];
        return <SplitScoreboard rows={rows} />;
      }
    },
    {
      id: 'services',
      descriptor: 'Service bottlenecks',
      render: () => {
        const items = [
          { key: 'jira', icon: <FolderKanban className="w-4 h-4" />, name: (
            <InlineDisclosureLink glossaryKey={'ops.risk.jira' as any} className="px-0.5" faceId="services" handoffSource="risk-index" handoffMeta={{ service: 'jira', from: 'services' }}>Jira</InlineDisclosureLink>
          ), stats: [{ label: 'P', value: 3 }, { label: 'U', value: 2 }] },
          { key: 'azure', icon: <GitBranch className="w-4 h-4" />, name: (
            <InlineDisclosureLink glossaryKey={'ops.risk.azure' as any} className="px-0.5" faceId="services" handoffSource="risk-index" handoffMeta={{ service: 'azure-devops', from: 'services' }}>Azure DevOps</InlineDisclosureLink>
          ), stats: [{ label: 'BP', value: 1 }, { label: 'AT', value: 4 }] },
          { key: 'sn', icon: <Server className="w-4 h-4" />, name: (
            <InlineDisclosureLink glossaryKey={'ops.risk.servicenow' as any} className="px-0.5" faceId="services" handoffSource="risk-index" handoffMeta={{ service: 'servicenow', from: 'services' }}>ServiceNow</InlineDisclosureLink>
          ), stats: [{ label: 'MI', value: 0 }, { label: 'CF:', value: 'off' }] },
        ];
        return <IconInlineStats items={items} />;
      }
    },
    {
      id: 'trends',
      descriptor: 'Recent trends',
      render: () => {
        const movers = [...data.domains]
          .map(d => ({ id: d.id, t: d.trend7d, score: domainScore(d) }))
          .sort((a,b)=>Math.abs(b.t)-Math.abs(a.t))
          .slice(0,3);
        const rows = movers.map(m => ({
          key: String(m.id),
          name: (
            <InlineDisclosureLink
              glossaryKey={`ops.risk.${m.id}` as any}
              className="px-0.5"
              faceId="trends"
              handoffSource="risk-index"
              handoffMeta={{ domainId: m.id, from: 'trends' }}
            >
              {titleCaseDomain(m.id as any)}
            </InlineDisclosureLink>
          ),
          score: m.score,
          trendSymbol: trendSymbol(m.t),
        }));
        return (
          <div className="space-y-1">
            <TabularMicroChart
              rows={rows}
              onRowClick={(r) => {
                messengerHandoff({
                  source: 'risk-index',
                  intent: 'open',
                  faceId: 'trends',
                  title: 'Risk Index',
                  anchorEl: anchorEl || undefined,
                  meta: { action: 'trends_row', domainId: r.key },
                });
              }}
            />
          </div>
        );
      }
    }
  ];
}

function usePrefersReducedMotion(){
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function arrowForTrend(t: number, stableThreshold = 0.02) {
  if (t > stableThreshold) return "↑";
  if (t < -stableThreshold) return "↓";
  return "stable";
}

function trendWord(t: number, stableThreshold = 0.02) {
  if (t > stableThreshold) return "rising";
  if (t < -stableThreshold) return "declining";
  return "stable";
}

function trendSymbol(t: number, stableThreshold = 0.02) {
  if (t > stableThreshold) return '▲';
  if (t < -stableThreshold) return '▼';
  return '—';
}

function sortByMovement(domains: RiskDomain[]): RiskDomain[] {
  return [...domains].sort((a, b) => {
    const da = Math.abs(a.trend7d);
    const db = Math.abs(b.trend7d);
    if (db !== da) return db - da;
    // tie-break by recency
    return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
  });
}

function titleCaseDomain(id: RiskDomain["id"]) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function domainScore(d: RiskDomain): number {
  // Simple placeholder composite: higher is better
  const risk = d.severity * 0.35 + d.probability * 0.3 + d.proximity * 0.2 + d.impact * 0.15;
  return Math.max(0, Math.min(100, Math.round(100 - 100 * risk)));
}

// Pill tint thresholds (per USER):
// low (green) when score < 60
// med (amber) when 60–65
// high (red) when > 65
function pillLevelForScore(score: number): 'low'|'med'|'high' {
  if (score < 60) return 'low';
  if (score <= 65) return 'med';
  return 'high';
}

export default function RiskIndex() {
  const { ref } = useResizeDensity();
  const [payload, setPayload] = useState<RiskIndexPayload>(() => getMockRiskIndexPayload());
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const label = labelForComposite(payload.composite);
  const sorted = sortByMovement(payload.domains);
  const top2 = sorted.slice(0, 2);
  const remainder = sorted.find((d) => !top2.includes(d));
  // visible movement terms will render as inline disclosure links below

  const delta = clampDelta(payload.trend7d);

  // ARIA summary: replace arrows with words and include a third domain if available
  const ariaMovements = top2
    .map((d) => `${titleCaseDomain(d.id)} ${trendWord(d.trend7d)}`)
    .join(", ");
  const thirdPart = remainder ? `, ${titleCaseDomain(remainder.id)} ${trendWord(remainder.trend7d)}` : "";
  const ariaSummary = `Risk Index ${payload.composite}, ${label}. ${ariaMovements}${thirdPart}. Seven-day change ${delta >= 0 ? `+${delta}` : `${delta}`}.`;

  function openBreakdown() {
    emit('risk.drilldown.open', { panel: 'domains' });
    // Build Messenger payload with domain metrics
    const metrics = payload.domains.map((d) => ({
      domain: titleCaseDomain(d.id),
      score: domainScore(d),
      trend: trendWord(d.trend7d),
      coverage: d.coverage,
      updated: new Date(d.lastUpdate).toISOString(),
    }));
    messengerHandoff({
      source: 'risk-index',
      intent: 'risk.breakdown.open',
      faceId: (faces[idx]?.id) as string | undefined,
      cardId: 'risk-index',
      title: 'Risk Index breakdown',
      primary: `${payload.composite} Risk Index — ${label}`,
      narrative: 'Live composite across operational, technical, legal, economic.',
      metrics,
      anchorEl: deckRef.current || undefined,
      meta: { from: 'risk-index-widget', context: 'domains-tab' },
    });
  }

  // track initial view (sampled)
  useEffect(() => {
    emit('risk.index.view');
  }, []);

  // refresh loop: update payload and emit telemetry every 30s
  useEffect(() => {
    const id = setInterval(() => {
      setPayload(getMockRiskIndexPayload());
      emit('risk.index.refresh');
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Faces for stacked view
  const faces = useMemo(() => buildFaces(payload, deckRef.current), [payload, deckRef.current]);

  // Pause on hover/focus, resume on leave
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const onEnter = () => setPaused(true);
    const onLeave = () => setPaused(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    };
  }, []);

  // Pause while disclosures are open
  useEffect(() => {
    const off1 = sub('disclosure.open', () => setPaused(true));
    const off2 = sub('disclosure.close', () => setPaused(false));
    return () => { off1?.(); off2?.(); };
  }, []);

  // Wheel/trackpad cycle (vertical) via CardWidget capture-phase handler
  const lastWheelAtRef = useRef(0);
  const onCardWheel = (ev: any) => {
    // Always allow manual wheel-driven cycling; paused only affects auto-rotate
    if (ev.ctrlKey) return;
    const raw = ev.deltaY;
    const delta = ev.deltaMode === 1 ? raw * 16 : (ev.deltaMode === 2 ? raw * 800 : raw);
    if (Math.abs(delta) < 0.5) return;
    const now = performance.now();
    if (now - lastWheelAtRef.current < 220) return;
    ev.preventDefault?.();
    cycle(delta > 0 ? 1 : -1);
    lastWheelAtRef.current = now;
  };

  // Touch flick (coarse pointers)
  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const isCoarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches;
    if (!isCoarse) return;
    let startY = 0, startT = 0, moved = false, last = 0;
    const MIN_DIST = 28, MIN_V = 0.35, THROTTLE = 220;
    const onDown = (e: PointerEvent) => { startY = e.clientY; startT = performance.now(); moved = false; };
    const onMove = (e: PointerEvent) => { if (Math.abs(e.clientY - startY) > 6) moved = true; };
    const onUp = (e: PointerEvent) => {
      const dy = e.clientY - startY; const dt = Math.max(1, performance.now() - startT); const v = Math.abs(dy) / dt; const now = performance.now();
      if (moved && Math.abs(dy) >= MIN_DIST && v >= MIN_V && (now - last) >= THROTTLE) {
        cycle(dy < 0 ? 1 : -1); last = now; e.preventDefault?.();
      }
    };
    el.addEventListener('pointerdown', onDown as any, { passive: true } as any);
    el.addEventListener('pointermove', onMove as any, { passive: true } as any);
    el.addEventListener('pointerup', onUp as any, { passive: false } as any);
    el.addEventListener('pointercancel', onUp as any, { passive: false } as any);
    return () => {
      el.removeEventListener('pointerdown', onDown as any);
      el.removeEventListener('pointermove', onMove as any);
      el.removeEventListener('pointerup', onUp as any);
      el.removeEventListener('pointercancel', onUp as any);
    };
  }, [faces.length, paused]);

  // Auto-rotate every 7s
  useEffect(() => {
    if (reduceMotion) return;
    if (paused) return;
    const t = setTimeout(() => cycle(1), 7000);
    return () => clearTimeout(t);
  }, [idx, paused, reduceMotion, faces.length]);

  function cycle(step: number) {
    setIdx((i) => {
      const next = (i + step + faces.length) % faces.length;
      emit('risk.scroll.cycle', { from: faces[i]?.id, to: faces[next]?.id });
      return next;
    });
  }

  const headerNode = (
    <div className="flex items-center gap-2 min-w-0">
      <KPIIcon name="risk" className="h-3.5 w-3.5 text-white/75" />
      <span className="truncate text-[12.5px] font-medium">Risk Index</span>
      <span className="ml-1 px-1.5 py-0 rounded-full text-[10px] leading-5 bg-white/10 text-white/70 ring-1 ring-white/10 tabular-nums">{idx + 1}/{faces.length}</span>
    </div>
  );

  return (
    <div ref={ref}>
      <CardWidget
        title={headerNode}
        subtitle={(
          <span className="text-[10px] text-white/60 truncate">{faces[idx]?.descriptor}</span>
        )}
        headerTight
        headerDivider
        interactive
        keyboardActivation={false}
        onWheel={onCardWheel}
        onPrimaryAction={() => openBreakdown()}
        ariaLabel={ariaSummary}
      >
        <div ref={deckRef} className="rk-rotate-surface relative min-h-[120px] pt-1 pb-3">
          {faces.map((f, i) => (
            <div
              key={f.id}
              aria-hidden={i !== idx}
              className={`rk-face absolute inset-0 will-change-transform transition-opacity ${reduceMotion ? '' : 'transition-transform duration-200'} ${i === idx ? 'rk-face--current opacity-100 translate-y-0' : 'rk-face--outgoing opacity-0 translate-y-1'}`}
              style={{ pointerEvents: i === idx ? 'auto' : 'none' }}
            >
              {f.render()}
            </div>
          ))}
        </div>
      </CardWidget>
    </div>
  );
}
