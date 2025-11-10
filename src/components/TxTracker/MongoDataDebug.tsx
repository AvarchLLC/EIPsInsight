import React, { useEffect, useState } from 'react';
import { Box, Text, Code, Button, VStack, Badge } from '@chakra-ui/react';
import MongoDataService, { type LatestValues } from '@/services/MongoDataService';

const MongoDataDebug = () => {
  const [mongoData, setMongoData] = useState<LatestValues | null>(null);
  const [serviceStatus, setServiceStatus] = useState<string>('Not initialized');
  const [apiTestResults, setApiTestResults] = useState<any>({});

  useEffect(() => {
    console.log('🚀 MongoDataDebug: Initializing service...');
    setServiceStatus('Initializing...');
    
    const mongoService = MongoDataService.getInstance();
    
    const unsubscribe = mongoService.subscribe((data: LatestValues) => {
      console.log('📊 MongoDataDebug received data:', data);
      setMongoData(data);
      setServiceStatus(data.isLoading ? 'Loading...' : 'Connected');
    });

    mongoService.startAutoRefresh(30000);

    return unsubscribe;
  }, []);

  const testAPIRoutes = async () => {
    console.log('🧪 Testing API routes...');
    setServiceStatus('Testing API routes...');
    
    const results: any = {};
    
    try {
      // Test each API route individually
      const routes = [
        { name: 'Base Fees', url: '/api/txtracker/fetchData' },
        { name: 'Gas Burnt', url: '/api/txtracker/fetchData1' },
        { name: 'Gas Used', url: '/api/txtracker/fetchData2' },
        { name: 'Priority Fee', url: '/api/txtracker/fetchData3' },
        { name: 'All Blocks', url: '/api/txtracker/fetchData4' }
      ];

      for (const route of routes) {
        try {
          console.log(`Testing ${route.name}: ${route.url}`);
          const response = await fetch(route.url);
          const data = await response.json();
          const dataValues = Object.values(data as Record<string, any>);
          
          results[route.name] = {
            status: response.status,
            ok: response.ok,
            dataLength: Array.isArray(dataValues[0]) ? dataValues[0].length : 0,
            sample: data
          };
          
          console.log(`✅ ${route.name}:`, results[route.name]);
        } catch (error) {
          results[route.name] = { error: error instanceof Error ? error.message : 'Unknown error' };
          console.error(`❌ ${route.name}:`, error);
        }
      }
      
      setApiTestResults(results);
      setServiceStatus('API test completed');
      
    } catch (error) {
      console.error('🔥 API test failed:', error);
      setServiceStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Box p={6} bg="gray.50" borderRadius="lg" border="2px solid orange.300" mb={4}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="orange.600">
            🔍 MongoDB Service Debug Panel
          </Text>
          <Badge colorScheme="orange" mt={2}>
            Status: {serviceStatus}
          </Badge>
        </Box>

        <Button onClick={testAPIRoutes} colorScheme="blue" size="sm">
          🧪 Test API Routes
        </Button>

        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            📊 Latest MongoDB Data:
          </Text>
          {mongoData ? (
            <Code display="block" whiteSpace="pre-wrap" fontSize="xs" p={3}>
              {JSON.stringify({
                blockNumber: mongoData.blockNumber,
                baseFeeGwei: mongoData.baseFeeGwei,
                priorityFeeGwei: mongoData.priorityFeeGwei,
                gasUsed: mongoData.gasUsed,
                gasUsedPercentage: mongoData.gasUsedPercentage,
                isLoading: mongoData.isLoading,
                timestamp: mongoData.timestamp.toISOString()
              }, null, 2)}
            </Code>
          ) : (
            <Box p={3} bg="yellow.100" borderRadius="md">
              <Text color="orange.600" fontWeight="bold">
                ⚠️ No MongoDB data received yet
              </Text>
            </Box>
          )}
        </Box>

        {Object.keys(apiTestResults).length > 0 && (
          <Box>
            <Text fontSize="md" fontWeight="semibold" mb={2}>
              🌐 API Test Results:
            </Text>
            <Code display="block" whiteSpace="pre-wrap" fontSize="xs" p={3}>
              {JSON.stringify(apiTestResults, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MongoDataDebug;