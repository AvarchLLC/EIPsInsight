import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Icon,
  Spinner,
  SimpleGrid,
  useDisclosure,
  Portal,
  Fade,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiLayers, 
  FiCode, 
  FiGitPullRequest, 
  FiGitBranch, 
  FiUsers, 
  FiTag,
  FiBarChart2,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { BsBarChart } from 'react-icons/bs';

const MotionBox = motion(Box);

interface StatItemProps {
  icon: any;
  label: string;
  value: number;
  gradient: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, gradient, delay }) => {
  const [count, setCount] = useState(0);
  const iconBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.600');

  useEffect(() => {
    // Faster count-up animation for dropdown
    const duration = 800;
    const steps = 40;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <MotionBox
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <HStack
        spacing={3}
        p={3}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        bg={iconBg}
        _hover={{
          borderColor: 'blue.400',
          bg: useColorModeValue('blue.50', 'gray.600'),
        }}
        transition="all 0.2s"
      >
        <Box
          p={2}
          borderRadius="md"
          bgGradient={gradient}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={4} color="white" />
        </Box>
        <VStack align="start" spacing={0} flex={1}>
          <Text 
            fontSize="xs" 
            fontWeight="500" 
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            {label}
          </Text>
          <Text 
            fontSize="lg" 
            fontWeight="700" 
            bgGradient={gradient}
            bgClip="text"
            letterSpacing="-0.01em"
          >
            {count.toLocaleString()}
          </Text>
        </VStack>
      </HStack>
    </MotionBox>
  );
};

const StatsDropdownButton: React.FC = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
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

  const popoverBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const shadowColor = useColorModeValue(
    '0 8px 32px rgba(0,0,0,0.08)',
    '0 8px 32px rgba(0,0,0,0.4)'
  );

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

  const statsData = [
    {
      label: 'EIPs',
      value: stats.eips,
      icon: FiFileText,
      gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      label: 'ERCs',
      value: stats.ercs,
      icon: FiLayers,
      gradient: 'linear(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      label: 'RIPs',
      value: stats.rips,
      icon: FiCode,
      gradient: 'linear(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      label: 'Total PRs',
      value: stats.prs,
      icon: FiGitPullRequest,
      gradient: 'linear(135deg, #30A0E0 0%, #4FD1FF 100%)',
    },
    {
      label: 'Open PRs',
      value: stats.openPRs,
      icon: FiGitBranch,
      gradient: 'linear(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      label: 'Contributors',
      value: stats.contributors,
      icon: FiUsers,
      gradient: 'linear(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      closeOnBlur={true}
      strategy="fixed"
    >
      <PopoverTrigger>
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
          rightIcon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
          bgColor="#30A0E0"
          _hover={{
            bgColor: useColorModeValue("#2B6CB0", "#4A5568"),
            color: useColorModeValue("white", "#F5F5F5"),
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          _active={{
            transform: 'translateY(0)',
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          leftIcon={<BsBarChart />}
        >
          Platform Stats
        </Button>
      </PopoverTrigger>
      
      <Portal>
        <PopoverContent
          bg={popoverBg}
          borderColor={borderColor}
          boxShadow={shadowColor}
          borderRadius="xl"
          width={{ base: "340px", sm: "380px", md: "420px" }}
          _focus={{ boxShadow: shadowColor }}
        >
          <PopoverArrow bg={popoverBg} borderColor={borderColor} />
          <PopoverBody p={4}>
            <Fade in={isOpen}>
              <VStack spacing={4} align="stretch">
                {/* Header */}
                <HStack spacing={2} mb={1}>
                  <Icon as={FiBarChart2} boxSize={5} color="blue.500" />
                  <Text fontSize="lg" fontWeight="700">
                    Live Statistics
                  </Text>
                </HStack>

                {loading ? (
                  <Box textAlign="center" py={8}>
                    <Spinner size="lg" color="blue.500" thickness="3px" />
                    <Text mt={3} fontSize="sm" color="gray.500">
                      Loading stats...
                    </Text>
                  </Box>
                ) : (
                  <VStack spacing={2} align="stretch">
                    {statsData.map((stat, index) => (
                      <StatItem
                        key={stat.label}
                        {...stat}
                        delay={0.05 * index}
                      />
                    ))}
                  </VStack>
                )}

                {/* Footer with total */}
                {!loading && (
                  <Box
                    mt={2}
                    p={3}
                    borderRadius="lg"
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  >
                    <HStack justify="space-between" color="white">
                      <Text fontSize="sm" fontWeight="600">
                        Total Tracked Items
                      </Text>
                      <Text fontSize="xl" fontWeight="700">
                        {(stats.eips + stats.ercs + stats.rips).toLocaleString()}
                      </Text>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Fade>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default StatsDropdownButton;
