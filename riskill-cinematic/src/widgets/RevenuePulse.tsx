import CardWidget from "./CardWidget";
import { QuickAction } from "./QuickAction";
import { useResizeDensity } from "./useResizeDensity";

export default function RevenuePulse() {
  const { ref, bp } = useResizeDensity();
  const numberCls =
    bp === "xs" ? "text-[20px]" : bp === "sm" ? "text-[22px]" : bp === "md" ? "text-2xl" : "text-3xl";
  const sparkW = bp === "xs" ? "w-24" : bp === "sm" ? "w-28" : bp === "md" ? "w-32" : "w-36";
  return (
    <div ref={ref}>
      <CardWidget
        title="Revenue"
        subtitle={bp === "xs" ? undefined : "Last 24h"}
        interactive
        onPrimaryAction={() => console.log("Open revenue detail")}
        actions={
          <>
            <QuickAction label="Drill in" onClick={() => console.log("Drill")}>↘︎</QuickAction>
            <QuickAction label="Export" onClick={() => console.log("Export")}>⤓</QuickAction>
          </>
        }
      >
        <div className="flex items-end justify-between">
          <div className={`${numberCls} font-semibold tabular-nums`}>—</div>
          <div className={`h-10 ${sparkW} rounded bg-white/5`} />
        </div>
      </CardWidget>
    </div>
  );
}
