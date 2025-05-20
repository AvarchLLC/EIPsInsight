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
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import dynamic from "next/dynamic";

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
      value: allData?.filter?.((item) =>
        item.type === "Standards Track" &&
        item.category === "Core" &&
        item.repo === "eip"
      )?.length ?? 0,

    },
    {
      status: "ERCs",
      value: allData?.filter((item) => getCat(item.category) === "ERCs").length,
    },
    {
      status: "RIPs",
      value: allData?.filter((item) => item.repo === "rip").length,
    },
    {
      status: "Networking",
      value: allData?.filter((item) => getCat(item.category) === "Networking").length,
    },
    {
      status: "Interface",
      value: allData?.filter((item) => getCat(item.category) === "Interface").length,
    },
    {
      status: "Informational",
      value: allData?.filter((item) => getCat(item.category) === "Informational").length,
    },
    {
      status: "Meta",
      value: allData?.filter((item) => getCat(item.category) === "Meta").length - 1,
    },

  ];

  const Area = dynamic(() => import("@ant-design/plots").then((item) => item.Pie), {
    ssr: false,
  });

  const statusColorMap: { [key: string]: string } = {
    Core: "#8B5CF6",          // Purple
    ERCs: "#34D399",          // Green
    RIPs: "#F87171",          // Red
    Networking: "#60A5FA",    // Blue
    Interface: "#FBBF24",     // Yellow
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
      labelHeight: 48,
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
      if ('status' in datum) {
        return statusColorMap[datum.status];
      }
      return '#000'; // Fallback color if status is not present
    },
  };



  return (
    <>
      <Area {...config} />
    </>
  );
};

export default DashboardDonut2;


// export default DashboardDonut;
