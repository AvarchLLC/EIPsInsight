import { Box, Flex, Icon, Text, Heading, Link, BoxProps } from "@chakra-ui/react";
import { FaChartLine, FaList, FaMedal } from "react-icons/fa";
import { FC } from "react";

interface ToolCardProps extends BoxProps {
  icon: FC;
  label: string;
  link: string;
}

const ToolCard: FC<ToolCardProps> = ({ icon, label, link, ...props }) => (
  <Link href={link} _hover={{ textDecoration: "none" }}>
    <Box
      border="2px solid"
      borderColor="blue.500"
      borderRadius="xl"
      p={8} // Increased padding for a larger box
      minWidth="300px"
      maxWidth="350px"
      height="250px" // Fixed height for uniform box sizes
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center" // Center content vertically and horizontally
      bg="transparent"
      transition="all 0.3s"
      _hover={{
        bg: "blue.50",
        transform: "scale(1.05)",
        shadow: "lg",
      }}
      textAlign="center"
      color="blue.600"
      {...props}
    >
      <Icon as={icon} boxSize={12} mb={4} /> {/* Larger icon */}
      <Text fontSize="xl" fontWeight="bold"> {/* Slightly larger font */}
        {label}
      </Text>
    </Box>
  </Link>
);

const ToolsSection: FC = () => (
  <Box py={10} textAlign="center">
    <Heading mb={10} color={"#30A0E0"}
                        fontWeight={"bold"}
                        fontSize={{
                          lg: "4xl",
                          md: "4xl",
                          sm: "4xl",
                          base: "4xl",
                        }}>Our Tools</Heading>
    <Flex
      justify="space-around"
      wrap="wrap"
      gap={6}
      mx="auto"
      maxW="1200px"
    >
      <ToolCard icon={FaChartLine} label="Analytics" link="/Analytics" />
      <ToolCard icon={FaMedal} label="Editors Leaderboard" link="/Reviewers" />
      <ToolCard icon={FaList} label="Boards" link="/boards" />
    </Flex>
  </Box>
);

export default ToolsSection;
