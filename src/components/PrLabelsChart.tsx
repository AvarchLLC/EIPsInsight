import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Menu, MenuList, MenuItem, MenuButton, Button, Flex, useToast } from '@chakra-ui/react';
import { ColumnConfig } from '@ant-design/plots';
import dynamic from "next/dynamic";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import CopyLink from './CopyLink';

const Column = dynamic(() => import("@ant-design/plots").then(mod => mod.Column), { ssr: false });

interface LabelData {
  _id: string;
  category: string;
  monthYear: string;
  type: string;
  count: number;
}

interface PRDetails {
  repo: string;
  prNumber: number;
  prTitle: string;
  labels: string[];
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
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
  const [chartData, setChartData] = useState<LabelData[]>([]);
  const [prDetails, setPrDetails] = useState<PRDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState('eips');
  const [showLabels, setShowLabels] = useState<Record<string, boolean>>(
    availableLabels.reduce((acc, label) => ({ ...acc, [label]: true }), {})
  );
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chartResponse, prResponse] = await Promise.all([
          fetch(`/api/eipslabelchart/${selectedRepo}`),
          fetch(`/api/${selectedRepo}prdetails2`)
        ]);
        
        const chartData = await chartResponse.json();
        const prData = await prResponse.json();
        
        setChartData(chartData);
        setPrDetails(prData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load chart or PR details data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
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
    const headers = ['Repo', 'PR Number', 'PR Title', 'Labels', 'Created At', 'Closed At', 'Merged At'];
    const rows = data.map(pr => [
      pr.repo,
      pr.prNumber,
      `"${pr.prTitle.replace(/"/g, '""')}"`, // Escape quotes in title
      `"${pr.labels.join(', ')}"`, // Wrap labels in quotes
      pr.created_at,
      pr.closed_at || '',
      pr.merged_at || ''
    ]);
  
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleDownload = () => {
    // Filter PRs that have at least one of the selected labels
    const filteredPRs = prDetails.filter(pr => 
      pr.labels.some(label => showLabels[label])
    );

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

    // Create CSV data
    // const csvData = convertToCSV(filteredPRs);
    const csvData = convertToCSV(filteredPRs);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRepo}-pr-details-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
      if (!Array.isArray(chartData)) return null;
  
      // Transform data to group by monthYear and count by label
      // const transformedData = chartData.reduce<{
      //   [key: string]: { [key: string]: number };
      // }>((acc, { monthYear, type, count }) => {
      //   if (showLabels[type]) {
      //     if (!acc[monthYear]) {
      //       acc[monthYear] = {};
      //     }
      //     acc[monthYear][type] = (acc[monthYear][type] || 0) + count;
      //   }
      //   return acc;
      // }, {});

      const transformedData = chartData.reduce<{
        [key: string]: { [key: string]: number };
      }>((acc, { monthYear, type, count }) => {
        // Determine the actual type to use
        let effectiveType = type;
        
        // If the type isn't in availableLabels AND miscellaneous is enabled in showLabels
        if (!availableLabels.includes(type) && showLabels.miscellaneous) {
          effectiveType = 'miscellaneous';
        }
        
        // Only process if the effective type is enabled in showLabels
        if (showLabels[effectiveType]) {
          if (!acc[monthYear]) {
            acc[monthYear] = {};
          }
          acc[monthYear][effectiveType] = (acc[monthYear][effectiveType] || 0) + count;
        }
        
        return acc;
      }, {});

      console.log("transformed data:",transformedData);
  
      // Convert to array format for the chart
      const finalData = Object.keys(transformedData).flatMap(monthYear => {
        const monthData = transformedData[monthYear];
        return Object.keys(monthData)
          .filter(label => showLabels[label])
          .map(label => ({
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
          
          // Core categories
          if (label.startsWith('a-')) return '#FFA500';  // Orange - Review
          if (label.startsWith('e-')) {
            if (label === 'e-review') return '#4169E1';  // Royal Blue
            if (label === 'e-consensus') return '#1E90FF';  // Dodger Blue
            if (label === 'e-blocked') return '#4682B4';  // Steel Blue
            if (label === 'e-blocking') return '#5F9EA0';  // Cadet Blue
            if (label === 'e-circular') return '#00BFFF';  // Deep Sky Blue
            if (label === 'e-number') return '#87CEFA';  // Light Sky Blue
            return '#4169E1';  // Default e- color
          }
          if (label.startsWith('w-')) {
            if (label === 'w-response') return '#FF6347';  // Tomato
            if (label === 'w-ci') return '#CD5C5C';  // Indian Red
            if (label === 'w-stale') return '#DC143C';  // Crimson
            if (label === 'w-dependency') return '#FF4500';  // Orange Red
            return '#FF6347';  // Default w- color
          }
          if (label.startsWith('c-')) {
            if (label === 'c-new') return '#32CD32';  // Lime Green
            if (label === 'c-status') return '#3CB371';  // Medium Sea Green
            if (label === 'c-update') return '#2E8B57';  // Sea Green
            return '#32CD32';  // Default c- color
          }
          if (label.startsWith('s-')) {
            if (label === 's-draft') return '#9370DB';  // Medium Purple
            if (label === 's-final') return '#8A2BE2';  // Blue Violet
            if (label === 's-lastcall') return '#9932CC';  // Dark Orchid
            if (label === 's-review') return '#BA55D3';  // Medium Orchid
            if (label === 's-stagnant') return '#800080';  // Purple
            if (label === 's-withdrawn') return '#D8BFD8';  // Thistle
            return '#9370DB';  // Default s- color
          }
          if (label.startsWith('t-')) {
            if (label === 't-core') return '#20B2AA';  // Light Sea Green
            if (label === 't-erc') return '#48D1CC';  // Medium Turquoise
            if (label === 't-informational') return '#40E0D0';  // Turquoise
            if (label === 't-interface') return '#00CED1';  // Dark Turquoise
            if (label === 't-meta') return '#008B8B';  // Dark Cyan
            if (label === 't-networking') return '#5F9EA0';  // Cadet Blue
            if (label === 't-process') return '#66CDAA';  // Medium Aquamarine
            if (label === 't-security') return '#7FFFD4';  // Aquamarine
            return '#20B2AA';  // Default t- color
          }
          if (label.startsWith('r-')) {
            if (label === 'r-ci') return '#FF69B4';  // Hot Pink
            if (label === 'r-eips') return '#DB7093';  // Pale Violet Red
            if (label === 'r-other') return '#FF1493';  // Deep Pink
            if (label === 'r-process') return '#C71585';  // Medium Violet Red
            if (label === 'r-website') return '#FFC0CB';  // Pink
            return '#FF69B4';  // Default r- color
          }
        
          // Standalone labels
          if (label === 'bug') return '#FF0000';  // Red
          if (label === 'enhancement') return '#00FF00';  // Lime
          if (label === 'dependencies') return '#FFFF00';  // Yellow
          if (label === 'stagnant') return '#8B008B';  // Dark Magenta
          if (label === 'stale') return '#B22222';  // Fire Brick
          if (label === 'created-by-bot') return 'green';  // Light Gray
          if (label === 'discussions-to') return '#778899';  // Light Slate Gray
          if (label === 'question') return '#98FB98';  // Pale Green
          if (label === 'javascript') return '#F0E68C';  // Khaki
          if (label === 'ruby') return '#E9967A';  // Dark Salmon
          if (label === 'unlabeled') return '#A9A9A9';  // Dark Gray
          if (label === '1272989785') return '#000000';  // Black
        
          return '#A9A9A9';  // Default gray for unknown labels
        },
        legend: {
          position: 'top-right',
          itemName: {
            formatter: (text: string) => {
              if (text.length > 15) return text.substring(0, 12) + '...';
              return text;
            }
          }
        },
        xAxis: {
          label: {
            autoRotate: false,
            formatter: (text: string) => {
              const [year, month] = text.split('-');
              return `${new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short' })} ${year.slice(-2)}`;
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
                      {item.name}: {item.value}
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
          <Heading size="md" color="black" flexShrink={0}>EIPs Label Distribution
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
                  {selectedRepo === 'eips' ? 'EIPs' : 
                   selectedRepo === 'ercs' ? 'ERCs' : 'Select Type'}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSelectedRepo('eips')}>EIPs</MenuItem>
                  <MenuItem onClick={() => setSelectedRepo('ercs')}>ERCs</MenuItem>
                  {/* <MenuItem onClick={() => setSelectedRepo('rips')}>RIPs</MenuItem> */}
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
          availableLabels.forEach(label => {
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
          availableLabels.forEach(label => {
            noneSelected[label] = false;
          });
          setShowLabels(noneSelected);
        }}
      >
        Remove All
      </Button>
    </Flex>
    
    {/* Labels List */}
    {availableLabels.map(label => (
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