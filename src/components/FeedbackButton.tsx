import React, { useState } from "react";
import { Tooltip, Box, Icon, Text } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FeedbackButton = () => {
  const [isThumbsVisible, setIsThumbsVisible] = useState(false); // Indicates if thumbs-up/down buttons are visible

  // Function to scroll to the comments section
  const scrollToCommentsSection = () => {
    const commentsSectionElement = document.getElementById("comments");
    if (commentsSectionElement) {
      commentsSectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box>
      {/* Floating Feedback Button */}
      <Box
        position="fixed"
        right="-15px" // Push the button further into the scrollbar area
        top="50%"
        transform="translateY(-50%)"
        zIndex="1000"
        display="flex"
        flexDirection="column" // Stack items vertically
        alignItems="center" // Center-align items
        gap="10px" // Spacing between text and button
        onMouseEnter={() => setIsThumbsVisible(true)} // Show thumbs when hovering
        onMouseLeave={() => setIsThumbsVisible(false)} // Hide thumbs when not hovering
      >
        {/* Feedback Button */}
        <Tooltip label="Give Feedback" aria-label="Feedback Tooltip">
          <Box
            bgGradient="linear(to-r, #3182CE, #63B3ED)" // Gradient background
            color="white"
            p="12px"
            borderRadius="50%" // Make the button circular
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="16px"
            fontWeight="bold"
            cursor="pointer"
            boxShadow="lg"
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{
              transform: "scale(1.1)",
              boxShadow: "xl",
            }}
            onClick={scrollToCommentsSection} // Scroll to comments section when clicked
          >
            Feedback
          </Box>
        </Tooltip>

        {/* Feedback Label */}
        <Text fontSize="sm" fontWeight="medium" color="#555" textAlign="center">
          Give Feedback
        </Text>

        {/* Thumbs-up and Thumbs-down Buttons */}
        {isThumbsVisible && (
          <Box
            bg="white"
            color="#3182CE"
            p="10px"
            borderRadius="15px"
            display="flex"
            flexDirection="column" // Stack thumbs vertically
            alignItems="center"
            justifyContent="center"
            gap="12px" // Spacing between thumbs
            mt="10px"
            boxShadow="lg"
            border="1px solid #E2E8F0"
            transition="opacity 0.3s ease, transform 0.3s ease"
            _hover={{
              transform: "scale(1.05)",
            }}
          >
            {/* Thumbs-Up Button */}
            <Tooltip label="I like this!" aria-label="Thumbs-Up Tooltip">
              <Box
                as="button"
                bg="#E6FFFA" // Light green background
                color="#2C7A7B"
                borderRadius="50%"
                p="12px"
                fontSize="24px"
                boxShadow="md"
                transition="background 0.3s ease, transform 0.3s ease"
                _hover={{
                  bg: "#B2F5EA", // Slightly darker green on hover
                  transform: "scale(1.1)",
                }}
                onClick={scrollToCommentsSection} // Scroll to comments when Thumbs-Up is clicked
              >
                <Icon as={FaThumbsUp} />
              </Box>
            </Tooltip>

            {/* Thumbs-Down Button */}
            <Tooltip label="Needs Improvement" aria-label="Thumbs-Down Tooltip">
              <Box
                as="button"
                bg="#FED7D7" // Light red background
                color="#C53030"
                borderRadius="50%"
                p="12px"
                fontSize="24px"
                boxShadow="md"
                transition="background 0.3s ease, transform 0.3s ease"
                _hover={{
                  bg: "#FEB2B2", // Slightly darker red on hover
                  transform: "scale(1.1)",
                }}
                onClick={scrollToCommentsSection} // Scroll to comments when Thumbs-Down is clicked
              >
                <Icon as={FaThumbsDown} />
              </Box>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackButton;
