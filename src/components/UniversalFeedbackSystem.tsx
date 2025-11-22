import React, { useState, useEffect } from "react";
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
  const [selectedRating, setSelectedRating] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTriggerButton, setShowTriggerButton] = useState(true); // Always show trigger button
  
  const toast = useToast();
  const router = useRouter();

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

  const handleRating = async (rating: 'positive' | 'neutral' | 'negative') => {
    setSelectedRating(rating);
    
    // Submit rating immediately without comment (silently, no toast)
    await submitFeedback(rating, "");

    // Keep the widget open so user can optionally add a comment
    // Widget will only close if user clicks X or submits a comment
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() && selectedRating) {
      // Submit feedback with the selected rating and comment
      await submitFeedback(selectedRating, comment);
      
      toast({
        title: "Thanks for your feedback!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });

      // Dismiss the feedback widget after successful submission
      handleDismiss();
    }
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
    
    // No toast when just closing - rating was already saved silently
    
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
    setSelectedRating(null);
    setComment("");
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
          >
        <ScaleFade initialScale={0.8} in={isExpanded}>
          <Box
            bg={bgColor}
            border={`1px solid ${borderColor}`}
            borderRadius="20px"
            boxShadow={useColorModeValue(
              '0 10px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
              '0 10px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
            )}
            p={{ base: 5, md: 6 }}
            backdropFilter="blur(10px)"
            minW={{ base: "300px", md: "380px" }}
            maxW="90vw"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isExpanded ? "scale(1)" : "scale(0.95)"}
            opacity={isExpanded ? 1 : 0}
            _hover={{
              transform: isExpanded ? "scale(1.01)" : "scale(0.95)",
              boxShadow: useColorModeValue(
                '0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
                '0 20px 60px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)'
              ),
            }}
          >
            {/* Show rating options with comment box always visible */}
            <VStack spacing={4}>
              <HStack spacing="12px" align="center" w="100%">
                <Box flex="1">
                  <Text 
                    fontSize={{ base: "md", md: "lg" }} 
                    fontWeight="700" 
                    color={textColor}
                    letterSpacing="-0.01em"
                  >
                    How's your experience?
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} mt="4px">
                    Your feedback helps us improve
                  </Text>
                </Box>
                
                <IconButton
                  aria-label="Dismiss feedback"
                  icon={<Icon as={FiX} />}
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  color={useColorModeValue("gray.400", "gray.500")}
                  borderRadius="full"
                  _hover={{ 
                    color: useColorModeValue("gray.700", "gray.300"),
                    bg: useColorModeValue("gray.100", "gray.700")
                  }}
                />
              </HStack>
              
              <HStack spacing={3} w="100%">
                <Button
                  size="md"
                  variant={selectedRating === 'positive' ? "solid" : "outline"}
                  leftIcon={<Icon as={FiThumbsUp} boxSize={4} />}
                  colorScheme="green"
                  isLoading={isSubmitting && selectedRating === 'positive'}
                  onClick={() => handleRating('positive')}
                  flex={1}
                  borderRadius="xl"
                  fontWeight="600"
                  bg={selectedRating === 'positive' ? "green.500" : "transparent"}
                  borderWidth="2px"
                  borderColor={selectedRating === 'positive' ? "green.500" : useColorModeValue("gray.200", "gray.600")}
                  _hover={{ 
                    bg: selectedRating === 'positive' ? "green.600" : useColorModeValue("green.50", "green.900"),
                    borderColor: "green.500",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(72, 187, 120, 0.3)"
                  }}
                  transition="all 0.2s"
                >
                  Good
                </Button>
                
                <Button
                  size="md"
                  variant={selectedRating === 'neutral' ? "solid" : "outline"}
                  leftIcon={<Icon as={FiMeh} boxSize={4} />}
                  colorScheme="orange"
                  isLoading={isSubmitting && selectedRating === 'neutral'}
                  onClick={() => handleRating('neutral')}
                  flex={1}
                  borderRadius="xl"
                  fontWeight="600"
                  bg={selectedRating === 'neutral' ? "orange.500" : "transparent"}
                  borderWidth="2px"
                  borderColor={selectedRating === 'neutral' ? "orange.500" : useColorModeValue("gray.200", "gray.600")}
                  _hover={{ 
                    bg: selectedRating === 'neutral' ? "orange.600" : useColorModeValue("orange.50", "orange.900"),
                    borderColor: "orange.500",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(237, 137, 54, 0.3)"
                  }}
                  transition="all 0.2s"
                >
                  Okay
                </Button>
                
                <Button
                  size="md"
                  variant={selectedRating === 'negative' ? "solid" : "outline"}
                  leftIcon={<Icon as={FiThumbsDown} boxSize={4} />}
                  colorScheme="red"
                  isLoading={isSubmitting && selectedRating === 'negative'}
                  onClick={() => handleRating('negative')}
                  flex={1}
                  borderRadius="xl"
                  fontWeight="600"
                  bg={selectedRating === 'negative' ? "red.500" : "transparent"}
                  borderWidth="2px"
                  borderColor={selectedRating === 'negative' ? "red.500" : useColorModeValue("gray.200", "gray.600")}
                  _hover={{ 
                    bg: selectedRating === 'negative' ? "red.600" : useColorModeValue("red.50", "red.900"),
                    borderColor: "red.500",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3)"
                  }}
                  transition="all 0.2s"
                >
                  Poor
                </Button>
              </HStack>

              {/* Comment box always visible */}
              <VStack spacing={3} w="100%">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts (optional)..."
                  size="md"
                  rows={3}
                  resize="none"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  _focus={{ 
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                  }}
                  _hover={{
                    borderColor: useColorModeValue("gray.300", "gray.500")
                  }}
                  transition="all 0.2s"
                />
                
                {comment.trim() && (
                  <Button
                    size="md"
                    bgGradient="linear(135deg, #30A0E0, #4FD1FF)"
                    color="white"
                    onClick={handleCommentSubmit}
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    w="100%"
                    isDisabled={!selectedRating}
                    borderRadius="xl"
                    fontWeight="600"
                    boxShadow="0 4px 12px rgba(48, 160, 224, 0.3)"
                    _hover={{
                      bgGradient: "linear(135deg, #2890D0, #3FC1EF)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(48, 160, 224, 0.4)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    transition="all 0.2s"
                  >
                    Send Feedback
                  </Button>
                )}
              </VStack>
            </VStack>
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
            right={{ base: "16px", md: "20px" }}
            bottom={{ base: "80px", md: "90px" }}
            zIndex="1400"
          >
            <Tooltip 
              label="Feedback" 
              placement="left" 
              hasArrow
              bg={useColorModeValue("gray.700", "gray.300")}
              color={useColorModeValue("white", "gray.800")}
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
            >
              <IconButton
                aria-label="Give feedback"
                icon={<Icon as={FiMessageSquare} boxSize={4} />}
                size="sm"
                colorScheme="blue"
                variant="solid"
                borderRadius="full"
                bgGradient="linear(135deg, #30A0E0, #4FD1FF)"
                boxShadow="0 2px 8px rgba(48, 160, 224, 0.3)"
                onClick={handleTriggerClick}
                w="40px"
                h="40px"
                _hover={{ 
                  transform: "scale(1.05)",
                  bgGradient: "linear(135deg, #2890D0, #3FC1EF)",
                  boxShadow: "0 4px 12px rgba(48, 160, 224, 0.4)"
                }}
                _active={{ 
                  transform: "scale(0.95)" 
                }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                color="white"
              />
            </Tooltip>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default UniversalFeedbackSystem;
