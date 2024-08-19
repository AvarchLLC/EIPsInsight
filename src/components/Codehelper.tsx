import { Box } from "@chakra-ui/react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";

const draculaStyle = {
  'code[class*="language-"]': {
    color: "#f8f8f2",
    background: "#282a36",
    fontFamily: "'Fira Code', 'Fira Mono', 'Courier New', Courier, monospace",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    tabSize: "4",
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#f8f8f2",
    background: "#282a36",
    fontFamily: "'Fira Code', 'Fira Mono', 'Courier New', Courier, monospace",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    tabSize: "4",
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.3em",
  },
  comment: { color: "#6272a4" },
  prolog: { color: "#6272a4" },
  doctype: { color: "#6272a4" },
  cdata: { color: "#6272a4" },
  punctuation: { color: "#f8f8f2" },
  ".namespace": { opacity: 0.7 },
  property: { color: "#ff79c6" },
  keyword: { color: "#ff79c6" },
  tag: { color: "#ff79c6" },
  "class-name": { color: "#50fa7b" },
  boolean: { color: "#bd93f9" },
  constant: { color: "#bd93f9" },
  symbol: { color: "#ffb86c" },
  deleted: { color: "#ff5555" },
  number: { color: "#bd93f9" },
  selector: { color: "#50fa7b" },
  "attr-name": { color: "#50fa7b" },
  string: { color: "#f1fa8c" },
  char: { color: "#f1fa8c" },
  builtin: { color: "#ff79c6" },
  inserted: { color: "#50fa7b" },
  variable: { color: "#f8f8f2" },
  operator: { color: "#f8f8f2" },
  entity: { color: "#f8f8f2" },
  url: { color: "#f8f8f2" },
  "arrow-function": { color: "#ff79c6" },
  "attr-value": { color: "#f1fa8c" },
  regex: { color: "#ffb86c" },
  important: { fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

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
        style={draculaStyle}
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
