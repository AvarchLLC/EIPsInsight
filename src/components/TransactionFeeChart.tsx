import { Box, Text, useColorModeValue, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Line chart to avoid SSR issues
const Line = dynamic(() => import("@ant-design/plots").then((mod) => mod.Line), { ssr: false });

// Define the data types
type DataType = "fee" | "priorityFee" | "gasUsed" | "gasBurnt";

const TransactionFeeChart = ({ data, data1, data2, data3 }: { data: any[], data1: any[], data2: any[], data3: any[] }) => {
  if (!data || data.length === 0) return null;

  const textColor = useColorModeValue("white", "white");
  const buttonBg = useColorModeValue("rgba(159, 122, 234, 0.2)", "rgba(159, 122, 234, 0.1)");
  const activeButtonBg = useColorModeValue("rgba(159, 122, 234, 0.5)", "rgba(159, 122, 234, 0.3)");
  const buttonHoverBg = useColorModeValue("rgba(159, 122, 234, 0.3)", "rgba(159, 122, 234, 0.2)");

  // State for controlling the selected data type
  const [dataType, setDataType] = useState<DataType>("fee");

  // State for controlling the slider value
  const [sliderValue, setSliderValue] = useState(0); // Initial value

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
    smooth: true,
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
        console.log("Slider moved to:", value); // Optional: Perform actions after sliding stops
      },
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        const item = items?.[0];
        return (
          <Box bg="white" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
            <Text color="black">Time: {title}</Text>
            <Text color="black">Block: {item?.data?.block}</Text>
            <Text color="black">{getDisplayName(dataType)}: {item?.value} Gwei</Text>
          </Box>
        );
      },
    },
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" m={20}>
      <Text
        fontSize={20}
        fontWeight="bold"
        mb={4}
        color={textColor}
        textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"
      >
        {getDisplayName(dataType)} vs Time
      </Text>

      {/* Tabs for selecting data type */}
      <Flex mb={4} gap={2} wrap="wrap">
        <Flex mb={4} gap={4} wrap="wrap">
          {(["fee", "priorityFee", "gasUsed", "gasBurnt"] as DataType[]).map((type) => (
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
      <br/>

      {/* Render the Line chart with the provided config */}
      <Box width="100%" height={300}>
        <Line {...chartConfig} />
      </Box>
    </Box>
  );
};

export default TransactionFeeChart;