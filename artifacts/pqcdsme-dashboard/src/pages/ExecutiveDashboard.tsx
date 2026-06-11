import PlantHealthCard from "../components/PlantHealthCard";
import KPIOverviewCard from "../components/KPIOverviewCard";
import { alerts, achievements, units } from "../mock/data";
import AlertDashboard from "@/components/AlertDashboard";
import AchievementsCard from "@/components/AchievementsCard";
import UnitRankingTable from "@/components/UnitRankingTable";

export default function ExecutiveDashboard() {
   console.log("EXECUTIVE DASHBOARD LOADED");
  return (
    


    <div className="max-w-[1600px] mx-auto space-y-6">
      <PlantHealthCard score={91} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">

        <KPIOverviewCard
          title="Production"
          value={94}
          trend="+3.2%"
          best="98%"
          color="#378ADD"
        />

        <KPIOverviewCard
          title="Quality"
          value={98}
          trend="+1.5%"
          best="99%"
          color="#1D9E75"
        />

        <KPIOverviewCard
          title="Cost"
          value={87}
          trend="-2.1%"
          best="93%"
          color="#BA7517"
        />

        <KPIOverviewCard
          title="Delivery"
          value={92}
          trend="+2.8%"
          best="97%"
          color="#7F77DD"
        />

        <KPIOverviewCard
          title="Safety"
          value={100}
          trend="+0%"
          best="100%"
          color="#E24B4A"
        />

        <KPIOverviewCard
          title="Morale"
          value={89}
          trend="+1.7%"
          best="97%"
          color="#D4537E"
        />

        <KPIOverviewCard
          title="Environment"
          value={91}
          trend="+1.2%"
          best="95%"
          color="#639922"
        />

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementsCard achievements={achievements} />
        <AlertDashboard alerts={alerts} />
        <UnitRankingTable units={units} />
      </div>

    </div>
  );
}