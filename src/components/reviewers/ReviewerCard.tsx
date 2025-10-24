import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { CSVLink } from 'react-csv';
import dynamic from 'next/dynamic';
import axios from 'axios';

const Line = dynamic(() => import('@ant-design/plots').then((mod) => mod.Line), { ssr: false });

interface ReviewerCardProps {
  reviewer: string;
  count: number;
  data: any[];
  isExpanded: boolean;
  onToggle: () => void;
  csvData: any[];
  onGenerateCSV: (reviewer: string) => void;
  loading: boolean;
  reviewerColor: string;
  sliderValue: [number, number];
  setSliderValue: (value: [number, number]) => void;
}

const ReviewerCard: React.FC<ReviewerCardProps> = ({
  reviewer,
  count,
  data,
  isExpanded,
  onToggle,
  csvData,
  onGenerateCSV,
  loading,
  reviewerColor,
  sliderValue,
  setSliderValue,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'gray.700');

  const config = {
    data: data,
    xField: 'monthYear',
    yField: 'count',
    seriesField: 'reviewer',
    height: 250,
    color: reviewerColor,
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    xAxis: {
      label: {
        rotate: -45,
        style: { fontSize: 10 },
      },
    },
    yAxis: {
      label: {
        formatter: (text: string) => {
          const value = parseFloat(text);
          return !isNaN(value) ? value.toFixed(0) : text;
        },
      },
    },
    slider: {
      start: sliderValue[0],
      end: sliderValue[1],
      step: 0.01,
      min: 0,
      max: 1,
      onChange: (value: [number, number]) => {
        setSliderValue(value);
      },
    },
    smooth: true,
  };

  return (
    <Box
      bg={bg}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
      transition="all 0.2s"
      _hover={{ borderColor: 'blue.400', boxShadow: 'md' }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        onClick={onToggle}
        _hover={{ bg: hoverBg }}
        p={2}
        borderRadius="md"
        transition="background 0.2s"
      >
        <Flex alignItems="center" gap={3}>
          <img
            src={`https://github.com/${reviewer}.png?size=40`}
            alt={`${reviewer}'s avatar`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `2px solid ${reviewerColor}`,
            }}
          />
          <Box>
            <Text fontWeight="bold" fontSize="md">
              {reviewer}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {count} reviews
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CSVLink
              data={csvData?.length ? csvData : []}
              filename={`${reviewer}_reviews_data.csv`}
              onClick={async () => {
                try {
                  onGenerateCSV(reviewer);
                  await axios.post('/api/DownloadCounter');
                } catch (error) {
                  console.error('Error triggering download counter:', error);
                }
              }}
            >
              <Button colorScheme="blue" size="sm" variant="outline">
                {loading ? <Spinner size="sm" /> : 'CSV'}
              </Button>
            </CSVLink>
          </Box>
          <IconButton
            aria-label="Toggle chart"
            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="sm"
            variant="ghost"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onToggle();
            }}
          />
        </Flex>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt={4}>
          <Line {...config} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ReviewerCard;
