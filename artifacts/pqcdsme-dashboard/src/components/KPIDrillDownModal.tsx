interface DrilldownRow {
  unit: string;
  fy26: number;
  current: number;
  status: string;
}

interface Props {
  open: boolean;
  title: string;
  data: DrilldownRow[];
  onClose: () => void;
}

export default function KPIDrilldownModal({
  open,
  title,
  data,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[800px] p-6 shadow-xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">
                Unit
              </th>

              <th className="text-left py-3">
                FY26
              </th>

              <th className="text-left py-3">
                Current
              </th>

              <th className="text-left py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.unit}
                className="border-b"
              >
                <td className="py-3">
                  {row.unit}
                </td>

                <td>{row.fy26}</td>

                <td>{row.current}</td>

                <td>
                  {row.status === "green"
                    ? "🟢"
                    : row.status === "yellow"
                    ? "🟡"
                    : "🔴"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}