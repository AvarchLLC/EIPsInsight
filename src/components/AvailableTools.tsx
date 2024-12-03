import { Box, Grid, Flex, Text, Heading, Link, Image, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface ToolCardProps {
  imageSrc: string;
  label: string;
  link: string;
  size: "small" | "large";
  layout: "imageLeft" | "imageBottom" | "imageTop" | "imageRight";
}

const ToolCard: FC<ToolCardProps> = ({ imageSrc, label, link, size, layout }) => {
  const bg = useColorModeValue("#F5F5F5", "#171923");
  const cardHeight = size === "large" ? { base: "250px", md: "425px" } : { base: "200px", md: "200px" };

  const flexDirection: { base: 'column' | 'column-reverse'; md: 'row' | 'row-reverse' | 'column' | 'column-reverse' } = {
    base: "column-reverse",
    md: layout === "imageLeft" ? "row" :
        layout === "imageBottom" ? "column-reverse" :
        layout === "imageTop" ? "column" :
        "row-reverse"
  };

  return (
    <Link href={link} _hover={{ textDecoration: "none" }}>
      <Box
        border="2px solid"
        borderColor="#30A0E0"
        borderRadius="xl"
        p={10}  // Apply padding to the entire card
        height={cardHeight}
        display="flex"
        flexDirection={flexDirection}
        alignItems="center"
        justifyContent="center"
        bg={bg}
        transition="all 0.3s"
        _hover={{
          bg: "#E0F7FA",
          transform: "scale(1.05)",
          shadow: "lg",
        }}
        textAlign="center"
        color="#30A0E0"
        overflow="hidden"
      >
        <Image 
          src={imageSrc} 
          boxSize={
            label === "Editors Leaderboard" 
              ? { base: "100px", md: "150px" }  // Smaller size for "Editors Leaderboard"
              : size === "large" 
              ? { base: "200px", md: "300px" } 
              : { base: "100px", md: "150px"  }
          }
          objectFit="cover" 
          mb={{ base: 4, md: layout === "imageBottom" ? 4 : 0 }} 
          mr={{ md: layout === "imageRight" ? 4 : 0 }} 
        />
        <Text 
          fontSize={{ base: "lg", md: "2xl" }} 
          fontWeight="bold"
          maxWidth="100%" 
          overflowWrap="break-word"
          // pt={label === "Editors Leaderboard" ? 2 : 0}  // Add padding-top if label matches
        >
          {label}
        </Text>

      </Box>
    </Link>
  );
};


const ToolsSection: FC = () => {
  const headingColorLight = "#333";
  const headingColorDark = "#F5F5F5";

  const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";
  const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";

  return (
    <Box  textAlign="center" bg="rgba(0, 0, 0, 0.5)" borderRadius="md" padding={5} boxShadow="md">
      <Flex
        direction={{ base: "column", lg: "row" }}
        mb={1}
        mx="auto" // Centers the Flex container
        maxW="1200px" // Ensures the Flex container doesn't exceed the width of the grid
        w="100%" // Ensures it takes the full width up to the maxW
      >
        <Box flex="1" textAlign="left" p={4}>
          <Heading
            color={useColorModeValue(headingColorLight, headingColorDark)}
            fontWeight="bold"
            fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
            textAlign="center"
            textShadow={useColorModeValue("none", "0 2px 5px rgba(0, 0, 0, 0.3)")}
            letterSpacing="wide"
            bgGradient={useColorModeValue(headingBgGradientLight, headingBgGradientDark)}
            bgClip="text"
            mb={6}
          >
            Our Tools
          </Heading>
        </Box>
        <Box flex="3">
          <ToolCard imageSrc="/DashboardCard1.png" label="Analytics" link="/Analytics" size="small" layout="imageLeft" />
        </Box>
      </Flex>

      <Grid
  templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
  gap={6}
  mx="auto"
  maxW="1200px"
>
  {/* Left Div: Three Cards */}
  <Grid templateRows={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
      <ToolCard 
        imageSrc="/DashboardCard2.png" 
        label="Editors Leaderboard" 
        link="/Reviewers" 
        size="small" 
        layout="imageBottom" 
      />
      <ToolCard 
        imageSrc="/DashboardCard3.png" 
        label="Boards" 
        link="/boards" 
        size="small" 
        layout="imageBottom" 
      />
    </Grid>
    <ToolCard 
      imageSrc="/DashboardCard5.png" 
      label="All EIPs" 
      link="/all" 
      size="small" 
      layout="imageLeft" 
    />
  </Grid>

  {/* Right Div: Single Large Card, only displayed on larger screens */}
  <Box
    display={{ base: "none", lg: "block" }} 
    gridColumn={{ base: "1", lg: "auto" }} 
    mt={{ base: 0, lg: 0 }}
    minHeight={{ base: "0", lg: "auto" }} // Set to auto on larger screens
  >
    <ToolCard 
      imageSrc="/DashBoardCard4.png" 
      label="Did you Know" 
      link="/trivia" 
      size="large" 
      layout="imageBottom" 
    />
  </Box>
</Grid>

    </Box>
  );
};

export default ToolsSection;
