import type { KPIStatus } from "@/components/KPIOverviewCard";

export interface CRMKPI {
  title: string;

  value: number;

  uom: string;

  best: number;

  status: KPIStatus;

  history: number[];

  historyMonths: string[];

  latestMonth: string;

  bestMonth: string;
  fy26Actual: number;
  fy27ABP: number;

  subKPIs?: {
    name: string;
    value: number;
    status: KPIStatus;
  }[];
}

function getBestMonth(
  history: number[],
  historyMonths: string[],
  higherIsBetter: boolean
): string {
  if (
    history.length === 0 ||
    historyMonths.length === 0
  ) {
    return "";
  }

  const bestValue =
    higherIsBetter
      ? Math.max(...history)
      : Math.min(...history);

  const index =
    history.indexOf(bestValue);

  return (
    historyMonths[index] || ""
  );
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
  
  const workHistory = months
  .filter(
    month =>
      workRollOverall?.[month] !== "" &&
      workRollOverall?.[month] !== null &&
      workRollOverall?.[month] !== undefined
  )
  .map(
    month =>
      Number(
        workRollOverall?.[month]
      )
  );

const workHistoryMonths =
  months.filter(
    month =>
      workRollOverall?.[month] !== "" &&
      workRollOverall?.[month] !== null &&
      workRollOverall?.[month] !== undefined
  );

const imrHistory = months
  .filter(
    month =>
      imrRollOverall?.[month] !== "" &&
      imrRollOverall?.[month] !== null &&
      imrRollOverall?.[month] !== undefined
  )
  .map(
    month =>
      Number(
        imrRollOverall?.[month]
      )
  );

const overallHistory =
  workHistory.map(
    (value, index) =>
      (
        value +
        (imrHistory[index] ?? 0)
      ) / 2
  );

const bestMonth =
  getBestMonth(
    overallHistory,
    workHistoryMonths,
    false
  );

const latestMonth =
  workHistoryMonths[
    workHistoryMonths.length - 1
  ] || "";

const displayMonths =
  workHistoryMonths.slice(-7);

const displayHistory =
  overallHistory.slice(-7);

  const imrCurrent =
    imrRollOverall
      ? getLatestValue(
          imrRollOverall,
          months
        )
      : 0;
  const overallValue =
    (workCurrent + imrCurrent) / 2;

  const workRollFY26 = Number(
    workRollOverall?.["FY26 "] ??
    workRollOverall?.["FY26"] ??
    0
  );

  const imrRollFY26 = Number(
    imrRollOverall?.["FY26 "] ??
    imrRollOverall?.["FY26"] ??
    0
  );

  const fy26 =
    (workRollFY26 + imrRollFY26) / 2;

  const workRollFY27ABP = Number(
    workRollOverall?.["FY27 ABP"] ?? 0
  );

  const imrRollFY27ABP = Number(
    imrRollOverall?.["FY27 ABP"] ?? 0
  );

  const fy27ABP =
    (workRollFY27ABP + imrRollFY27ABP) / 2;
  
  return {
    title: "Roll Consumption",

    value: Number(
      overallValue.toFixed(3)
    ),

    uom:
      workRollOverall?.UOM ??
      "mm/kt",

    best: Math.min(...overallHistory),

    status: getStatus(
      overallValue,
      fy26,
      "Roll Consumption"
    ),

    history: displayHistory,
    historyMonths: displayMonths,
    latestMonth: latestMonth,
    bestMonth,
    fy26Actual: fy26,
    fy27ABP: fy27ABP,
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
        row.KPI ?.toString().trim() === "Metal" &&
        row["Sub-KPI"]?.toString().trim() === "Dross" &&
        row.Unit ?.toString().trim()=== "Overall"
    );

  const overcoatingOverall =
    rows.find(
      row =>
        row.KPI ?.toString().trim()=== "Metal" &&
        row["Sub-KPI"]?.toString().trim() === "Overcoating" &&
        row.Unit ?.toString().trim()=== "Overall"
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
  
  const drossHistory = months
  .filter(
    month =>
      drossOverall?.[month] !== "" &&
      drossOverall?.[month] !== null &&
      drossOverall?.[month] !== undefined
  )
  .map(
    month =>
      Number(
        drossOverall?.[month]
      )
  );

  const drossHistoryMonths =
    months.filter(
      month =>
        drossOverall?.[month] !== "" &&
        drossOverall?.[month] !== null &&
        drossOverall?.[month] !== undefined
    );
  
  const overcoatingHistory = months
    .filter(
      month =>
        overcoatingOverall?.[month] !== "" &&
        overcoatingOverall?.[month] !== null &&
        overcoatingOverall?.[month] !== undefined
    )
    .map(
      month =>
        Number(
          overcoatingOverall?.[month]
        )
    );
  
  const overallHistory =
    drossHistory.map(
      (value, index) =>
        (
          value +
          (overcoatingHistory[index] ?? 0)
        ) / 2
    );

  const bestMonth =
    getBestMonth(
      overallHistory,
      drossHistoryMonths,
      false
    );

  const overcoatingCurrent =
    overcoatingOverall
      ? getLatestValue(
          overcoatingOverall,
          months
        )
      : 0;

  const overallValue =
    (drossCurrent+overcoatingCurrent)/2;

  const drossFY26 = Number(
    drossOverall?.["FY26 "] ??
    drossOverall?.["FY26"] ??
    0
  );

  const overcoatingFY26 = Number(
    overcoatingOverall?.["FY26 "] ??
    overcoatingOverall?.["FY26"] ??
    0
  );

  const fy26 =
    (drossFY26 + overcoatingFY26) / 2;

  const drossFY27ABP = Number(
    drossOverall?.["FY27 ABP"] ?? 0
  );

  const overcoatingFY27ABP = Number(
    overcoatingOverall?.["FY27 ABP"] ?? 0
  );

  const fy27ABP =
    (drossFY27ABP + overcoatingFY27ABP) / 2;  
  
  const displayMonths =
    drossHistoryMonths.slice(-7);

  const displayHistory =
    overallHistory.slice(-7);

  const latestMonth =
    drossHistoryMonths[
      drossHistoryMonths.length - 1
    ] || "";

  return {
    title: "Metal",

    value: overallValue,

    uom:
      drossOverall?.UOM || "%",

    best: Math.min(...overallHistory),

    status: getStatus(
      overallValue,
      fy26,
      "Metal"
    ),

    history: displayHistory,
    historyMonths: displayMonths,
    latestMonth: latestMonth,
    bestMonth,
    fy26Actual: fy26,
    fy27ABP: fy27ABP,
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

  const historyMonths =
    months.filter(
      (month) =>
        overallRow[month] !== ""
    );

  const latestMonth =
    historyMonths[
      historyMonths.length - 1
    ] || "";

  const bestMonth =
    getBestMonth(
      history,
      historyMonths,
      false
    );
  const displayMonths =
    historyMonths.slice(-7);

  const displayHistory =
    history.slice(-7);
  return {
    title:
      "Rolling Oil Consumption",

    value: current,

    uom:
      overallRow.UOM || "",

    best: Math.min(...history),
    fy26Actual: fy26,
    fy27ABP: Number(
      overallRow?.["FY27 ABP"] || 0
    ),
    status: getStatus(
      current,
      fy26,
      "Rolling Oil consumption"
    ),

    history:displayHistory,
    historyMonths: displayMonths,

    latestMonth,

    bestMonth,
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
  
  const historyMonths =
    months.filter(
      month =>
        overallRow[month] !== "" &&
        overallRow[month] !== null &&
        overallRow[month] !== undefined
    );

  const latestMonth =
    historyMonths[
      historyMonths.length - 1
    ] || "";

  const bestMonth =
    getBestMonth(
      history,
      historyMonths,
      true
    );
  const displayMonths =
    historyMonths.slice(-7);

  const displayHistory =
    history.slice(-7);
  return {
    title: "Line Yield",

    value: current,

    uom:
      overallRow.UOM || "%",

    best: Math.min(...history),
    fy26Actual: fy26,
    fy27ABP: Number(
      overallRow?.["FY27 ABP"] || 0
    ),
    status: getStatus(
      current,
      fy26,
      "Line Yield"
    ),

    history: displayHistory,
    historyMonths: displayMonths,

    latestMonth,
    bestMonth,
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
        

      const historyMonths =
        months.filter(
          (month) =>
            row[month] !== ""
        );

      const latestMonth =
        historyMonths[
          historyMonths.length - 1
        ] || "";

      const bestMonth =
        getBestMonth(
          history,
          historyMonths,
          false
        );

      const displayMonths =
        historyMonths.slice(-7);

      const displayHistory =
        history.slice(-7);
      
      return {
        title: row.KPI,

        value: current,

        uom: row.UOM || "",

        best: Math.min(...history),
        fy26Actual: fy26,
        fy27ABP: Number(
          row?.["FY27 ABP"] || 0
        ),
        status: getStatus(
          current,
          fy26,
          row.KPI
        ),

        history: displayHistory,
        historyMonths: displayMonths,

        latestMonth,

        bestMonth,
      };
    });

  const rollConsumption =
    buildRollConsumption(
      rows,
      months
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


