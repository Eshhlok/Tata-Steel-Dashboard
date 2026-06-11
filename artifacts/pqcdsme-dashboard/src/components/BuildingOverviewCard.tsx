interface Props {
  name: string;
  units: number;
  score: number;
}

export default function BuildingOverviewCard({
  name,
  units,
  score,
}: Props) {
  return (
    <div className="bg-white border rounded-sm p-5 cursor-pointer hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">
            {units} Units
          </p>
        </div>

        <div className="text-2xl font-bold text-blue-600">
          {score}%
        </div>
      </div>
    </div>
  );
}