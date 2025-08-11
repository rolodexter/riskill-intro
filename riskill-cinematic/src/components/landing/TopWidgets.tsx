import RevenuePulse from "../../widgets/RevenuePulse";
import Operations from "../../widgets/Operations";
import RiskIndex from "../../widgets/RiskIndex";
import AgentActivity from "../../widgets/AgentActivity";

export default function TopWidgets(){
  return (
    <div className="mx-auto max-w-[1280px] w-full px-4 md:px-6 pt-6 top-row-compact">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-stretch gap-4 md:gap-6"
        data-band="top"
        style={{ ['--rk-card-alpha' as any]: 0.60 }}
      >
        <RevenuePulse />
        <Operations />
        <RiskIndex />
        <AgentActivity />
      </div>
    </div>
  );
}
