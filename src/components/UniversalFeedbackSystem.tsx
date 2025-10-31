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
  Slide,
  Tooltip
} from "@chakra-ui/react";
import { FiThumbsUp, FiThumbsDown, FiMeh, FiX, FiMessageSquare } from "react-icons/fi";
import { useRouter } from "next/router";

// Combined thumbs up/down icon component
const CombinedThumbsIcon = ({ size = "20px" }: { size?: string }) => (
  <Box position="relative" width={size} height={size} display="flex" alignItems="center" justifyContent="center">
    <Icon 
      as={FiThumbsUp} 
      position="absolute" 
      top="1px"
      left="1px"
      fontSize="14px" 
      color="currentColor"
      opacity={0.8}
    />
    <Icon 
      as={FiThumbsDown} 
      position="absolute" 
      bottom="1px"
      right="1px"
      fontSize="14px" 
      color="currentColor"
      opacity={0.8}
      transform="rotate(0deg)"
    />
  </Box>
);

const UniversalFeedbackSystem = () => {
  const [isVisible, setIsVisible] = useState(false); // Always false - popup disabled
  const [isExpanded, setIsExpanded] = useState(false); // Always false - popup disabled
  const [hasGivenRating, setHasGivenRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 5 second timer
  const [showTriggerButton, setShowTriggerButton] = useState(true); // Always show trigger button
  
  const toast = useToast();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrolledTo75Ref = useRef(false);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Get session storage key (now session-wide, not per-page)
  const getSessionKey = () => `helpfulPopupShown`;

  // Check if feedback popup has already been shown during this session
  useEffect(() => {
    const sessionKey = getSessionKey();
    const hasBeenShown = sessionStorage.getItem(sessionKey);
    if (hasBeenShown) {
      setIsVisible(false);
      // Show trigger button if feedback was previously given
      setTimeout(() => setShowTriggerButton(true), 2000);
    }
  }, []);

  // Scroll detection disabled - popup removed, only trigger button remains
  useEffect(() => {
    // Popup is disabled, so we don't need scroll detection
    // The trigger button will always be available
    return;
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
    const sessionKey = getSessionKey();
    sessionStorage.setItem(sessionKey, 'true');
    
    // Smooth exit animation
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
      // Show trigger button after main popup is dismissed
      setTimeout(() => setShowTriggerButton(true), 500);
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
    const sessionKey = getSessionKey();
    sessionStorage.setItem(sessionKey, 'true');
    
    // Smooth exit animation
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
      // Show trigger button after main popup is dismissed
      setTimeout(() => setShowTriggerButton(true), 500);
    }, 300);
  };

  // Handle trigger button click to reopen feedback widget
  const handleTriggerClick = () => {
    // Reset the widget state
    setHasGivenRating(false);
    setSelectedRating(null);
    setShowCommentBox(false);
    setComment("");
    setTimeLeft(5);
    setShowTriggerButton(false);
    
    // Clear session storage temporarily to allow re-showing
    const sessionKey = getSessionKey();
    sessionStorage.removeItem(sessionKey);
    
    // Show the widget
    setIsVisible(true);
    setTimeout(() => setIsExpanded(true), 100);
  };

  if (!isVisible && !showTriggerButton) return null;

  return (
    <>
      {/* Main Feedback Widget */}
      {isVisible && (
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
      )}
      
      {/* Small Trigger Button - appears after feedback is dismissed */}
      {showTriggerButton && (
        <Fade in={showTriggerButton}>
          <Box
            position="fixed"
            right="20px"
            bottom="100px"
            zIndex="1400"
          >
            <Tooltip 
              label="Give feedback about this page" 
              placement="left" 
              hasArrow
              bg={useColorModeValue("gray.800", "gray.200")}
              color={useColorModeValue("white", "gray.800")}
            >
              <IconButton
                aria-label="Give feedback"
                icon={
                  <Box display="flex" alignItems="center" justifyContent="center" w="100%" h="100%">
                    <Icon as={FiMessageSquare} boxSize={5} />
                  </Box>
                }
                size="md"
                colorScheme="blue"
                variant="solid"
                borderRadius="full"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.25)"
                onClick={handleTriggerClick}
                _hover={{ 
                  transform: "scale(1.15)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)"
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                bg={useColorModeValue("blue.500", "blue.400")}
                color="white"
                _active={{ transform: "scale(0.95)" }}
                border={`2px solid ${useColorModeValue("white", "gray.700")}`}
                w="48px"
                h="48px"
                animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                css={{
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 1,
                    },
                    '50%': {
                      opacity: .7,
                    },
                  },
                }}
              />
            </Tooltip>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default UniversalFeedbackSystem;
