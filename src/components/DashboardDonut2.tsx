import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import dynamic from "next/dynamic";
import { legend } from "@antv/g2plot/lib/adaptor/common";

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: Date;
  discussion: string;
  deadline: string;
  requires: string;
  repo: string;
  unique_ID: number;
  __v: number;
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

interface AreaCProps {
  dataset: APIResponse;
  // status:string;
}

const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track":
    case "Standard Track":
    case "Standards Track (Core, Networking, Interface, ERC)":
    case "Standard":
    case "Process":
    case "Core":
    case "core":
      return "Core";
    case "ERC":
      return "ERCs";
    case "RIP":
      return "RIPs";
    case "Networking":
      return "Networking";
    case "Interface":
      return "Interface";
    case "Meta":
      return "Meta";
    case "Informational":
      return "Informational";
    default:
      return "Core";
  }
};

const DashboardDonut2: React.FC<AreaCProps> = ({ dataset }) => {
  const [data, setData] = useState<APIResponse>();

  useEffect(() => {
    setData(dataset);
  }, []);

  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];

  const dat = [
    {
      status: "Core",
      value: allData.filter(
        (item) =>
          item.type === "Standards Track" &&
          item.category === "Core" &&
          item.repo === "eip"
      ).length,
    },
    {
      status: "ERCs",
      value: allData.filter((item) => getCat(item.category) === "ERCs").length,
    },
    {
      status: "RIPs",
      value: allData.filter((item) => item.repo === "rip").length,
    },
    {
      status: "Networking",
      value: allData.filter((item) => getCat(item.category) === "Networking")
        .length,
    },
    {
      status: "Interface",
      value: allData.filter((item) => getCat(item.category) === "Interface")
        .length,
    },
    {
      status: "Informational",
      value: allData.filter((item) => getCat(item.category) === "Informational")
        .length,
    },
    {
      status: "Meta",
      value:
        allData.filter((item) => getCat(item.category) === "Meta").length - 1,
    },
  ];

  const Area = dynamic(
    () => import("@ant-design/plots")?.then((item) => item.Pie),
    {
      ssr: false,
    }
  );

  const statusColorMap: { [key: string]: string } = {
    Core: "#8B5CF6", // Purple
    ERCs: "#34D399", // Green
    RIPs: "#F87171", // Red
    Networking: "#60A5FA", // Blue
    Interface: "#FBBF24", // Yellow
    Informational: "#A78BFA", // Light Purple
    Meta: "#F472B6",
  };

  const config = {
    appendPadding: 10,
    data: dat,
    angleField: "value",
    colorField: "status",
    radius: 0.8,
    innerRadius: 0.5,
    legend: { position: "top" as const },
    label: {
      type: "spider",
      labelHeight: 64, // Try increasing it
      content: "{name} ({value})",
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },

    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
    color: (datum: any) => {
      // Type guard to check if datum has the status property
      if ("status" in datum) {
        return statusColorMap[datum.status];
      }
      return "#000"; // Fallback color if status is not present
    },
  };
  return (
    <div className="w-full flex flex-col  md:items-start md:flex-row">
      <div className="flex flex-col items-start justify-start gap-4 w-full">
        {/* Custom Legend */}
        <div className="flex flex-col gap-4 w-full p-3 md:p-0">
          {/* For medium and above screens (4 + 3) */}
          <div className="hidden md:flex flex-wrap justify-start gap-x-20">
            {dat.slice(0, 4).map((item) => (
              <div key={item.status} className="flex items-start gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColorMap[item.status] }}
                ></span>
                <span className="text-sm">{item.status}</span>
              </div>
            ))}
          </div>
          <div className="hidden md:flex flex-wrap justify-start gap-x-20">
            {dat.slice(4).map((item) => (
              <div key={item.status} className="flex items-start gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColorMap[item.status] }}
                ></span>
                <span className="text-sm">{item.status}</span>
              </div>
            ))}
          </div>

          {/* For mobile screens (3 + 2 + 2) */}
          <div className="flex md:hidden flex-col gap-3">
            <div className="flex justify-start gap-6">
              {dat.slice(0, 3).map((item) => (
                <div key={item.status} className="flex items-start gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColorMap[item.status] }}
                  ></span>
                  <span className="text-sm">{item.status}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-start gap-6">
              {dat.slice(3, 5).map((item) => (
                <div key={item.status} className="flex items-start gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColorMap[item.status] }}
                  ></span>
                  <span className="text-sm">{item.status}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-start gap-6">
              {dat.slice(5).map((item) => (
                <div key={item.status} className="flex items-start gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColorMap[item.status] }}
                  ></span>
                  <span className="text-sm">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Pie Chart */}
        <div className="w-full mt-6 overflow-x-auto">
          <Area {...{ ...config, legend: false }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardDonut2;

// export default DashboardDonut;
