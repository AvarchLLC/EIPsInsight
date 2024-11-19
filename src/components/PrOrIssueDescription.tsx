import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface MarkdownBoxProps {
  text: string|undefined;
}

const MarkdownBox: React.FC<MarkdownBoxProps> = ({ text }) => {
  // Get background colors for light and dark modes
  const codeBg = useColorModeValue('#f5f5f5', '#2d3748'); // Light and dark mode background for code blocks
  const preCodeBg = useColorModeValue('#f5f5f5', '#2d3748'); // Light and dark mode background for block code

  return (
    <Box
      border="1px"
      borderColor="blue.400"
      p="4"
      rounded="lg"
      maxWidth="100%"
      overflow="hidden"
      style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
    >
      <Text fontSize="xl" overflow="hidden">
        <ReactMarkdown
          components={{
            code({ inline, children, ...props }) {
              return inline ? (
                <code
                  style={{
                    whiteSpace: 'break-spaces',
                    wordBreak: 'break-word',
                    backgroundColor: codeBg, // Adjusted dynamic background color for inline code
                    padding: '4px 6px', // Padding for inline code
                    borderRadius: '4px',
                    display: 'inline-block', // Ensure inline block behavior
                  }}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <pre
                  style={{
                    overflowX: 'auto',
                    backgroundColor: preCodeBg, // Adjusted dynamic background color for block code
                    padding: '12px 16px', // Padding for block code
                    borderRadius: '4px',
                    maxWidth: '100%',
                    margin: 0, // Remove default <pre> margin
                  }}
                  {...props}
                >
                  <code>{children}</code>
                </pre>
              );
            },
          }}
        >
          {text || ''}
        </ReactMarkdown>
      </Text>
    </Box>
  );
};

export default MarkdownBox;
