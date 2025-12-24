import React, { useState } from "react";
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
  Brush,
  TooltipProps,
} from "recharts";
import { FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ContributorLastUpdatedDateTime from "@/components/ContributorLastUpdatedDateTime";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  const bgColor = useColorModeValue("#FFFFFF", "#1F2937");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const labelColor = useColorModeValue("#111827", "#F3F4F6");
  const textColor = useColorModeValue("#4B5563", "#9CA3AF");

  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: labelColor, marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ fontSize: '11px', color: textColor }}>
            <span style={{ color: entry.color }}>{entry.name}: </span>
            <span style={{ fontWeight: 600 }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
  const [showInfo, setShowInfo] = useState(false);
  const gridColor = useColorModeValue("#E5E7EB", "#374151");
  const axisColor = useColorModeValue("#9CA3AF", "#6B7280");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const infoBg = useColorModeValue("#FFFFFF", "#1F2937");
  const infoBorder = useColorModeValue("#C7D2FE", "#4338CA");

  return (
    <div className="rounded-lg shadow-sm" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Activity Velocity</h3>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>7-day moving average</p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <FiInfo />
            {showInfo ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
        
        {showInfo && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: infoBg, border: `1px solid ${infoBorder}` }}>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: textColor }}>
              <FiInfo className="text-indigo-600 dark:text-indigo-400" />
              How Activity Velocity is Calculated
            </h4>
            <div className="text-xs space-y-2" style={{ color: textSecondary }}>
              <p>
                <strong style={{ color: textColor }}>Daily Activity:</strong> The total number of contributions (commits, PRs, reviews, comments) made on each day.
              </p>
              <p>
                <strong style={{ color: textColor }}>7-Day Moving Average:</strong> A smoothed trend line that calculates the average activity over a rolling 7-day window. This helps identify consistent patterns and reduces noise from day-to-day variations.
              </p>
              <p className="italic" style={{ color: textSecondary }}>
                💡 Tip: Use the slider below the chart to zoom into specific time periods.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 py-4">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: axisColor }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              stroke={gridColor}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 10, fill: axisColor }} stroke={gridColor} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
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
            <Brush
              dataKey="date"
              height={30}
              stroke="#6366F1"
              fill="#EEF2FF"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ContributorLastUpdatedDateTime name="Activity Velocity" />
    </div>
  );
};
