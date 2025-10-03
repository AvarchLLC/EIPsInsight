import React, { useRef, useState } from "react";
import { Box, Tooltip, useToast, useOutsideClick } from "@chakra-ui/react";

const FeedbackWidget = () => {
  const [showThumbs, setShowThumbs] = useState(false);
  const toast = useToast();
  const thumbsRef = useRef(null);

  useOutsideClick({
    ref: thumbsRef,
    handler: () => setShowThumbs(false),
  });

  const submitFeedback = async (type: "like" | "dislike") => {
    try {
      const res = await fetch("/api/Feedback/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type,
          page: window.location.href,
          timestamp: new Date().toISOString()
        }),
      });

      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Unexpected response format");
      }

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Thanks for your feedback! 🎉",
          description: "Your feedback helps us improve EIPs Insight",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setShowThumbs(false);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      toast({
        title: "Error submitting feedback",
        description: err?.message || "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="fixed" right="4" top="50%" transform="translateY(-50%)" zIndex="1000">
      <Box
        ref={thumbsRef}
        bg="rgba(255, 255, 255, 0.95)"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="full"
        p={2}
        shadow="lg"
        backdropFilter="blur(8px)"
        transition="all 0.3s ease"
        _hover={{ shadow: "xl", transform: "scale(1.05)" }}
      >
        {!showThumbs ? (
          <Tooltip label="Rate this page" placement="left">
            <Box
              as="button"
              onClick={() => setShowThumbs(true)}
              p={2}
              borderRadius="full"
              color="gray.600"
              _hover={{ color: "blue.500", bg: "blue.50" }}
              transition="all 0.2s"
            >
              💬
            </Box>
          </Tooltip>
        ) : (
          <Box display="flex" gap={1}>
            <Tooltip label="👍 I like this page">
              <Box
                as="button"
                onClick={() => submitFeedback("like")}
                p={2}
                borderRadius="full"
                color="green.500"
                _hover={{ bg: "green.50", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                👍
              </Box>
            </Tooltip>
            <Tooltip label="👎 I don't like this page">
              <Box
                as="button"
                onClick={() => submitFeedback("dislike")}
                p={2}
                borderRadius="full"
                color="red.500"
                _hover={{ bg: "red.50", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                👎
              </Box>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackWidget;
