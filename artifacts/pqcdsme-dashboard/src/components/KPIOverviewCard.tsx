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
  fy26Actual: number;
  fy27ABP: number;
  comparisonBasis: "FY26" | "FY27";
  status: "green" | "yellow" | "red";
  history: number[];
  historyMonths?: string[];
  bestMonth?: string;
  subKPIs?: SubKPI[];
  onSubKPIClick?: (subKPIName: string) => void;
  onCardClick?: () => void;
}

export default function KPIOverviewCard({
  title,
  value,
  uom,
  best,
  status,
  history,
  historyMonths = [],
  fy26Actual,
  fy27ABP,
  comparisonBasis,
  bestMonth,
  subKPIs,
  onSubKPIClick,
  onCardClick,
}: KPIOverviewCardProps) {
  const benchmark = comparisonBasis === "FY26" ? fy26Actual : fy27ABP;
  const benchmarkLabel =
    comparisonBasis === "FY26" ? "FY26 Actual" : "FY27 ABP";

  const chartData = history.map((value, index) => ({
    month: index + 1,
    value,
  }));

  const formatValue = (value: number) => {
    return value >= 100 ? value.toFixed(0) : value.toFixed(2);
  };

  const statusConfig = {
    green: {
      label: `Better than ${benchmarkLabel} (${formatValue(benchmark)})`,
      badge: "bg-green-100 text-green-700",
      accent: "#1D9E75",
    },
    yellow: {
      label: `At ${benchmarkLabel} (${formatValue(benchmark)})`,
      badge: "bg-yellow-100 text-yellow-700",
      accent: "#BA7517",
    },
    red: {
      label: `Worse than ${benchmarkLabel} (${formatValue(benchmark)})`,
      badge: "bg-red-100 text-red-700",
      accent: "#E24B4A",
    },
  };

  const config = statusConfig[status] ?? statusConfig.green;

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const isCardClickable = !!onCardClick && (!subKPIs || subKPIs.length === 0);

  return (
    <div
      onClick={() => {
        if (isCardClickable) {
          onCardClick?.();
        }
      }}
      className={`bg-white border rounded-sm px-5 py-5 h-full transition-all duration-200 hover:shadow-md ${
        isCardClickable ? "cursor-pointer" : ""
      }`}
      style={{
        borderTop: `4px solid ${config.accent}`,
        backgroundColor: hexToRgba(config.accent, 0.03),
      }}
    >
      <div>
        <p className="text-s text-gray-500">
          {title}{" "}
          {uom && (
            <span className="text-s text-gray-500 mb-1">({uom})</span>
          )}
        </p>

        <div className="flex items-end gap-2 mt-2">
          <h2
            className="text-4xl font-bold"
            style={{ color: config.accent }}
          >
            {formatValue(value)}
          </h2>
        </div>

        <div
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${config.badge}`}
        >
          {config.label}
        </div>
      </div>

      {subKPIs && subKPIs.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-2">
          {subKPIs.map((item) => (
            <div
              key={item.name}
              onClick={(e) => {
                e.stopPropagation();
                onSubKPIClick?.(item.name);
              }}
              className="border rounded-md p-3 hover:bg-slate-100 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="text-xs text-gray-500">{item.name}</div>

              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold">{formatValue(item.value)}</span>

                <div
                  className={`w-2 h-2 rounded-full ${
                    item.status === "green"
                      ? "bg-green-500"
                      : item.status === "yellow"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">Historical Best</p>
          <p className="text-sm font-medium text-gray-700">
            {formatValue(best)}
            {bestMonth && (
              <span className="text-xs text-gray-500 ml-1">({bestMonth})</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2">7-Month Trend</p>
        <div className="h-14">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke={config.accent}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {historyMonths.length > 0 && (
          <div className="grid grid-cols-7 gap-1 mt-1">
            {historyMonths.map((month) => (
              <div
                key={month}
                className="text-[13px] text-center text-gray-500"
              >
                {month}
              </div>
            ))}
          </div>
        )}
        {history.length > 0 && (
          <div className="grid grid-cols-7 gap-1 mt-1">
            {history.map((value, index) => (
              <div
                key={index}
                className="text-[13px] text-center font-medium text-gray-700"
              >
                {formatValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export type KPIStatus = "green" | "yellow" | "red";