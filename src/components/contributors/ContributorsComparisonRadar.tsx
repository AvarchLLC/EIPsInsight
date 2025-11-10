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
  Select,
  Switch,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

interface ContributorData {
  login: string;
  avatar_url: string;
  total_commits: number;
  total_additions: number;
  total_deletions: number;
  rank: number;
}

interface ContributorsComparisonRadarProps {
  contributors: ContributorData[];
  title?: string;
}

const ContributorsComparisonRadar: React.FC<ContributorsComparisonRadarProps> = ({
  contributors,
  title = "Contributors Comparison Radar"
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [showAvatars, setShowAvatars] = useState(true);

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Get top contributors for initial selection
  const topContributors = contributors
    .sort((a, b) => b.total_commits - a.total_commits)
    .slice(0, 10);

  // Initialize with top 3 contributors
  useEffect(() => {
    if (selectedContributors.length === 0 && topContributors.length > 0) {
      setSelectedContributors(topContributors.slice(0, 3).map(c => c.login));
    }
  }, [topContributors, selectedContributors.length]);

  const getSelectedContributorData = () => {
    return contributors.filter(c => selectedContributors.includes(c.login));
  };

  useEffect(() => {
    if (!chartRef.current || selectedContributors.length === 0) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const selectedData = getSelectedContributorData();
    
    // Calculate max values for normalization
    const maxCommits = Math.max(...contributors.map(c => c.total_commits));
    const maxAdditions = Math.max(...contributors.map(c => c.total_additions));
    const maxDeletions = Math.max(...contributors.map(c => c.total_deletions));
    
    // Define radar indicators
    const indicators = [
      { name: 'Commits', max: maxCommits },
      { name: 'Additions', max: maxAdditions },
      { name: 'Deletions', max: maxDeletions },
      { name: 'Commit Frequency', max: maxCommits },
      { name: 'Code Impact', max: maxAdditions + maxDeletions },
      { name: 'Ranking', max: contributors.length, min: 1, inverse: true }
    ];

    // Prepare series data
    const seriesData = selectedData.map((contributor, index) => ({
      value: [
        contributor.total_commits,
        contributor.total_additions,
        contributor.total_deletions,
        contributor.total_commits, // Commit frequency (same as commits for now)
        contributor.total_additions + contributor.total_deletions, // Code impact
        contributor.rank
      ],
      name: contributor.login,
      symbol: showAvatars ? `image://${contributor.avatar_url}` : 'circle',
      symbolSize: showAvatars ? 30 : 8,
      itemStyle: {
        color: [
          '#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#38B2AC', 
          '#F56565', '#D69E2E', '#805AD5', '#DD6B20', '#319795'
        ][index % 10]
      },
      lineStyle: {
        color: [
          '#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#38B2AC', 
          '#F56565', '#D69E2E', '#805AD5', '#DD6B20', '#319795'
        ][index % 10],
        width: 2
      },
      areaStyle: {
        color: [
          '#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#38B2AC', 
          '#F56565', '#D69E2E', '#805AD5', '#DD6B20', '#319795'
        ][index % 10] + '20'
      }
    }));

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
      legend: {
        data: selectedData.map(c => c.login),
        top: 'bottom',
        textStyle: {
          color: textColor
        },
        formatter: (name: string) => {
          const contributor = selectedData.find(c => c.login === name);
          return `${name} (${contributor?.total_commits} commits)`;
        }
      },
      tooltip: {
        backgroundColor: bg,
        borderColor: '#ccc',
        textStyle: {
          color: textColor
        },
        formatter: (params: any) => {
          const contributor = selectedData.find(c => c.login === params.name);
          if (!contributor) return '';
          
          return `
            <div style="padding: 10px; text-align: center;">
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">
                ${contributor.login}
              </div>
              <div style="margin: 4px 0;"><strong>Rank:</strong> #${contributor.rank}</div>
              <div style="margin: 4px 0; color: #4299E1;"><strong>Commits:</strong> ${contributor.total_commits.toLocaleString()}</div>
              <div style="margin: 4px 0; color: #48BB78;"><strong>Additions:</strong> +${contributor.total_additions.toLocaleString()}</div>
              <div style="margin: 4px 0; color: #ED8936;"><strong>Deletions:</strong> -${contributor.total_deletions.toLocaleString()}</div>
            </div>
          `;
        }
      },
      radar: {
        indicator: indicators.map(ind => ({
          ...ind,
          name: ind.name,
          nameTextStyle: {
            color: textColor,
            fontSize: 12,
            fontWeight: 'bold'
          }
        })),
        shape: 'polygon',
        radius: '60%',
        splitNumber: 5,
        splitArea: {
          areaStyle: {
            color: [
              'rgba(66, 153, 225, 0.1)',
              'rgba(66, 153, 225, 0.05)'
            ]
          }
        },
        splitLine: {
          lineStyle: {
            color: mutedColor,
            width: 1
          }
        },
        axisLine: {
          lineStyle: {
            color: mutedColor,
            width: 1
          }
        }
      },
      series: [{
        name: 'Contributors Comparison',
        type: 'radar',
        data: seriesData,
        emphasis: {
          lineStyle: {
            width: 4
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
  }, [contributors, selectedContributors, showAvatars, textColor, mutedColor, bg, title]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  }, []);

  const handleContributorToggle = (login: string) => {
    setSelectedContributors(prev => {
      if (prev.includes(login)) {
        return prev.filter(c => c !== login);
      } else if (prev.length < 6) { // Limit to 6 contributors for readability
        return [...prev, login];
      }
      return prev;
    });
  };

  const downloadCSV = () => {
    const selectedData = getSelectedContributorData();
    const header = 'Contributor,Rank,Commits,Additions,Deletions,Total_Changes\n';
    const csvContent = header + selectedData.map(c =>
      `${c.login},${c.rank},${c.total_commits},${c.total_additions},${c.total_deletions},${c.total_additions + c.total_deletions}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributors-comparison-radar-${new Date().toISOString().split('T')[0]}.csv`;
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
              Multi-dimensional comparison of contributor metrics
            </Text>
          </VStack>
          
          <VStack align="end" spacing={3}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="show-avatars" mb="0" fontSize="sm">
                Show Avatars
              </FormLabel>
              <Switch
                id="show-avatars"
                isChecked={showAvatars}
                onChange={(e) => setShowAvatars(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl>
            
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

        {/* Contributors Selection */}
        <Box mt={4}>
          <Text fontSize="sm" fontWeight="bold" color={textColor} mb={3}>
            Select Contributors to Compare (max 6):
          </Text>
          <Flex wrap="wrap" gap={2} maxHeight="120px" overflowY="auto">
            {topContributors.map((contributor) => (
              <Box
                key={contributor.login}
                as="button"
                onClick={() => handleContributorToggle(contributor.login)}
                p={2}
                borderRadius="md"
                border="2px solid"
                borderColor={selectedContributors.includes(contributor.login) ? "blue.500" : "gray.300"}
                bg={selectedContributors.includes(contributor.login) ? "blue.50" : "transparent"}
                _hover={{
                  borderColor: "blue.500",
                  bg: "blue.50"
                }}
                transition="all 0.2s"
                opacity={selectedContributors.length >= 6 && !selectedContributors.includes(contributor.login) ? 0.5 : 1}
                disabled={selectedContributors.length >= 6 && !selectedContributors.includes(contributor.login)}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="xs"
                    src={contributor.avatar_url}
                    name={contributor.login}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="bold">
                      {contributor.login}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      #{contributor.rank} • {contributor.total_commits} commits
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </Flex>
          <Text fontSize="xs" color={mutedColor} mt={2}>
            Selected: {selectedContributors.length}/6
          </Text>
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

export default ContributorsComparisonRadar;