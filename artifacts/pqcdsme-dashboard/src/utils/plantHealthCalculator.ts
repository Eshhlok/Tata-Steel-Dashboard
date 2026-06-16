import { KPIStatus } from "@/components/KPIOverviewCard";

const STATUS_SCORES: Record<KPIStatus, number> = {
  green: 100,
  yellow: 70,
  red: 40,
};

export function calculatePlantHealth(
  statuses: KPIStatus[]
): number {

  if (!statuses.length) {
    return 0;
  }

  const total = statuses.reduce(
    (sum, status) =>
      sum + STATUS_SCORES[status],
    0
  );

  return Math.round(
    total / statuses.length
  );
}