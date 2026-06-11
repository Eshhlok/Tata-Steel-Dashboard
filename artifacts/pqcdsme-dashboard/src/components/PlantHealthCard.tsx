interface Props {
  score: number;
}

export default function PlantHealthCard({ score }: Props) {
  return (
    <div className="bg-white border rounded-sm p-6">
      <h2 className="text-sm text-gray-500 mb-2">
        Plant Health Score
      </h2>

      <div className="text-5xl font-bold text-blue-600">
        {score}%
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Overall plant performance
      </p>
    </div>
  );
}