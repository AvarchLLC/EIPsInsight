'use client';
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAllEipsData } from '@/hooks/useAllEipsData';

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

const EIPChartWrapper: React.FC<{ type: string }> = ({ type }) => {
  interface EIPData {
    created: string;
    repo: string;
    category: string;
    status: string;
  }

  const [chartType, setChartType] = useState('category');
  const { data: allEipsData } = useAllEipsData();
  const data: EIPData[] =
    type === 'EIP'
      ? allEipsData?.eip ?? []
      : type === 'ERC'
        ? allEipsData?.erc ?? []
        : type === 'RIP'
          ? allEipsData?.rip ?? []
          : allEipsData
            ? [...allEipsData.eip, ...allEipsData.erc, ...allEipsData.rip]
            : [];

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

  const colorsByType = ["#f579ba", "#9164f7", "#3ed59e", "#68aafa", "#fbc22f", "#ac91fa", "#f97878"];

  const seriesData = Array.from(uniqueCategories)?.map((category, index) => ({
    name: category,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    itemStyle: {
      color: colorsByType[index % colorsByType?.length],
      borderColor: colorsByType[index % colorsByType?.length],
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
