import React, { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
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
import { useRouter } from "next/router";
import { FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ContributorLastUpdatedDateTime from "@/components/ContributorLastUpdatedDateTime";

interface TopContributorsChartProps {
  data: {
    username: string;
    score: number;
    avatarUrl: string;
  }[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

const CustomYAxisTick = ({ x, y, payload, avatarUrl }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-40} y={-15} width={30} height={30}>
        <div className="flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={payload.value}
              className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.value)}&background=random&size=24`;
              }}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          )}
        </div>
      </foreignObject>
    </g>
  );
};

export const TopContributorsChart: React.FC<TopContributorsChartProps> = ({
  data,
}) => {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);
  const gridColor = useColorModeValue("#E5E7EB", "#374151");
  const axisColor = useColorModeValue("#9CA3AF", "#6B7280");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const infoBg = useColorModeValue("#FFFFFF", "#1F2937");
  const infoBorder = useColorModeValue("#FBCFE8", "#831843");
  
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg shadow-sm" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Top Contributors</h3>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>Highest scoring</p>
        </div>
        <div className="p-8 text-center" style={{ color: textSecondary }}>No data available</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-sm" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Top Contributors</h3>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>Highest scoring</p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
          >
            <FiInfo />
            {showInfo ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
        
        {showInfo && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: infoBg, border: `1px solid ${infoBorder}` }}>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: textColor }}>
              <FiInfo className="text-pink-600 dark:text-pink-400" />
              How Contributor Scores are Calculated
            </h4>
            <div className="text-xs space-y-2" style={{ color: textSecondary }}>
              <p>
                <strong style={{ color: textColor }}>Scoring System:</strong> Each contributor's score is calculated based on their contributions across different activity types:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Commits:</strong> Base points for code contributions</li>
                <li><strong>Pull Requests:</strong> Higher weight for merged PRs vs. opened/closed</li>
                <li><strong>Reviews:</strong> Points for approved reviews, comments, and change requests</li>
                <li><strong>Comments:</strong> Engagement points for issue and PR discussions</li>
              </ul>
              <p className="italic" style={{ color: textSecondary }}>
                💡 Tip: Hover over bars to see detailed scores and click to view contributor profiles.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={Math.max(350, data.length * 50)}>
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} horizontal={false} />
            <XAxis 
              type="number" 
              tick={{ fontSize: 10, fill: axisColor }} 
              stroke={gridColor}
              axisLine={false}
            />
            <YAxis
              dataKey="username"
              type="category"
              tick={(props) => {
                const entry = data.find(d => d.username === props.payload.value);
                return <CustomYAxisTick {...props} avatarUrl={entry?.avatarUrl} />;
              }}
              width={50}
              stroke={gridColor}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {data.avatarUrl && (
                          <img
                            src={data.avatarUrl}
                            alt={data.username}
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}&background=random`;
                            }}
                          />
                        )}
                        <button
                          onClick={() => router.push(`/contributors/${data.username}`)}
                          className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                        >
                          {data.username}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Score:</span> {data.score.toLocaleString()}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[0, 8, 8, 0]} name="Score" maxBarSize={30}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ContributorLastUpdatedDateTime name="Top Contributors" />
    </div>
  );
};
