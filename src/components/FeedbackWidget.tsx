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
      {/* FeedbackWidget content removed - replaced by UniversalFeedbackSystem */}
    </Box>
  );
};

export default FeedbackWidget;
