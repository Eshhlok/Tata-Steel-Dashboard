import { units } from "../mock/data";

export default function PerformanceHighlights() {
  const sorted = [...units].sort(
    (a, b) => b.score - a.score
  );

  const topThree = sorted.slice(0, 3);
  const bottomThree = sorted.slice(-3);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-sm p-5">
        <h2 className="font-semibold text-lg mb-4 text-green-700">
          Top Performers
        </h2>

        <div className="space-y-3">
          {topThree.map((unit, index) => (
            <div
              key={unit.id}
              className="flex justify-between"
            >
              <span>
                {unit.name}
              </span>

              <span className="font-semibold text-green-600">
                {unit.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-sm p-5">
        <h2 className="font-semibold text-lg mb-4 text-red-700">
          Needs Attention
        </h2>

        <div className="space-y-3">
          {bottomThree.map((unit) => (
            <div
              key={unit.id}
              className="flex justify-between"
            >
              <span>{unit.name}</span>

              <span className="font-semibold text-red-600">
                {unit.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}