import { useState } from 'react';
import { Box, VStack, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import MaintenancePage from '@/components/MaintenancePage';
import DeploymentErrorBoundary from '@/components/DeploymentErrorBoundary';

// Component that throws error for testing
const ErrorThrower = () => {
  throw new Error('ChunkLoadError: Loading chunk failed');
};

const TestMaintenancePage = () => {
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  
  const bg = useColorModeValue('gray.50', 'gray.900');
  
  if (showMaintenance) {
    return <MaintenancePage />;
  }
  
  if (triggerError) {
    // Wrap in error boundary to see production-like behavior
    return (
      <DeploymentErrorBoundary>
        <ErrorThrower />
      </DeploymentErrorBoundary>
    );
  }
  
  return (
    <Box minH="100vh" bg={bg} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6} p={8}>
        <Heading>Test Maintenance & Error Pages</Heading>
        <Text textAlign="center">
          Use these buttons to test the maintenance page and error boundary functionality.
        </Text>
        
        <VStack spacing={4}>
          <Button 
            colorScheme="teal" 
            size="lg"
            onClick={() => setShowMaintenance(true)}
          >
            Show Maintenance Page
          </Button>
          
          <Button 
            colorScheme="red" 
            size="lg"
            onClick={() => setTriggerError(true)}
          >
            Test Deployment Error (ChunkLoadError)
          </Button>
          
          <Button 
            colorScheme="gray" 
            size="sm"
            onClick={() => {
              setShowMaintenance(false);
              setTriggerError(false);
            }}
          >
            Reset
          </Button>
        </VStack>
        
        <Box p={4} bg="blue.50" borderRadius="md" maxW="md">
          <Text fontSize="sm" color="blue.700">
            <strong>Note:</strong> In production, the maintenance page will show automatically 
            during deployments when chunk loading fails.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default TestMaintenancePage;