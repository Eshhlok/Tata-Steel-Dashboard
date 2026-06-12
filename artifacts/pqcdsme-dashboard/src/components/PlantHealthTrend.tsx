import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", score: 87 },
  { day: "Tue", score: 88 },
  { day: "Wed", score: 89 },
  { day: "Thu", score: 90 },
  { day: "Fri", score: 91 },
  { day: "Sat", score: 91 },
  { day: "Sun", score: 91 },
];
const currentScore = 91;
const previousScore = 88;

const improvement =
  (((currentScore - previousScore) / previousScore) * 100).toFixed(1);


export default function PlantHealthTrend() {
    
  return (
    <div className="bg-white border rounded-sm p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Plant Health Trend
        </h2>
        <div className="mt-2 flex gap-6 text-sm">
            <div>
                <span className="text-gray-500">
                Current:
                </span>{" "}
                <span className="font-semibold">
                {currentScore}%
                </span>
            </div>
           
            <div>
                <span className="text-gray-500">
                Previous Week:
                </span>{" "}
                <span className="font-semibold">
                {previousScore}%
                </span>
            </div>

            <div className="text-green-600 font-semibold">
                ▲ +{improvement}%
            </div>
            </div>
        <p className="text-sm text-gray-500">
          Last 7 Days
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
             <YAxis hide domain={[86, 92]}/>
            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#378ADD"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}