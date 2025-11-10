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
  Avatar,
  Badge,
  Flex,
  Select
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

interface ContributorActivity {
  login: string;
  avatar_url: string;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  weeks: Array<{
    week: Date;
    additions: number;
    deletions: number;
    commits: number;
  }>;
}

interface ContributorsActivityHeatmapProps {
  contributors: ContributorActivity[];
  title?: string;
  showTopN?: number;
}

const ContributorsActivityHeatmap: React.FC<ContributorsActivityHeatmapProps> = ({
  contributors,
  title = "Contributors Activity Heatmap",
  showTopN = 10
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'commits' | 'additions' | 'deletions'>('commits');
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(52); // weeks

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const topContributors = contributors
    .sort((a, b) => b.total_commits - a.total_commits)
    .slice(0, showTopN);

  useEffect(() => {
    if (!chartRef.current || topContributors.length === 0) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    // Prepare heatmap data
    const heatmapData: any[] = [];
    const contributorNames = topContributors.map(c => c.login);
    const allWeeks = new Set<string>();

    // Collect all weeks across all contributors
    topContributors.forEach(contributor => {
      contributor.weeks.slice(-selectedTimeframe).forEach(week => {
        allWeeks.add(new Date(week.week).toISOString().slice(0, 10));
      });
    });

    const sortedWeeks = Array.from(allWeeks).sort();

    // Create heatmap data points
    topContributors.forEach((contributor, contributorIndex) => {
      const contributorWeeks = new Map();
      contributor.weeks.slice(-selectedTimeframe).forEach(week => {
        const weekKey = new Date(week.week).toISOString().slice(0, 10);
        contributorWeeks.set(weekKey, week);
      });

      sortedWeeks.forEach((week, weekIndex) => {
        const weekData = contributorWeeks.get(week);
        const value = weekData ? weekData[selectedMetric] : 0;
        
        heatmapData.push([
          weekIndex, // x-axis (week index)
          contributorIndex, // y-axis (contributor index)
          value || 0 // value for heatmap color
        ]);
      });
    });

    // Calculate max value for color scaling
    const maxValue = Math.max(...heatmapData.map(d => d[2]), 1);

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
        position: 'top',
        backgroundColor: bg,
        borderColor: '#ccc',
        textStyle: {
          color: textColor
        },
        formatter: (params: any) => {
          const [weekIndex, contributorIndex, value] = params.data;
          const contributor = topContributors[contributorIndex];
          const week = sortedWeeks[weekIndex];
          const metricName = selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1);
          
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 5px;">
                ${contributor.login}
              </div>
              <div>Week: ${week}</div>
              <div>${metricName}: ${value.toLocaleString()}</div>
            </div>
          `;
        }
      },
      grid: {
        height: '60%',
        top: '15%',
        left: '15%',
        right: '5%'
      },
      xAxis: {
        type: 'category',
        data: sortedWeeks.map(week => {
          const date = new Date(week);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        splitArea: {
          show: true
        },
        axisLabel: {
          color: textColor,
          interval: Math.floor(sortedWeeks.length / 10), // Show every nth label
          rotate: 45
        }
      },
      yAxis: {
        type: 'category',
        data: contributorNames,
        splitArea: {
          show: true
        },
        axisLabel: {
          color: textColor,
          formatter: (value: string) => {
            // Truncate long usernames
            return value.length > 12 ? value.substring(0, 12) + '...' : value;
          }
        }
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: selectedMetric === 'commits' 
            ? ['#ffffff', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
            : selectedMetric === 'additions'
            ? ['#ffffff', '#c6f6d5', '#68d391', '#38a169', '#22543d']
            : ['#ffffff', '#fed7d7', '#fc8181', '#e53e3e', '#9b2c2c']
        },
        textStyle: {
          color: textColor
        }
      },
      series: [{
        name: selectedMetric,
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
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
  }, [contributors, selectedMetric, selectedTimeframe, textColor, bg, title, showTopN, topContributors]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  const downloadCSV = () => {
    const header = 'Contributor,Week,Commits,Additions,Deletions\n';
    const csvData: string[] = [];
    
    topContributors.forEach(contributor => {
      contributor.weeks.slice(-selectedTimeframe).forEach(week => {
        const weekStr = new Date(week.week).toISOString().slice(0, 10);
        csvData.push(
          `${contributor.login},${weekStr},${week.commits},${week.additions},${week.deletions}`
        );
      });
    });

    const csvContent = header + csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributors-activity-heatmap-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card bg={bg} shadow="lg" borderRadius="xl">
      <CardHeader pb={2}>
        <HStack justify="space-between" align="flex-start" wrap="wrap">
          <VStack align="start" spacing={2}>
            <Heading size="md" color="blue.500">
              {title}
            </Heading>
            <Text color={mutedColor} fontSize="sm">
              Weekly activity patterns for top contributors (GitHub-style)
            </Text>
          </VStack>
          
          <VStack align="end" spacing={3}>
            <HStack spacing={3}>
              <Select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                size="sm"
                width="140px"
              >
                <option value="commits">Commits</option>
                <option value="additions">Additions</option>
                <option value="deletions">Deletions</option>
              </Select>
              
              <Select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(Number(e.target.value))}
                size="sm"
                width="140px"
              >
                <option value={12}>Last 12 weeks</option>
                <option value={26}>Last 26 weeks</option>
                <option value={52}>Last 52 weeks</option>
              </Select>
            </HStack>
            
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
          </VStack>
        </HStack>

        {/* Contributors Legend */}
        <Box mt={4}>
          <Text fontSize="sm" fontWeight="bold" color={textColor} mb={2}>
            Top Contributors:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {topContributors.slice(0, 5).map((contributor, index) => (
              <HStack key={contributor.login} spacing={2}>
                <Avatar
                  size="xs"
                  src={contributor.avatar_url}
                  name={contributor.login}
                />
                <Text fontSize="sm" color={textColor}>
                  {contributor.login}
                </Text>
                <Badge variant="outline" colorScheme="blue">
                  {contributor.total_commits}
                </Badge>
              </HStack>
            ))}
            {topContributors.length > 5 && (
              <Text fontSize="sm" color={mutedColor}>
                +{topContributors.length - 5} more
              </Text>
            )}
          </Flex>
        </Box>
      </CardHeader>
      <CardBody pt={0}>
        <Box
          ref={chartRef}
          width="100%"
          height="500px"
          borderRadius="md"
        />
      </CardBody>
    </Card>
  );
};

export default ContributorsActivityHeatmap;