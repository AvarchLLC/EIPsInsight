import { Box, Text, Link } from "@chakra-ui/react";

interface ErrorListProps {
  errors: string[];
}

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  // Function to detect and replace URLs with clickable links
  const renderErrorWithLinks = (error: string) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the error message by URLs and map over the parts
    return error.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        // If the part is a URL, wrap it in a Link component
        return (
          <Link key={index} href={part} color="blue.500" isExternal>
            {part}
          </Link>
        );
      } else {
        // Otherwise, return the part as plain text
        return part;
      }
    });
  };

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>
        Validation Errors:
      </Text>
      {errors.map((error, index) => (
        <Text key={index}>{renderErrorWithLinks(error)}</Text>
      ))}
    </Box>
  );
};