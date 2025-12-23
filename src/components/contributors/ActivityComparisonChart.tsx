import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ActivityComparisonChartProps {
  data: {
    category: string;
    current: number;
    previous: number;
  }[];
}

export const ActivityComparisonChart: React.FC<ActivityComparisonChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-cyan-50/30 dark:bg-cyan-950/20 border-2 border-cyan-200 dark:border-cyan-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-cyan-200 dark:border-cyan-900 bg-cyan-100/20 dark:bg-cyan-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Activity Comparison</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current vs Previous</p>
      </div>
      <div className="p-8">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid stroke="#F3F4F6" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 10, fill: '#9CA3AF' }} 
              stroke="#F3F4F6"
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
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
              iconType="square"
              iconSize={8}
            />
            <Radar
              name="Current Period"
              dataKey="current"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Radar
              name="Previous Period"
              dataKey="previous"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
