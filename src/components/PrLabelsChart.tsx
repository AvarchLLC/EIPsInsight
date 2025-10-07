import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Menu, MenuList, MenuItem, MenuButton, Button, Flex, useToast } from '@chakra-ui/react';
import { ColumnConfig } from '@ant-design/plots';
import dynamic from "next/dynamic";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import CopyLink from './CopyLink';

const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

interface AggregatedLabelCount {
  monthYear: string;
  label: string;
  count: number;
  labelType: string;
  prNumbers: number[];
}

interface PRDetails {
  MonthKey: string;
  Label: string;
  LabelType: string;
  Repo: string;
  PRNumber: number;
  PRLink: string;
  Author: string;
  Title: string;
  CreatedAt: string;
}

const availableLabels = [
  'a-review',
  'e-review',
  'e-consensus',
  'stagnant',
  'stale',
  'created-by-bot',
  "miscellaneous"
];

const EipsLabelChart = () => {
  const [chartData, setChartData] = useState<AggregatedLabelCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState('erc');
  const [showLabels, setShowLabels] = useState<Record<string, boolean>>(
    availableLabels?.reduce((acc, label) => ({ ...acc, [label]: true }), {})
  );
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        
        // Use the same API as PrLabels.tsx with githubLabels labelType to get workflow labels
        const repoApiMap: Record<string, string> = {
          'eip': '/api/pr-stats',
          'erc': '/api/ercpr-stats',
          'rip': '/api/rippr-stats'
        };
        
        const apiUrl = repoApiMap[selectedRepo];
        if (!apiUrl) {
          throw new Error(`Unknown repo: ${selectedRepo}`);
        }
        
        const response = await fetch(`${apiUrl}?labelType=githubLabels`, { 
          signal: controller.signal 
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const chartData = Array.isArray(data) ? data as AggregatedLabelCount[] : [];
        
        // Filter to only include our specific labels
        const filteredData = chartData.filter(item => 
          availableLabels.includes(item.label) || 
          (item.label !== 'miscellaneous' && !availableLabels.includes(item.label))
        );
        
        setChartData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load chart data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRepo, toast]);

  const toggleLabel = (label: string) => {
    setShowLabels(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const convertToCSV = (data: PRDetails[]) => {
    const headers = ['Month', 'MonthKey', 'Label', 'LabelType', 'Repo', 'PRNumber', 'PRLink', 'Author', 'Title', 'CreatedAt'];
    const rows = data?.map(pr => [
      pr.MonthKey ? new Date(pr.MonthKey + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }) : '',
      pr.MonthKey || '',
      pr.Label || '',
      pr.LabelType || '',
      pr.Repo || '',
      pr.PRNumber || '',
      pr.PRLink || '',
      pr.Author || '',
      `"${(pr.Title || '').replace(/"/g, '""')}"`, // Escape quotes in title
      pr.CreatedAt ? new Date(pr.CreatedAt).toISOString() : ''
    ]);
  
    return [headers, ...rows]?.map(row => row.join(',')).join('\n');
  };

  const handleDownload = async () => {
    setLoading(true);
    
    try {
      // Fetch detailed PR data using the same API as PrLabels.tsx
      const params = new URLSearchParams({
        repo: selectedRepo,
        mode: 'detail',
        labelType: 'githubLabels',
      }).toString();
      
      const response = await fetch(`/api/pr-details?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch PR details: ${response.status}`);
      }
      
      const prData = await response.json();
      const prDetails = Array.isArray(prData) ? prData as PRDetails[] : [];
      
      // Filter PRs that have labels matching our selected labels
      const filteredPRs = prDetails.filter(pr => {
        const label = pr.Label || '';
        return showLabels[label] || (showLabels.miscellaneous && !availableLabels.includes(label));
      });

      if (filteredPRs.length === 0) {
        toast({
          title: 'No data to download',
          description: 'No PRs match the currently selected labels',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const csvData = convertToCSV(filteredPRs);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedRepo}-pr-details-${new Date().toISOString().split('T')[0]}.csv`;
      document.body?.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download successful',
        description: `Downloaded ${filteredPRs.length} PR records`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Could not download PR data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
      if (!Array?.isArray(chartData)) return null;
  
      const transformedData = chartData?.reduce<{
        [key: string]: { [key: string]: number };
      }>((acc, { monthYear, label, count }) => {
        // Determine the actual label to use
        let effectiveLabel = label;
        
        // If the label isn't in availableLabels AND miscellaneous is enabled in showLabels
        if (!availableLabels.includes(label) && showLabels.miscellaneous) {
          effectiveLabel = 'miscellaneous';
        }
        
        // Only process if the effective label is enabled in showLabels
        if (showLabels[effectiveLabel]) {
          if (!acc[monthYear]) {
            acc[monthYear] = {};
          }
          acc[monthYear][effectiveLabel] = (acc[monthYear][effectiveLabel] || 0) + count;
        }
        
        return acc;
      }, {});

      console.log("transformed data:",transformedData);
  
      // Convert to array format for the chart
      const finalData = Object?.keys(transformedData).flatMap(monthYear => {
        const monthData = transformedData[monthYear];
        return Object?.keys(monthData)
          ?.filter(label => showLabels[label])
          ?.map(label => ({
            monthYear,
            type: label,
            count: monthData[label]
          }));
      });
  
      // Sort data by monthYear
      const sortedData = finalData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  
      // Define colors for different label categories
      const getColor = (type: string) => {
        if (type.startsWith('a-')) return '#FFA500'; // Orange for author-related
        if (type.startsWith('e-')) return '#4169E1'; // Royal blue for editor-related
        if (type.startsWith('w-')) return '#FF6347'; // Tomato for waiting-related
        if (type.startsWith('c-')) return '#32CD32'; // Lime green for creation-related
        if (type.startsWith('s-')) return '#9370DB'; // Medium purple for status-related
        if (type.startsWith('t-')) return '#20B2AA'; // Light sea green for topic-related
        return '#A9A9A9'; // Dark gray for others
      };
  
      const config: ColumnConfig = {
        data: sortedData,
        xField: 'monthYear',
        yField: 'count',
        seriesField: 'type',
        isStack: true,
        color: (datum: any) => {
          const label = datum.type || '';
          
          // Specific colors for our available labels
          if (label === 'a-review') return '#FFA500';  // Orange
          if (label === 'e-review') return '#4169E1';  // Royal Blue  
          if (label === 'e-consensus') return '#1E90FF';  // Dodger Blue
          if (label === 'stagnant') return '#8B008B';  // Dark Magenta
          if (label === 'stale') return '#B22222';  // Fire Brick
          if (label === 'created-by-bot') return '#228B22';  // Forest Green
          if (label === 'miscellaneous') return '#A9A9A9';  // Dark Gray
        
          return '#A9A9A9';  // Default gray for unknown labels
        },
        legend: {
          position: 'top-right',
          itemName: {
            formatter: (text: string) => {
              if (text?.length > 15) return text?.substring(0, 12) + '...';
              return text;
            }
          }
        },
        xAxis: {
          label: {
            autoRotate: false,
            formatter: (text: string) => {
              const [year, month] = text.split('-');
              return `${new Date(Number(year), Number(month) - 1)?.toLocaleString('default', { month: 'short' })} ${year.slice(-2)}`;
            }
          }
        },
        yAxis: {
          label: {
            formatter: (value: string) => `${value}`,
          },
        },
        tooltip: {
          shared: true,
          showMarkers: false,
          customContent: (title: string, items: any[]) => {
            return (
              <div>
                <h3>{title}</h3>
                <ul>
                  {items?.map((item, index) => (
                    <li key={index}>
                      {item.name}: {item?.value}
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
        },
        slider: {
          start: 0,
          end: 1,
        },
        interactions: [
          {
            type: 'active-region',
            enable: false,
          },
        ],
        // columnStyle: {
        //   radius: [4, 4, 0, 0],
        // },
      };
  
      return <Column {...config} />;
    };

  return (
    <Box p={2}>
      <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
        {loading ? (
          <Box textAlign="center" py={10}>Loading chart data...</Box>
        ) : (
          <>
            <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          align="center" 
          gap={6} 
          mb={6}
        >
          {/* Title on the left */}
          <Heading size="md" color="black" flexShrink={0}>PRs Label Distribution
            <CopyLink link={`https://eipsinsight.com//Analytics#EIPsLabelChart`} />
          </Heading>
          
          {/* Controls on the right */}
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={6}>
            {/* Repo Selector */}
            <Box minW="200px">
              {/* <Heading size="sm" color="black" mb={2} textAlign="center">Repo</Heading> */}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  colorScheme="blue"
                  size="md"
                  width="200px"
                >
                  {selectedRepo === 'eip' ? 'EIPs' : 
                   selectedRepo === 'erc' ? 'ERCs' : 
                   selectedRepo === 'rip' ? 'RIPs' : 'Select Type'}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSelectedRepo('eip')}>EIPs</MenuItem>
                  <MenuItem onClick={() => setSelectedRepo('erc')}>ERCs</MenuItem>
                  <MenuItem onClick={() => setSelectedRepo('rip')}>RIPs</MenuItem>
                </MenuList>
              </Menu>
            </Box>

            {/* Labels Selector */}
            <Box minW="200px">
              {/* <Heading size="sm" mb={2} color="black" textAlign="center">Labels</Heading> */}
              <Menu closeOnSelect={false}>
  <MenuButton
    as={Button}
    rightIcon={<ChevronDownIcon />}
    colorScheme="blue"
    size="md"
    width="200px"
  >
    Labels
  </MenuButton>
  <MenuList maxHeight="300px" overflowY="auto">
    {/* Select All / Remove All Actions */}
    <Flex px={3} py={2} borderBottomWidth="1px" borderColor="gray.200">
      <Button 
        size="sm" 
        variant="ghost" 
        colorScheme="blue"
        onClick={() => {
          const allSelected: Record<string, boolean> = {};
          availableLabels?.forEach(label => {
            allSelected[label] = true;
          });
          setShowLabels(allSelected);
        }}
        mr={2}
      >
        Select All
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        colorScheme="red"
        onClick={() => {
          const noneSelected: Record<string, boolean> = {};
          availableLabels?.forEach(label => {
            noneSelected[label] = false;
          });
          setShowLabels(noneSelected);
        }}
      >
        Remove All
      </Button>
    </Flex>
    
    {/* Labels List */}
    {availableLabels?.map(label => (
      <MenuItem key={label} closeOnSelect={false}>
        <Checkbox
          isChecked={showLabels[label]}
          onChange={() => toggleLabel(label)}
          colorScheme="blue"
          flex="1"
        >
          {label}
        </Checkbox>
      </MenuItem>
    ))}
  </MenuList>
</Menu>
            </Box>
            <Button 
              colorScheme="blue" 
              leftIcon={<DownloadIcon />} 
              onClick={handleDownload}
              size="md"
            >
              Download PR Data
            </Button>
          </Flex>
        </Flex>
            {renderChart()}
          </>
        )}
      </Box>
    </Box>
  );
};

export default EipsLabelChart;