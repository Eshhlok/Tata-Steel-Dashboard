import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from "recharts";

interface KPIOverviewCardProps {
  title: string;
  value: number;
  trend: string;
  best: string;
  color: string;
  history: number[];
}

export default function KPIOverviewCard({
  title,
  value,
  trend,
  best,
  color,
  history,
}: KPIOverviewCardProps) {
  const chartData = history.map((value, index) => ({
    day: index + 1,
    value,
  }));

  const getStatus = () => {
    if (value >= 95) {
      return {
        label: "Excellent",
        color: "bg-green-100 text-green-700",
      };
    }

    if (value >= 90) {
      return {
        label: "Good",
        color: "bg-blue-100 text-blue-700",
      };
    }

    return {
      label: "Attention",
      color: "bg-orange-100 text-orange-700",
    };
  };

  const status = getStatus();
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const cardTint = hexToRgba(color, 0.03);

  return (
    <div
      className="bg-white border rounded-sm px-5 py-6 min-h-[280px] transition-all duration-200 hover:shadow-md"
      style={{
        borderTop: `4px solid ${color}`,
        backgroundColor: cardTint,
        opacity: 0.99,
      }}
    >
      <div className="flex justify-between items-center gap-2">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2
            className="text-4xl font-bold mt-1"
            style={{ color }}
          >
            {value}%
          </h2>
          <div
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${status.color}`}
          >
            {status.label}
          </div>
        </div>

        <span
          className={`text-xs font-medium ${
            trend.startsWith("-")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {trend.startsWith("-") ? "▼ " : "▲ "}
          {trend}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400">
          Historical Best
        </p>

        <p className="text-sm font-medium text-gray-700">
          {best}
        </p>

        <div className="h-24 mt-3">
          <p className="text-xs text-gray-400 mt-3">
            7-Day Trend
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis
                hide
                domain={[
                  Math.min(...history) - 1,
                  Math.max(...history) + 1,
                ]}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                
                activeDot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}