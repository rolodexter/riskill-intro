import CardWidget from "./CardWidget";
import { QuickAction } from "./QuickAction";
import { pub } from "./bus";
import { useResizeDensity } from "./useResizeDensity";

export default function RecommendationsCard() {
  const { ref, bp } = useResizeDensity();
  const textCls = bp === "xs" ? "text-[13px]" : bp === "sm" ? "text-[14px]" : "text-sm";
  const btnPad = bp === "xs" ? "px-2.5 py-1.5 text-[12px]" : "px-3 py-1.5 text-[13px]";
  const apply = () => pub("action.queue.push", { id: crypto.randomUUID(), type: "recommendation", ts: Date.now() });
  return (
    <div ref={ref}>
      <CardWidget
        title="Recommendations"
        actions={<QuickAction label="Apply all" onClick={apply}>✓</QuickAction>}
      >
        <ul className={`space-y-3 ${textCls}`}>
          <li className="flex justify-between items-center">
            <span>Increase safety stock for SKU-23</span>
            <button
              className={`${btnPad} rounded-lg bg-accent/20 border border-accent/30 hover:bg-accent/30`}
              onClick={apply}
            >
              Apply
            </button>
          </li>
          <li className="flex justify-between items-center">
            <span>Pause underperforming ad set</span>
            <button
              className={`${btnPad} rounded-lg bg-accent/20 border border-accent/30 hover:bg-accent/30`}
              onClick={apply}
            >
              Apply
            </button>
          </li>
        </ul>
      </CardWidget>
    </div>
  );
}
