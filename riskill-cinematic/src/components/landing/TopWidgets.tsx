import RevenuePulse from "../../widgets/RevenuePulse";
import OpsHealth from "../../widgets/OpsHealth";
import RiskAlerts from "../../widgets/RiskAlerts";
import AgentActivity from "../../widgets/AgentActivity";

export default function TopWidgets(){
  return (
    <div className="mx-auto max-w-[1280px] w-full px-4 md:px-6 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-stretch gap-4 md:gap-6">
        <RevenuePulse />
        <OpsHealth />
        <RiskAlerts />
        <AgentActivity />
      </div>
    </div>
  );
}
