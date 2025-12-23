import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RepositoryBreakdownChartProps {
  data: {
    repository: string;
    score?: number;
    totalScore?: number;
    commits: number;
    prsOpened?: number;
    prsMerged?: number;
    prsClosed?: number;
    pullRequests?: number;
    reviews: number;
    comments: number;
  }[];
}

const RepositoryBreakdownChart: React.FC<RepositoryBreakdownChartProps> = ({
  data,
}) => {
  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

  const chartData = data.map((stat) => ({
    name: stat.repository.split("/")[1],
    value: stat.score || stat.totalScore || 0,
  }));

  return (
    <div className="bg-green-50/30 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 rounded-lg shadow-sm col-span-full">
      <div className="px-8 py-6 border-b-2 border-green-200 dark:border-green-900 bg-green-100/20 dark:bg-green-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Repository Breakdown</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contribution distribution</p>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="square"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data.map((stat, index) => (
              <div
                key={stat.repository}
                className="p-5 border-l-[3px] bg-gray-50 dark:bg-gray-800/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderLeftColor: COLORS[index % COLORS.length] }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">{stat.repository.split("/")[1]}</h4>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.score || stat.totalScore || 0}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{stat.commits}</span>
                    <span className="uppercase tracking-wide text-[10px]">Commits</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{(stat.prsOpened || 0) + (stat.prsMerged || 0) + (stat.prsClosed || 0)}</span>
                    <span className="uppercase tracking-wide text-[10px]">PRs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{stat.reviews}</span>
                    <span className="uppercase tracking-wide text-[10px]">Reviews</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{stat.comments}</span>
                    <span className="uppercase tracking-wide text-[10px]">Comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryBreakdownChart;
