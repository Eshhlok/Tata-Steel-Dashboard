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

function buildMetal(
  rows: Record<string, any>[],
  months: string[]
): CRMKPI | null {

  const drossOverall =
    rows.find(
      row =>
        row.KPI === "Metal" &&
        row["Sub-KPI"] === "Dross" &&
        row.Unit === "Overall"
    );

  const overcoatingOverall =
    rows.find(
      row =>
        row.KPI === "Metal" &&
        row["Sub-KPI"] === "Overcoating" &&
        row.Unit === "Overall"
    );

  if (
    !drossOverall &&
    !overcoatingOverall
  ) {
    return null;
  }

  const drossCurrent =
    drossOverall
      ? getLatestValue(
          drossOverall,
          months
        )
      : 0;

  const overcoatingCurrent =
    overcoatingOverall
      ? getLatestValue(
          overcoatingOverall,
          months
        )
      : 0;

  const overallValue =
    drossCurrent;

  const fy26 =
    Number(
      drossOverall?.["FY26 "] ||
      drossOverall?.["FY26"] ||
      0
    );

  return {
    title: "Metal",

    value: overallValue,

    uom:
      drossOverall?.UOM || "%",

    best: fy26,

    status: getStatus(
      overallValue,
      fy26,
      "Metal"
    ),

    history: [],

    subKPIs: [
      {
        name: "Dross",
        value: drossCurrent,

        status: getStatus(
          drossCurrent,
          Number(
            drossOverall?.["FY26 "] ||
            drossOverall?.["FY26"] ||
            0
          ),
          "Metal"
        ),
      },

      {
        name: "Overcoating",
        value:
          overcoatingCurrent,

        status: getStatus(
          overcoatingCurrent,
          Number(
            overcoatingOverall?.["FY26 "] ||
            overcoatingOverall?.["FY26"] ||
            0
          ),
          "Metal"
        ),
      },
    ],
  };
}

function buildRollingOilConsumption(
  rows: Record<string, any>[],
  months: string[]
): CRMKPI | null {

  const overallRow =
    rows.find(
      row =>
        row.KPI ===
          "Rolling Oil consumption" &&
        row.Unit ===
          "Overall"
    );

  if (!overallRow) {
    return null;
  }

  const current =
    getLatestValue(
      overallRow,
      months
    );

  const fy26 =
    Number(
      overallRow["FY26 "] ||
      overallRow["FY26"] ||
      0
    );

  const history =
    months
      .filter(
        month =>
          overallRow[month] !== ""
      )
      .map(
        month =>
          Number(
            overallRow[month]
          )
      );

  return {
    title:
      "Rolling Oil Consumption",

    value: current,

    uom:
      overallRow.UOM || "",

    best: fy26,

    status: getStatus(
      current,
      fy26,
      "Rolling Oil consumption"
    ),

    history,
  };
}

function buildLineYield(
  rows: Record<string, any>[],
  months: string[]
): CRMKPI | null {

  const overallRow =
    rows.find(
      row =>
        row.KPI === "Line Yield" &&
        row.Unit === "Overall"
    );

  if (!overallRow) {
    return null;
  }

  const current =
    getLatestValue(
      overallRow,
      months
    );

  const fy26 =
    Number(
      overallRow["FY26 "] ||
      overallRow["FY26"] ||
      0
    );

  const history =
    months
      .filter(
        month =>
          overallRow[month] !== "" &&
          overallRow[month] !== null &&
          overallRow[month] !== undefined
      )
      .map(
        month =>
          Number(
            overallRow[month]
          )
      );

  return {
    title: "Line Yield",

    value: current,

    uom:
      overallRow.UOM || "%",

    best: fy26,

    status: getStatus(
      current,
      fy26,
      "Line Yield"
    ),

    history,
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
  
  const rollingOil =
  buildRollingOilConsumption(
    rows,
    months
  );
  const metal =
    buildMetal(
      rows,
      months
    );
  const lineYield =
    buildLineYield(
      rows,
      months
    );
    
  return [

    
    ...baseKPIs,

    ...(rollConsumption
      ? [rollConsumption]
      : []),

    ...(rollingOil
      ? [rollingOil]
      : []),

    ...(metal
      ? [metal]
      : []),

    ...(lineYield
      ? [lineYield]
      : []),
  ];
}