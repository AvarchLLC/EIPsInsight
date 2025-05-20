'use client';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Link from 'next/link';
import { Spinner } from '@chakra-ui/react';

const getCat = (cat: string): string => {
  switch (cat) {
    case 'Standards Track':
    case 'Standard Track':
    case 'Standards Track (Core, Networking, Interface, ERC)':
    case 'Standard':
    case 'Process':
    case 'Core':
    case 'core':
      return 'Core';
    case 'ERC':
      return 'ERCs';
    case 'RIP':
      return 'RIPs';
    case 'Networking':
      return 'Networking';
    case 'Interface':
      return 'Interface';
    case 'Meta':
      return 'Meta';
    case 'Informational':
      return 'Informational';
    default:
      return 'Core';
  }
};

const getStatus = (status: string): string => {
  switch (status) {
    case 'Draft':
      return 'Draft';
    case 'Final':
    case 'Accepted':
    case 'Superseded':
      return 'Final';
    case 'Last Call':
      return 'Last Call';
    case 'Withdrawn':
    case 'Abandoned':
    case 'Rejected':
      return 'Withdrawn';
    case 'Review':
      return 'Review';
    case 'Living':
    case 'Active':
      return 'Living';
    case 'Stagnant':
      return 'Stagnant';
    default:
      return 'Final';
  }
};

const fetchEIPData = async () => {
  try {
    const response = await fetch('/api/new/all');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching EIP data:', error);
    return { eip: [], erc: [], rip: [] }; // Return empty data in case of an error
  }
};

const EIPChartWrapper: React.FC<{ type: string }> = ({ type }) => {
  interface EIPData {
    created: string;
    repo: string;
    category: string;
    status: string;
  }

  const [data, setData] = useState<EIPData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState('category');

  useEffect(() => {
    fetchEIPData().then((dataset) => {
      if (type === 'EIP') setData(dataset.eip);
      else if (type === 'ERC') setData(dataset.erc);
      else if (type === 'RIP') setData(dataset.rip);
      else setData([...dataset.eip, ...dataset.erc, ...dataset.rip]);
      setIsLoading(false);
    });
  }, [type]);

  const transformedData = data?.reduce(
    (acc, item) => {
      const year = new Date(item.created).getFullYear();
      const category = item.repo === 'rip' ? 'RIPs' : getCat(item.category);
      const key = `${year}-${category}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const transformedData2 = data?.reduce(
    (acc, item) => {
      const year = new Date(item.created).getFullYear();
      const status = getStatus(item.status);
      const key = `${year}-${status}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const finalData = chartType === 'status' ? transformedData2 : transformedData;
  const uniqueCategories = new Set(
    Object.keys(finalData)?.map((k) => k.split('-')[1])
  );
  const years = [
    ...new Set(Object.keys(finalData)?.map((k) => k.split('-')[0])),
  ].sort();

  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
  ];

  const seriesData = Array.from(uniqueCategories)?.map((category, index) => ({
    name: category,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    itemStyle: {
      color: colors[index % colors?.length],
      borderColor: colors[index % colors?.length],
      borderWidth: 2,
      opacity: 0.6,
    },
    data: years?.map((year) => finalData[`${year}-${category}`] || 0),
  }));

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      top: 'top',
      textStyle: {
        color: '#ffffff',
      },
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLabel: {
        color: '#ffffff',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#ffffff',
      },
    },
    series: seriesData,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default EIPChartWrapper;