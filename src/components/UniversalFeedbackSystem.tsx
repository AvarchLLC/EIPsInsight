import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  useToast, 
  Icon,
  Text,
  Button,
  HStack,
  VStack,
  useColorModeValue,
  Fade,
  IconButton,
  Textarea,
  ScaleFade,
  Slide
} from "@chakra-ui/react";
import { FiThumbsUp, FiThumbsDown, FiMeh, FiX, FiMessageSquare } from "react-icons/fi";
import { useRouter } from "next/router";

const UniversalFeedbackSystem = () => {
  const [isVisible, setIsVisible] = useState(false); // Hidden until 75% scroll
  const [isExpanded, setIsExpanded] = useState(false); // Expands at 75% scroll
  const [hasGivenRating, setHasGivenRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 5 second timer
  
  const toast = useToast();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrolledTo75Ref = useRef(false);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Get session storage key for current page
  const getPageKey = () => `feedback-completed-${router.pathname}`;

  // Check if feedback already completed for this page
  useEffect(() => {
    const pageKey = getPageKey();
    const hasCompleted = sessionStorage.getItem(pageKey);
    if (hasCompleted) {
      setIsVisible(false);
    }
  }, [router.pathname]);

  // Scroll detection for 75% trigger
  useEffect(() => {
    const handleScroll = () => {
      if (scrolledTo75Ref.current) return; // Already triggered

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / documentHeight) * 100;

      if (scrollPercent >= 75) {
        scrolledTo75Ref.current = true;
        // Smooth entrance with slight delay
        setTimeout(() => {
          setIsVisible(true);
          setTimeout(() => setIsExpanded(true), 200); // Stagger the expansion
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer management
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setTimeLeft(5);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeTimer = () => {
    if (!isHovered && !isTyping && hasGivenRating && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle timer pause/resume based on hover and typing states
  useEffect(() => {
    if (hasGivenRating) {
      if (isHovered || isTyping) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, isTyping, hasGivenRating, timeLeft]);

  const handleRating = async (rating: 'positive' | 'neutral' | 'negative') => {
    setSelectedRating(rating);
    setHasGivenRating(true);
    setShowCommentBox(true);
    startTimer();

    // Submit rating immediately
    await submitFeedback(rating, "");
  };

  const handleTimeout = () => {
    const pageKey = getPageKey();
    sessionStorage.setItem(pageKey, 'true');
    
    // Smooth exit animation
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Wait for collapse animation
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await submitFeedback(selectedRating!, comment);
    }
    handleTimeout(); // Close after comment submission
  };

  const submitFeedback = async (rating: 'positive' | 'neutral' | 'negative', commentText: string) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/Feedback/enhanced-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating,
          comment: commentText.trim() || null,
          page: router.pathname,
          timestamp: new Date().toISOString()
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }
    } catch (err: any) {
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    const pageKey = getPageKey();
    sessionStorage.setItem(pageKey, 'true');
    
    // Smooth exit animation
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <Slide direction="bottom" in={isVisible} style={{ zIndex: 1500 }}>
      <Box
        position="fixed"
        bottom="20px"
        left="50%"
        transform="translateX(-50%)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ScaleFade initialScale={0.8} in={isExpanded}>
          <Box
            bg={bgColor}
            border={`1px solid ${borderColor}`}
            borderRadius="16px"
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
            p="20px"
            backdropFilter="blur(10px)"
            minW="320px"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isExpanded ? "scale(1)" : "scale(0.95)"}
            opacity={isExpanded ? 1 : 0}
            _hover={{
              transform: isExpanded ? "scale(1.02)" : "scale(0.95)",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.2)",
            }}
          >
          {!hasGivenRating ? (
            // Show rating options (no minimized state anymore)
            <VStack spacing={3}>
              <HStack spacing="16px" align="center">
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    How's your experience with this page?
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt="2px">
                    Quick feedback helps us improve
                  </Text>
                </Box>
                
                <IconButton
                  aria-label="Dismiss feedback"
                  icon={<Icon as={FiX} />}
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  color="gray.400"
                  _hover={{ color: "gray.600" }}
                />
              </HStack>
              
              <HStack spacing="8px">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Icon as={FiThumbsUp} />}
                  colorScheme="green"
                  isLoading={isSubmitting}
                  onClick={() => handleRating('positive')}
                  _hover={{ bg: "green.50" }}
                >
                  Good
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Icon as={FiMeh} />}
                  colorScheme="orange"
                  isLoading={isSubmitting}
                  onClick={() => handleRating('neutral')}
                  _hover={{ bg: "orange.50" }}
                >
                  Okay
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Icon as={FiThumbsDown} />}
                  colorScheme="red"
                  isLoading={isSubmitting}
                  onClick={() => handleRating('negative')}
                  _hover={{ bg: "red.50" }}
                >
                  Poor
                </Button>
              </HStack>
            </VStack>
          ) : (
            // After rating - show comment box with timer
            <VStack spacing={3}>
              <HStack justify="space-between" w="100%">
                <Text fontSize="sm" color={textColor}>
                  Thanks! Any additional comments?
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {timeLeft}s
                </Text>
              </HStack>
              
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                placeholder="Optional feedback..."
                size="sm"
                rows={2}
                resize="none"
                _focus={{ borderColor: "blue.400" }}
              />
              
              <HStack spacing={2} w="100%">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleTimeout}
                  flex={1}
                >
                  Skip
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleCommentSubmit}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  flex={1}
                >
                  Send
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      </ScaleFade>
    </Box>
  </Slide>
  );
};

export default UniversalFeedbackSystem;
