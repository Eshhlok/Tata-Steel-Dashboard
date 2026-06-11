interface Achievement {
  title: string;
  unit: string;
  value: string;
}

interface Props {
  achievements: Achievement[];
}

export default function AchievementsCard({ achievements }: Props) {
  return (
    <div className="bg-white border rounded-sm p-5">
      <h2 className="text-lg font-semibold mb-4">
        Achievements
      </h2>

      <div className="space-y-3">
        {achievements.map((item, index) => (
          <div key={index}>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">
              {item.unit} • {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}