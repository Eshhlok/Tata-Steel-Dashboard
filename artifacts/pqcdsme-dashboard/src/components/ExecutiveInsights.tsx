import type { CRMKPI } from "@/services/crmMapper";

interface Props {
  kpis: CRMKPI[];
}

export default function ExecutiveInsights({
  kpis,
}: Props) {
  const alerts: string[] = [];

  kpis.forEach((kpi) => {
    if (kpi.status === "red") {
      alerts.push(
        `${kpi.title} is performing below FY26 benchmark`
      );
    }

    if (
      kpi.title === "Line Yield" &&
      kpi.value === 0
    ) {
      alerts.push(
        "Line Yield data unavailable"
      );
    }
  });

  const achievements = kpis
    .filter(
      (kpi) =>
        kpi.bestMonth &&
        kpi.best > 0
    )
    .slice(0, 3);

    const redCount =
    kpis.filter(
        k => k.status === "red"
    ).length;

    const yellowCount =
    kpis.filter(
        k => k.status === "yellow"
    ).length;

    const greenCount =
    kpis.filter(
        k => k.status === "green"
    ).length;

  return (
    <div className="mt-4 rounded-xl border bg-card p-4">
      <h3 className="font-semibold mb-4">
        Executive Insights
      </h3>

      <div className="space-y-4">
        <div>
          <p className="font-medium text-red-600 mb-2">
            Alerts
          </p>

          <ul className="space-y-1 text-sm">
            {alerts.length > 0 ? (
              alerts
                .slice(0, 3)
                .map((alert) => (
                  <li key={alert}>
                    ⚠ {alert}
                  </li>
                ))
            ) : (
              <li>
                No critical alerts
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="font-medium text-green-600 mb-2">
            Achievements
          </p>

          <ul className="space-y-1 text-sm">
            {achievements.map(
              (kpi) => (
                <li key={kpi.title}>
                    🏆 {kpi.title} reached record{" "}
                    {kpi.title === "Line Yield"
                        ? "high"
                        : "low"}
                    {" "}
                    of {kpi.best} {kpi.uom}
                    {" "}
                    in {kpi.bestMonth}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="border-t pt-3 mt-3">
            <p className="font-medium mb-2">
                Summary
            </p>

            <div className="text-sm space-y-1">
                <div>
                🔴 {redCount} KPI(s) require attention
                </div>

                <div>
                🟡 {yellowCount} KPI(s) within tolerance
                </div>

                <div>
                🟢 {greenCount} KPI(s) meeting target
                </div>
            </div>
            </div>
      </div>
    </div>
  );
}