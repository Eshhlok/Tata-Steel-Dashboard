import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

const data = [
  { day: "6 Jun", score: 87 },
  { day: "7 Jun", score: 88 },
  { day: "8 Jun", score: 89 },
  { day: "9 Jun", score: 90 },
  { day: "10 Jun", score: 91 },
  { day: "11 Jun", score: 91 },
  { day: "12 Jun", score: 91 },
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

      <div className="h-50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top: 10,right: 30,left: 30,bottom: 10,}} >
            <XAxis dataKey="day" interval={0} tick={{ fontSize: 16 }}/>
             <YAxis hide domain={[86, 92]}/>
            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#378ADD"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}