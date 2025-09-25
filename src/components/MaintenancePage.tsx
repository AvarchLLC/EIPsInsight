import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Spinner, 
  useColorModeValue,
  Flex,
  Icon,
  Progress,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCogs, FaRocket } from 'react-icons/fa';

const MaintenancePage = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Box 
      minH="100vh" 
      bg={bg} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      px={4}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          bg={cardBg}
          p={8}
          borderRadius="xl"
          shadow="2xl"
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
          maxW="md"
          mx="auto"
        >
          {/* Header with Icon */}
          <Flex justify="center" mb={6}>
            <Box position="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Icon as={FaCogs} fontSize="4xl" color="teal.500" />
              </motion.div>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              >
                <Icon as={FaRocket} fontSize="lg" color="teal.600" />
              </Box>
            </Box>
          </Flex>

          {/* Main Content */}
          <Badge colorScheme="teal" mb={4} px={3} py={1} borderRadius="full">
            System Update in Progress
          </Badge>
          
          <Heading size="lg" mb={4} color={headingColor}>
            EIPsInsight is Updating
          </Heading>
          
          <Text color={textColor} mb={6} lineHeight="1.6">
            We're deploying new features and improvements to enhance your experience. 
            This will only take a few minutes.
          </Text>

          {/* Progress Indicator */}
          <Box mb={6}>
            <Progress 
              size="sm" 
              colorScheme="teal" 
              isIndeterminate 
              borderRadius="full"
              bg={useColorModeValue('gray.100', 'gray.700')}
            />
            <Text fontSize="sm" color={textColor} mt={2}>
              Expected completion: ~5 minutes
            </Text>
          </Box>

          {/* Footer */}
          <Box 
            p={4} 
            bg={useColorModeValue('teal.50', 'teal.900')} 
            borderRadius="lg"
            border="1px solid"
            borderColor={useColorModeValue('teal.200', 'teal.700')}
          >
            <Text fontSize="sm" color={textColor} mb={1}>
              💡 <strong>Tip:</strong> Bookmark us and check back shortly!
            </Text>
            <Text fontSize="xs" color={textColor} opacity={0.8}>
              Follow @EIPsInsight for real-time updates
            </Text>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default MaintenancePage;