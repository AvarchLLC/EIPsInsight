import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { 
  Box, 
  Card, 
  CardHeader, 
  CardBody, 
  Heading, 
  Text, 
  Select, 
  HStack, 
  useColorModeValue,
  Button,
  Tooltip as ChakraTooltip
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { chartColorPalettes, echartThemes } from './ModernTheme';

interface CommitData {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
  contributors: number;
}

interface CommitsTimelineChartProps {
  data: CommitData[];
  title?: string;
}

const CommitsTimelineChart: React.FC<CommitsTimelineChartProps> = ({ 
  data, 
  title = "Commits Timeline" 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('90d');
  
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    const daysToSubtract = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[timeRange];
    
    const cutoffDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const filteredData = getFilteredData();
    const dates = filteredData.map(d => d.date);
    const commits = filteredData.map(d => d.commits);
    const additions = filteredData.map(d => d.additions);
    const deletions = filteredData.map(d => d.deletions);
    const contributors = filteredData.map(d => d.contributors);

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
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        backgroundColor: bg,
        borderColor: '#ccc',
        textStyle: {
          color: textColor
        },
        formatter: (params: any) => {
          const date = params[0].axisValue;
          let content = `<div style="font-weight: bold; margin-bottom: 5px;">${date}</div>`;
          params.forEach((param: any) => {
            const marker = `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 5px;"></span>`;
            content += `${marker}${param.seriesName}: ${param.value.toLocaleString()}<br/>`;
          });
          return content;
        }
      },
      legend: {
        data: ['Commits', 'Additions', 'Deletions', 'Active Contributors'],
        top: 30,
        textStyle: {
          color: textColor
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
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
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            color: textColor,
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: mutedColor
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#4299E1'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: textColor
          }
        },
        {
          type: 'value',
          name: 'Contributors',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#9F7AEA'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: textColor
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,22.6H6.7v-1.2h6.6V22.6z',
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
          name: 'Commits',
          type: 'line',
          data: commits,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#4299E1',
            width: 3
          },
          itemStyle: {
            color: '#4299E1'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(66, 153, 225, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(66, 153, 225, 0.1)'
              }
            ])
          }
        },
        {
          name: 'Additions',
          type: 'line',
          data: additions,
          smooth: true,
          symbol: 'triangle',
          symbolSize: 6,
          lineStyle: {
            color: '#48BB78',
            width: 2
          },
          itemStyle: {
            color: '#48BB78'
          }
        },
        {
          name: 'Deletions',
          type: 'line',
          data: deletions,
          smooth: true,
          symbol: 'diamond',
          symbolSize: 6,
          lineStyle: {
            color: '#ED8936',
            width: 2
          },
          itemStyle: {
            color: '#ED8936'
          }
        },
        {
          name: 'Active Contributors',
          type: 'line',
          yAxisIndex: 1,
          data: contributors,
          smooth: true,
          symbol: 'rect',
          symbolSize: 6,
          lineStyle: {
            color: '#9F7AEA',
            width: 2,
            type: 'dashed'
          },
          itemStyle: {
            color: '#9F7AEA'
          }
        }
      ]
    };

    chartInstanceRef.current.setOption(option);

    // Resize handler
    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, timeRange, textColor, mutedColor, bg, title]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  const downloadCSV = () => {
    const filteredData = getFilteredData();
    const header = 'Date,Commits,Additions,Deletions,Contributors\n';
    const csvContent = header + filteredData.map(d => 
      `${d.date},${d.commits},${d.additions},${d.deletions},${d.contributors}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commits-timeline-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card 
      bg={bg} 
      shadow="xl" 
      borderRadius="2xl" 
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      w="full"
      overflow="hidden"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.3s ease"
    >
      <CardHeader pb={3}>
        <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
          <Heading size="lg" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" fontWeight="bold">
            {title}
          </Heading>
          <HStack spacing={3}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              size="sm"
              w="100px"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
              <option value="all">All Time</option>
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
        </HStack>
        <Text color={mutedColor} fontSize="sm" mt={2} fontWeight="medium">
          📈 Interactive timeline with zoom, pan, and data export capabilities
        </Text>
      </CardHeader>
      <CardBody pt={0}>
        <Box
          ref={chartRef}
          w="full"
          h="500px"
          borderRadius="xl"
          bg={useColorModeValue('gray.50', 'gray.800')}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          overflow="hidden"
        />
      </CardBody>
    </Card>
  );
};

export default CommitsTimelineChart;