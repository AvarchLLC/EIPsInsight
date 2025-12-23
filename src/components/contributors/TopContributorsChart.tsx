import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopContributorsChartProps {
  data: {
    username: string;
    score: number;
    avatarUrl: string;
  }[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

export const TopContributorsChart: React.FC<TopContributorsChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-pink-50/30 dark:bg-pink-950/20 border-2 border-pink-200 dark:border-pink-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-pink-200 dark:border-pink-900 bg-pink-100/20 dark:bg-pink-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Top Contributors</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Highest scoring</p>
      </div>
      <div className="p-8">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" opacity={0.5} />
            <XAxis 
              type="number" 
              tick={{ fontSize: 10, fill: '#9CA3AF' }} 
              stroke="#F3F4F6"
              axisLine={false}
            />
            <YAxis
              dataKey="username"
              type="category"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              width={100}
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
              labelStyle={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
            />
            <Bar dataKey="score" radius={[0, 8, 8, 0]} name="Score">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
