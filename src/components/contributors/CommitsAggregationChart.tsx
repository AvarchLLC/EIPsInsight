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
  Tooltip as ChakraTooltip,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';

interface CommitData {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
  contributors: number;
}

interface CommitsAggregationChartProps {
  data: CommitData[];
  title?: string;
}

type AggregationType = 'daily' | 'weekly' | 'monthly' | 'yearly';

const CommitsAggregationChart: React.FC<CommitsAggregationChartProps> = ({
  data,
  title = "Commits Over Time"
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [aggregationType, setAggregationType] = useState<AggregationType>('monthly');
  const [metric, setMetric] = useState<'commits' | 'additions' | 'deletions' | 'contributors'>('commits');

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Aggregate data based on selected type
  const getAggregatedData = () => {
    const aggregated: { [key: string]: { commits: number; additions: number; deletions: number; contributors: Set<string> } } = {};

    data.forEach(item => {
      let key: string;
      const date = dayjs(item.date);

      switch (aggregationType) {
        case 'daily':
          key = date.format('YYYY-MM-DD');
          break;
        case 'weekly':
          key = date.startOf('week').format('YYYY-MM-DD');
          break;
        case 'monthly':
          key = date.format('YYYY-MM');
          break;
        case 'yearly':
          key = date.format('YYYY');
          break;
        default:
          key = date.format('YYYY-MM');
      }

      if (!aggregated[key]) {
        aggregated[key] = {
          commits: 0,
          additions: 0,
          deletions: 0,
          contributors: new Set()
        };
      }

      aggregated[key].commits += item.commits;
      aggregated[key].additions += item.additions;
      aggregated[key].deletions += item.deletions;
      // For contributors, we'll just use the max value for simplicity
      // In a real implementation, you'd want to track unique contributors per period
    });

    return Object.entries(aggregated)
      .map(([key, values]) => ({
        date: key,
        commits: values.commits,
        additions: values.additions,
        deletions: values.deletions,
        contributors: data.filter(d => {
          const date = dayjs(d.date);
          let periodKey: string;
          switch (aggregationType) {
            case 'daily':
              periodKey = date.format('YYYY-MM-DD');
              break;
            case 'weekly':
              periodKey = date.startOf('week').format('YYYY-MM-DD');
              break;
            case 'monthly':
              periodKey = date.format('YYYY-MM');
              break;
            case 'yearly':
              periodKey = date.format('YYYY');
              break;
            default:
              periodKey = date.format('YYYY-MM');
          }
          return periodKey === key;
        }).reduce((max, current) => Math.max(max, current.contributors), 0)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const aggregatedData = getAggregatedData();
    const dates = aggregatedData.map(d => d.date);
    const values = aggregatedData.map(d => d[metric]);

    const getColor = () => {
      switch (metric) {
        case 'commits': return '#4299E1';
        case 'additions': return '#48BB78';
        case 'deletions': return '#ED8936';
        case 'contributors': return '#9F7AEA';
        default: return '#4299E1';
      }
    };

    const getMetricName = () => {
      switch (metric) {
        case 'commits': return 'Commits';
        case 'additions': return 'Additions';
        case 'deletions': return 'Deletions';
        case 'contributors': return 'Contributors';
        default: return 'Commits';
      }
    };

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: `${title} (${getMetricName()} - ${aggregationType.charAt(0).toUpperCase() + aggregationType.slice(1)})`,
        left: 'center',
        textStyle: {
          color: textColor,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: bg,
        borderColor: '#ccc',
        textStyle: {
          color: textColor
        },
        formatter: (params: any) => {
          const param = params[0];
          const date = param.axisValue;
          const value = param.value;
          const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${date}</div>
              <div>${getMetricName()}: ${formattedValue}</div>
            </div>
          `;
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
          },
          magicType: {
            type: ['line', 'bar', 'stack']
          }
        },
        iconStyle: {
          borderColor: textColor
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          color: textColor,
          rotate: aggregationType === 'daily' ? 45 : 0
        },
        axisLine: {
          lineStyle: {
            color: mutedColor
          }
        }
      },
      yAxis: {
        type: 'value',
        name: getMetricName(),
        nameTextStyle: {
          color: textColor
        },
        axisLabel: {
          color: textColor,
          formatter: (value: number) => {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value.toString();
          }
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
      },
      dataZoom: [
        {
          type: 'inside',
          start: Math.max(0, 100 - (12 / dates.length) * 100),
          end: 100
        },
        {
          start: Math.max(0, 100 - (12 / dates.length) * 100),
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,22.6H6.7v-1.2h6.6V22.6z',
          handleSize: '80%',
          handleStyle: {
            color: getColor(),
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }
      ],
      series: [
        {
          name: getMetricName(),
          type: 'line',
          data: values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: getColor(),
            width: 3
          },
          itemStyle: {
            color: getColor()
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: getColor() + '40'
              },
              {
                offset: 1,
                color: getColor() + '10'
              }
            ])
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Maximum' },
              { type: 'min', name: 'Minimum' }
            ],
            itemStyle: {
              color: getColor()
            }
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average' }
            ],
            lineStyle: {
              color: getColor(),
              type: 'dashed'
            }
          },
          animationDuration: 2000,
          animationEasing: 'cubicInOut'
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
  }, [data, aggregationType, metric, textColor, mutedColor, bg, title]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  const downloadCSV = () => {
    const aggregatedData = getAggregatedData();
    const header = `Date,${metric.charAt(0).toUpperCase() + metric.slice(1)}\n`;
    const csvContent = header + aggregatedData.map(d =>
      `${d.date},${d[metric]}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commits-${aggregationType}-${metric}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card bg={bg} shadow="lg" borderRadius="xl">
      <CardHeader pb={2}>
        <HStack justify="space-between" align="flex-start" wrap="wrap" spacing={4}>
          <Box>
            <Heading size="md" color="blue.500" mb={2}>
              {title}
            </Heading>
            <Text color={mutedColor} fontSize="sm">
              Configurable time aggregation with interactive controls
            </Text>
          </Box>
          <Box>
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
          </Box>
        </HStack>

        <HStack spacing={6} mt={4} wrap="wrap">
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
              Time Period:
            </Text>
            <RadioGroup value={aggregationType} onChange={(value: AggregationType) => setAggregationType(value)}>
              <Stack direction="row" spacing={4}>
                <Radio value="daily" size="sm">Daily</Radio>
                <Radio value="weekly" size="sm">Weekly</Radio>
                <Radio value="monthly" size="sm">Monthly</Radio>
                <Radio value="yearly" size="sm">Yearly</Radio>
              </Stack>
            </RadioGroup>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
              Metric:
            </Text>
            <RadioGroup value={metric} onChange={(value: any) => setMetric(value)}>
              <Stack direction="row" spacing={4}>
                <Radio value="commits" size="sm">Commits</Radio>
                <Radio value="additions" size="sm">Additions</Radio>
                <Radio value="deletions" size="sm">Deletions</Radio>
                <Radio value="contributors" size="sm">Contributors</Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <Box
          ref={chartRef}
          width="100%"
          height="450px"
          borderRadius="md"
        />
      </CardBody>
    </Card>
  );
};

export default CommitsAggregationChart;