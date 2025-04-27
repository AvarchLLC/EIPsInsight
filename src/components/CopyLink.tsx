import { IconButton, useToast } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useState } from "react";

// Reusable CopyLink component
interface CopyLinkProps {
  link: string;
  style?: React.CSSProperties;
}

const CopyLink: React.FC<CopyLinkProps> = ({ link, style }) => {
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  // Function to copy the link to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy!",
        description: "There was an issue copying the link.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  return (
    <IconButton
      icon={<CopyIcon />}
      style={style}
      aria-label="Copy link"
      onClick={copyToClipboard}
      size="lg" // Increase the size of the icon button
      variant="link"
      color="blue.400"
      marginLeft={2}
      bg="gray.200" // Set the background color to gray
      borderRadius="md" // Partially rounded corners
      _hover={{
        bg: "gray.300", // Darker gray on hover
      }}
      _active={{
        bg: "gray.400", // Even darker gray when active
      }}
      fontSize="2xl" // Make the icon much bigger (you can adjust the size)
      padding="0.5rem" // Add padding around the icon
      marginY="0.5rem" // Add vertical margin (top and bottom)
    />
  );
};

export default CopyLink;
