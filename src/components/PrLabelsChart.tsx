import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Menu, MenuList, MenuItem, MenuButton, Button, Flex, useToast, useColorModeValue } from '@chakra-ui/react';
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

// Initial set of common labels - will be updated dynamically from API
const initialLabels = [
  'a-review',
  'e-review',
  'e-consensus',
  'stagnant',
  'stale',
  'created-by-bot',
  'c-update',
  'c-new-eip',
  'w-review',
  'w-author',
  's-draft',
  's-review',
  's-final',
  'miscellaneous'
];

const EipsLabelChart = () => {
  const [chartData, setChartData] = useState<AggregatedLabelCount[]>([]);
  const [availableLabels, setAvailableLabels] = useState<string[]>(initialLabels);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState('eip');
  const [showLabels, setShowLabels] = useState<Record<string, boolean>>(
    initialLabels?.reduce((acc, label) => ({ ...acc, [label]: true }), {})
  );
  const toast = useToast();

  // Dark mode color values
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const loadingBg = useColorModeValue("gray.50", "gray.700");
  const loadingText = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        
        // Fetch detailed PR data with labels to avoid double counting
        const response = await fetch(
          `/api/AnalyticsCharts/pr-details/${selectedRepo}?labelType=githubLabels`, 
          { signal: controller.signal }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        const data = result.data || [];
        
        console.log("Raw API data sample:", data.slice(0, 3));
        
        // Process data to avoid double counting PRs with multiple labels
        const processedData = new Map<string, Set<number>>(); // monthYear-label -> Set of PR numbers
        const allLabels = new Set<string>();
        
        // Group by month-label and collect unique PR numbers
        data.forEach((item: any) => {
          const { monthYear, label, prNumber } = item;
          const key = `${monthYear}-${label}`;
          
          allLabels.add(label);
          
          if (!processedData.has(key)) {
            processedData.set(key, new Set());
          }
          processedData.get(key)!.add(prNumber);
        });
        
        // Convert to chart format with unique counts
        const transformedData: AggregatedLabelCount[] = [];
        processedData.forEach((prNumbers, key) => {
          const [monthYear, label] = key.split('-');
          transformedData.push({
            monthYear,
            label,
            count: prNumbers.size, // Count unique PRs, not label instances
            labelType: 'githubLabels',
            prNumbers: Array.from(prNumbers)
          });
        });
        
        // Update available labels from processed data
        const uniqueLabels = Array.from(allLabels).sort();
        setAvailableLabels(uniqueLabels);
        
        // Update showLabels state to include new labels
        setShowLabels(prevState => {
          const newState = { ...prevState };
          uniqueLabels.forEach((label: string) => {
            if (!(label in newState)) {
              newState[label] = true; // Show new labels by default
            }
          });
          return newState;
        });
        
        setChartData(transformedData);
        
        // Debug: Log the processed data
        console.log(`📊 Processed ${transformedData.length} unique label-month combinations`);
        console.log("Sample processed data:", transformedData.slice(0, 5));
        
        const monthYears = transformedData.map(item => item.monthYear).sort();
        const earliestMonth = monthYears[0];
        const latestMonth = monthYears[monthYears.length - 1];
        console.log(`📊 Data range: ${earliestMonth} to ${latestMonth}`);
        
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
      // Get selected labels for filtering
      const selectedLabels = availableLabels.filter(label => showLabels[label]);
      
      if (selectedLabels.length === 0) {
        toast({
          title: 'No labels selected',
          description: 'Please select at least one label to download data',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      // Create CSV from current chart data
      const csvRows = [];
      const headers = ['Month', 'MonthYear', 'Label', 'Count', 'Repo'];
      csvRows.push(headers.join(','));

      // Filter chart data by selected labels
      const filteredData = chartData.filter(item => showLabels[item.label]);
      
      if (filteredData.length === 0) {
        toast({
          title: 'No data to download',
          description: 'No data matches the currently selected labels',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      filteredData.forEach(item => {
        const monthName = item.monthYear ? 
          new Date(item.monthYear + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }) : 
          '';
        
        const row = [
          monthName,
          item.monthYear || '',
          item.label || '',
          item.count || 0,
          selectedRepo.toUpperCase()
        ];
        csvRows.push(row.join(','));
      });

      const csvData = csvRows.join('\n');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedRepo}-raw-labels-${new Date().toISOString().split('T')[0]}.csv`;
      document.body?.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download successful',
        description: `Downloaded ${filteredData.length} label count records`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Could not download label data',
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
        // Specific colors for common labels
        const colorMap: Record<string, string> = {
          'a-review': '#FFA500',      // Orange
          'e-review': '#4169E1',      // Royal Blue  
          'e-consensus': '#1E90FF',   // Dodger Blue
          'stagnant': '#8B008B',      // Dark Magenta
          'stale': '#B22222',         // Fire Brick
          'created-by-bot': '#228B22', // Forest Green
          'c-update': '#32CD32',      // Lime Green
          'c-new-eip': '#90EE90',     // Light Green
          'w-review': '#FF6347',      // Tomato
          'w-author': '#FF4500',      // Orange Red
          's-draft': '#9370DB',       // Medium Purple
          's-review': '#8A2BE2',      // Blue Violet
          's-final': '#4B0082',       // Indigo
          'miscellaneous': '#A9A9A9'  // Dark Gray
        };

        if (colorMap[type]) return colorMap[type];

        // Fallback: color by prefix
        if (type.startsWith('a-')) return '#FFA500'; // Orange for author-related
        if (type.startsWith('e-')) return '#4169E1'; // Royal blue for editor-related
        if (type.startsWith('w-')) return '#FF6347'; // Tomato for waiting-related
        if (type.startsWith('c-')) return '#32CD32'; // Lime green for creation-related
        if (type.startsWith('s-')) return '#9370DB'; // Medium purple for status-related
        if (type.startsWith('t-')) return '#20B2AA'; // Light sea green for topic-related
        return '#A9A9A9'; // Dark gray for others
      };
  
      // Detect dark mode for chart styling
      const isDarkMode = document?.documentElement?.classList?.contains('chakra-ui-dark') || false;
      const chartTextColor = isDarkMode ? '#E2E8F0' : '#2D3748';
      const chartGridColor = isDarkMode ? '#4A5568' : '#E2E8F0';

      const config: ColumnConfig = {
        data: sortedData,
        xField: 'monthYear',
        yField: 'count',
        seriesField: 'type',
        isStack: true,
        color: (datum: any) => {
          return getColor(datum.type || '');
        },
        legend: {
          position: 'top-right',
          itemName: {
            formatter: (text: string) => {
              if (text?.length > 15) return text?.substring(0, 12) + '...';
              return text;
            },
            style: {
              fill: chartTextColor,
            }
          }
        },
        xAxis: {
          label: {
            autoRotate: false,
            formatter: (text: string) => {
              const [year, month] = text.split('-');
              return `${new Date(Number(year), Number(month) - 1)?.toLocaleString('default', { month: 'short' })} ${year.slice(-2)}`;
            },
            style: {
              fill: chartTextColor,
            }
          },
          line: {
            style: {
              stroke: chartGridColor,
            }
          }
        },
        yAxis: {
          label: {
            formatter: (value: string) => `${value}`,
            style: {
              fill: chartTextColor,
            }
          },
          grid: {
            line: {
              style: {
                stroke: chartGridColor,
                strokeOpacity: 0.5,
              }
            }
          },
          line: {
            style: {
              stroke: chartGridColor,
            }
          }
        },
        tooltip: {
          shared: true,
          showMarkers: false,
          customContent: (title: string, items: any[]) => {
            const isDark = document.documentElement.classList.contains('chakra-ui-dark');
            const tooltipBg = isDark ? '#2D3748' : '#ffffff';
            const tooltipText = isDark ? '#E2E8F0' : '#2D3748';
            const tooltipBorder = isDark ? '#4A5568' : '#E2E8F0';
            
            // Calculate total count for this month
            const totalCount = items?.reduce((sum, item) => sum + (Number(item?.value) || 0), 0);
            
            return `
              <div style="
                background: ${tooltipBg}; 
                color: ${tooltipText};
                border: 1px solid ${tooltipBorder}; 
                border-radius: 6px; 
                padding: 12px; 
                box-shadow: 0 4px 12px rgba(0,0,0,${isDark ? '0.3' : '0.15'});
                min-width: 180px;
              ">
                <div style="
                  font-weight: bold; 
                  margin-bottom: 8px; 
                  color: ${tooltipText};
                  border-bottom: 1px solid ${tooltipBorder};
                  padding-bottom: 6px;
                ">
                  ${title}
                </div>
                <div style="
                  margin-bottom: 8px;
                  padding-bottom: 6px;
                  border-bottom: 1px solid ${tooltipBorder};
                ">
                  <div style="
                    display: flex; 
                    justify-content: space-between; 
                    font-weight: bold;
                    color: ${tooltipText};
                  ">
                    <span>Total:</span>
                    <span style="color: #4299E1;">${totalCount}</span>
                  </div>
                </div>
                <div>
                  ${items?.map(item => `
                    <div style="
                      display: flex; 
                      justify-content: space-between; 
                      padding: 2px 0;
                      color: ${tooltipText};
                    ">
                      <span>${item.name}:</span>
                      <span style="font-weight: 600; margin-left: 8px;">${item?.value}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
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
      <Box bg={bgColor} p={4} borderRadius="md" boxShadow="sm" border="1px solid" borderColor={borderColor}>
        {loading ? (
          <Box textAlign="center" py={10} bg={loadingBg} borderRadius="md">
            <Box color={loadingText} fontSize="md">Loading chart data...</Box>
          </Box>
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
          <Heading size="md" color="blue.500" flexShrink={0}>Github Labels Distribution
            <CopyLink link={`https://eipsinsight.com//Analytics#PrLabelsChart`} />
          </Heading>
          
          {/* Controls on the right */}
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={6}>
            {/* Repo Selector */}
            <Box minW="200px">
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
                <MenuList bg={bgColor} borderColor={borderColor}>
                  <MenuItem onClick={() => setSelectedRepo('eip')} _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}>
                    EIPs
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedRepo('erc')} _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}>
                    ERCs
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedRepo('rip')} _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}>
                    RIPs
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            {/* Labels Selector */}
            <Box minW="200px">
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
                <MenuList maxHeight="300px" overflowY="auto" bg={bgColor} borderColor={borderColor}>
                  {/* Select All / Remove All Actions */}
                  <Flex px={3} py={2} borderBottomWidth="1px" borderColor={borderColor}>
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
                    <MenuItem 
                      key={label} 
                      closeOnSelect={false} 
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    >
                      <Checkbox
                        isChecked={showLabels[label]}
                        onChange={() => toggleLabel(label)}
                        colorScheme="blue"
                        flex="1"
                      >
                        <Box color={textColor}>{label}</Box>
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
              Download Label Data
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