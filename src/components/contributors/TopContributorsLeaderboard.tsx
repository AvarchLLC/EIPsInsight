import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Avatar,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
  Button,
  Tooltip as ChakraTooltip,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { DownloadIcon, StarIcon } from '@chakra-ui/icons';

interface TopContributor {
  login: string;
  avatar_url: string;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  rank: number;
  html_url?: string;
}

interface TopContributorsLeaderboardProps {
  contributors: TopContributor[];
  title?: string;
  showCount?: number;
}

const TopContributorsLeaderboard: React.FC<TopContributorsLeaderboardProps> = ({
  contributors,
  title = "Top Contributors Leaderboard",
  showCount = 20
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const topContributors = contributors.slice(0, showCount);

  useEffect(() => {
    if (!chartRef.current || viewMode !== 'chart') return;

    // Initialize chart
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    // Prepare data for the chart
    const chartData = topContributors.map((contributor, index) => ({
      name: contributor.login,
      value: contributor.total_commits,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#4299E1'
          },
          {
            offset: 1,
            color: index < 3 ? ['#FFA500', '#A9A9A9', '#8B4513'][index] : '#2B6CB0'
          }
        ])
      },
      // Custom data for tooltip
      avatar_url: contributor.avatar_url,
      additions: contributor.total_additions,
      deletions: contributor.total_deletions,
      rank: contributor.rank
    }));

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: textColor,
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: bg,
        borderColor: '#ccc',
        textStyle: {
          color: textColor
        },
        formatter: (params: any) => {
          const data = params.data;
          return `
            <div style="text-align: center; padding: 10px;">
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">
                🏆 #${data.rank} ${data.name}
              </div>
              <div style="margin: 8px 0;">
                <strong>Commits:</strong> ${data.value.toLocaleString()}
              </div>
              <div style="margin: 8px 0; color: #48BB78;">
                <strong>Additions:</strong> +${data.additions.toLocaleString()}
              </div>
              <div style="margin: 8px 0; color: #ED8936;">
                <strong>Deletions:</strong> -${data.deletions.toLocaleString()}
              </div>
            </div>
          `;
        }
      },
      series: [
        {
          name: 'Contributors',
          type: 'bar',
          data: chartData.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: item.itemStyle,
            rank: item.rank,
            additions: item.additions,
            deletions: item.deletions,
            avatar_url: item.avatar_url
          })),
          barWidth: '60%',
          animationDuration: 2000,
          animationEasing: 'elasticOut' as any,
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            color: textColor,
            fontWeight: 'bold',
            fontSize: 11
          }
        } as any
      ],
      xAxis: {
        type: 'category',
        data: topContributors.map(c => c.login),
        axisLabel: {
          show: false // Hide x-axis labels since we show them on bars
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: 'Commits',
        nameTextStyle: {
          color: textColor,
          fontWeight: 'bold'
        },
        axisLabel: {
          color: textColor,
          formatter: (value: number) => {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'k';
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
      grid: {
        left: '10%',
        right: '5%',
        bottom: '5%',
        top: '15%',
        containLabel: true
      },
      dataZoom: [
        {
          type: 'slider',
          show: topContributors.length > 10,
          start: 0,
          end: Math.min(100, (10 / topContributors.length) * 100),
          height: 30,
          bottom: 20
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
  }, [contributors, viewMode, textColor, mutedColor, bg, title, showCount, topContributors]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  const downloadCSV = () => {
    const header = 'Rank,Username,Commits,Additions,Deletions,Profile_URL\n';
    const csvContent = header + topContributors.map(c =>
      `${c.rank},${c.login},${c.total_commits},${c.total_additions},${c.total_deletions},${c.html_url || ''}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-contributors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'yellow.400';
      case 2: return 'gray.400';
      case 3: return 'orange.400';
      default: return 'blue.400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  return (
    <Card bg={bg} shadow="lg" borderRadius="xl">
      <CardHeader pb={2}>
        <HStack justify="space-between" align="center" wrap="wrap">
          <Heading size="md" color="blue.500">
            {title}
          </Heading>
          <HStack spacing={3}>
            <Button
              size="sm"
              variant={viewMode === 'chart' ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => setViewMode('chart')}
            >
              Chart View
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
            <ChakraTooltip label="Download CSV">
              <Button
                size="sm"
                leftIcon={<DownloadIcon />}
                colorScheme="green"
                variant="outline"
                onClick={downloadCSV}
              >
                Export
              </Button>
            </ChakraTooltip>
          </HStack>
        </HStack>
        <Text color={mutedColor} fontSize="sm" mt={1}>
          Top {showCount} contributors ranked by total commits
        </Text>
      </CardHeader>
      <CardBody pt={0}>
        {viewMode === 'chart' ? (
          <Box
            ref={chartRef}
            width="100%"
            height="500px"
            borderRadius="md"
          />
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
            {topContributors.map((contributor, index) => (
              <GridItem key={contributor.login}>
                <Card
                  bg={cardBg}
                  borderColor={borderColor}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  _hover={{
                    borderColor: getRankColor(contributor.rank),
                    shadow: 'lg',
                    transform: 'translateY(-2px)'
                  }}
                  transition="all 0.2s"
                >
                  <VStack spacing={3}>
                    <HStack justify="space-between" width="100%">
                      <HStack spacing={3}>
                        <Text fontSize="2xl">{getRankIcon(contributor.rank)}</Text>
                        <Avatar
                          size="lg"
                          src={contributor.avatar_url}
                          name={contributor.login}
                          border="3px solid"
                          borderColor={getRankColor(contributor.rank)}
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="lg">
                            {contributor.login}
                          </Text>
                          <Badge
                            colorScheme={contributor.rank <= 3 ? 'gold' : 'blue'}
                            variant="solid"
                          >
                            Rank #{contributor.rank}
                          </Badge>
                        </VStack>
                      </HStack>
                    </HStack>

                    <Grid templateColumns="repeat(3, 1fr)" gap={4} width="100%">
                      <VStack spacing={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {contributor.total_commits.toLocaleString()}
                        </Text>
                        <Text fontSize="xs" color={mutedColor}>
                          Commits
                        </Text>
                      </VStack>
                      <VStack spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color="green.500">
                          +{contributor.total_additions.toLocaleString()}
                        </Text>
                        <Text fontSize="xs" color={mutedColor}>
                          Additions
                        </Text>
                      </VStack>
                      <VStack spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color="red.500">
                          -{contributor.total_deletions.toLocaleString()}
                        </Text>
                        <Text fontSize="xs" color={mutedColor}>
                          Deletions
                        </Text>
                      </VStack>
                    </Grid>

                    {contributor.html_url && (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        width="100%"
                        onClick={() => window.open(contributor.html_url, '_blank')}
                      >
                        View Profile
                      </Button>
                    )}
                  </VStack>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}
      </CardBody>
    </Card>
  );
};

export default TopContributorsLeaderboard;