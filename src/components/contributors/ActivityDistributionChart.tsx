import React from "react";
import { useColorModeValue } from "@chakra-ui/react";
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
import LastUpdatedDateTime from "@/components/LastUpdatedDateTime";

type ActivityType = "COMMIT" | "PR_OPENED" | "PR_MERGED" | "PR_CLOSED" | "REVIEW_APPROVED";

interface ActivityDistributionChartProps {
  data: {
    activityType: ActivityType;
    count: number;
  }[];
  rawActivities?: any[];
}

const COLORS: Record<string, { fill: string; stroke: string }> = {
  COMMIT: { fill: "rgba(59, 130, 246, 0.6)", stroke: "#3B82F6" },
  PR_OPENED: { fill: "rgba(16, 185, 129, 0.6)", stroke: "#10B981" },
  PR_MERGED: { fill: "rgba(139, 92, 246, 0.6)", stroke: "#8B5CF6" },
  PR_CLOSED: { fill: "rgba(239, 68, 68, 0.6)", stroke: "#EF4444" },
  REVIEW_APPROVED: { fill: "rgba(245, 158, 11, 0.6)", stroke: "#F59E0B" },
  REVIEW_COMMENTED: { fill: "rgba(236, 72, 153, 0.6)", stroke: "#EC4899" },
  REVIEW_CHANGES_REQUESTED: { fill: "rgba(248, 113, 113, 0.6)", stroke: "#F87171" },
  ISSUE_COMMENT: { fill: "rgba(6, 182, 212, 0.6)", stroke: "#06B6D4" },
  PR_COMMENT: { fill: "rgba(132, 204, 22, 0.6)", stroke: "#84CC16" },
};

const DEFAULT_COLOR = { fill: "rgba(59, 130, 246, 0.6)", stroke: "#3B82F6" };

const ACTIVITY_LABELS: Record<string, string> = {
  COMMIT: "Commit",
  PR_OPENED: "PR Opened",
  PR_MERGED: "PR Merged",
  PR_CLOSED: "PR Closed",
  REVIEW_APPROVED: "Review Approved",
  REVIEW_COMMENTED: "Review Commented",
  REVIEW_CHANGES_REQUESTED: "Changes Requested",
  ISSUE_COMMENT: "Issue Comment",
  PR_COMMENT: "PR Comment",
};

export const ActivityDistributionChart: React.FC<ActivityDistributionChartProps> = ({
  data,
  rawActivities = [],
}) => {
  const tooltipBg = useColorModeValue("#FFFFFF", "#1F2937");
  const tooltipBorder = useColorModeValue("#E5E7EB", "#374151");
  const tooltipLabel = useColorModeValue("#111827", "#F3F4F6");
  const tooltipText = useColorModeValue("#4B5563", "#9CA3AF");
  const gridColor = useColorModeValue("#E5E7EB", "#374151");
  const axisColor = useColorModeValue("#9CA3AF", "#6B7280");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const buttonBg = useColorModeValue("#FFFFFF", "#1F2937");
  const buttonBorder = useColorModeValue("#D1D5DB", "#4B5563");
  const buttonHover = useColorModeValue("#F9FAFB", "#374151");
  const [selectedTypes, setSelectedTypes] = React.useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  const formattedData = data.map((item, index) => ({
    ...item,
    displayLabel: ACTIVITY_LABELS[item.activityType] || item.activityType,
  }));

  const displayData = selectedTypes.size > 0
    ? formattedData.filter(item => selectedTypes.has(item.activityType))
    : formattedData;

  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedTypes(new Set(formattedData.map(item => item.activityType)));
  };

  const unselectAll = () => {
    setSelectedTypes(new Set());
  };

  const downloadCSV = () => {
    if (!rawActivities || rawActivities.length === 0) {
      // Fallback to simple export if no raw activities
      const csvContent = [
        ['Activity Type', 'Count'],
        ...formattedData.map(item => [item.displayLabel, item.count])
      ].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-distribution-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      return;
    }

    // Detailed export with filtering
    const filteredActivities = selectedTypes.size > 0
      ? rawActivities.filter(a => selectedTypes.has(a.activityType))
      : rawActivities;

    const csvContent = [
      ['Activity Type', 'Username', 'Repository', 'Title', 'PR Number', 'Timestamp'],
      ...filteredActivities.map(activity => [
        ACTIVITY_LABELS[activity.activityType] || activity.activityType,
        activity.username || '',
        activity.repository || '',
        (activity.metadata?.title || activity.metadata?.message || '').replace(/,/g, ';'),
        activity.metadata?.prNumber || '',
        new Date(activity.timestamp).toISOString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const typeLabel = selectedTypes.size > 0 
      ? `-filtered-${selectedTypes.size}-types`
      : '-all';
    a.download = `activity-distribution${typeLabel}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Activity Distribution</h3>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>By type</p>
          </div>
          <button
            onClick={downloadCSV}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded transition-colors"
            style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}`, color: textColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonBg}
          >
            Download CSV
          </button>
        </div>
        {rawActivities && rawActivities.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded"
              style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}`, color: textSecondary }}
            >
              <span className="font-medium">
                {selectedTypes.size > 0 
                  ? `${selectedTypes.size} type${selectedTypes.size > 1 ? 's' : ''} selected` 
                  : 'Filter by activity type'}
              </span>
              <span className="ml-2">{isDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded shadow-lg" style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}` }}>
                <div className="p-2 flex gap-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <button
                    onClick={selectAll}
                    className="flex-1 px-2 py-1 text-xs font-medium rounded"
                    style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}`, color: textSecondary }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={unselectAll}
                    className="flex-1 px-2 py-1 text-xs font-medium rounded"
                    style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}`, color: textSecondary }}
                  >
                    Unselect All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                  {formattedData.map((item) => (
                    <label
                      key={item.activityType}
                      className="flex items-center gap-2 text-xs cursor-pointer px-2 py-1.5 rounded"
                      style={{ color: textSecondary }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.has(item.activityType)}
                        onChange={() => toggleType(item.activityType)}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{item.displayLabel}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 p-6">
        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
            <XAxis 
              dataKey="displayLabel"
              angle={0}
              interval={0}
              tick={{ fontSize: 10, fill: axisColor }} 
              stroke={gridColor}
              axisLine={false}
              height={80}
              tickFormatter={(value) => {
                const words = value.split(' ');
                if (words.length > 1) {
                  return words[0];
                }
                return value;
              }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: axisColor }}
              stroke={gridColor} 
              axisLine={false}
              label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: axisColor } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: tooltipLabel, marginBottom: '8px' }}>{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: '11px', color: tooltipText }}>
                          <span style={{ fontWeight: 600 }}>{entry.name}: </span>
                          <span>{entry.value}</span>
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
            />
            <Bar 
              dataKey="count" 
              radius={[8, 8, 0, 0]}
              minPointSize={5}
            >
              {displayData.map((entry, index) => {
                const color = COLORS[entry.activityType] || DEFAULT_COLOR;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={color.fill} 
                    stroke={color.stroke}
                    strokeWidth={2}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <LastUpdatedDateTime name="Activity Distribution" />
    </div>
  );
};
