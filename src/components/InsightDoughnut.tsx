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
import { Box, useColorModeValue } from "@chakra-ui/react";
import DateTime from "./DateTime";

interface CustomProps {
  data: {
    _id: string;
    count: number;
    statusChanges: {
      _id: string;
      eip: string;
      fromStatus: string;
      toStatus: string;
      title: string;
      status: string;
      author: string;
      created: string;
      changeDate: string;
      type: string;
      category: string;
      discussion: string;
      deadline: string;
      requires: string;
      pr: number;
      changedDay: number;
      changedMonth: number;
      changedYear: number;
      createdMonth: number;
      createdYear: number;
      __v: number;
    }[];
  }[];
}

const InsightDoughnut: React.FC<CustomProps> = ({ data }) => {
  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Pie),
    {
      ssr: false,
    }
  );
  const bg = useColorModeValue("#f6f6f7", "#171923");

  const config = {
    data: data,
    angleField: "count",
    colorField: "_id",
    radius: 1,
    innerRadius: 0.5,
    legend: { position: "top" as const },
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
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
  };

  const categoryColors: string[] = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(255, 99, 255)",
    "rgb(50, 205, 50)",
    "rgb(255, 0, 0)",
    "rgb(0, 128, 0)",
  ];
  const categoryBorder: string[] = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 205, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 99, 255, 0.2)",
    "rgba(50, 205, 50, 0.2)",
    "rgba(255, 0, 0, 0.2)",
    "rgba(0, 128, 0, 0.2)",
  ];

  return (
    <>
      <Box bg={bg} borderRadius={"0.55rem"} className="p-4">
        <Area {...config} />
        <Box className={"w-full"}>
          <DateTime />
        </Box>
      </Box>
    </>
  );
};

export default InsightDoughnut;
