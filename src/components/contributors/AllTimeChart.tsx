import React from "react";
import { useColorModeValue } from "@chakra-ui/react";
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
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";

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
  const tooltipBg = useColorModeValue("#FFFFFF", "#1F2937");
  const tooltipBorder = useColorModeValue("#E5E7EB", "#374151");
  const tooltipLabel = useColorModeValue("#111827", "#F3F4F6");
  const tooltipText = useColorModeValue("#4B5563", "#9CA3AF");
  const gridColor = useColorModeValue("#E5E7EB", "#374151");
  const axisColor = useColorModeValue("#9CA3AF", "#6B7280");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  return (
    <div className="rounded-lg shadow-sm col-span-full" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>
          All-Time Activity Trends
        </h3>
        <p className="text-xs mt-1" style={{ color: textSecondary }}>
          Historical activity data by month
        </p>
      </div>
      <div className="p-6">
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
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
            <XAxis
              dataKey="monthYear"
              tick={{ fontSize: 10, fill: axisColor }}
              stroke={gridColor}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 10, fill: axisColor }}
              stroke={gridColor}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: tooltipLabel, marginBottom: '8px' }}>{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: '11px', color: tooltipText }}>
                          <span style={{ color: entry.color }}>{entry.name}: </span>
                          <span style={{ fontWeight: 600 }}>{entry.value}</span>
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
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
      <LastUpdatedDateTime name="All-Time Activity" />
    </div>
  );
};

export default AllTimeChart;
