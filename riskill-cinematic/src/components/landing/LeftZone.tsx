import NavigationCard from "../../widgets/NavigationCard";
import FiltersCard from "../../widgets/FiltersCard";
import DataSourcesCard from "../../widgets/DataSourcesCard";

export default function LeftZone(){
  return (
    <div className="grid gap-4 md:gap-6">
      <NavigationCard />
      <FiltersCard />
      <DataSourcesCard />
    </div>
  );
}
