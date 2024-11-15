import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface Comment {
  _id: string;
  content: string;
  subComments?: Comment[]; // Ensure this matches your DB structure
}
interface CommentsProps {
  page: string;
}


const Comments: React.FC<CommentsProps> =({page}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${page}`);
        console.log('Fetched comments:', response.data);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const response = await axios.post(`/api/comments/${page}`, { content: newComment });
      console.log('Added comment:', response.data);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (replyText.trim() === '') return;

    try {
      const response = await axios.post(`/api/comments/${page}/${commentId}/reply`, { content: replyText });
      console.log('Reply response:', response.data); // Log the response

      const newReply: Comment = {
        _id: response.data._id, // Ensure the ID is taken from the response
        content: replyText, // Ensure content is taken from the response
      };

      // Find the comment by id and update its subComments
      setComments(prevComments => {
        const updatedComments = prevComments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              subComments: [...(comment.subComments || []), newReply],
            };
          }
          return comment; // Return the comment unchanged if it doesn't match
        });
        return updatedComments; // Return the updated comments array
      });

      setReplyCommentId(null);
      setReplyText('');
    } catch (error) {
      console.error('Failed to add reply', error);
    }
  };

  return (
    <Box mt={8}>
      <VStack spacing={4} align="stretch">
        {comments.map(comment => (
          <Box key={comment._id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
            <Text mb={2}>{comment.content}</Text>
            <HStack>
              <Button size="sm" onClick={() => setReplyCommentId(comment._id)}>
                Reply
              </Button>
            </HStack>

            {/* Replies */}
            {comment.subComments && (
              <VStack spacing={3} align="stretch" pl={6} mt={3}>
                {comment.subComments.map(reply => (
                  <Box key={reply._id} p={3} shadow="sm" borderWidth="1px" borderRadius="md">
                    <Text>{reply.content}</Text>
                  </Box>
                ))}
              </VStack>
            )}

            {/* Reply Input */}
            {replyCommentId === comment._id && (
              <Box mt={3}>
                <HStack>
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    size="sm"
                  />
                  <IconButton
                    aria-label="Add Reply"
                    icon={<AddIcon />}
                    onClick={() => handleAddReply(comment._id)}
                    size="sm"
                  />
                </HStack>
              </Box>
            )}
          </Box>
        ))}

        {/* New Comment Input */}
        <Box mt={4}>
          <HStack>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button onClick={handleAddComment} colorScheme="blue">
              Add Comment
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Comments;
