import PlantHealthCard from "../components/PlantHealthCard";
import KPIOverviewCard, { KPIStatus } from "../components/KPIOverviewCard";

import { alerts, achievements, units, buildings } from "../mock/data";

import AlertDashboard from "@/components/AlertDashboard";
import AchievementsCard from "@/components/AchievementsCard";
import UnitRankingTable from "@/components/UnitRankingTable";
import BuildingOverviewCard from "@/components/BuildingOverviewCard";
import PlantHealthTrend from "@/components/PlantHealthTrend";
import PerformanceHighlights from "@/components/PerformanceHighlights";
import ExecutiveInsights from "@/components/ExecutiveInsights";

import { useEffect, useState } from "react";

import { calculatePlantHealthTrend } from "@/utils/plantHealthTrend";

import ExcelUploader from "@/components/ExcelUploader";

import { mapCRMRows, type CRMKPI } from "@/services/crmMapper";

export default function ExecutiveDashboard() {
  console.log("EXECUTIVE DASHBOARD LOADED");

  const [crmData, setCrmData] = useState<CRMKPI[]>([]);
  const [excelRows, setExcelRows] = useState<Record<string, any>[]>([]);

  const [selectedDrilldown, setSelectedDrilldown] = useState<{
    kpi: string;
    subKPI: string;
  } | null>(null);

  const [selectedCardKPI, setSelectedCardKPI] = useState<string | null>(null);

  const previousStatuses = [
    "yellow",
    "red",
    "yellow",
    "red",
    "green",
    "green",
  ] as KPIStatus[];

  const trend = calculatePlantHealthTrend(
    crmData.map((kpi) => kpi.status),
    previousStatuses
  );

  const latestMonth = crmData[0]?.latestMonth ?? "";

  const drilldownRows = selectedDrilldown
    ? excelRows.filter(
        (row) =>
          row.KPI?.toLowerCase().trim() ===
            selectedDrilldown.kpi.toLowerCase().trim() &&
          row["Sub-KPI"]?.toLowerCase().trim() ===
            selectedDrilldown.subKPI.toLowerCase().trim() &&
          row.Unit !== "Overall"
      )
    : [];

  const cardDrilldownRows = selectedCardKPI
    ? excelRows.filter(
        (row) =>
          row.KPI?.toLowerCase().trim() ===
            selectedCardKPI.toLowerCase().trim() &&
          row.Unit !== "Overall"
      )
    : [];

  const [comparisonBasis, setComparisonBasis] = useState<"FY26" | "FY27">(
    "FY27"
  );

  const [selectedMonth, setSelectedMonth] = useState("");

  const availableMonths =
    excelRows.length > 0
      ? Object.keys(excelRows[0]).filter((key) =>
          /^[A-Za-z]{3}'\d{2}$/.test(key)
        )
      : [];

  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[availableMonths.length - 1]);
    }
  }, [availableMonths]);

  useEffect(() => {
    if (!excelRows.length || !selectedMonth) return;
    const mapped = mapCRMRows(
      excelRows,
      availableMonths,
      selectedMonth,
      comparisonBasis
    );
    setCrmData(mapped);
  }, [excelRows, selectedMonth, comparisonBasis]);

  return (
    <div className="max-w-none mx-auto space-y-6">
      <div className="flex justify-end mb-4">
        <ExcelUploader
          compact
          onDataLoaded={(data, rows) => {
            setExcelRows(rows);
            // Derive months from the freshly loaded rows (not stale excelRows state)
            const freshMonths = Object.keys(rows[0] ?? {}).filter((key) =>
              /^[A-Za-z]{3}'\d{2}$/.test(key)
            );
            const freshMonth =
              selectedMonth || freshMonths[freshMonths.length - 1] || "";
            const mapped = mapCRMRows(
              rows,
              freshMonths,
              freshMonth,
              comparisonBasis
            );
            setCrmData(mapped);
          }}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">CRM KPI Overview</h2>
        <span className="text-s text-muted-foreground">
          Reporting Month:{" "}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </span>
        <select
          value={comparisonBasis}
          onChange={(e) =>
            setComparisonBasis(e.target.value as "FY26" | "FY27")
          }
          className="border rounded px-2 py-1"
        >
          <option value="FY26">FY26 Actual</option>
          <option value="FY27">FY27 ABP</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-stretch">
        {crmData.map((kpi) => (
          <KPIOverviewCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            uom={kpi.uom}
            best={kpi.best}
            fy26Actual={kpi.fy26Actual}
            fy27ABP={kpi.fy27ABP}
            comparisonBasis={comparisonBasis}
            status={kpi.status}
            history={kpi.history}
            historyMonths={kpi.historyMonths}
            bestMonth={kpi.bestMonth}
            subKPIs={kpi.subKPIs}
            onSubKPIClick={(name) =>
              setSelectedDrilldown({ kpi: kpi.title, subKPI: name })
            }
            onCardClick={() => {
              if (
                kpi.title === "Rolling Oil Consumption" ||
                kpi.title === "Line Yield"
              ) {
                setSelectedCardKPI(kpi.title);
              }
            }}
          />
        ))}
      </div>

      <div className="space-y-4">
        {/*<PlantHealthCard score={trend.current} trend={trend.change} />*/}
        <ExecutiveInsights kpis={crmData} />
      </div>

      {/* Sub-KPI Drilldown Modal */}
      {selectedDrilldown && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[750px] max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-semibold">
              {selectedDrilldown.subKPI}
            </h2>
            <p className="text-gray-500 mt-1">KPI: {selectedDrilldown.kpi}</p>

            <div className="mt-6 border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-gray-600 text-left">
                    <th className="px-4 py-2 font-medium">Unit</th>
                    <th className="px-4 py-2 font-medium text-right">{selectedMonth || "Current"}</th>
                    <th className="px-4 py-2 font-medium text-right">FY26 Actual</th>
                    <th className="px-4 py-2 font-medium text-right">FY27 ABP</th>
                  </tr>
                </thead>
                <tbody>
                  {drilldownRows.map((row, i) => {
                    const current = selectedMonth && row[selectedMonth] != null
                      ? Number(row[selectedMonth]).toFixed(2)
                      : "-";
                    const fy26 = Number(row["FY26 "] || row["FY26"] || 0).toFixed(2);
                    const fy27 = Number(row["FY27 ABP"] || 0).toFixed(2);
                    return (
                      <tr
                        key={row.Unit}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-2 text-gray-700">{row.Unit}</td>
                        <td className="px-4 py-2 text-right font-medium">{current}</td>
                        <td className="px-4 py-2 text-right text-gray-500">{fy26}</td>
                        <td className="px-4 py-2 text-right text-gray-500">{fy27}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setSelectedDrilldown(null)}
              className="mt-6 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Card KPI Drilldown Modal */}
      {selectedCardKPI && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[750px] max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-semibold">{selectedCardKPI}</h2>

            <div className="mt-6 border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-gray-600 text-left">
                    <th className="px-4 py-2 font-medium">Unit</th>
                    <th className="px-4 py-2 font-medium text-right">{selectedMonth || "Current"}</th>
                    <th className="px-4 py-2 font-medium text-right">FY26 Actual</th>
                    <th className="px-4 py-2 font-medium text-right">FY27 ABP</th>
                  </tr>
                </thead>
                <tbody>
                  {cardDrilldownRows.map((row, i) => {
                    const current = selectedMonth && row[selectedMonth] != null
                      ? Number(row[selectedMonth]).toFixed(2)
                      : "-";
                    const fy26 = Number(row["FY26 "] || row["FY26"] || 0).toFixed(2);
                    const fy27 = Number(row["FY27 ABP"] || 0).toFixed(2);
                    return (
                      <tr
                        key={row.Unit}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-2 text-gray-700">{row.Unit}</td>
                        <td className="px-4 py-2 text-right font-medium">{current}</td>
                        <td className="px-4 py-2 text-right text-gray-500">{fy26}</td>
                        <td className="px-4 py-2 text-right text-gray-500">{fy27}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setSelectedCardKPI(null)}
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