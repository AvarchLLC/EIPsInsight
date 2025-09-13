import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AllLayout from "@/components/Layout";
import EtherWorldAdCard from "@/components/EtherWorldAdCard";
import {
  Box,
  Text,
  Avatar,
  Button,
  Input,
  VStack,
  Spinner,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface Comment {
  id: number;
  author: string;
  content: string;
  profileLink: string;
  profileImage: string;
  submittedAt: string;
}

const Feedback: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const bg = useColorModeValue('#f7fafc', '#171923');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const cardBg = useColorModeValue('#E5E7EB', '#374151');

  const page = 'feedback'; // Page identifier

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${page}`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || authorName.trim() === '' || githubProfile.trim() === '') return;

    try {
      // Extract GitHub avatar dynamically
      const profileResponse = await axios.get(`https://api.github.com/users/${githubProfile}`);
      const profileImage = profileResponse.data.avatar_url;

      const newCommentData = {
        author: authorName,
        content: newComment,
        profileLink: `https://github.com/${githubProfile}`,
        profileImage,
        submittedAt: new Date().toISOString(),
      };

      const response = await axios.post(`/api/comments/${page}`, newCommentData);
      setComments([...comments, response.data]);
      setAuthorName('');
      setGithubProfile('');
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  return (<>
    <AllLayout>
      <Box minH="100vh"  py={8}>
        <Text
          fontSize="4xl"
          fontWeight="bold"
          textAlign="center"
          color="#30A0E0"
          mb={8}
        >
          Feedback
        </Text>

        {/* EtherWorld Advertisement */}
        <Box my={4} width="100%">
          <EtherWorldAdCard />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Spinner />
          </Box>
        ) : (
          <Box maxW="6xl" mx="auto">
            {comments?.length === 0 ? (
              <Text textAlign="center" fontSize="xl" color={textColor} mt={8}>
                No feedback yet!
              </Text>
            ) : (
              comments?.map((comment, index) => (
                <Flex
                  key={comment.id}
                  flexDirection={index % 2 === 0 ? 'row' : 'row-reverse'}
                  alignItems="center"
                  mb={8}
                >
                  <Avatar
                    size="xl"
                    src={comment.profileImage}
                    bg={comment.profileImage ? undefined : 'black'}
                    mr={index % 2 === 0 ? 4 : 0}
                    ml={index % 2 === 0 ? 0 : 4}
                  />
                  <Box
                    bg={cardBg}
                    p={6}
                    borderRadius="md"
                    shadow="md"
                    maxW="400px"
                  >
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {comment.author}
                    </Text>
                    <div style={{ color: 'black' }}>
                      <ReactMarkdown>
                        {comment.content.split('\r\n\r\n')[0]}
                      </ReactMarkdown>
                    </div>

                  </Box>
                </Flex>
              ))
            )}

            <Box mt={12} p={6} bg={cardBg} borderRadius="md">
              <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
                Add Your Feedback
              </Text>
              <VStack spacing={4}>
                <Input
                  placeholder="Your GitHub Username (e.g., octocat)"
                  value={githubProfile}
                  onChange={(e) => {
                    setGithubProfile(e.target.value);
                    setAuthorName(e.target.value);
                  }}
                  bg={bg}
                  color={textColor}
                />
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  bg={bg}
                  color={textColor}
                />
                <Button colorScheme="blue" onClick={handleAddComment}>
                  Submit
                </Button>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
    </AllLayout>
    </>
  );
};

export default Feedback;
