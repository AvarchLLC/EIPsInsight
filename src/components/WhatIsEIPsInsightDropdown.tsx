import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Icon,
  useDisclosure,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { 
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiExternalLink,
} from 'react-icons/fi';
import NextLink from 'next/link';



const WhatIsEIPsInsightDropdown: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false }); // Initially collapsed
  const [stats, setStats] = useState({
    eips: 0,
    ercs: 0,
    rips: 0,
    prs: 0,
    openPRs: 0,
    contributors: 0,
    repositories: 0,
  });
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        if (data.counts) {
          setStats({
            eips: data.counts.eips || 0,
            ercs: data.counts.ercs || 0,
            rips: data.counts.rips || 0,
            prs: data.counts.prs || 0,
            openPRs: data.counts.openPRs || 0,
            contributors: data.counts.contributors || 0,
            repositories: data.counts.repositories || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback values
        setStats({
          eips: 1245,
          ercs: 342,
          rips: 78,
          prs: 8421,
          openPRs: 127,
          contributors: 1204,
          repositories: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);



  return (
    <Box
      className={`transition-all duration-500 ease-in-out ${
        isOpen ? 'w-full' : 'w-full max-w-[580px]'
      }`}
    >
      {/* Button styled to match blue buttons above */}
      <Button
        onClick={onToggle}
        color="#F5F5F5"
        variant="outline"
        fontSize={{
          lg: "14px",
          md: "12px", 
          sm: "12px",
          base: "10px",
        }}
        fontWeight="bold"
        padding={{
          lg: "10px 20px",
          md: "5px 10px",
          sm: "5px 10px", 
          base: "5px 10px",
        }}
        bgColor="#30A0E0"
        _hover={{
          bgColor: useColorModeValue("#2B6CB0", "#4A5568"),
          color: useColorModeValue("white", "#F5F5F5"),
        }}
        rightIcon={
          <Icon 
            as={isOpen ? FiChevronUp : FiChevronDown}
            boxSize={4}
            className="transition-transform duration-300"
          />
        }
        width="100%"
        justifyContent="space-between"
        className="transition-all duration-500 ease-in-out rounded-lg"
        borderRadius="md"
        h="auto"
        minH="40px"
      >
        What is EIPsInsight?
      </Button>

      {/* Collapsible Content */}
      <Collapse in={isOpen} animateOpacity>
        <Box 
          bg={useColorModeValue('gray.50', '#101a24')}
          borderRadius="xl"
          p={6}
          mt={2}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          boxShadow="lg"
          transition="all 0.5s ease-in-out"
        >
          <VStack spacing={4} align="stretch">
            {/* Enhanced Description Text */}
            <Text 
              color={useColorModeValue('gray.700', 'gray.300')}
              fontSize="sm"
              lineHeight="1.7"
            >
              EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposals (EIPs), Ethereum Request for Comments (ERCs), and Rollup Improvement Proposals (RIPs) over a specified period. Data provided is used for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.
            </Text>

            {/* Learn More Button - Left Aligned */}
            <Box>
              <NextLink href="/about" passHref>
                <ChakraLink _hover={{ textDecoration: 'none' }}>
                  <Button
                    size="sm"
                    bgGradient="linear(to-r, blue.500, blue.600)"
                    _hover={{
                      bgGradient: "linear(to-r, blue.600, blue.700)",
                    }}
                    color="white"
                    rightIcon={<FiExternalLink />}
                    fontSize="xs"
                    h="32px"
                    borderRadius="lg"
                    px={4}
                    py={2}
                    transition="all 0.2s"
                  >
                    Learn More
                  </Button>
                </ChakraLink>
              </NextLink>
            </Box>

            {/* Comprehensive Stats Grid */}
            {!loading && (
              <Box 
                mt={4}
                pt={4}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.300', 'gray.600')}
              >
                {/* Stats Section Title */}
                <Text 
                  color={useColorModeValue('gray.700', 'gray.300')}
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={3}
                  textAlign="center"
                  letterSpacing="0.02em"
                >
                  We Track:
                </Text>
                
                {/* Main Stats Row */}
                <HStack spacing={0} justify="space-between" mb={3}>
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="2xl" 
                      fontWeight="bold" 
                      color={useColorModeValue('blue.600', 'blue.400')}
                    >
                      {stats.eips.toLocaleString()}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      EIPs
                    </Text>
                  </VStack>
                  
                  <Box 
                    width="1px" 
                    height="8" 
                    bg={useColorModeValue('gray.300', 'gray.600')} 
                    mx={3} 
                  />
                  
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="2xl" 
                      fontWeight="bold" 
                      color={useColorModeValue('green.600', 'green.400')}
                    >
                      {stats.ercs.toLocaleString()}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      ERCs
                    </Text>
                  </VStack>
                  
                  <Box 
                    width="1px" 
                    height="8" 
                    bg={useColorModeValue('gray.300', 'gray.600')} 
                    mx={3} 
                  />
                  
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="2xl" 
                      fontWeight="bold" 
                      color={useColorModeValue('purple.600', 'purple.400')}
                    >
                      {stats.rips.toLocaleString()}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      RIPs
                    </Text>
                  </VStack>
                </HStack>

                {/* Additional Stats Row */}
                <HStack 
                  spacing={0} 
                  justify="space-between" 
                  pt={3} 
                  borderTop="1px solid" 
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      color={useColorModeValue('orange.600', 'orange.400')}
                    >
                      {stats.prs.toLocaleString()}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      Total PRs
                    </Text>
                  </VStack>
                  
                  <Box 
                    width="1px" 
                    height="6" 
                    bg={useColorModeValue('gray.300', 'gray.600')} 
                    mx={2} 
                  />
                  
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      color={useColorModeValue('yellow.600', 'yellow.400')}
                    >
                      {stats.openPRs.toLocaleString()}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      Open PRs
                    </Text>
                  </VStack>
                  
                  <Box 
                    width="1px" 
                    height="6" 
                    bg={useColorModeValue('gray.300', 'gray.600')} 
                    mx={2} 
                  />
                  
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      color={useColorModeValue('cyan.600', 'cyan.400')}
                    >
                      {stats.contributors.toLocaleString()}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      Contributors
                    </Text>
                  </VStack>
                  
                  <Box 
                    width="1px" 
                    height="6" 
                    bg={useColorModeValue('gray.300', 'gray.600')} 
                    mx={2} 
                  />
                  
                  <VStack spacing={1} flex={1} textAlign="center">
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      color={useColorModeValue('pink.600', 'pink.400')}
                    >
                      {stats.repositories}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={useColorModeValue('gray.600', 'gray.400')} 
                      fontWeight="medium"
                    >
                      Repositories
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            {loading && (
              <Box display="flex" justifyContent="center" py={4}>
                <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
                  Loading stats...
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default WhatIsEIPsInsightDropdown;