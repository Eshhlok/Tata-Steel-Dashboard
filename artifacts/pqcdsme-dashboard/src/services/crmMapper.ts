import type { KPIStatus } from "@/components/KPIOverviewCard";

export interface CRMKPI {
  title: string;

  value: number;

  uom: string;

  best: number;

  status: KPIStatus;

  history: number[];

  subKPIs?: {
    name: string;
    value: number;
    status: KPIStatus;
  }[];
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
function buildRollConsumption(
  rows: Record<string, any>[],
  months: string[]
): CRMKPI | null {

  const workRollOverall =
    rows.find(
      row =>
        row.KPI === "Roll Consumption" &&
        row["Sub-KPI"] === "Work Roll" &&
        row.Unit === "Overall"
    );

  const imrRollOverall =
    rows.find(
      row =>
        row.KPI === "Roll Consumption" &&
        row["Sub-KPI"] === "IMR Roll" &&
        row.Unit === "Overall"
    );

  if (
    !workRollOverall &&
    !imrRollOverall
  ) {
    return null;
  }

  const workCurrent =
    workRollOverall
      ? getLatestValue(
          workRollOverall,
          months
        )
      : 0;

  const imrCurrent =
    imrRollOverall
      ? getLatestValue(
          imrRollOverall,
          months
        )
      : 0;
        console.log("WORK CURRENT:", workCurrent);
        console.log("IMR CURRENT:", imrCurrent);
  const overallValue =
    (workCurrent + imrCurrent) / 2;

  const fy26 =
    Number(
      workRollOverall?.["FY26 "] ||
      workRollOverall?.["FY26"] ||
      0
    );

  return {
    title: "Roll Consumption",

    value: Number(
      overallValue.toFixed(3)
    ),

    uom:
      workRollOverall?.UOM ??
      "mm/kt",

    best: fy26,

    status: getStatus(
      overallValue,
      fy26,
      "Roll Consumption"
    ),

    history: [],

    subKPIs: [
      {
        name: "Work Roll",
        value: workCurrent,
        status: getStatus(
          workCurrent,
          Number(
            workRollOverall?.["FY26 "] ||
            workRollOverall?.["FY26"] ||
            0
          ),
          "Roll Consumption"
        ),
      },

      {
        name: "IMR Roll",
        value: imrCurrent,
        status: getStatus(
          imrCurrent,
          Number(
            imrRollOverall?.["FY26 "] ||
            imrRollOverall?.["FY26"] ||
            0
          ),
          "Roll Consumption"
        ),
      },
    ],
  };
}
export function mapCRMRows(
  rows: Record<string, any>[],
  months: string[]
): CRMKPI[] {

  const baseKPIs = rows
    .filter(
      (row) =>
        row.Unit === "Overall" &&
        (
          row.KPI === "RLNG Consumption" ||
          row.KPI === "Power Consumption"
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
          row["FY26 "] ||
          row["FY26"] ||
          0
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

        uom: row.UOM || "",

        best: fy26,

        status: getStatus(
          current,
          fy26,
          row.KPI
        ),

        history,
      };
    });

  const rollConsumption =
    buildRollConsumption(
      rows,
      months
    );
    console.log(
    "ROLL CARD:",
    rollConsumption
    );
  return rollConsumption
    ? [
        ...baseKPIs,
        rollConsumption,
      ]
    : baseKPIs;
}