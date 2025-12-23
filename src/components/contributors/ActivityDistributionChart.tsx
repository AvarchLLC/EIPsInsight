import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

type ActivityType = "COMMIT" | "PR_OPENED" | "PR_MERGED" | "PR_CLOSED" | "REVIEW_APPROVED";

interface ActivityDistributionChartProps {
  data: {
    activityType: ActivityType;
    count: number;
  }[];
}

const COLORS: Record<ActivityType, string> = {
  COMMIT: "#3182CE",
  PR_OPENED: "#38A169",
  PR_MERGED: "#805AD5",
  PR_CLOSED: "#E53E3E",
  REVIEW_APPROVED: "#38A169",
};

export const ActivityDistributionChart: React.FC<ActivityDistributionChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-purple-50/30 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-purple-200 dark:border-purple-900 bg-purple-100/20 dark:bg-purple-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Activity Distribution</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">By type</p>
      </div>
      <div className="p-8">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" opacity={0.5} />
            <XAxis 
              dataKey="activityType" 
              tick={{ fontSize: 10, fill: '#9CA3AF' }} 
              angle={-45} 
              textAnchor="end" 
              height={100}
              stroke="#F3F4F6"
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} stroke="#F3F4F6" axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #F3F4F6',
                borderRadius: '4px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                padding: '8px 12px',
              }}
              labelStyle={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} iconType="square" iconSize={8} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.activityType] || "#3B82F6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
