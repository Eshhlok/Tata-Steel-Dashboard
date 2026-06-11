interface Unit {
  name: string;
  score: number;
}

export default function UnitRankingTable({
  units,
}: {
  units: Unit[];
}) {
  const sorted = [...units].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="bg-white border rounded-sm p-5">
      <h2 className="text-lg font-semibold mb-4">
        Unit Performance Ranking
      </h2>

      <div className="space-y-3">
        {sorted.map((unit, index) => (
          <div
            key={unit.name}
            className="flex justify-between"
          >
            <span>
               {unit.name}
            </span>

            <span className="font-semibold">
              {unit.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}