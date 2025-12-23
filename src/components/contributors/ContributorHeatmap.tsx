import React from "react";

interface ContributorHeatmapProps {
  data: {
    date: string;
    count: number;
  }[];
}

export const ContributorHeatmap: React.FC<ContributorHeatmapProps> = ({
  data,
}) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getColor = (count: number) => {
    if (count === 0) return "#F3F4F6";
    const intensity = count / maxCount;
    if (intensity > 0.75) return "#10B981";
    if (intensity > 0.5) return "#34D399";
    if (intensity > 0.25) return "#6EE7B7";
    return "#A7F3D0";
  };

  const groupedByWeek: { [key: string]: typeof data } = {};
  data.forEach((item) => {
    const week = Math.floor(
      (new Date(item.date).getTime() - new Date(data[0]?.date || item.date).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    if (!groupedByWeek[week]) groupedByWeek[week] = [];
    groupedByWeek[week].push(item);
  });

  return (
    <div className="bg-emerald-50/30 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900 rounded-lg shadow-sm">
      <div className="px-8 py-6 border-b-2 border-emerald-200 dark:border-emerald-900 bg-emerald-100/20 dark:bg-emerald-900/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Activity Heatmap</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contribution calendar</p>
      </div>
      <div className="p-8">
        <div className="overflow-x-auto">
          <div className="flex gap-1 items-start">
            {Object.entries(groupedByWeek).map(([week, weekData]) => (
              <div key={week} className="flex flex-col gap-1">
                {weekData.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-3 h-3 cursor-pointer transition-all hover:scale-125 hover:ring-1 hover:ring-gray-400"
                    style={{ backgroundColor: getColor(item.count) }}
                    title={`${item.date}: ${item.count} activities`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-8 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <span>Less</span>
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700" />
          <div className="w-3 h-3" style={{ backgroundColor: "#A7F3D0" }} />
          <div className="w-3 h-3" style={{ backgroundColor: "#6EE7B7" }} />
          <div className="w-3 h-3" style={{ backgroundColor: "#34D399" }} />
          <div className="w-3 h-3" style={{ backgroundColor: "#10B981" }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
