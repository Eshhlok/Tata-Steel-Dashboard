interface Props {
  score: number;
  trend?: number;
}

export default function PlantHealthCard({
  score,
  trend = 0,
}: Props) {

  const isPositive =
    trend >= 0;

  return (
<div className="bg-white border rounded-sm p-4">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xs uppercase tracking-wide text-gray-500">
        Plant Health
      </h2>

      <div className="text-4xl font-bold text-blue-600 leading-none mt-1">
        {score}%
      </div>
    </div>

    <div
      className={`text-2xl font-bold ${
        isPositive
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      {isPositive ? "▲" : "▼"}{" "}
      {Math.abs(trend)}%
    </div>
  </div>
</div>
  );
}