import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from "recharts";

interface SubKPI {
  name: string;
  value: number;
  status: "green" | "yellow" | "red";
}

interface KPIOverviewCardProps {
  title: string;
  value: number;

  uom?: string;

  best: number;

  status: "green" | "yellow" | "red";

  history: number[];

  subKPIs?: SubKPI[];

  onSubKPIClick?: (
    subKPIName: string
  ) => void;

  onCardClick?: () => void;
}

export default function KPIOverviewCard({
  title,
  value,
  uom,
  best,
  status,
  history,
  subKPIs,
  onSubKPIClick,
  onCardClick,
}: KPIOverviewCardProps) {

  const chartData = history.map(
    (value, index) => ({
      month: index + 1,
      value,
    })
  );

  const formatValue = (
    value: number
  ) => {
    return value >= 100
      ? value.toFixed(0)
      : value.toFixed(2);
  };

  const statusConfig = {
    green: {
      label: "Better than FY26",
      badge:
        "bg-green-100 text-green-700",
      accent: "#1D9E75",
    },

    yellow: {
      label: "At FY26 Level",
      badge:
        "bg-yellow-100 text-yellow-700",
      accent: "#BA7517",
    },

    red: {
      label: "Worse than FY26",
      badge:
        "bg-red-100 text-red-700",
      accent: "#E24B4A",
    },
  };

  const config =
    statusConfig[status] ??
    statusConfig.green;

  const hexToRgba = (
    hex: string,
    alpha: number
  ) => {
    const r = parseInt(
      hex.slice(1, 3),
      16
    );

    const g = parseInt(
      hex.slice(3, 5),
      16
    );

    const b = parseInt(
      hex.slice(5, 7),
      16
    );

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const isCardClickable =
    !!onCardClick &&
    (!subKPIs ||
      subKPIs.length === 0);

  return (
    <div
      onClick={() => {
        if (
          isCardClickable
        ) {
          onCardClick?.();
        }
      }}
      className={`bg-white border rounded-sm px-5 py-5 min-h-[270px] transition-all duration-200 hover:shadow-md ${
        isCardClickable
          ? "cursor-pointer"
          : ""
      }`}
      style={{
        borderTop: `4px solid ${config.accent}`,
        backgroundColor:
          hexToRgba(
            config.accent,
            0.03
          ),
      }}
    >
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <div className="flex items-end gap-2 mt-2">
          <h2
            className="text-4xl font-bold"
            style={{
              color:
                config.accent,
            }}
          >
            {formatValue(value)}
          </h2>

          {uom && (
            <span className="text-xs text-gray-500 mb-1">
              ({uom})
            </span>
          )}
        </div>

        <div
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${config.badge}`}
        >
          {config.label}
        </div>
      </div>

      {subKPIs &&
        subKPIs.length >
          0 && (
          <div className="mt-5 space-y-2">
            {subKPIs.map(
              (item) => (
                <div
                  key={
                    item.name
                  }
                  onClick={(
                    e
                  ) => {
                    e.stopPropagation();

                    onSubKPIClick?.(
                      item.name
                    );
                  }}
                  className="flex items-center justify-between border rounded-md px-3 py-2 hover:bg-slate-100 hover:shadow-sm cursor-pointer transition-all"
                >
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {formatValue(
                        item.value
                      )}
                    </span>

                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status ===
                        "green"
                          ? "bg-green-500"
                          : item.status ===
                            "yellow"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />

                    <span className="text-gray-400">
                      →
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

      <div className="mt-5">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Historical Best
          </p>

          <p className="text-sm font-medium text-gray-700">
            {formatValue(best)}
          </p>
        </div>
      </div>

      <div className="h-20 mt-4">
        <p className="text-xs text-gray-400 mb-2">
          7-Month Trend
        </p>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
          >
            <YAxis hide />

            <Line
              type="monotone"
              dataKey="value"
              stroke={
                config.accent
              }
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export type KPIStatus =
  | "green"
  | "yellow"
  | "red";