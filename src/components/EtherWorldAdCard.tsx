import React from "react";
import { Box, Flex, Text, Badge, Image, useColorModeValue } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";

const etherWorldLogo = "https://etherworld.co/favicon.ico"; // Replace with actual logo if available

const EtherWorldAdCard: React.FC = () => {
  const bg = useColorModeValue("blue.50", "gray.800");
  const border = useColorModeValue("blue.200", "gray.600");
  const gradientBg = useColorModeValue(
    "linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)",
    "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)"
  );
  
  const handleClick = () => {
    window.open("https://etherworld.co/", "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      bg={useColorModeValue("blue.50", "gray.800")}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue("blue.200", "gray.600")}
      boxShadow="sm"
      p={3}
      w="100%"
      mx="auto"
      cursor="pointer"
      onClick={handleClick}
      transition="all 0.2s ease-in-out"
      _hover={{
        boxShadow: "md",
        transform: "translateY(-1px)",
        borderColor: useColorModeValue("blue.300", "blue.500")
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Advertisement: EtherWorld - Click to visit website"
      role="button"
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        align="center"
        justify="space-between"
        gap={3}
      >
        {/* Left side - Brand */}
        <Flex align="center" gap={3} flex={1}>
          <Box
            bg="white"
            p={1.5}
            borderRadius="md"
            boxShadow="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image 
              src={etherWorldLogo} 
              alt="EtherWorld logo" 
              boxSize="24px" 
              borderRadius="sm"
              fallback={
                <Box
                  bg="blue.500"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  w="24px"
                  h="24px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="sm"
                >
                  EW
                </Box>
              }
            />
          </Box>
          
          <Box>
            <Flex align="center" gap={2} mb={1}>
              <Text 
                fontWeight="semibold" 
                fontSize="sm"
                color={useColorModeValue("gray.800", "gray.100")}
              >
                EtherWorld
              </Text>
              <Badge 
                colorScheme="blue" 
                fontSize="xs" 
                px={1.5} 
                py={0.5} 
                borderRadius="sm"
              >
                Sponsored
              </Badge>
            </Flex>
            <Text 
              fontSize="xs"
              color={useColorModeValue("gray.600", "gray.400")}
              lineHeight="1.2"
            >
              Your gateway to Ethereum insights & blockchain news
            </Text>
          </Box>
        </Flex>

        {/* Right side - CTA */}
        <Flex
          align="center"
          gap={1.5}
          bg={useColorModeValue("blue.600", "blue.500")}
          color="white"
          px={3}
          py={2}
          borderRadius="md"
          fontSize="xs"
          fontWeight="medium"
          flexShrink={0}
          _hover={{
            bg: useColorModeValue("blue.700", "blue.600")
          }}
          transition="background-color 0.2s"
        >
          <Text>Explore</Text>
          <FiExternalLink size={12} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default EtherWorldAdCard;
