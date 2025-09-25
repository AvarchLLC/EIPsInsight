import React, { Component, ReactNode } from 'react';
import { Box, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import MaintenancePage from './MaintenancePage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isDeployment: boolean;
}

class DeploymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isDeployment: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if error suggests deployment/server restart
    const isDeploymentError = 
      error.message.includes('Loading chunk') || 
      error.message.includes('Loading CSS chunk') ||
      error.message.includes('ChunkLoadError') ||
      error.name === 'ChunkLoadError' ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError');
    
    console.log('Error caught by boundary:', error.message, error.name);
    
    return { hasError: true, isDeployment: isDeploymentError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Deployment Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isDeployment) {
        return <MaintenancePage />;
      }
      
      // Generic error fallback
      return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4} textAlign="center" p={8}>
            <Heading size="lg" color="red.500">Something went wrong</Heading>
            <Text>We're experiencing technical difficulties</Text>
            <Button 
              colorScheme="teal" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default DeploymentErrorBoundary;