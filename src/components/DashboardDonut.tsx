import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  import dynamic from 'next/dynamic';

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

const DashboardDonut = () => {
  const [data, setData] = useState<EIP[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(data.length)

  const dat = [
    {"status": "Final", "value" : data.filter(item => item.status === 'Final').length},
    {"status": "Draft", "value" : data.filter(item => item.status === 'Draft').length},
    {"status": "Review", "value" : data.filter(item => item.status === 'Review').length},
    {"status": "Last Call", "value" : data.filter(item => item.status === 'Last Call').length},
    {"status": "Living", "value" : data.filter(item => item.status === 'Living').length},
    {"status": "Stagnant", "value" : data.filter(item => item.status === 'Stagnant').length},
    {"status": "Withdrawn", "value" : data.filter(item => item.status === 'Withdrawn').length}
  ];
  const Area = dynamic(() => import("@ant-design/plots").then((item) => item.Pie), {
    ssr: false,
  });



  const categoryColors: string[] = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(255, 99, 255)',
    'rgb(50, 205, 50)',
    'rgb(255, 0, 0)',
    'rgb(0, 128, 0)',
  ];
  const categoryBorder: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 99, 255, 0.2)',
    'rgba(50, 205, 50, 0.2)',
    'rgba(255, 0, 0, 0.2)',
    'rgba(0, 128, 0, 0.2)',
  ];


  const config = {
    appendPadding: 10,
    data: dat,
    angleField: "value",
    colorField: "status",
    radius: 1,
    innerRadius: 0.5,
    legend: { position: 'top' as const },
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14
      }
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
      }
    }
  };


    
  return (
    <Area {...config}/>


  )
}

export default DashboardDonut;