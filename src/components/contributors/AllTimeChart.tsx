import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AllTimeChartProps {
  data: {
    monthYear: string;
    commits: number;
    pullRequests: number;
    reviews: number;
    comments: number;
  }[];
}

export const AllTimeChart: React.FC<AllTimeChartProps> = ({ data }) => {
  return (
    <div className="bg-violet-50/30 dark:bg-violet-950/20 border-2 border-violet-200 dark:border-violet-900 rounded-lg shadow-sm col-span-full">
      <div className="px-8 py-6 border-b-2 border-violet-200 dark:border-violet-900 bg-violet-100/20 dark:bg-violet-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          All-Time Activity Trends
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Historical activity data by month
        </p>
      </div>
      <div className="p-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorCommitsAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorPRsAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorReviewsAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorCommentsAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" opacity={0.5} />
            <XAxis
              dataKey="monthYear"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              stroke="#F3F4F6"
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              stroke="#F3F4F6"
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F3F4F6",
                borderRadius: "4px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                padding: "8px 12px",
              }}
              labelStyle={{
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              itemStyle={{ fontSize: "12px", padding: "2px 0" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px", fontSize: "11px" }}
              iconType="square"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", r: 3 }}
              name="Commits"
              fill="url(#colorCommitsAll)"
            />
            <Line
              type="monotone"
              dataKey="pullRequests"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", r: 3 }}
              name="Pull Requests"
              fill="url(#colorPRsAll)"
            />
            <Line
              type="monotone"
              dataKey="reviews"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", r: 3 }}
              name="Reviews"
              fill="url(#colorReviewsAll)"
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", r: 3 }}
              name="Comments"
              fill="url(#colorCommentsAll)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AllTimeChart;
