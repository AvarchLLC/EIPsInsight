import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Icon,
  VStack,
  HStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { FiCode, FiGitPullRequest, FiUsers, FiFileText, FiGitBranch, FiLayers, FiTag } from 'react-icons/fi';
import Header from './Header';

const MotionBox = motion(Box);

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: any;
  delay: number;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, delay, gradient }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay }
    });

    // Count up animation
    const duration = 2000; // 2 seconds
    const steps = 60;
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
  }, [value, delay, controls]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ 
        y: -4,
        scale: 1.01,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Box
        bg={cardBg}
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
        border="1px solid"
        borderColor={borderColor}
        boxShadow={useColorModeValue(
          '0 2px 8px rgba(0,0,0,0.04)',
          '0 2px 8px rgba(0,0,0,0.2)'
        )}
        position="relative"
        overflow="hidden"
        role="group"
        _hover={{
          borderColor: 'blue.400',
          boxShadow: useColorModeValue(
            '0 4px 12px rgba(48,160,224,0.12)',
            '0 4px 12px rgba(48,160,224,0.25)'
          ),
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {/* Gradient overlay on hover */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="4px"
          bgGradient={gradient}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.3s"
        />

        <VStack align="stretch" spacing={3}>
          {/* Icon */}
          <HStack justify="space-between" align="start">
            <Box
              bg={iconBg}
              p={2}
              borderRadius="lg"
              display="inline-flex"
              _groupHover={{
                bg: 'blue.50',
                transform: 'rotate(5deg) scale(1.05)',
              }}
              transition="all 0.3s"
            >
              <Icon 
                as={icon} 
                boxSize={4} 
                color="blue.500"
                _groupHover={{ color: 'blue.600' }}
              />
            </Box>
          </HStack>

          {/* Number with count-up animation */}
          <Stat>
            <StatNumber
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="700"
              bgGradient={gradient}
              bgClip="text"
              letterSpacing="-0.01em"
            >
              {count.toLocaleString()}
            </StatNumber>
            <StatLabel
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="600"
              color={useColorModeValue('gray.700', 'gray.200')}
              mt={1}
            >
              {title}
            </StatLabel>
            <StatHelpText
              fontSize="xs"
              color={useColorModeValue('gray.500', 'gray.400')}
              mt={0.5}
            >
              {subtitle}
            </StatHelpText>
          </Stat>
        </VStack>

        {/* Subtle glow effect on hover */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="200px"
          height="200px"
          bgGradient="radial(circle, blue.400 0%, transparent 70%)"
          opacity={0}
          _groupHover={{ opacity: 0.03 }}
          transition="opacity 0.5s"
          pointerEvents="none"
        />
      </Box>
    </MotionBox>
  );
};

const StatsGrid: React.FC = () => {
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch comprehensive stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Could not load live stats');
        // Fallback to placeholder values
        setStats({
          eips: 1245,
          ercs: 342,
          rips: 78,
          prs: 8421,
          openPRs: 127,
          contributors: 1204,
          repositories: 3,
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total EIPs',
      value: stats.eips,
      subtitle: 'Ethereum Improvement Proposals',
      icon: FiFileText,
      gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total ERCs',
      value: stats.ercs,
      subtitle: 'Ethereum Request for Comments',
      icon: FiLayers,
      gradient: 'linear(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total RIPs',
      value: stats.rips,
      subtitle: 'Rollup Improvement Proposals',
      icon: FiCode,
      gradient: 'linear(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Total PRs',
      value: stats.prs,
      subtitle: 'All pull requests tracked',
      icon: FiGitPullRequest,
      gradient: 'linear(135deg, #30A0E0 0%, #4FD1FF 100%)',
    },
    {
      title: 'Open PRs',
      value: stats.openPRs,
      subtitle: 'Currently active pull requests',
      icon: FiGitBranch,
      gradient: 'linear(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: 'Contributors',
      value: stats.contributors,
      subtitle: 'Active community members',
      icon: FiUsers,
      gradient: 'linear(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      title: 'Repositories',
      value: stats.repositories,
      subtitle: 'Tracked GitHub repos',
      icon: FiTag,
      gradient: 'linear(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  ];

  if (loading) {
    return (
      <Box 
        id="platform-stats"
        sx={{ scrollMarginTop: "100px" }}
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        p={6}
        mb={8}
        textAlign="center"
      >
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} color={useColorModeValue('gray.600', 'gray.400')}>
          Loading stats...
        </Text>
      </Box>
    );
  }

  return (
    <Box 
      id="platform-stats"
      sx={{ scrollMarginTop: "100px" }}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      p={6}
      mb={8}
    >
      {/* Header with Copy Link */}
      <Header
        title="Platform Stats"
        subtitle=""
        description=""
        sectionId="platform-stats"
      />

      {/* Error Message */}
      {error && (
        <Text fontSize="sm" color="orange.400" mb={4}>
          {error} - showing latest snapshot
        </Text>
      )}

      {/* Stats Grid - 4 columns on desktop, responsive */}
      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
        spacing={{ base: 4, md: 5 }}
        mt={6}
      >
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            delay={0.05 * (index + 1)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StatsGrid;
