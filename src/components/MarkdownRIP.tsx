import NLink from "next/link";
import {
  Heading,
  Link,
  Text,
  Code,
  Divider,
  Image,
  UnorderedList,
  OrderedList,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/Codehelper";

export const extractRIPNumber = (RIPOrNo: string, prefix: string): string => {
  const match = RIPOrNo.match(
    new RegExp(`^${prefix}-(\\d+)(?:\\.md)?$|^(\\d+)$`)
  );
  if (match) {
    return match[1] || match[2];
  } else {
    throw new Error("Invalid RIP format");
  }
};

const isRelativeURL = (url: string) => {
  const absolutePattern = new RegExp("^(?:[a-z]+:)?//", "i");
  return !absolutePattern.test(url);
};

const resolveURL = (markdownFileURL: string, url: string) => {
  if (isRelativeURL(url)) {
    const markdownFilePath = new URL(markdownFileURL);
    const basePath = markdownFilePath.href.substring(
      0,
      markdownFilePath.href.lastIndexOf("/")
    );
    return new URL(url, `${basePath}/`).href;
  }
  return url;
};

type GetCoreProps = {
  children?: React.ReactNode;
  "data-sourcepos"?: any;
};

function getCoreProps(props: GetCoreProps): any {
  return props["data-sourcepos"]
    ? { "data-sourcepos": props["data-sourcepos"] }
    : {};
}

export const Markdown = ({
  md,
  markdownFileURL,
}: {
  md: string;
  markdownFileURL: string;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (props) => {
          const { children } = props;
          return <Text mb={2}>{children}</Text>;
        },
        em: (props) => {
          const { children } = props;
          return <Text as="em">{children}</Text>;
        },
        blockquote: (props) => {
          const { children } = props;
          return (
            <Code as="blockquote" p={2} rounded={"lg"}>
              {children}
            </Code>
          );
        },
        code: (props) => {
          const { children, className } = props;
          const isMultiLine = children!.toString().includes("\n");

          if (!isMultiLine) {
            return (
              <Code mt={1} p={1} rounded={"lg"}>
                {children}
              </Code>
            );
          }

          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "javascript";
          return (
            <Box
            position="relative"
            w={{ base: "100%", sm: "600px", md: "800px", lg: "1000px", xl: "1200px" }}  // Responsive width
            maxW="1200px"          // Maximum width to prevent exceeding this value
            overflowX="auto"       // Allow horizontal scroll if needed
            borderRadius="lg"
            p={5}
            mx="auto"              // Center horizontally
            textAlign="center"
            >
              <CodeBlock language={language}>{children as string}</CodeBlock>
            </Box>
          );
        },
        del: (props) => {
          const { children } = props;
          return <Text as="del">{children}</Text>;
        },
        hr: () => {
          return <Divider />;
        },
        a: (props) => {
            const url = props.href ?? "";
          
            let isRIPLink = false;
            let RIPNumber = "";
          
            try {
              const RIPPattern = /rip-(\d+)/;
              const match = url.match(RIPPattern);
              if (match) {
                isRIPLink = true;
                RIPNumber = match[1];  // Extract the RIP number
              }
            } catch {}
          
            if (isRIPLink) {
              return (
                <NLink href={`/rips/rip-${RIPNumber}`}>
                  <Text as={"span"} color="blue.500" textDecor={"underline"}>
                    {props.children}
                  </Text>
                </NLink>
              );
            } else {
              return (
                <Link
                  {...props}
                  href={resolveURL(markdownFileURL, url)}
                  color="blue.500"
                  isExternal
                />
              );
            }
          },          
        img: (props) => (
          <Image
            {...props}
            src={resolveURL(markdownFileURL, props.src as string)}
          />
        ),
        text: (props) => {
          const { children } = props;
          return <Text as="span">{children}</Text>;
        },
        ul: (props) => {
          const { children } = props;
          const attrs = getCoreProps(props);
          return (
            <UnorderedList
              spacing={2}
              as="ul"
              styleType="disc"
              pl={4}
              {...attrs}
            >
              {children}
            </UnorderedList>
          );
        },
        ol: (props) => {
          const { children } = props;
          const attrs = getCoreProps(props);
          return (
            <OrderedList
              spacing={2}
              as="ol"
              styleType="decimal"
              pl={4}
              {...attrs}
            >
              {children}
            </OrderedList>
          );
        },
        li: (props) => {
          const { children } = props;
          return (
            <ListItem {...getCoreProps(props)} listStyleType="inherit">
              {children}
            </ListItem>
          );
        },
        h1: (props) => {
          return (
            <Heading my={4} as={`h1`} size={"2xl"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h2: (props) => {
          return (
            <Heading my={4} as={`h2`} size={"xl"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h3: (props) => {
          return (
            <Heading my={4} as={`h3`} size={"lg"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h4: (props) => {
          return (
            <Heading my={4} as={`h4`} size={"md"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h5: (props) => {
          return (
            <Heading my={4} as={`h5`} size={"sm"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h6: (props) => {
          return (
            <Heading my={4} as={`h6`} size={"xs"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        pre: (props) => {
          const { children } = props;
          return <Code {...getCoreProps(props)}>{children}</Code>;
        },
        table: (props) => (
          <Box overflowX={"auto"}>
            <Table variant="simple" border="1px solid" borderColor="gray.200">
              {props.children}
            </Table>
          </Box>
        ),
        thead: (props) => (
          <Thead borderBottom="2px solid" borderColor="gray.500" {...props} />
        ),
        tbody: Tbody,
        tr: (props) => <Tr borderBottom="1px solid" borderColor="gray.300">{props.children}</Tr>,
        td: (props) => (
          <Td border="1px solid" borderColor="gray.300" p={3}>
            {props.children}
          </Td>
        ),
        th: (props) => (
          <Th border="1px solid" borderColor="gray.300" p={3}>
            {props.children}
          </Th>
        ),
      }}
    >
      {md}
    </ReactMarkdown>
  );
};
