import RecommendationsCard from "../../widgets/RecommendationsCard";
import AlertsCard from "../../widgets/AlertsCard";
import CtaCard from "../../widgets/CtaCard";

export default function RightZone(){
  return (
    <div className="grid gap-4 md:gap-6">
      <RecommendationsCard />
      <AlertsCard />
      <CtaCard />
    </div>
  );
}
