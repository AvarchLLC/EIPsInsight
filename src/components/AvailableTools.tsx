import {
  Box,
  Grid,
  Heading,
  Link,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import Header from "./Header";

interface ToolCardProps {
  imageSrc: string;
  label: string;
  link: string;
}

const ToolCard: FC<ToolCardProps> = ({ imageSrc, label, link }) => {
  const bg = useColorModeValue("#F5F5F5", "#171923");

  return (
    <Link href={link} _hover={{ textDecoration: "none" }}>
      <Box
        border="2px solid"
        borderColor="#30A0E0"
        borderRadius="xl"
        p={6}
        height="250px"
        width="100%"
        display="flex"
        flexDirection="column"
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
          boxSize="150px"
          objectFit="contain"
          // mb={4}
        />
        <Text fontSize="2xl" fontWeight="bold" noOfLines={2}>
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
    <div className="py-10" id="ourtools">
     
      <Box
        textAlign="left"
        bg="rgba(0, 0, 0, 0.5)"
        borderRadius="md"
        padding={8}
        boxShadow="md"
        py={4}
      >
        {/* <Heading
          color={useColorModeValue(headingColorLight, headingColorDark)}
          fontWeight="bold"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          textAlign="center"
          textShadow={useColorModeValue("none", "0 2px 5px rgba(0, 0, 0, 0.3)")}
          letterSpacing="wide"
          bgGradient={useColorModeValue(
            headingBgGradientLight,
            headingBgGradientDark
          )}
          bgClip="text"
          mb={6}
        
        >
          Our Tools
        </Heading> */}
         <Header
        title="OUR TOOLS"
        subtitle="Overview"
        description="A high-level overview of Ethereum Standards by Analytics, Editors Leaderboard, Boards,Search by Author,All EIPs, and More Resources.
"
        sectionId="ourtools"
      />

        <Grid
          templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={6}
          justifyContent="center"
          alignItems="center"
          width="100%"
          className="mt-3"
        >
          <ToolCard
            imageSrc="/DashboardCard1.png"
            label="Analytics"
            link="/Analytics"
          />
          <ToolCard
            imageSrc="/DashboardCard2.png"
            label="Editors Leaderboard"
            link="/Reviewers"
          />
          <ToolCard
            imageSrc="/DashboardCard3.png"
            label="Boards"
            link="/boards"
          />
          <ToolCard
            imageSrc="/DashboardCard7.png"
            label="Search by Author"
            link="/authors"
          />
          <ToolCard
            imageSrc="/DashboardCard5.png"
            label="All EIPs"
            link="/all"
          />
          <ToolCard
            imageSrc="/DashBoardCard4.png"
            label="Did you Know"
            link="/trivia"
          />
          <ToolCard
            imageSrc="/DashboardCard6.png"
            label="Feedback Form"
            link="/Feedback"
          />
          <ToolCard
            imageSrc="/dashBoardCard8.png"
            label="More Resources"
            link="/resources"
          />
        </Grid>
      </Box>
    </div>
  );
};

export default ToolsSection;
