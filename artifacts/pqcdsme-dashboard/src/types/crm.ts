export interface MonthlyValue {
  month: string;
  value: number | null;
}

export interface KPIUnit {
  unit: string;
  fy26Actual: number;
  fy27ABP: number;
  monthlyValues: MonthlyValue[];
}

export interface SubKPI {
  name: string;

  overall?: KPIUnit;

  units?: KPIUnit[];
}

export interface KPI {
  name: string;

  hasDrilldown: boolean;

  manualEntry?: boolean;

  subKPIs: SubKPI[];
}

export interface LineYieldEntry {
  subKPI: "Process Yield" | "GR Yield";

  unit: string;

  value: number;

  updatedAt?: string;

  updatedBy?: string;
}

export interface ParsedCRMData {
  months: string[];

  kpis: KPI[];
}