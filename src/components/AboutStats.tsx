import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue, Spinner, Text } from '@chakra-ui/react';

export default function AboutStats() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ label: string; value: number; note?: string }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout | null = null;
    const fetchStats = async () => {
      if (!mounted) return;
      setLoading(true);
      setError(null);

      try {
        const [eipsRes, prsRes, contribsRes] = await Promise.all([
          fetch('/api/eips-status-count'),
          fetch('/api/allprs'),
          fetch('/api/allcontributors'),
        ]);

        if (!eipsRes.ok || !prsRes.ok || !contribsRes.ok) {
          throw new Error('One or more endpoints returned non-OK status');
        }

        const [eipsData, prsData, contribsData] = await Promise.all([eipsRes.json(), prsRes.json(), contribsRes.json()]);

        const eipsCount = Array.isArray(eipsData) ? eipsData.length : (eipsData?.total || 0);
        const prsCount = Array.isArray(prsData) ? prsData.length : (prsData?.total || 0);
        const contribsCount = Array.isArray(contribsData) ? contribsData.length : (contribsData?.total || 0);

        if (!mounted) return;
        setStats([
          { label: 'EIPs Tracked', value: eipsCount, note: 'Updated monthly' },
          { label: 'PRs & Issues', value: prsCount, note: 'Across repos' },
          { label: 'Team', value: contribsCount, note: 'Active contributors' },
        ]);
        setLastUpdated(Date.now());
      } catch (err) {
        console.warn('Failed to load live stats, falling back to snapshot', err);
        if (!mounted) return;
        setError('Could not load live stats — showing latest snapshot.');
        setStats([
          { label: 'EIPs Tracked', value: 1245, note: 'Updated monthly' },
          { label: 'PRs & Issues', value: 8421, note: 'Across repos' },
          { label: 'Contributors', value: 42, note: 'Active contributors' },
        ]);
      } finally {
        if (mounted) setLoading(false);
      }

      // schedule next poll
      if (mounted) timer = setTimeout(fetchStats, 60 * 1000);
    };

    fetchStats();

    return () => { mounted = false; if (timer) clearTimeout(timer); };
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={6}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Box mb={4}>
          <Text color="orange.400">{error}</Text>
        </Box>
      )}
      {lastUpdated && (
        <Text fontSize="sm" mb={2} color="gray.400">Last updated: {new Date(lastUpdated).toLocaleString()}</Text>
      )}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {stats.map((s) => (
          <Box key={s.label} bg={cardBg} p={6} borderRadius="lg" boxShadow="sm">
            <Stat>
              <StatLabel color={textColor}>{s.label}</StatLabel>
              <StatNumber color={textColor}>{s.value}</StatNumber>
              <StatHelpText color="gray.500">{s.note}</StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
