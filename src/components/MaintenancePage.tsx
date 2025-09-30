import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  useColorModeValue,
  Flex,
  Icon,
  Progress,
  Badge,
  Container,
  Stack,
  HStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCogs, FaRocket, FaTools } from 'react-icons/fa';
import { BsArrowUpRight } from 'react-icons/bs';
import { Briefcase, Settings } from 'react-feather';

const MaintenancePage = () => {
  // Match your website's color scheme
  const bg = useColorModeValue('#f6f6f7', '#171923');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('#2C7A7B', '#81E6D9'); // Your teal colors
  const subtitleColor = useColorModeValue('#27696b', '#81E6D9');
  
  // Gradient matching your headers
  const headingBgGradient = useColorModeValue(
    'linear(to-r, #2C7A7B, #285E61)', 
    'linear(to-r, #81E6D9, #4FD1C5)'
  );
  
  return (
    <Box 
      minH="100vh" 
      bg={bg} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.03"
        backgroundImage="radial-gradient(circle at 25px 25px, #2C7A7B 2px, transparent 0)"
        backgroundSize="50px 50px"
      />
      
      <Container maxW="2xl" px={6}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box
            bg={cardBg}
            p={{ base: 8, md: 12 }}
            borderRadius="xl"
            boxShadow="sm" // Match your dashboard shadow
            border="1px solid"
            borderColor={borderColor}
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            {/* Subtle gradient overlay */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              height="4px"
              bgGradient={headingBgGradient}
            />
            {/* Header with Icon and Title */}
            <Stack spacing={6} align="center">
              <Box position="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Icon as={Settings} size={48} color="teal.500" />
                </motion.div>
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                >
                  <Icon as={BsArrowUpRight} fontSize="lg" color="teal.600" />
                </Box>
              </Box>

              {/* Badge */}
              <Badge 
                colorScheme="teal" 
                px={4} 
                py={2} 
                borderRadius="full"
                fontSize="sm"
                textTransform="none"
              >
                System Update in Progress
              </Badge>
              
              {/* Main Heading - Match your website style */}
              <Box textAlign="center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Text
                    fontSize={{ base: "32px", md: "40px", lg: "48px" }}
                    fontWeight="extrabold"
                    color={headingColor}
                    bgGradient={headingBgGradient}
                    bgClip="text"
                    mb={2}
                  >
                    EIPsInsight is Updating
                  </Text>
                </motion.div>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={subtitleColor}
                  fontWeight="medium"
                >
                  Enhancing Your Experience
                </Text>
              </Box>
              
              {/* Description */}
              <Text 
                color={textColor} 
                fontSize="md"
                lineHeight="1.7"
                maxW="lg"
                textAlign="center"
              >
                We're deploying new features and improvements to provide you with better 
                insights into Ethereum proposals. This will only take a few minutes.
              </Text>

              {/* Progress Section */}
              <Box w="full" maxW="sm">
                <Progress 
                  size="md" 
                  colorScheme="teal" 
                  isIndeterminate 
                  borderRadius="full"
                  bg={useColorModeValue('gray.100', 'gray.700')}
                  mb={3}
                />
                <HStack justify="space-between" fontSize="sm" color={textColor}>
                  <Text>Deploying updates...</Text>
                  <Text fontWeight="medium">~5 minutes</Text>
                </HStack>
              </Box>

              {/* Info Cards */}
              <Stack 
                direction={{ base: "column", sm: "row" }} 
                spacing={4} 
                w="full"
              >
                <Box 
                  p={4} 
                  bg={useColorModeValue('teal.50', 'teal.900')} 
                  borderRadius="md"
                  border="1px solid"
                  borderColor={useColorModeValue('teal.200', 'teal.700')}
                  flex={1}
                  textAlign="center"
                >
                  <Icon as={Briefcase} color="teal.500" mb={2} />
                  <Text fontSize="sm" color={textColor} fontWeight="medium">
                    Bookmark us
                  </Text>
                  <Text fontSize="xs" color={textColor} opacity={0.8}>
                    eipsinsight.com
                  </Text>
                </Box>
                
                <Box 
                  p={4} 
                  bg={useColorModeValue('blue.50', 'blue.900')} 
                  borderRadius="md"
                  border="1px solid"
                  borderColor={useColorModeValue('blue.200', 'blue.700')}
                  flex={1}
                  textAlign="center"
                >
                  <Text fontSize="sm" color={textColor} fontWeight="medium" mb={1}>
                    Follow Updates
                  </Text>
                  <Text fontSize="xs" color={textColor} opacity={0.8}>
                    @EIPsInsight
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MaintenancePage;