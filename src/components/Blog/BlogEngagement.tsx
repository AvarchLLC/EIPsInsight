"use client";

import { useState, useEffect } from 'react';
import { 
  Box, 
  HStack, 
  IconButton, 
  Text, 
  Tooltip,
  useColorModeValue,
  VStack,
  Spinner
} from '@chakra-ui/react';
import { 
  FaHeart, 
  FaRegHeart, 
  FaEye, 
  FaComment, 
  FaDownload 
} from 'react-icons/fa';

interface BlogEngagementProps {
  slug: string;
  userId?: string; // Optional: current logged-in user ID
}

interface EngagementStats {
  view_count: number;
  upvote_count: number;
  download_count: number;
  comment_count: number;
  has_user_upvoted: boolean;
}

export default function BlogEngagement({ slug, userId }: BlogEngagementProps) {
  const [stats, setStats] = useState<EngagementStats>({
    view_count: 0,
    upvote_count: 0,
    download_count: 0,
    comment_count: 0,
    has_user_upvoted: false,
  });
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const activeColor = useColorModeValue('red.500', 'red.400');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch engagement stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const userParam = userId ? `?user_id=${userId}` : '';
        const response = await fetch(`/api/blogs/${slug}/engagement${userParam}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching engagement stats:', error);
      }
    }

    fetchStats();
  }, [slug, userId]);

  // Track view on mount (once)
  useEffect(() => {
    if (hasTrackedView) return;

    async function trackView() {
      try {
        await fetch(`/api/blogs/${slug}/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'view',
            user_id: userId || null
          }),
        });
        setHasTrackedView(true);
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }

    trackView();
  }, [slug, userId, hasTrackedView]);

  // Handle upvote toggle
  const handleUpvote = async () => {
    if (!userId) {
      alert('Please login to upvote');
      return;
    }

    setIsUpvoting(true);
    try {
      const response = await fetch(`/api/blogs/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'upvote',
          user_id: userId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          has_user_upvoted: data.upvoted,
          upvote_count: data.upvoted 
            ? prev.upvote_count + 1 
            : prev.upvote_count - 1
        }));
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <Box
      position="sticky"
      top="120px"
      p={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="sm" fontWeight="semibold" color={iconColor}>
          Engagement
        </Text>

        {/* Upvote */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Tooltip label={userId ? 'Toggle upvote' : 'Login to upvote'}>
              <IconButton
                aria-label="Upvote"
                icon={stats.has_user_upvoted ? <FaHeart /> : <FaRegHeart />}
                size="sm"
                variant="ghost"
                color={stats.has_user_upvoted ? activeColor : iconColor}
                onClick={handleUpvote}
                isLoading={isUpvoting}
                _hover={{
                  color: activeColor,
                  transform: 'scale(1.1)',
                }}
                transition="all 0.2s"
              />
            </Tooltip>
            <Text fontSize="sm">Upvotes</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold">
            {stats.upvote_count}
          </Text>
        </HStack>

        {/* Views */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <FaEye color={iconColor} />
            <Text fontSize="sm">Views</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold">
            {stats.view_count.toLocaleString()}
          </Text>
        </HStack>

        {/* Comments */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <FaComment color={iconColor} />
            <Text fontSize="sm">Comments</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold">
            {stats.comment_count}
          </Text>
        </HStack>

        {/* Downloads (if applicable) */}
        {stats.download_count > 0 && (
          <HStack justify="space-between">
            <HStack spacing={2}>
              <FaDownload color={iconColor} />
              <Text fontSize="sm">Downloads</Text>
            </HStack>
            <Text fontSize="sm" fontWeight="semibold">
              {stats.download_count}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
