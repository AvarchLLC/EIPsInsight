import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  HStack,
  VStack,
  useColorModeValue,
  Button,
  Tooltip as ChakraTooltip,
  Select,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { TrendingUpIcon } from 'lucide-react';

interface ContributorGrowthData {
  month: string;
  newContributors: number;
  totalContributors: number;
  activeContributors: number;
  returningContributors: number;
}

interface ContributorsGrowthChartProps {
  contributors: Array<{
    login: string;
    weeks: Array<{
      week: Date;
      commits: number;
    }>;
  }>;
  title?: string;
}

const ContributorsGrowthChart: React.FC<ContributorsGrowthChartProps> = ({
  contributors,
  title = "Contributors Growth Analysis"
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [timeRange, setTimeRange] = useState<number>(12); // months
  
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Process contributor growth data
  const getGrowthData = (): ContributorGrowthData[] => {
    const monthlyData: { [key: string]: Set<string> } = {};
    const allContributorFirstSeen: { [key: string]: string } = {};
    
    // Track when each contributor first appeared
    contributors.forEach(contributor => {
      contributor.weeks.forEach(week => {
        if (week.commits > 0) {
          const monthKey = dayjs(week.week).format('YYYY-MM');
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = new Set();
          }
          monthlyData[monthKey].add(contributor.login);
          
          // Track first appearance
          if (!allContributorFirstSeen[contributor.login]) {
            allContributorFirstSeen[contributor.login] = monthKey;
          } else if (monthKey < allContributorFirstSeen[contributor.login]) {
            allContributorFirstSeen[contributor.login] = monthKey;
          }
        }
      });
    });

    // Calculate growth metrics for each month
    const sortedMonths = Object.keys(monthlyData).sort();
    const growthData: ContributorGrowthData[] = [];
    const seenContributors = new Set<string>();

    sortedMonths.slice(-timeRange).forEach(month => {
      const monthContributors = monthlyData[month];
      const newContributors = Array.from(monthContributors).filter(
        contributor => allContributorFirstSeen[contributor] === month
      ).length;
      
      const returningContributors = Array.from(monthContributors).filter(
        contributor => seenContributors.has(contributor) && allContributorFirstSeen[contributor] !== month
      ).length;

      monthContributors.forEach(contributor => seenContributors.add(contributor));

      growthData.push({
        month,
        newContributors,
        totalContributors: seenContributors.size,
        activeContributors: monthContributors.size,
        returningContributors
      });
    });

    return growthData;
  };

  const growthData = getGrowthData();

  useEffect(() => {
    if (!chartRef.current || growthData.length === 0) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const months = growthData.map(d => d.month);
    const newContributors = growthData.map(d => d.newContributors);
    const totalContributors = growthData.map(d => d.totalContributors);
    const activeContributors = growthData.map(d => d.activeContributors);
    const returningContributors = growthData.map(d => d.returningContributors);

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: bg,
        borderColor: '#ccc',
        textStyle: {
          color: textColor
        },
        formatter: (params: any) => {
          const month = params[0].axisValue;
          let content = `<div style="font-weight: bold; margin-bottom: 8px;">${month}</div>`;
          params.forEach((param: any) => {
            const marker = `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 5px;"></span>`;
            content += `${marker}${param.seriesName}: ${param.value}<br/>`;
          });
          return content;
        }
      },
      legend: {
        data: ['New Contributors', 'Total Contributors', 'Active Contributors', 'Returning Contributors'],
        top: 30,
        textStyle: {
          color: textColor
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {
            backgroundColor: bg
          }
        },
        iconStyle: {
          borderColor: textColor
        }
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          color: textColor,
          formatter: (value: string) => {
            return dayjs(value).format('MMM YY');
          }
        },
        axisLine: {
          lineStyle: {
            color: mutedColor
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Contributors',
          position: 'left',
          axisLabel: {
            color: textColor
          },
          axisLine: {
            lineStyle: {
              color: mutedColor
            }
          },
          splitLine: {
            lineStyle: {
              color: mutedColor,
              opacity: 0.3
            }
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: Math.max(0, 100 - (12 / months.length) * 100),
          end: 100
        },
        {
          start: Math.max(0, 100 - (12 / months.length) * 100),
          end: 100,
          handleSize: '80%',
          handleStyle: {
            color: '#4299E1',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }
      ],
      series: [
        {
          name: 'New Contributors',
          type: 'bar',
          data: newContributors,
          itemStyle: {
            color: '#48BB78'
          },
          stack: 'contributors'
        },
        {
          name: 'Returning Contributors',
          type: 'bar',
          data: returningContributors,
          itemStyle: {
            color: '#4299E1'
          },
          stack: 'contributors'
        },
        {
          name: 'Total Contributors',
          type: 'line',
          data: totalContributors,
          smooth: true,
          lineStyle: {
            color: '#9F7AEA',
            width: 3
          },
          itemStyle: {
            color: '#9F7AEA'
          },
          symbol: 'circle',
          symbolSize: 8
        },
        {
          name: 'Active Contributors',
          type: 'line',
          data: activeContributors,
          smooth: true,
          lineStyle: {
            color: '#ED8936',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#ED8936'
          },
          symbol: 'diamond',
          symbolSize: 6
        }
      ]
    };

    chartInstanceRef.current.setOption(option);

    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [contributors, timeRange, textColor, mutedColor, bg, title, growthData]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  const downloadCSV = () => {
    const header = 'Month,New_Contributors,Total_Contributors,Active_Contributors,Returning_Contributors\n';
    const csvContent = header + growthData.map(d =>
      `${d.month},${d.newContributors},${d.totalContributors},${d.activeContributors},${d.returningContributors}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributor-growth-${timeRange}m-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate growth metrics
  const latestData = growthData[growthData.length - 1];
  const previousData = growthData[growthData.length - 2];
  const growthRate = previousData ? 
    Math.round(((latestData?.totalContributors - previousData.totalContributors) / previousData.totalContributors) * 100) : 0;

  return (
    <Card bg={bg} shadow="lg" borderRadius="xl">
      <CardHeader pb={2}>
        <HStack justify="space-between" align="flex-start" wrap="wrap">
          <VStack align="start" spacing={2}>
            <Heading size="md" color="blue.500">
              {title}
            </Heading>
            <Text color={mutedColor} fontSize="sm">
              Track contributor acquisition and retention patterns
            </Text>
          </VStack>
          
          <VStack align="end" spacing={3}>
            <HStack spacing={3}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                size="sm"
                width="150px"
              >
                <option value={6}>Last 6 months</option>
                <option value={12}>Last 12 months</option>
                <option value={24}>Last 24 months</option>
                <option value={36}>Last 3 years</option>
              </Select>
              
              <ChakraTooltip label="Download CSV">
                <Button
                  size="sm"
                  leftIcon={<DownloadIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={downloadCSV}
                >
                  Export
                </Button>
              </ChakraTooltip>
            </HStack>
          </VStack>
        </HStack>

        {/* Growth Metrics Summary */}
        {latestData && (
          <HStack spacing={6} mt={4} wrap="wrap">
            <Stat size="sm">
              <StatLabel>Growth Rate</StatLabel>
              <StatNumber color={growthRate > 0 ? "green.500" : "red.500"} fontSize="lg">
                {growthRate > 0 ? '+' : ''}{growthRate}%
              </StatNumber>
              <StatHelpText>Month over month</StatHelpText>
            </Stat>
            
            <Stat size="sm">
              <StatLabel>New This Month</StatLabel>
              <StatNumber color="green.500" fontSize="lg">
                {latestData.newContributors}
              </StatNumber>
              <StatHelpText>First-time contributors</StatHelpText>
            </Stat>
            
            <Stat size="sm">
              <StatLabel>Retention</StatLabel>
              <StatNumber color="blue.500" fontSize="lg">
                {latestData.activeContributors > 0 ? 
                  Math.round((latestData.returningContributors / latestData.activeContributors) * 100) : 0}%
              </StatNumber>
              <StatHelpText>Returning contributors</StatHelpText>
            </Stat>

            <Badge colorScheme="blue" variant="subtle" p={2} borderRadius="md">
              <HStack>
                <TrendingUpIcon />
                <Text fontSize="sm">
                  Total: {latestData.totalContributors} Contributors
                </Text>
              </HStack>
            </Badge>
          </HStack>
        )}
      </CardHeader>
      <CardBody pt={0}>
        <Box
          ref={chartRef}
          width="100%"
          height="400px"
          borderRadius="md"
        />
      </CardBody>
    </Card>
  );
};

export default ContributorsGrowthChart;