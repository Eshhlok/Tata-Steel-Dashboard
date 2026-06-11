interface KPIOverviewCardProps {
  title: string;
  value: number;
  trend: string;
  best: string;
  color: string;
}

export default function KPIOverviewCard({
  title,
  value,
  trend,
  best,
  color,
}: KPIOverviewCardProps) {
  return (
    <div
      className="bg-white border rounded-sm p-4 transition-all duration-200 hover:shadow-md"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2
            className="text-3xl font-bold mt-1"
            style={{ color }}
          >
            {value}%
          </h2>
        </div>

        <span className="text-xs font-medium text-green-600">
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
      </div>
    </div>
  );
}