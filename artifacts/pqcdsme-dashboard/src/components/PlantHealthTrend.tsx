import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

import type { CRMKPI } from "@/services/crmMapper";
import { calculatePlantHealthHistory } from "./plantHealthHistory";
interface Props {
  kpis: CRMKPI[];
}


export default function PlantHealthTrend({kpis}: Props) {
  const data =
  calculatePlantHealthHistory(
    kpis
  );

const currentScore =
  data[
    data.length - 1
  ]?.score ?? 0;

const previousScore =
  data[
    data.length - 2
  ]?.score ??
  currentScore;

const improvement =
  previousScore
    ? (
        ((currentScore -
          previousScore) /
          previousScore) *
        100
      ).toFixed(1)
    : "0";


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
                Previous Month:
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
          Last 7 Months
        </p>
      </div>

      <div className="h-50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top: 10,right: 30,left: 30,bottom: 10,}} >
            <XAxis dataKey="month" interval={0} tick={{ fontSize: 16 }}/>
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