interface Alert {
  title: string;
  unit: string;
}

interface Props {
  alerts: Alert[];
}

export default function AlertDashboard({ alerts }: Props) {
  return (
    <div className="bg-white border rounded-sm p-5">
      <h2 className="text-lg font-semibold mb-4">
        Alerts
      </h2>

      <div className="space-y-3">
        {alerts.map((item, index) => (
          <div key={index}>
            <p className="font-medium text-red-600">
              {item.title}
            </p>
            <p className="text-sm text-gray-500">
              {item.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}