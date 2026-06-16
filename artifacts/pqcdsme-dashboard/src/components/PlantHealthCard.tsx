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
    <div className="bg-white border rounded-sm p-6">

      <h2 className="text-sm text-gray-500 mb-2">
        Plant Health Score
      </h2>

      <div className="flex items-end justify-between">

        <div className="text-5xl font-bold text-blue-600">
          {score}%
        </div>

        <div
          className={`text-sm font-medium ${
            isPositive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isPositive ? "▲" : "▼"}{" "}
          {Math.abs(trend)}%
        </div>

      </div>

      <p className="text-sm text-gray-500 mt-2">
        Overall plant performance
      </p>

    </div>
  );
}