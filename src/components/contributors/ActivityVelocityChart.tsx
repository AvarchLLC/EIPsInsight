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

interface ActivityVelocityChartProps {
  data: {
    date: string;
    velocity: number;
    movingAverage: number;
  }[];
}

export const ActivityVelocityChart: React.FC<ActivityVelocityChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-indigo-200 dark:border-indigo-900 bg-indigo-100/20 dark:bg-indigo-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Activity Velocity</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">7-day moving average</p>
      </div>
      <div className="p-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey="velocity"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ fill: '#6366F1', r: 4 }}
              name="Daily Activity"
            />
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              name="7-Day Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
