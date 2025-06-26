import React, { useRef, useState } from "react";
import { Box, Tooltip, useToast, useOutsideClick } from "@chakra-ui/react";

const FeedbackWidget = () => {
  const [showThumbs, setShowThumbs] = useState(false);
  const toast = useToast();
  const thumbsRef = useRef(null); // 👈 for outside click detection

  useOutsideClick({
    ref: thumbsRef,
    handler: () => setShowThumbs(false), // 👈 close on outside click
  });

  const submitFeedback = async (type: "like" | "dislike") => {
    try {
      const res = await fetch("/api/Feedback/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Unexpected response format");
      }

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Thanks for your feedback!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setShowThumbs(false); // ✅ hide after selection
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
    <Box position="fixed" right="0" top="50%" transform="translateY(-50%)" zIndex="1000">
      <Tooltip label="Give Feedback" aria-label="Feedback Tooltip">
        <Box
          bg="#48BB78"
          color="white"
          p="9px"
          position="fixed"
          right="-60px"
          borderRadius="8px 8px 0px 0px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize="12px"
          cursor="pointer"
          minWidth="140px"
          transition="translateY(-55%), transform 0.3s ease, box-shadow 0.3s ease"
          boxShadow="lg"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center center" }}
          _hover={{ transform: "scale(1.05) rotate(-90deg)", bg: "#2B6CB0", boxShadow: "xl" }}
          onClick={() => setShowThumbs((prev) => !prev)}
        >
          Is this page helpful?
        </Box>
      </Tooltip>

      {showThumbs && (
        <Box
          ref={thumbsRef} // 👈 reference for outside click
          bg="white"
          color="#3182CE"
          p="10px"
          borderRadius="15px"
          position="fixed"
          right="25px"
          top="-70px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="12px"
          mt="10px"
          boxShadow="lg"
          border="1px solid #E2E8F0"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Tooltip label="I like this!" aria-label="Thumbs-Up Tooltip">
            <Box
              as="button"
              bg="#E6FFFA"
              color="#2C7A7B"
              borderRadius="50%"
              p="12px"
              fontSize="20px"
              boxShadow="md"
              transition="background 0.3s ease, transform 0.3s ease"
              _hover={{ bg: "#B2F5EA", transform: "scale(1.1)" }}
              onClick={() => submitFeedback("like")}
              aria-label="Thumbs up"
            >
              👍
            </Box>
          </Tooltip>

          <Tooltip label="Needs Improvement" aria-label="Thumbs-Down Tooltip">
            <Box
              as="button"
              bg="#FED7D7"
              color="#C53030"
              borderRadius="50%"
              p="12px"
              fontSize="20px"
              boxShadow="md"
              transition="background 0.3s ease, transform 0.3s ease"
              _hover={{ bg: "#FEB2B2", transform: "scale(1.1)" }}
              onClick={() => submitFeedback("dislike")}
              aria-label="Thumbs down"
            >
              👎
            </Box>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackWidget;
