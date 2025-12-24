import React from "react";
import { useColorModeValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";

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
  const tooltipBg = useColorModeValue("#FFFFFF", "#1F2937");
  const tooltipBorder = useColorModeValue("#E5E7EB", "#374151");
  const tooltipLabel = useColorModeValue("#111827", "#F3F4F6");
  const tooltipText = useColorModeValue("#4B5563", "#9CA3AF");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const cardBg = useColorModeValue("#F9FAFB", "#1F2937");
  const cardHover = useColorModeValue("#F3F4F6", "#374151");

  const chartData = data.map((stat) => ({
    name: stat.repository.split("/")[1],
    value: stat.score || stat.totalScore || 0,
  }));

  return (
    <div className="rounded-lg shadow-sm col-span-full" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Repository Breakdown</h3>
        <p className="text-xs mt-1" style={{ color: textSecondary }}>Contribution distribution</p>
      </div>
      <div className="p-6">
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
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          backgroundColor: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: tooltipLabel, marginBottom: '8px' }}>{payload[0].name}</p>
                          <p style={{ fontSize: '11px', color: tooltipText }}>
                            <span style={{ fontWeight: 600 }}>Contributors: </span>
                            <span>{payload[0].value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
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
                className="p-5 border-l-[3px] transition-colors"
                style={{ backgroundColor: cardBg, borderLeftColor: COLORS[index % COLORS.length] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cardHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = cardBg}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-base" style={{ color: textColor }}>{stat.repository.split("/")[1]}</h4>
                  <span className="text-xl font-bold" style={{ color: textColor }}>
                    {stat.score || stat.totalScore || 0}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs" style={{ color: textSecondary }}>
                  <div className="flex flex-col">
                    <span className="font-medium" style={{ color: textColor }}>{stat.commits}</span>
                    <span className="uppercase tracking-wide text-[10px]">Commits</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium" style={{ color: textColor }}>{(stat.prsOpened || 0) + (stat.prsMerged || 0) + (stat.prsClosed || 0)}</span>
                    <span className="uppercase tracking-wide text-[10px]">PRs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium" style={{ color: textColor }}>{stat.reviews}</span>
                    <span className="uppercase tracking-wide text-[10px]">Reviews</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium" style={{ color: textColor }}>{stat.comments}</span>
                    <span className="uppercase tracking-wide text-[10px]">Comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LastUpdatedDateTime name="Repository Breakdown" />
    </div>
  );
};

export default RepositoryBreakdownChart;
