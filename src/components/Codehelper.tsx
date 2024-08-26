import { Box } from "@chakra-ui/react";  
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type CodeBlockProps = {
  children: string;
  language: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language }) => {
  return (
    <Box
      position="relative"
      overflow="auto"
      rounded="xl"
      mx="auto"
      maxW={{ base: "100%", sm: "600px", md: "800px", lg: "1000px", xl: "1200px" }}
    >
      <SyntaxHighlighter
        language={language}  
        style={dracula}  
        lineProps={{
          style: {
            wordBreak: "break-all", 
            whiteSpace: "pre-wrap",  
          },
        }}
        wrapLines={true}  
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  );
};
