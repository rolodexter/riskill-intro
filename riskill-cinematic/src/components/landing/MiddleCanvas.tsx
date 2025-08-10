import CommandCanvasCard from "../../widgets/CommandCanvasCard";
import InsightStreamCard from "../../widgets/InsightStreamCard";
import ActionQueueCard from "../../widgets/ActionQueueCard";

export default function MiddleCanvas(){
  return (
    <div className="grid gap-4 md:gap-6">
      <CommandCanvasCard />
      <InsightStreamCard />
      <ActionQueueCard />
    </div>
  );
}
