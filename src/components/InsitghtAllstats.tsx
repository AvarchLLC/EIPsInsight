import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import InsightsLeaderboard from "@/components/InsightsLeaderboard";
import InsightsOpenPrsIssues from "@/components/InsightOpenPrsIssues";
import InsightSummary from "@/components/InsightSummaryTable";
import { usePathname } from "next/navigation";
import DateTime from "./DateTime";

const MyComponent = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const path = usePathname();

  let year = "";
  let month = "";

  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3];
  }

  return (
    <Box
  padding="2rem"
  bgColor={bg}
  borderRadius="0.55rem"
  _hover={{
    border: "1px",
    borderColor: "#30A0E0",
  }}
>
  {/* First Row: Insight Summary and Editors Leaderboard */}
  <Flex
    direction={{ base: "column", md: "row" }} // Stack on small screens, side by side on medium and larger screens
    justifyContent="space-between"
    wrap="wrap" // Allow items to wrap on smaller screens
  >
    {/* Left Side: Full-height Insight Summary Table */}
    <Box
      flex="1"
      marginRight={{ base: "0", md: "1rem" }}
      marginBottom={{ base: "1rem", md: "0" }}
    >
      <InsightSummary />
    </Box>

    {/* Right Side: Editors Leaderboard */}
    <Box
      flex="1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {/* First Chart Box with fixed height and heading */}
      <Box
        bgColor={bg}
        padding="1rem"
        borderRadius="0.55rem"
        minHeight="470px" // Set minimum height
        // marginBottom="1rem"
      >
        <Text
          color={"#30A0E0"}
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          // marginBottom="0.5rem"
          paddingTop={5}
          width="100%"
          wordWrap="break-word"
        >
          Editors Leaderboard
        </Text>
        <InsightsLeaderboard /> {/* First chart */}
        
      </Box>
      <Box className={"w-full"}>
              <DateTime />
            </Box>
    </Box>
  </Flex>
  <br/>
  {/* Second Row: Open PRs and Issues */}
  
    <InsightsOpenPrsIssues/> {/* Second chart */}
    
</Box>

  );
};

export default MyComponent;
