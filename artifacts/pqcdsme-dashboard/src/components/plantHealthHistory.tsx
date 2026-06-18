import type { CRMKPI } from "@/services/crmMapper";

const STATUS_SCORE = {
  green: 100,
  yellow: 70,
  red: 30,
};

export function calculatePlantHealthHistory(
  kpis: CRMKPI[]
) {
  if (!kpis.length) {
    return [];
  }

  const months =
    kpis[0].historyMonths;

  return months.map(
    (_, monthIndex) => {
      let total = 0;
      let count = 0;

      kpis.forEach((kpi) => {
        const value =
          kpi.history[monthIndex];

        if (
          value === undefined
        ) {
          return;
        }

        const best =
          kpi.title ===
          "Line Yield";

        const currentBest =
          best
            ? Math.max(
                ...kpi.history
              )
            : Math.min(
                ...kpi.history
              );

        let status:
          | "green"
          | "yellow"
          | "red";

        if (
          Math.abs(
            value -
              currentBest
          ) /
            currentBest <=
          0.005
        ) {
          status = "yellow";
        } else if (best) {
          status =
            value >
            currentBest
              ? "green"
              : "red";
        } else {
          status =
            value <
            currentBest
              ? "green"
              : "red";
        }

        total +=
          STATUS_SCORE[
            status
          ];

        count++;
      });

      return {
        month:
          months[
            monthIndex
          ],
        score:
          count > 0
            ? Math.round(
                total /
                  count
              )
            : 0,
      };
    }
  );
}