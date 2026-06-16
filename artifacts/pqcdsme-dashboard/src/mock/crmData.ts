import type { KPIStatus, } from "@/components/KPIOverviewCard";
export interface CRMSubKPI {
  name: string;
  value: number;
  status: KPIStatus;
}

export interface CRMKPI {
  title: string;
  value: number;
  uom: string;

  best: number;

  status: KPIStatus;

  history: number[];

  subKPIs?: CRMSubKPI[];
}
export const crmData = [
  {
    title: "RLNG Consumption",
    value: 1.19,
    uom: "MMSCFD",
    best: 1.24,
    status: "green" as KPIStatus,
    history: [1.31, 1.28, 1.25, 1.23, 1.21, 1.20, 1.19]
  },

  

  {
    title: "Power Consumption",
    value: 208.2,
    best: 206.1,
    status: "red" as KPIStatus,
    history: [203, 205, 206, 207, 208, 208, 208]
  },

  {
    title: "Roll Consumption",
    value: 0.89,
    best: 0.85,
    status: "yellow" as KPIStatus,

    subKPIs: [
      {
        name: "Work Roll",
        value: 0.82,
        status: "green" as KPIStatus
      },
      {
        name: "IMR Roll",
        value: 0.96,
        status: "yellow" as KPIStatus
      }
    ],

    history: [0.95, 0.94, 0.92, 0.91, 0.90, 0.89, 0.89]
  },

  {
    title: "Rolling Oil Consumption",
    value: 0.74,
    best: 0.71,
    status: "yellow" as KPIStatus,
    history: [0.78, 0.77, 0.76, 0.75, 0.75, 0.74, 0.74]
  },

  {
    title: "Metal",
    value: 0.42,
    best: 0.38,

    status: "green" as KPIStatus,

    subKPIs: [
      {
        name: "Dross",
        value: 0.24,
        status: "green" as KPIStatus
      },
      {
        name: "Overcoating",
        value: 0.18,
        status: "yellow" as KPIStatus
      }
    ],

    history: [0.55, 0.52, 0.50, 0.47, 0.45, 0.43, 0.42]
  },

  {
    title: "Line Yield",

    value: 98.1,

    best: 99.0,

    status: "green" as KPIStatus,

    subKPIs: [
      {
        name: "Process Yield",
        value: 98.4,
        status: "green" as KPIStatus
      },
      {
        name: "GR Yield",
        value: 97.8,
        status: "green" as KPIStatus
      }
    ],

    history: [96.2, 96.8, 97.1, 97.4, 97.7, 97.9, 98.1]
  }
];