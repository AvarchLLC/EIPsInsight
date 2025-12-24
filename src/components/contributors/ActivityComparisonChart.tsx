import React, { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
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
        <p style={{ fontSize: '11px', fontWeight: 600, color: labelColor, marginBottom: '8px' }}>{payload[0].payload.category}</p>
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
  const [showInfo, setShowInfo] = useState(false);
  const gridColor = useColorModeValue("#E5E7EB", "#374151");
  const axisColor = useColorModeValue("#9CA3AF", "#6B7280");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const infoBg = useColorModeValue("#FFFFFF", "#1F2937");
  const infoBorder = useColorModeValue("#BAE6FD", "#0E7490");

  return (
    <div className="rounded-lg shadow-sm" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Activity Comparison</h3>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>Current vs Previous</p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            <FiInfo />
            {showInfo ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
        
        {showInfo && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: infoBg, border: `1px solid ${infoBorder}` }}>
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: textColor }}>
              <FiInfo className="text-cyan-600 dark:text-cyan-400" />
              Understanding Activity Comparison
            </h4>
            <div className="text-xs space-y-2" style={{ color: textSecondary }}>
              <p>
                <strong style={{ color: textColor }}>Period-over-Period Analysis:</strong> Compares contribution activity between two time periods to identify trends and patterns.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong style={{ color: textColor }}>Current Period (Blue):</strong> Most recent time window showing current activity levels</li>
                <li><strong style={{ color: textColor }}>Previous Period (Green):</strong> Earlier time window for baseline comparison</li>
                <li><strong style={{ color: textColor }}>Categories:</strong> Activity types including commits, PRs, reviews, and comments</li>
              </ul>
              <p>
                <strong style={{ color: textColor }}>How to Read:</strong> Larger shapes mean higher activity. Overlapping areas show consistent patterns, while gaps indicate growth or decline in specific contribution types.
              </p>
              <p className="italic" style={{ color: textSecondary }}>
                💡 Tip: Hover over data points to see exact counts for each activity type.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 10, fill: axisColor }}
            />
            <PolarRadiusAxis 
              tick={{ fontSize: 10, fill: axisColor }} 
              stroke={gridColor}
            />
            <Tooltip content={<CustomTooltip />} />
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
      <LastUpdatedDateTime name="Activity Comparison" />
    </div>
  );
};
