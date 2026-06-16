import PlantHealthCard from "../components/PlantHealthCard";
import KPIOverviewCard, {
  KPIStatus,
} from "../components/KPIOverviewCard";

import {
  alerts,
  achievements,
  units,
  buildings,
} from "../mock/data";

import AlertDashboard from "@/components/AlertDashboard";
import AchievementsCard from "@/components/AchievementsCard";
import UnitRankingTable from "@/components/UnitRankingTable";
import BuildingOverviewCard from "@/components/BuildingOverviewCard";
import PlantHealthTrend from "@/components/PlantHealthTrend";
import PerformanceHighlights from "@/components/PerformanceHighlights";

import { useState } from "react";

import {
  calculatePlantHealthTrend,
} from "@/utils/plantHealthTrend";

import ExcelUploader from "@/components/ExcelUploader";

import type {
  CRMKPI,
} from "@/services/crmMapper";

export default function ExecutiveDashboard() {

  console.log(
    "EXECUTIVE DASHBOARD LOADED"
  );

  const [crmData, setCrmData] =
    useState<CRMKPI[]>([]);
  
  const [excelRows, setExcelRows] =
    useState<Record<string, any>[]>(
      []
    );

  const [
    selectedDrilldown,
    setSelectedDrilldown,
  ] = useState<{
    kpi: string;
    subKPI: string;
  } | null>(null);

  const [selectedCardKPI, setSelectedCardKPI] =
    useState<string | null>(null);

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

  const drilldownRows =
    selectedDrilldown
      ? excelRows.filter(
          (row) =>
            row.KPI
              ?.toLowerCase()
              .trim() ===
            selectedDrilldown.kpi
              .toLowerCase()
              .trim() &&
            row["Sub-KPI"]
              ?.toLowerCase()
              .trim() ===
            selectedDrilldown.subKPI
              .toLowerCase()
              .trim() &&
            row.Unit !==
              "Overall"
        )
      : [];
  const cardDrilldownRows =
    selectedCardKPI
      ? excelRows.filter(
          (row) =>
            row.KPI
              ?.toLowerCase()
              .trim() ===
            selectedCardKPI
              .toLowerCase()
              .trim() &&
            row.Unit !==
              "Overall"
        )
      : [];
    
    console.log(
      "SELECTED CARD:",
      selectedCardKPI
    );

    console.log(
      "SELECTED DRILLDOWN:",
      selectedDrilldown
    );

    console.log(
      "CARD ROWS:",
      cardDrilldownRows
    );

    console.log(
      "DRILLDOWN ROWS:",
      drilldownRows
    );
    console.log(
  "ROLLING ROWS:",
  excelRows.filter(
    row =>
      String(row.KPI)
        .toLowerCase()
        .includes("rolling")
  )
);

console.log(
  "METAL ROWS:",
  excelRows.filter(
    row =>
      String(row.KPI)
        .toLowerCase()
        .includes("metal")
  )
);
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      <ExcelUploader
        onDataLoaded={(
          data,
          rows
        ) => {
          setCrmData(data);
          setExcelRows(rows);
        }}
      />

      <PlantHealthCard
        score={trend.current}
        trend={trend.change}
      />

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
            subKPIs={kpi.subKPIs}
            onSubKPIClick={(name) =>
              setSelectedDrilldown({
                kpi: kpi.title,
                subKPI: name,
              })
            }
          onCardClick={() => {
              if (
                kpi.title ===
                  "Rolling Oil Consumption" ||
                kpi.title ===
                  "Line Yield"
              ) {
                setSelectedCardKPI(
                  kpi.title
                );
              }
            }}
          />

        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <AchievementsCard
          achievements={achievements}
        />

        <AlertDashboard
          alerts={alerts}
        />

      </div>

      <PerformanceHighlights />

      <UnitRankingTable
        units={units}
      />

      <h2 className="text-xl font-semibold">
        Building Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {buildings.map(
          (building) => (
            <BuildingOverviewCard
              key={building.id}
              name={building.name}
              units={building.units}
              score={building.score}
            />
          )
        )}

      </div>

      {/* DRILLDOWN MODAL */}

      {selectedDrilldown && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">

            <h2 className="text-xl font-semibold">
              {selectedDrilldown.subKPI}
            </h2>

            <p className="text-gray-500 mt-2">
              KPI:
              {" "}
              {selectedDrilldown.kpi}
            </p>

            <div className="mt-6 border rounded p-4 bg-slate-50">

              <div className="space-y-2">

                {drilldownRows.map((row) => (

                  <div
                    key={row.Unit}
                    className="flex justify-between bg-white border rounded px-3 py-2"
                  >

                    <span>
                      {row.Unit}
                    </span>

                    <span className="font-medium">
                      {
                        row["Oct'26"] ||
                        row["Sep'26"] ||
                        row["Aug'26"] ||
                        "-"
                      }
                    </span>

                  </div>

                ))}

              </div>

            </div>
            <button
              onClick={() =>
                setSelectedDrilldown(null)
              }
              className="mt-6 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
            >
              Close
            </button>

          </div>

        </div>

      )}
      {selectedCardKPI && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">

            <h2 className="text-xl font-semibold">
              {selectedCardKPI}
            </h2>

            <div className="mt-6 border rounded p-4 bg-slate-50">

              <div className="space-y-2">

                {cardDrilldownRows.map(
                  (row) => (

                    <div
                      key={row.Unit}
                      className="flex justify-between bg-white border rounded px-3 py-2"
                    >

                      <span>
                        {row.Unit}
                      </span>

                      <span className="font-medium">
                        {
                          row["Oct'26"] ||
                          row["Sep'26"] ||
                          row["Aug'26"] ||
                          "-"
                        }
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            <button
              onClick={() =>
                setSelectedCardKPI(null)
              }
              className="mt-6 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
            >
              Close
            </button>

          </div>

        </div>

      )}
    </div>
  );
}