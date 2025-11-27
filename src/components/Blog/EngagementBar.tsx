"use client";

import { useState, useEffect } from 'react';
import {
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaArrowUp,
  FaArrowDown,
  FaShare,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa';

interface EngagementBarProps {
  slug: string;
  userId?: string;
  commentCount?: number;
}

export default function EngagementBar({ 
  slug, 
  userId, 
  commentCount = 0 
}: EngagementBarProps) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const upvoteColor = useColorModeValue('green.500', 'green.400');
  const downvoteColor = useColorModeValue('red.500', 'red.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    trackView();
  }, [slug]);

  const trackView = async () => {
    try {
      await fetch(`/api/blogs/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'view', user_id: userId || null }),
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: voteType, user_id: userId || null }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (voteType === 'upvote') {
          setHasUpvoted(data.upvoted);
          setHasDownvoted(false);
        } else {
          setHasDownvoted(data.downvoted);
          setHasUpvoted(false);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <HStack spacing={2} justify="flex-start" py={2}>
      {/* Upvote */}
      <Tooltip label="Upvote" placement="top">
        <IconButton
          icon={<FaArrowUp />}
          aria-label="Upvote"
          size="sm"
          variant={hasUpvoted ? 'solid' : 'outline'}
          colorScheme={hasUpvoted ? 'green' : 'gray'}
          onClick={() => handleVote('upvote')}
          isLoading={isLoading}
          _hover={{ bg: hasUpvoted ? upvoteColor : hoverBg }}
        />
      </Tooltip>

      {/* Downvote */}
      <Tooltip label="Downvote" placement="top">
        <IconButton
          icon={<FaArrowDown />}
          aria-label="Downvote"
          size="sm"
          variant={hasDownvoted ? 'solid' : 'outline'}
          colorScheme={hasDownvoted ? 'red' : 'gray'}
          onClick={() => handleVote('downvote')}
          isLoading={isLoading}
          _hover={{ bg: hasDownvoted ? downvoteColor : hoverBg }}
        />
      </Tooltip>

      {/* Save */}
      <Tooltip label={isBookmarked ? 'Saved' : 'Save'} placement="top">
        <IconButton
          icon={isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          aria-label="Save"
          size="sm"
          variant="outline"
          colorScheme={isBookmarked ? 'blue' : 'gray'}
          onClick={() => setIsBookmarked(!isBookmarked)}
          _hover={{ bg: hoverBg }}
        />
      </Tooltip>

      {/* Share */}
      <Tooltip label="Share" placement="top">
        <IconButton
          icon={<FaShare />}
          aria-label="Share"
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={handleShare}
          _hover={{ bg: hoverBg }}
        />
      </Tooltip>
    </HStack>
  );
}
