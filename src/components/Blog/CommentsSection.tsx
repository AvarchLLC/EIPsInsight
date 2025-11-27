"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Textarea,
  Text,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  useColorModeValue,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import {
  FaArrowUp,
  FaReply,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaFlag,
  FaRegClock,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const MotionBox = motion(Box);

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  upvote_count: number;
  is_edited: boolean;
  edited_at?: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  blogSlug: string;
  userId?: string;
  isAdmin?: boolean;
}

function CommentItem({
  comment,
  userId,
  isAdmin,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: {
  comment: Comment;
  userId?: string;
  isAdmin?: boolean;
  onReply: (commentId: string) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  depth?: number;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(comment.upvote_count);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const isOwner = userId === comment.user.id;
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  const handleUpvote = async () => {
    if (!userId) {
      alert('Please login to upvote comments');
      return;
    }

    try {
      const response = await fetch(`/api/blogs/comments/${comment.id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setHasUpvoted(data.upvoted);
        setUpvoteCount(data.upvote_count);
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      ml={depth * 8}
      mb={4}
    >
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={4}
        _hover={{ bg: hoverBg }}
        transition="all 0.2s"
      >
        <HStack align="start" spacing={3}>
          {/* Avatar */}
          <Avatar
            size="sm"
            name={comment.user.display_name || comment.user.username}
            src={comment.user.avatar_url}
          />

          <VStack align="start" flex={1} spacing={2}>
            {/* Header */}
            <HStack justify="space-between" width="full">
              <HStack spacing={2}>
                <Text fontWeight="semibold" fontSize="sm">
                  {comment.user.display_name || comment.user.username}
                </Text>
                {isAdmin && (
                  <Badge colorScheme="purple" fontSize="xs">
                    Admin
                  </Badge>
                )}
                <HStack spacing={1} color="gray.500">
                  <FaRegClock size={12} />
                  <Text fontSize="xs">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </Text>
                </HStack>
                {comment.is_edited && (
                  <Badge colorScheme="gray" fontSize="xs">
                    edited
                  </Badge>
                )}
              </HStack>

              {/* Actions Menu */}
              {(isOwner || isAdmin) && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="xs"
                  />
                  <MenuList>
                    {isOwner && (
                      <MenuItem icon={<FaEdit />} onClick={() => onEdit(comment)}>
                        Edit
                      </MenuItem>
                    )}
                    {(isOwner || isAdmin) && (
                      <MenuItem
                        icon={<FaTrash />}
                        onClick={() => onDelete(comment.id)}
                        color="red.500"
                      >
                        Delete
                      </MenuItem>
                    )}
                    <MenuItem icon={<FaFlag />}>Report</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>

            {/* Content */}
            <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
              {comment.content}
            </Text>

            {/* Actions */}
            <HStack spacing={3} pt={2}>
              <Button
                leftIcon={<FaArrowUp />}
                size="xs"
                variant={hasUpvoted ? 'solid' : 'ghost'}
                colorScheme={hasUpvoted ? 'green' : 'gray'}
                onClick={handleUpvote}
              >
                {upvoteCount}
              </Button>

              {canReply && (
                <Button
                  leftIcon={<FaReply />}
                  size="xs"
                  variant="ghost"
                  onClick={() => setShowReplyBox(!showReplyBox)}
                >
                  Reply
                </Button>
              )}
            </HStack>

            {/* Reply Box */}
            <Collapse in={showReplyBox} animateOpacity>
              <Box pt={3} width="full">
                <CommentForm
                  parentCommentId={comment.id}
                  onSuccess={() => setShowReplyBox(false)}
                  placeholder="Write a reply..."
                  compact
                />
              </Box>
            </Collapse>
          </VStack>
        </HStack>
      </Box>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <VStack align="stretch" mt={2} spacing={2}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              userId={userId}
              isAdmin={isAdmin}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </VStack>
      )}
    </MotionBox>
  );
}

function CommentForm({
  blogSlug,
  parentCommentId,
  onSuccess,
  placeholder = "Share your thoughts...",
  compact = false,
}: {
  blogSlug?: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${blogSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          parent_comment_id: parentCommentId,
          user_id: 'current-user-id', // Replace with actual user ID
        }),
      });

      if (response.ok) {
        setContent('');
        toast({
          title: 'Comment posted!',
          status: 'success',
          duration: 2000,
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: 'Error posting comment',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing={3} align="stretch">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        size={compact ? 'sm' : 'md'}
        rows={compact ? 2 : 4}
        resize="vertical"
      />
      <HStack justify="flex-end">
        <Text fontSize="xs" color="gray.500">
          {content.length}/5000
        </Text>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!content.trim() || content.length > 5000}
        >
          {parentCommentId ? 'Reply' : 'Post Comment'}
        </Button>
      </HStack>
    </VStack>
  );
}

export default function CommentsSection({
  blogSlug,
  userId,
  isAdmin = false,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'top'>('newest');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchComments();
  }, [blogSlug, sortBy]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blogSlug}/comments?sort=${sortBy}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/blogs/comments/${commentId}?user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Box
      id="comments"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      mt={8}
    >
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <Text fontSize="2xl" fontWeight="bold">
              Comments
            </Text>
            <Badge colorScheme="blue" fontSize="md">
              {comments.length}
            </Badge>
          </HStack>

          {/* Sort Options */}
          <HStack spacing={2}>
            <Button
              size="sm"
              variant={sortBy === 'newest' ? 'solid' : 'ghost'}
              onClick={() => setSortBy('newest')}
            >
              Newest
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'top' ? 'solid' : 'ghost'}
              onClick={() => setSortBy('top')}
            >
              Top
            </Button>
          </HStack>
        </Flex>

        <Divider />

        {/* Comment Form */}
        {userId ? (
          <CommentForm blogSlug={blogSlug} onSuccess={fetchComments} />
        ) : (
          <Box
            p={4}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="md"
            textAlign="center"
          >
            <Text>Please login to post a comment</Text>
            <Button mt={2} colorScheme="blue" size="sm">
              Login
            </Button>
          </Box>
        )}

        <Divider />

        {/* Comments List */}
        {isLoading ? (
          <Flex justify="center" py={8}>
            <Spinner size="lg" />
          </Flex>
        ) : comments.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No comments yet. Be the first to comment!</Text>
          </Box>
        ) : (
          <VStack align="stretch" spacing={4}>
            <AnimatePresence>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  userId={userId}
                  isAdmin={isAdmin}
                  onReply={() => {}}
                  onEdit={() => {}}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
