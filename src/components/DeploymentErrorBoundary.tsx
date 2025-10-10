import React, { Component, ReactNode } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  HStack,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';
import { FaEnvelope, FaRedo, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import MaintenancePage from './MaintenancePage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isDeployment: boolean;
  countdown: number;
  autoRefreshEnabled: boolean;
}

class DeploymentErrorBoundary extends Component<Props, State> {
  private countdownInterval: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isDeployment: false, 
      countdown: 600, // 10 minutes in seconds
      autoRefreshEnabled: true 
    };
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
    
    return { 
      hasError: true, 
      isDeployment: isDeploymentError,
      countdown: 600,
      autoRefreshEnabled: true
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Deployment Error Boundary caught an error:', error, errorInfo);
    
    // Start countdown if it's an error (not deployment)
    if (!this.state.isDeployment && this.state.autoRefreshEnabled) {
      this.startCountdown();
    }
  }

  componentWillUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown = () => {
    this.countdownInterval = setInterval(() => {
      this.setState(prevState => {
        if (prevState.countdown <= 1) {
          window.location.reload();
          return prevState;
        }
        return { ...prevState, countdown: prevState.countdown - 1 };
      });
    }, 1000);
  };

  stopCountdown = () => {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.setState({ autoRefreshEnabled: false });
  };

  formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  handleContactDev = () => {
    const subject = encodeURIComponent('EIPs Insight - Technical Issue Report');
    const body = encodeURIComponent(`Hi Dev Team,

I encountered a technical issue on EIPs Insight:

Error Type: ${this.state.isDeployment ? 'Deployment/Server Issue' : 'Application Error'}
Time: ${new Date().toLocaleString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Please look into this issue.

Best regards`);
    
    window.open(`mailto:dev@avarch.org?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isDeployment) {
        return <MaintenancePage />;
      }
      
      // Modern error fallback with countdown and contact options
      return (
        <Box 
          minH="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          position="relative"
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            opacity={0.1}
            backgroundImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
            backgroundSize="40px 40px"
          />
          
          <Box
            maxW="500px"
            w="full"
            mx={4}
            position="relative"
            zIndex={1}
          >
            <VStack 
              spacing={6} 
              textAlign="center" 
              p={8}
              bg="rgba(255, 255, 255, 0.95)"
              backdropFilter="blur(10px)"
              borderRadius="2xl"
              boxShadow="xl"
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              {/* Error Icon */}
              <Box
                p={4}
                bg="red.100"
                borderRadius="full"
                color="red.500"
              >
                <Icon as={FaExclamationTriangle} boxSize={8} />
              </Box>

              {/* Title and Description */}
              <VStack spacing={3}>
                <Heading size="lg" color="gray.800" fontWeight="bold">
                  Oops! Something went wrong
                </Heading>
                <Text color="gray.600" fontSize="md" lineHeight="relaxed">
                  We're experiencing technical difficulties. Don't worry, our team has been notified.
                </Text>
              </VStack>

              {/* Status Badge */}
              <Badge colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="sm">
                <HStack spacing={1}>
                  <Icon as={FaCog} boxSize={3} />
                  <Text>System Issue Detected</Text>
                </HStack>
              </Badge>

              <Divider />

              {/* Auto-refresh Section */}
              {this.state.autoRefreshEnabled && (
                <VStack spacing={4}>
                  <Text color="gray.700" fontSize="sm" fontWeight="medium">
                    Auto-refresh in
                  </Text>
                  
                  <Box position="relative">
                    <CircularProgress 
                      value={(600 - this.state.countdown) / 600 * 100} 
                      size="80px"
                      color="blue.500"
                      trackColor="gray.200"
                      thickness={6}
                    >
                      <CircularProgressLabel fontSize="sm" fontWeight="bold" color="gray.700">
                        {this.formatTime(this.state.countdown)}
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  
                  <Text fontSize="xs" color="gray.500" maxW="300px">
                    The page will automatically refresh in {this.formatTime(this.state.countdown)}. 
                    You can also try refreshing manually or contact our dev team.
                  </Text>
                </VStack>
              )}

              {/* Action Buttons */}
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button 
                  colorScheme="blue" 
                  leftIcon={<Icon as={FaRedo} />}
                  onClick={() => window.location.reload()}
                  size="md"
                  borderRadius="lg"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Refresh Now
                </Button>
                
                <Button 
                  colorScheme="gray"
                  variant="outline" 
                  leftIcon={<Icon as={FaEnvelope} />}
                  onClick={this.handleContactDev}
                  size="md"
                  borderRadius="lg"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                >
                  Contact Dev Team
                </Button>
              </HStack>

              {/* Stop Auto-refresh Option */}
              {this.state.autoRefreshEnabled && (
                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.500"
                  onClick={this.stopCountdown}
                  _hover={{ color: 'gray.700' }}
                >
                  Stop auto-refresh
                </Button>
              )}

              {/* Footer */}
              <Box pt={4} borderTop="1px solid" borderColor="gray.200" w="full">
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  EIPs Insight • If this persists, please contact dev@avarch.org
                </Text>
              </Box>
            </VStack>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default DeploymentErrorBoundary;