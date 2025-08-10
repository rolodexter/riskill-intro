import CardWidget from "./CardWidget";
import { useResizeDensity } from "./useResizeDensity";
import { KPIIcon, TrendIcon } from "../components/icons/KPI";
import { KPI_COPY } from "../content/kpi";
import { useProgressiveDisclosure } from "../hooks/useProgressiveDisclosure";

export default function AgentActivity() {
  const { ref, bp } = useResizeDensity();
  const { escalateToChat } = useProgressiveDisclosure();
  const numberCls =
    bp === "xs" ? "text-[20px]" : bp === "sm" ? "text-[22px]" : bp === "md" ? "text-2xl" : "text-3xl";
  const k = KPI_COPY.agentActivity;

  function openDetails() {
    const rect = (ref.current as HTMLDivElement | null)?.getBoundingClientRect();
    escalateToChat({
      source: "agent-activity-widget",
      cardId: k.id,
      title: k.title,
      primary: k.primary,
      metrics: k.secondary,
      anchorRect: rect
        ? { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
        : undefined,
      narrative: k.narrative,
    });
  }

  return (
    <div ref={ref}>
      <CardWidget
        title={
          <div className="flex items-center gap-2 min-w-0">
            <KPIIcon name={k.icon} className="h-4 w-4 text-white/80" />
            <span className="truncate">{k.title}</span>
          </div>
        }
        subtitle={<span className="text-xs text-textSec truncate">{k.contextShort}</span>}
        interactive
        keyboardActivation={false}
        onPrimaryAction={openDetails}
      >
        <div className="flex flex-col gap-2">
          {/* Primary */}
          <div className={`${numberCls} font-semibold tabular-nums`}>{k.primary}</div>

          {/* Secondary */}
          {k.secondary && k.secondary.length > 0 && (
            <div className="flex items-center gap-3 text-sm text-white/85">
              {k.secondary.slice(0, 2).map((m, i) => (
                <div key={i} className="flex items-baseline gap-1 min-w-0">
                  <div className="font-medium truncate">{m.label}</div>
                  <div className="text-white/70 truncate">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Trend */}
          {k.trend && (
            <div className="flex items-center gap-2 text-xs text-white/80">
              <TrendIcon dir={k.trend.dir} className="h-3.5 w-3.5" />
              <span className="font-medium">{k.trend.pct}</span>
              <span className="text-white/60">{k.trend.period}</span>
            </div>
          )}
        </div>
      </CardWidget>
    </div>
  );
}
