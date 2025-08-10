import CardWidget from "./CardWidget";
import { useResizeDensity } from "./useResizeDensity";

export default function RiskAlerts() {
  const { ref, bp } = useResizeDensity();
  const numberCls =
    bp === "xs" ? "text-[20px]" : bp === "sm" ? "text-[22px]" : bp === "md" ? "text-2xl" : "text-3xl";
  const meterW = bp === "xs" ? "w-24" : bp === "sm" ? "w-28" : bp === "md" ? "w-32" : "w-36";

  return (
    <div ref={ref}>
      <CardWidget title="Risk Alerts" subtitle="Last alert">
        <div className="flex items-center justify-between">
          <span className={`${numberCls} font-semibold tabular-nums`}>0</span>
          <div className={`h-4 ${meterW} rounded bg-white/5`} />
        </div>
      </CardWidget>
    </div>
  );
}
