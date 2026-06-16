import { KPIStatus } from "@/components/KPIOverviewCard";

const STATUS_SCORES: Record<KPIStatus, number> = {
  green: 100,
  yellow: 70,
  red: 40,
};

export function calculatePlantHealthTrend(
  currentStatuses: KPIStatus[],
  previousStatuses: KPIStatus[]
) {
  const current =
    currentStatuses.reduce(
      (sum, status) =>
        sum + STATUS_SCORES[status],
      0
    ) / currentStatuses.length;

  const previous =
    previousStatuses.reduce(
      (sum, status) =>
        sum + STATUS_SCORES[status],
      0
    ) / previousStatuses.length;

  const change =
    current - previous;

  return {
    current: Math.round(current),
    previous: Math.round(previous),
    change: Number(
      change.toFixed(1)
    ),
  };
}