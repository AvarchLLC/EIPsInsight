import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ActivityTimelineChartProps {
  data: {
    date: string;
    commits: number; 
    pullRequests: number;
    reviews: number;
    comments: number;
  }[];
}

export const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-blue-50/30 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-blue-200 dark:border-blue-900 bg-blue-100/20 dark:bg-blue-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Activity Timeline</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
      </div>
      <div className="p-8">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPRs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              stroke="#F3F4F6"
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#9CA3AF' }} 
              stroke="#F3F4F6"
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #F3F4F6',
                borderRadius: '4px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                padding: '8px 12px',
              }}
              labelStyle={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
              itemStyle={{ fontSize: '12px', padding: '2px 0' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
              iconType="square"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stackId="1"
              stroke="#3B82F6"
              fill="url(#colorCommits)"
              strokeWidth={2}
              name="Commits"
            />
            <Area
              type="monotone"
              dataKey="pullRequests"
              stackId="1"
              stroke="#8B5CF6"
              fill="url(#colorPRs)"
              strokeWidth={2}
              name="Pull Requests"
            />
            <Area
              type="monotone"
              dataKey="reviews"
              stackId="1"
              stroke="#10B981"
              fill="url(#colorReviews)"
              strokeWidth={2}
              name="Reviews"
            />
            <Area
              type="monotone"
              dataKey="comments"
              stackId="1"
              stroke="#F59E0B"
              fill="url(#colorComments)"
              strokeWidth={2}
              name="Comments"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
