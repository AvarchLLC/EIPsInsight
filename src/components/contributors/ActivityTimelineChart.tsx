import React from "react";
import { useColorModeValue } from "@chakra-ui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import ContributorLastUpdatedDateTime from "@/components/ContributorLastUpdatedDateTime";

interface ActivityTimelineChartProps {
  data: {
    date: string;
    commits: number; 
    pullRequests: number;
    reviews: number;
    comments: number;
  }[];
  timelineLabel?: string;
}

const METRIC_LABELS: Record<string, string> = {
  commits: "Commits",
  pullRequests: "Pull Requests",
  reviews: "Reviews",
  comments: "Comments",
};

export const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> = ({
  data,
  timelineLabel = "Last 30 days",
}) => {
  const tooltipBg = useColorModeValue("#FFFFFF", "#1F2937");
  const tooltipBorder = useColorModeValue("#E5E7EB", "#374151");
  const tooltipLabelColor = useColorModeValue("#111827", "#F3F4F6");
  const tooltipTextColor = useColorModeValue("#4B5563", "#9CA3AF");
  const gridColor = useColorModeValue("#E5E7EB", "#374151");
  const axisColor = useColorModeValue("#9CA3AF", "#6B7280");
  const bgColor = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#111827", "#F3F4F6");
  const textSecondary = useColorModeValue("#6B7280", "#9CA3AF");
  const buttonBg = useColorModeValue("#FFFFFF", "#1F2937");
  const buttonBorder = useColorModeValue("#D1D5DB", "#4B5563");

  const [selectedMetrics, setSelectedMetrics] = React.useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const metricKeys = ['commits', 'pullRequests', 'reviews', 'comments'];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metric)) {
        newSet.delete(metric);
      } else {
        newSet.add(metric);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedMetrics(new Set(metricKeys));
  };

  const unselectAll = () => {
    setSelectedMetrics(new Set());
  };

  const downloadCSV = () => {
    const headers = ['Date'];
    const metricsToExport = selectedMetrics.size > 0 ? Array.from(selectedMetrics) : metricKeys;
    
    metricsToExport.forEach(metric => {
      headers.push(METRIC_LABELS[metric] || metric);
    });

    const csvContent = [
      headers,
      ...data.map(item => [
        item.date,
        ...metricsToExport.map(metric => (item as any)[metric] || 0)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filterLabel = selectedMetrics.size > 0 ? `-filtered-${selectedMetrics.size}-metrics` : '-all';
    a.download = `activity-timeline${filterLabel}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: textColor }}>Activity Timeline</h3>
            <p className="text-xs mt-1" style={{ color: textSecondary }}>{timelineLabel}</p>
          </div>
          <button
            onClick={downloadCSV}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded transition-colors"
            style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}`, color: textColor }}
          >
            Download CSV
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs rounded"
            style={{ backgroundColor: buttonBg, border: `1px solid ${buttonBorder}`, color: textSecondary }}
          >
            <span className="font-medium">
              {selectedMetrics.size > 0 
                ? `${selectedMetrics.size} metric${selectedMetrics.size > 1 ? 's' : ''} selected` 
                : 'Filter by metric type'}
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
              <div className="p-2 space-y-1">
                {metricKeys.map((metric) => (
                  <label
                    key={metric}
                    className="flex items-center gap-2 text-xs cursor-pointer px-2 py-1.5 rounded"
                    style={{ color: textSecondary }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMetrics.has(metric)}
                      onChange={() => toggleMetric(metric)}
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{METRIC_LABELS[metric]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-6">
        <ResponsiveContainer width="100%" height={400}>
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
            <YAxis 
              tick={{ fontSize: 10, fill: axisColor }} 
              stroke={gridColor}
              axisLine={false}
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
                      <p style={{ fontSize: '11px', fontWeight: 600, color: tooltipLabelColor, marginBottom: '8px' }}>{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ fontSize: '11px', color: tooltipTextColor }}>
                          <span style={{ color: entry.color }}>{entry.name}: </span>
                          <span style={{ fontWeight: 600 }}>{entry.value}</span>
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
              iconType="square"
              iconSize={8}
            />
            {(selectedMetrics.size === 0 || selectedMetrics.has('commits')) && (
              <Area
                type="monotone"
                dataKey="commits"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#colorCommits)"
                strokeWidth={2}
                name="Commits"
              />
            )}
            {(selectedMetrics.size === 0 || selectedMetrics.has('pullRequests')) && (
              <Area
                type="monotone"
                dataKey="pullRequests"
                stackId="1"
                stroke="#8B5CF6"
                fill="url(#colorPRs)"
                strokeWidth={2}
                name="Pull Requests"
              />
            )}
            {(selectedMetrics.size === 0 || selectedMetrics.has('reviews')) && (
              <Area
                type="monotone"
                dataKey="reviews"
                stackId="1"
                stroke="#10B981"
                fill="url(#colorReviews)"
                strokeWidth={2}
                name="Reviews"
              />
            )}
            {(selectedMetrics.size === 0 || selectedMetrics.has('comments')) && (
              <Area
                type="monotone"
                dataKey="comments"
                stackId="1"
                stroke="#F59E0B"
                fill="url(#colorComments)"
                strokeWidth={2}
                name="Comments"
              />
            )}
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="#8884d8"
              fill="#f3f4f6"
              travellerWidth={10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ContributorLastUpdatedDateTime name="Activity Timeline" />
    </div>
  );
};
