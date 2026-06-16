import PlantHealthCard from "../components/PlantHealthCard";
import KPIOverviewCard, { KPIStatus } from "../components/KPIOverviewCard";
import { alerts, achievements, units, buildings } from "../mock/data";
import AlertDashboard from "@/components/AlertDashboard";
import AchievementsCard from "@/components/AchievementsCard";
import UnitRankingTable from "@/components/UnitRankingTable";
import BuildingOverviewCard from "@/components/BuildingOverviewCard";
import PlantHealthTrend from "@/components/PlantHealthTrend";
import PerformanceHighlights from "@/components/PerformanceHighlights";
import { useState } from "react";
import KPIDrilldownModal from "@/components/KPIDrillDownModal";
import { drilldownData } from "@/mock/drillDowndata";
import { calculatePlantHealth } from "@/utils/plantHealthCalculator";
import { calculatePlantHealthTrend } from "@/utils/plantHealthTrend";
import ExcelUploader from "@/components/ExcelUploader";
import type { CRMKPI } from "@/services/crmMapper";

export default function ExecutiveDashboard() {
   console.log("EXECUTIVE DASHBOARD LOADED");
   const [crmData, setCrmData] =useState<CRMKPI[]>([]);
   console.log("CRM DATA:",crmData);
   const [selectedKPI,setSelectedKPI,] = useState<string | null>(null);
   const plantHealthScore = calculatePlantHealth(crmData.map((kpi) => kpi.status));
   const previousStatuses = [
      "yellow",
      "red",
      "yellow",
      "red",
      "green",
      "green",
    ] as KPIStatus[];
    const trend =
    calculatePlantHealthTrend(
      crmData.map(
        (kpi) => kpi.status
      ),
      previousStatuses
    );
    
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <ExcelUploader onDataLoaded={setCrmData} />
      <PlantHealthCard score={trend.current} trend={trend.change} />
      <PlantHealthTrend />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {crmData.map((kpi) => (
          <KPIOverviewCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            uom={kpi.uom}
            best={kpi.best}
            status={kpi.status}
            history={kpi.history}
          />
        ))}

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementsCard achievements={achievements} />
        <AlertDashboard alerts={alerts} />
        
      </div>
      <PerformanceHighlights />
      <UnitRankingTable units={units} />
      
      <h2 className="text-xl font-semibold">
        Building Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        {buildings.map((building) => (
          <BuildingOverviewCard
            key={building.id}
            name={building.name}
            units={building.units}
            score={building.score}
          />
        ))}
    </div>
    <KPIDrilldownModal
        open={!!selectedKPI}
        title={selectedKPI || ""}
        data={
          selectedKPI
            ? drilldownData[
                selectedKPI as keyof typeof drilldownData
              ] || []
            : []
        }
        onClose={() =>
          setSelectedKPI(null)
        }
      />
  </div>
  );

}