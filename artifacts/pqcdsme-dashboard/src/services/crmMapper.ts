import type { KPIStatus } from "@/components/KPIOverviewCard";

export interface CRMKPI {
  title: string;
  value: number;
  uom: string;
  best: number;
  status: KPIStatus;
  history: number[];
}

function getLatestValue(
  row: Record<string, any>,
  months: string[]
): number {

  for (
    let i = months.length - 1;
    i >= 0;
    i--
  ) {
    const value =
      row[months[i]];

    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      return Number(value);
    }
  }

  return 0;
}

function getStatus(
  current: number,
  fy26: number,
  kpi: string
): KPIStatus {

  const diff =
    Math.abs(
      current - fy26
    ) / fy26;

  if (diff <= 0.005) {
    return "yellow";
  }

  const higherIsBetter =
    kpi === "Line Yield";

  if (higherIsBetter) {
    return current > fy26
      ? "green"
      : "red";
  }

  return current < fy26
    ? "green"
    : "red";
}

export function mapCRMRows(
  rows: Record<string, any>[],
  months: string[]
): CRMKPI[] {

  return rows
    .filter(
      (row) =>
        row.Unit ===
          "Overall" &&
        (
          row.KPI ===
            "RLNG Consumption" ||
          row.KPI ===
            "Power Consumption"
        )
    )
    .map((row) => {

      const current =
        getLatestValue(
          row,
          months
        );

      const fy26 =
        Number(
           row["FY26 "] ||row["FY26"] || 0
        );

      const history =
        months
          .filter(
            (month) =>
              row[month] !== ""
          )
          .map(
            (month) =>
              Number(
                row[month]
              )
          );

      return {
        title: row.KPI,

        value: current,

        uom:
          row.UOM || "",

        best: fy26,

        status:
          getStatus(
            current,
            fy26,
            row.KPI
          ),

        history,
      };
    });
}