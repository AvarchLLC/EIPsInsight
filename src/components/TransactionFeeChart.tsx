import { Box, Text, useColorModeValue, Flex, Button, Heading, Collapse, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { convertGweiToUSD } from "./ethereumService";
import CalendarHeatmap from 'react-calendar-heatmap';
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

// Dynamically import the Line chart to avoid SSR issues
const Line = dynamic(() => import("@ant-design/plots").then((mod) => mod.Line), { ssr: false });

// Define the data types
type DataType = "fee" | "priorityFee" | "gasUsed" | "gasBurnt";

const TransactionFeeChart = ({ data, data1, data2, data3, ethPriceInUSD }: { data: any[], data1: any[], data2: any[], data3: any[], ethPriceInUSD: number }) => {
  if (!data || data?.length === 0) return null;

  const textColor = useColorModeValue("white", "white");
  const buttonBg = useColorModeValue("rgba(159, 122, 234, 0.2)", "rgba(159, 122, 234, 0.1)");
  const activeButtonBg = useColorModeValue("rgba(159, 122, 234, 0.5)", "rgba(159, 122, 234, 0.3)");
  const buttonHoverBg = useColorModeValue("rgba(159, 122, 234, 0.3)", "rgba(159, 122, 234, 0.2)");
  const [sliderValue, setSliderValue] = useState(0.98); 

  // State for controlling the selected data type
  const [dataType, setDataType] = useState<DataType>("fee");

  // State for controlling the collapse of the FAQ section
  const [show, setShow] = useState(false);

  const toggleCollapse = () => setShow(!show);

  // Get the selected data based on the data type
  const getSelectedData = () => {
    switch (dataType) {
      case "fee":
        return data;
      case "priorityFee":
        return data1;
      case "gasUsed":
        return data2;
      case "gasBurnt":
        return data3;
      default:
        return data;
    }
  };

  // Sort data in increasing timestamp order
  const sortedData = [...getSelectedData()].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()).reverse();

  // Get the display name for the selected data type
  const getDisplayName = (type: DataType) => {
    switch (type) {
      case "fee":
        return "Base Fee";
      case "priorityFee":
        return "Priority Fee";
      case "gasUsed":
        return "Gas Used";
      case "gasBurnt":
        return "Gas Burnt";
      default:
        return "Base Fee";
    }
  };

  const generateHeatmapData = () => {
    const now = new Date();
    const heatmapData = [];

    // Function to convert 12-hour format to 24-hour format
    const convertTo24Hour = (timeStr: string) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes, seconds] = time.split(":")?.map(Number);

        if (modifier.toLowerCase() === "pm" && hours !== 12) {
            hours += 12;
        } else if (modifier.toLowerCase() === "am" && hours === 12) {
            hours = 0;
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // Normalize sortedData timestamps to Date objects
    const normalizedData = sortedData?.map((d) => {
        const formattedTime = convertTo24Hour(d.time); // Convert 12-hour to 24-hour
        const dateObj = new Date(`${now.toISOString().split("T")[0]}T${formattedTime}`); // Parse correctly
        return {
            ...d,
            time: dateObj.getTime(), // Convert to timestamp
        };
    });

    for (let i = 0; i < 20; i++) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000); // Current hour minus i hours
        const hourStart = new Date(hour).setMinutes(0, 0, 0); // Start of the hour
        const hourEnd = hourStart + 60 * 60 * 1000; // End of the hour

        // Filter data for the current hour
        const hourData = normalizedData?.filter((d) => d.time >= hourStart && d.time < hourEnd);

        // Calculate the average for the selected dataType
        const avgValue =
            hourData?.length > 0
                ? hourData?.reduce((acc, curr) => acc + curr[dataType], 0) / hourData?.length
                : 0; // Default to 0 if no data for the hour

        heatmapData.push({
            date: new Date(hourStart).toISOString().split('T')[0], // Use date for calendar heatmap
            count: avgValue,
        });
    }

    return heatmapData.reverse();
  };

  const heatmapData = generateHeatmapData();

  // Chart configuration for @ant-design/plots
  const chartConfig = {
    data: sortedData,
    xField: "time",
    yField: dataType, // Dynamically set the yField based on the selected data type
    color: "#8884d8",
    lineStyle: {
      stroke: "#8884d8",
      lineWidth: 2,
    },
    slider: {
      start: sliderValue, // Set the start value from the state
      end: 1, // End of the slider
      step: 0.01, // Define the step value for the slider
      min: 0, // Minimum value for the slider
      max: 1, // Maximum value for the slider
      onChange: (value: number) => {
        setSliderValue(value); // Update state when slider value changes
      },
      onAfterChange: (value: number) => {
        console.log('Slider moved to:', value); // Optional: Perform actions after sliding stops
      },
    },
    smooth: true,
    tooltip: {
      customContent: (title: string, items: any[]) => {
        const item = items?.[0];
        return (
          <Box bg="white" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
            <Text color="black">Time: {title}</Text>
            <Text color="black">Block: {item?.data?.block}</Text>
            <Text color="black">{getDisplayName(dataType)}: {item?.value} Gwei ({convertGweiToUSD(item?.value, ethPriceInUSD)}$)</Text>
          </Box>
        );
      },
    },
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" m={20}>
      <Box
            pl={4}
            bg={"white"}
            borderRadius="5"
            pr="8px"
            paddingLeft="20px"
            marginBottom={2}
            pb="15px"
          >
            <Flex justify="space-between" align="center">
              <Heading
                as="h3"
                size="lg"
                marginBottom={4}
                color={useColorModeValue("#3182CE", "blue.300")}
              > Transaction fee Chart FAQ
              </Heading>
              <Box
        bg="blue" // Gray background
        borderRadius="md" // Rounded corners
        padding={2} // Padding inside the box
      >
        <IconButton
          onClick={toggleCollapse}
          icon={show ? <ChevronUpIcon boxSize={8} color="white" /> : <ChevronDownIcon boxSize={8} color="white" />}
          variant="ghost"
          h="24px" // Smaller height
           w="20px"
          aria-label="Toggle Instructions"
         bg="blue"
        />
      </Box>
            </Flex>
      
            <Collapse in={show}>
  <Heading
    as="h4"
    size="md"
    marginBottom={4}
    color={useColorModeValue("#3182CE", "blue.300")}
  >
    How to calculate the gas for a transaction?
  </Heading>
  <Text
    fontSize="md"
    marginBottom={2}
    color={useColorModeValue("gray.800", "gray.200")}
    className="text-justify"
  >
    The total gas cost for a transaction depends on three factors:
    <br />
    1. <strong>Gas Limit</strong>: The maximum amount of gas you're willing to spend. Simple ETH transfers use 21,000 gas, while smart contract interactions can use 100,000–500,000 gas or more.
    <br />
    2. <strong>Base Fee</strong>: The minimum gas price required to include your transaction in a block. This fluctuates based on network demand.
    <br />
    3. <strong>Priority Fee (Tip)</strong>: An additional amount paid to miners to prioritize your transaction.
    <br />
    <br />
    The total gas cost is calculated as:
    <br />
    <strong>Total Gas Cost = (Base Fee + Priority Fee) * Gas Limit</strong>
    <br />
    <br />
    For example, if the base fee is 10 Gwei, the priority fee is 2 Gwei, and the gas limit is 21,000, the total gas cost would be:
    <br />
    <strong>(10 + 2) * 21,000 = 252,000 Gwei = 0.000252 ETH</strong>
    <br />
    At an ETH price of $3,000, this would be <strong>$0.756</strong>.
  </Text>

  <Heading
    as="h4"
    size="md"
    marginBottom={4}
    color={useColorModeValue("#3182CE", "blue.300")}
  >
    Why do transactions often cost $3–$4 or more?
  </Heading>
  <Text
    fontSize="md"
    marginBottom={2}
    color={useColorModeValue("gray.800", "gray.200")}
    className="text-justify"
  >
    Transactions often cost $3–$4 or more because:
    <br />
    1. <strong>Complex Transactions</strong>: Interacting with smart contracts (e.g., swapping tokens or minting NFTs) requires more gas (e.g., 100,000–500,000 gas units).
    <br />
    2. <strong>Network Congestion</strong>: During high demand, the base fee can spike (e.g., 50–100 Gwei or more).
    <br />
    3. <strong>Priority Fees</strong>: To ensure fast processing, you may need to pay a higher priority fee (e.g., 5–10 Gwei).
    <br />
    <br />
    For example, a transaction with a base fee of 50 Gwei, a priority fee of 5 Gwei, and a gas limit of 100,000 would cost:
    <br />
    <strong>(50 + 5) * 100,000 = 5,500,000 Gwei = 0.0055 ETH</strong>
    <br />
    At an ETH price of $3,000, this would be <strong>$16.50</strong>.
  </Text>
</Collapse>
      
           
          </Box>
      

      <Text
        fontSize={20}
        fontWeight="bold"
        mb={4}
        color={textColor}
        textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"
      >
        {getDisplayName(dataType)} Trend
      </Text>

      {/* Tabs for selecting data type */}
      <Flex mb={4} gap={2} wrap="wrap">
        <Flex mb={4} gap={4} wrap="wrap">
          {(["fee", "priorityFee", "gasUsed", "gasBurnt"] as DataType[])?.map((type) => (
            <Button
              key={type}
              onClick={() => setDataType(type)}
              bg={dataType === type ? activeButtonBg : buttonBg}
              color={textColor}
              borderRadius="full" // Fully rounded corners for a pill-like shape
              _hover={{
                bg: buttonHoverBg,
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-in-out",
              }}
              _active={{
                bg: activeButtonBg,
              }}
              textShadow="0 0 10px rgba(159, 122, 234, 0.8)"
              boxShadow="0 0 10px rgba(159, 122, 234, 0.5)"
              fontSize={15} // Increased font size
              px={6} // Horizontal padding for better spacing
              py={3} // Vertical padding for better spacing
            >
              {getDisplayName(type)}
            </Button>
          ))}
        </Flex>
      </Flex>
      <br />

      {/* Render the Line chart with the provided config */}
      <Box width="100%" height={300}>
        <Line {...chartConfig} />
      </Box>

      {/* Render the Heatmap */}
      {/* <Box width="100%" mt={10}>
        <Text fontSize={16} fontWeight="bold" mb={2} color={textColor}>
          Hourly Averages (Past 20 Hours)
        </Text>
        <Box sx={{
          '.react-calendar-heatmap': {
            width: '100%',
            height: '50px', // Make the heatmap compact
          },
          '.react-calendar-heatmap .color-empty': {
            fill: '#f0f0f0', // Light gray for empty cells
          },
          '.react-calendar-heatmap .color-scale-0': {
            fill: '#d6e685', // Light green for low values
          },
          '.react-calendar-heatmap .color-scale-1': {
            fill: '#8cc665', // Medium green for medium values
          },
          '.react-calendar-heatmap .color-scale-2': {
            fill: '#44a340', // Dark green for high values
          },
          '.react-calendar-heatmap .color-scale-3': {
            fill: '#1e6823', // Very dark green for very high values
          },
        }}>
          <CalendarHeatmap
            startDate={new Date(new Date().setDate(new Date().getDate() - 20))}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) {
                return 'color-empty';
              }
              return `color-scale-${Math.min(Math.floor(value.count / 10), 4)}`;
            }}
            showWeekdayLabels={false} // Hide weekday labels for compactness
            horizontal // Display in a single row
          />
        </Box>
      </Box> */}
    </Box>
  );
};

export default TransactionFeeChart;