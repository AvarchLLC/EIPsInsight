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

const DashboardDonut: React.FC<AreaCProps> =({dataset}) => {
  const [data, setData] = useState<APIResponse>();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/new/all`);
    //     const jsonData = await response.json();
        setData(dataset);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchData();
  }, []);

  const allData: EIP[] = data?.eip?.concat(data?.erc?.concat(data?.rip)) || [];

  const dat = [
    {
      status: "Draft",
      value: allData.filter((item) => item.status === "Draft").length,
    },
    {
      status: "Review",
      value: allData.filter((item) => item.status === "Review").length,
    },
    {
      status: "Last Call",
      value: allData.filter((item) => item.status === "Last Call").length,
    },
    {
      status: "Living",
      value: allData.filter((item) => item.status === "Living").length,
    },
    {
      status: "Stagnant",
      value: allData.filter((item) => item.status === "Stagnant").length,
    },
    {
      status: "Withdrawn",
      value: allData.filter((item) => item.status === "Withdrawn").length,
    },
    {
      status: "Final",
      value: allData.filter((item) => item.status === "Final").length,
    },
  ];

  const Area = dynamic(() => import("@ant-design/plots").then((item) => item.Pie), {
    ssr: false,
  });

  const statusColorMap: { [key: string]: string } = {
    Draft: "#FFD800",
    Review: "#D69E2E",
    "Last Call": "#38A169",
    Living: "#367588",
    Stagnant: "#FF2400",
    Withdrawn: "#FF0000",
    Final: "#1E90FF",
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

export default DashboardDonut;


// export default DashboardDonut;
