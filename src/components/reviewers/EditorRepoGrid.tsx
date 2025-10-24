import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  Avatar,
  Badge,
  HStack,
  VStack,
  Progress,
} from '@chakra-ui/react';

interface EditorData {
  reviewer: string;
  eips: number;
  ercs: number;
  rips: number;
  total: number;
}

interface EditorRepoGridProps {
  editorsData: EditorData[];
  reviewersData: EditorData[];
}

const EditorRepoGrid: React.FC<EditorRepoGridProps> = ({
  editorsData,
  reviewersData,
}) => {
  const [showAllEditors, setShowAllEditors] = useState(false);
  const [showAllReviewers, setShowAllReviewers] = useState(false);
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  const displayedEditors = showAllEditors ? editorsData : editorsData.slice(0, 3);
  const displayedReviewers = showAllReviewers ? reviewersData : reviewersData.slice(0, 3);

  const renderCard = (item: EditorData) => {
    const maxValue = item.total;
    
    return (
      <Box
        key={item.reviewer}
        bg={bg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={5}
        boxShadow="sm"
        transition="all 0.2s"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
      >
        <Flex align="center" mb={4}>
          <Avatar
            size="md"
            name={item.reviewer}
            src={`https://github.com/${item.reviewer}.png?size=40`}
            mr={3}
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="lg">
              {item.reviewer}
            </Text>
            <Badge colorScheme="blue" fontSize="sm">
              {item.total} total reviews
            </Badge>
          </VStack>
        </Flex>

        <VStack spacing={3} align="stretch">
          {/* EIPs */}
          <Box>
            <Flex justify="space-between" mb={1}>
              <HStack>
                <Badge colorScheme="blue" fontSize="xs">EIPs</Badge>
                <Text fontSize="sm" fontWeight="medium">{item.eips}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {maxValue > 0 ? Math.round((item.eips / maxValue) * 100) : 0}%
              </Text>
            </Flex>
            <Progress 
              value={maxValue > 0 ? (item.eips / maxValue) * 100 : 0} 
              size="sm" 
              colorScheme="blue" 
              borderRadius="full"
            />
          </Box>

          {/* ERCs */}
          <Box>
            <Flex justify="space-between" mb={1}>
              <HStack>
                <Badge colorScheme="green" fontSize="xs">ERCs</Badge>
                <Text fontSize="sm" fontWeight="medium">{item.ercs}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {maxValue > 0 ? Math.round((item.ercs / maxValue) * 100) : 0}%
              </Text>
            </Flex>
            <Progress 
              value={maxValue > 0 ? (item.ercs / maxValue) * 100 : 0} 
              size="sm" 
              colorScheme="green" 
              borderRadius="full"
            />
          </Box>

          {/* RIPs */}
          <Box>
            <Flex justify="space-between" mb={1}>
              <HStack>
                <Badge colorScheme="red" fontSize="xs">RIPs</Badge>
                <Text fontSize="sm" fontWeight="medium">{item.rips}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {maxValue > 0 ? Math.round((item.rips / maxValue) * 100) : 0}%
              </Text>
            </Flex>
            <Progress 
              value={maxValue > 0 ? (item.rips / maxValue) * 100 : 0} 
              size="sm" 
              colorScheme="red" 
              borderRadius="full"
            />
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <Box>
      {/* Editors Section */}
      <Box mb={8}>
        <Heading
          as="h3"
          size="lg"
          mb={4}
          fontWeight="bold"
          color={headingColor}
        >
          Editors Repository Distribution
        </Heading>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={4}
          mb={4}
        >
          {displayedEditors.map(renderCard)}
        </Grid>
        {editorsData.length > 3 && (
          <Flex justify="center">
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => setShowAllEditors(!showAllEditors)}
              size="md"
            >
              {showAllEditors ? 'Show Less' : `See More (${editorsData.length - 3} more)`}
            </Button>
          </Flex>
        )}
      </Box>

      {/* Reviewers Section */}
      <Box>
        <Heading
          as="h3"
          size="lg"
          mb={4}
          fontWeight="bold"
          color={headingColor}
        >
          Reviewers Repository Distribution
        </Heading>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={4}
          mb={4}
        >
          {displayedReviewers.map(renderCard)}
        </Grid>
        {reviewersData.length > 3 && (
          <Flex justify="center">
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => setShowAllReviewers(!showAllReviewers)}
              size="md"
            >
              {showAllReviewers ? 'Show Less' : `See More (${reviewersData.length - 3} more)`}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default EditorRepoGrid;
