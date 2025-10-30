import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Heading, Text, Spinner, useColorModeValue } from '@chakra-ui/react';

type Counts = Record<string, number | null>;

const statKeys: { key: string; label: string }[] = [
  { key: 'eips', label: 'EIPs' },
  { key: 'ercs', label: 'ERCs' },
  { key: 'rips', label: 'RIPs' },
  { key: 'prs', label: 'PRs (all)' },
  { key: 'openPRs', label: 'Open PRs' },
  { key: 'contributors', label: 'Contributors' },
  { key: 'repositories', label: 'Repositories' },
  { key: 'labels', label: 'Normalized labels' },
];

const Stats: React.FC = () => {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue('white', '#1f2937');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (!mounted) return;
        if (data && data.counts) setCounts(data.counts);
      } catch (e) {
        console.error('Failed to load stats', e);
        if (mounted) setCounts(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box mt={6} bg={cardBg} p={{ base: 4, md: 6 }} borderRadius="xl" border={useColorModeValue('1px solid rgba(2,6,23,0.04)', '1px solid rgba(255,255,255,0.04)')}>
      <Heading as="h3" size="md" mb={4} className="gradient-text">What we track</Heading>

      {loading && (
        <Box display="flex" alignItems="center">
          <Spinner size="sm" mr={2} />
          <Text as="span">Loading stats…</Text>
        </Box>
      )}

      {!loading && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {statKeys.map((s) => (
            <Box key={s.key} p={4} bg={useColorModeValue('gray.50', '#111827')} borderRadius="md" textAlign="center">
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>{s.label}</Text>
              <Text fontSize="2xl" fontWeight="bold" mt={2}>
                {counts && typeof counts[s.key] === 'number' ? counts[s.key] : 'N/A'}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {!loading && !counts && (
        <Text mt={4} color="gray.500">Real-time counts are currently unavailable (database offline). The UI will show numbers when the data connection is available.</Text>
      )}
    </Box>
  );
};

export default Stats;
