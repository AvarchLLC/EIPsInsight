import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Textarea,
  Select,
  useToast,
  IconButton,
  Switch,
  Table, 
  TableContainer,
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr,
  Wrap, 
  WrapItem,
  Spinner
} from "@chakra-ui/react";
import {
  DownloadIcon,
  AddIcon,
} from "@chakra-ui/icons";
import { ViewIcon, EditIcon, ViewOffIcon } from "@chakra-ui/icons";
import { BiColumns } from "react-icons/bi";
import { FaBold, FaItalic, FaLink, FaListUl, FaListOl, FaCheckSquare, FaCode, FaQuoteLeft, FaHeading, FaTable, FaMinus, FaImage } from 'react-icons/fa';
// import { IconButton, Text, HStack } from '@chakra-ui/react';
import { MarkdownViewer } from 'react-github-markdown';


type TemplateData = typeof initialTemplateData;
type TemplateDataKeys = keyof TemplateData;

const initialTemplateData = {
  title: "",
  description: "",
  author: "",
  discussionsTo: "",
  status: "Draft",
  type: "",
  category: "",
  created: "",
  requires: "",
  abstract: "",
  motivation: "",
  specification: "",
  rationale: "",
  backwardsCompatibility: "",
  testCases: "",
  referenceImplementation: "",
  securityConsiderations: "",
};

type Step = {
  label: string;
  key: TemplateDataKeys;
  type: "input" | "textarea" | "select";
  options?: string[];
};

const initialSteps: Step[] = [
  { label: "Title", key: "title", type: "input" },
  { label: "Description", key: "description", type: "textarea" },
  { label: "Author", key: "author", type: "input" },
  { label: "Discussions To", key: "discussionsTo", type: "input" },
  { label: "Status", key: "status", type: "select", options: ["Draft"] },
  { label: "Type", key: "type", type: "select", options: ["Standards Track", "Meta", "Informational"] },
  { label: "Created", key: "created", type: "input" },
  { label: "Requires", key: "requires", type: "input" },
  { label: "Abstract", key: "abstract", type: "textarea" },
  { label: "Motivation", key: "motivation", type: "textarea" },
  { label: "Specification", key: "specification", type: "textarea" },
  { label: "Rationale", key: "rationale", type: "textarea" },
  { label: "Compatibility", key: "backwardsCompatibility", type: "textarea" },
  { label: "Test Cases", key: "testCases", type: "textarea" },
  { label: "Reference Implementation", key: "referenceImplementation", type: "textarea" },
  { label: "Security Considerations", key: "securityConsiderations", type: "textarea" },
];

const EipTemplateEditor = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [templateData, setTemplateData] = useState<TemplateData>(initialTemplateData);
  const [viewMode, setViewMode] = useState<"edit" | "output" | "split">("split");
  const [preview, setPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  

  const handleInputChange = (key: TemplateDataKeys, value: string) => {
    setTemplateData((prev) => ({ ...prev, [key]: value }));

    if (key === "type" && value === "Standards Track") {
      setSteps((prevSteps) => [
        ...prevSteps.slice(0, 6),
        { label: "Category", key: "category", type: "select", options: ["Core", "Networking", "Interface", "ERC"] },
        ...prevSteps.slice(6),
      ]);
    } else if (key === "type" && value !== "Standards Track") {
      setSteps((prevSteps) => prevSteps.filter((step) => step.key !== "category"));
    }
  };

  const handleMarkdownInsert = (key: TemplateDataKeys, syntax: string) => {
    setTemplateData((prev) => ({
      ...prev,
      [key]: `${prev[key] || ""}${syntax}`,
    }));
  };

  const renderTemplate = () => {

    const template = `---
eip: <TBD>
title: ${templateData.title}
description: ${templateData.description}
author: ${templateData.author}
discussions-to: ${templateData.discussionsTo}
status: ${templateData.status}
type: ${templateData.type}
${templateData.type === "Standards Track" && templateData.category ? `category: ${templateData.category}` : ""}
created: ${templateData.created}
${templateData.requires ? `requires: ${templateData.requires}` : ""}
---
  
## Abstract
${templateData.abstract}
  
## Motivation
${templateData.motivation}
  
## Specification
${templateData.specification}
  
## Rationale
${templateData.rationale}
  
## Backwards Compatibility
${templateData.backwardsCompatibility}
  
## Test Cases
${templateData.testCases}
  
## Reference Implementation
${templateData.referenceImplementation}
  
## Security Considerations
${templateData.securityConsiderations}
  
## Copyright
Copyright and related rights waived via [CC0](../LICENSE.md).
`;

    const cleanedTemplate = template.replace(/---\n([\s\S]*?)\n---/, (match, content) => {
      const cleanedContent = content
        .split("\n")
        .filter((line:any) => line.trim() !== "") // Remove empty lines
        .join("\n");
      return `---\n${cleanedContent}\n---`;
    });

    return cleanedTemplate
  };

  const rendermdfile = () => {

    const template = `---
eip: <TBD>
title: ${templateData.title}
description: ${templateData.description}
author: ${templateData.author}
discussions-to: ${templateData.discussionsTo}
status: ${templateData.status}
type: ${templateData.type}
${templateData.type === "Standards Track" && templateData.category ? `category: ${templateData.category}` : ""}
created: ${templateData.created}
${templateData.requires ? `requires: ${templateData.requires}` : ""}
---
  
## Abstract
${templateData.abstract}
  
## Motivation
${templateData.motivation}
  
## Specification
${templateData.specification}
  
## Rationale
${templateData.rationale}
  
## Backwards Compatibility
${templateData.backwardsCompatibility}
  
## Test Cases
${templateData.testCases}
  
## Reference Implementation
${templateData.referenceImplementation}
  
## Security Considerations
${templateData.securityConsiderations}
  
## Copyright
Copyright and related rights waived via [CC0](../LICENSE.md).
`;

    const cleanedTemplate = template.replace(/---\n([\s\S]*?)\n---/, (match, content) => {
      const cleanedContent = content
        .split("\n")
        .filter((line:any) => line.trim() !== "") // Remove empty lines
        .join("\n");
      return `---\n${cleanedContent}\n---`;
    });

    return cleanedTemplate
  };

  const markdownContent = rendermdfile();
  
  // Split the content
  const splitContent = markdownContent.split(/---\n/); // Split by "---"
  const tableContent = splitContent[1]?.trim() || ""; // Extract the content between "---"
  const markdownValue = splitContent.length > 2 ? splitContent.slice(2).join("---\n").trim() : ""; // Rest of the markdown

  const tableRows = tableContent
  .split("\n") // Split rows by newline
  .filter((line) => line.trim()) // Remove empty lines
  .map((row) => {
    // Match key-value pairs with optional URL handling
    const match = row.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      return [match[1].trim(), match[2].trim()]; // Return key-value pairs
    }
    return [row.trim(), ""]; // Handle rows without a colon
  });


    const handleDownload = async () => {
      // const [isLoading, setIsLoading] = useState(false);
    
      const requiredHeaders: TemplateDataKeys[] = [
        "title",
        "description",
        "author",
        "discussionsTo",
        "status",
        "type",
        "created",
      ];
    
      const missingHeaders: string[] = [];
      const unrecognizedHeaders: string[] = [];
      const errorMessages: string[] = [];
    
      setIsLoading(true); // Show spinner
    
      // Check if any required header is missing
      requiredHeaders.forEach((header) => {
        if (!templateData[header] || templateData[header].trim() === "") {
          missingHeaders.push(header);
        }
      });
    
      // Author field validation
      const authorRegex = /@\w+/;
      if (!authorRegex.test(templateData.author)) {
        errorMessages.push("The authors field should contain at least one GitHub handle in the format @xyz.");
      }
    
      // DiscussionsTo field validation
      const discussionsRegex = /^https:\/\/ethereum-magicians\.org\/t\/.+$/;
      if (templateData.discussionsTo && !discussionsRegex.test(templateData.discussionsTo)) {
        errorMessages.push("The discussions-to field should contain a valid link to ethereum-magicians.org.");
      }
    
      // Requires field validation
      if (templateData.requires) {
        const requiresNumbers = templateData.requires
          .split(",")
          .map((num) => num.trim())
          .filter((num) => /^\d+$/.test(num));
    
        for (const num of requiresNumbers) {
          const links = [
            `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${num}.md`,
            `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${num}.md`,
            `https://raw.githubusercontent.com/ethereum/ERCs/master/EIPS/erc-${num}.md`,
          ];
    
          let isValid = false;
          for (const link of links) {
            try {
              const response = await fetch(link);
              if (response.ok) {
                isValid = true;
                break;
              }
            } catch {
              // Ignore fetch errors
            }
          }
    
          if (!isValid) {
            errorMessages.push(`The requires field contains an invalid reference: ${num}.`);
          }
        }
      }
    
      // Check for unrecognized headers (like category)
      if (templateData.type === "Standards Track" && !templateData.category) {
        unrecognizedHeaders.push("category");
      }
    
      if (missingHeaders.length > 0 || unrecognizedHeaders.length > 0 || errorMessages.length > 0) {
        // Compile error messages
        const numberedErrors = [
          ...missingHeaders.map((header, index) => `${index + 1}. Missing Header: ${header}`),
          ...unrecognizedHeaders.map((header, index) => `${missingHeaders.length + index + 1}. Unrecognized Header: ${header}`),
          ...errorMessages.map((message, index) => `${missingHeaders.length + unrecognizedHeaders.length + index + 1}. ${message}`),
        ];
    
        toast({
          title: "Error in Template",
          description: numberedErrors.join("\n"), // Separate each error with a new line
          status: "error",
          duration: 5000,
          isClosable: true,
        });
    
        setIsLoading(false); // Hide spinner
        return; // Stop execution if errors are present
      }
    
      // Proceed with template generation if no errors
      const template = `---
    // Template content as in your original code
    ---`;
    
      const cleanedTemplate = template.replace(/---\n([\s\S]*?)\n---/, (match, content) => {
        const cleanedContent = content
          .split("\n")
          .filter((line: any) => line.trim() !== "") // Remove empty lines
          .join("\n");
        return `---\n${cleanedContent}\n---`;
      });
    
      const blob = new Blob([cleanedTemplate], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "eip_template.md";
      link.click();
      URL.revokeObjectURL(url);
    
      toast({
        title: "Template Downloaded",
        status: "success",
        duration: 2000,
      });
    
      setIsLoading(false); // Hide spinner
    };
    
    
    
    
  

  return (
    <Box p={5} mx="auto" bg="gray.200" _dark={{ bg: "gray.900", color: "gray.200" }} color="black" borderRadius="lg">
  <Box
    p={4}
    bg="gray.300"
    _dark={{ bg: "gray.800" }}
    borderRadius="md"
    display="flex"
    flexWrap="wrap"
    justifyContent="space-between"
    alignItems="center"
    gap={4} // Adds spacing between rows when wrapped
  >
    <HStack spacing={4} flexWrap="wrap">
    <Button
        leftIcon={<BiColumns />}
        colorScheme="blue"
        variant={viewMode === "split" ? "solid" : "outline"}
        _hover={{ bg: viewMode !== "split" ? "blue.700" : undefined }}
        _dark={{
          bg: viewMode === "split" ? "blue.500" : "transparent",
          color: viewMode === "split" ? "white" : "blue.300",
          borderColor: "blue.300",
        }}
        onClick={() => setViewMode("split")}
      >
        Split
      </Button>
      <Button
        leftIcon={<EditIcon />}
        colorScheme="blue"
        variant={viewMode === "edit" ? "solid" : "outline"}
        _hover={{ bg: viewMode !== "edit" ? "blue.700" : undefined }}
        _dark={{
          bg: viewMode === "edit" ? "blue.500" : "transparent",
          color: viewMode === "edit" ? "white" : "blue.300",
          borderColor: "blue.300",
        }}
        onClick={() => setViewMode("edit")}
      >
        Edit
      </Button>
      <Button
        leftIcon={<ViewIcon />}
        colorScheme="blue"
        variant={viewMode === "output" ? "solid" : "outline"}
        _hover={{ bg: viewMode !== "output" ? "blue.700" : undefined }}
        _dark={{
          bg: viewMode === "output" ? "blue.500" : "transparent",
          color: viewMode === "output" ? "white" : "blue.300",
          borderColor: "blue.300",
        }}
        onClick={() => setViewMode("output")}
      >
        Output
      </Button>
      
    </HStack>
    <Button
    rightIcon={isLoading ? <Spinner size="sm" /> : <DownloadIcon />}
    colorScheme="blue"
    mt={[4, 0]} // Adds spacing for smaller screens
    _dark={{
      bg: "blue.600",
      color: "white",
      _hover: { bg: "blue.700" },
    }}
    onClick={handleDownload}
    isDisabled={isLoading} // Disable button while loading
  >
    {isLoading ? "Validating..." : "Download"}
  </Button>
  </Box>

  <Box
    display="flex"
    flexDirection={["column","column", "row"]} // Stacks vertically on small screens
    height="800px"
    mt={4}
    gap={4} // Adds spacing between editor and output
    _dark={{
      bg: "gray.800",
      color: "gray.200",
    }}
  >
    
    {(viewMode === "edit" || viewMode === "split") && (
      <Box
        flex="1"
        p={4}
        minWidth={["100%", "50%"]}
        overflowY="auto"
        bg="gray.100"
        _dark={{ bg: "gray.700" }}
        borderRadius="md"
        boxShadow="sm"
        fontSize={["sm", "md", "lg"]} // Adjust font size based on screen size
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px", // Width of the scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3182ce", // Color of the scrollbar thumb
            borderRadius: "4px", // Rounded edges for the thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#2b6cb0", // Darker color on hover
          },
          "&::-webkit-scrollbar-track": {
            background: "#edf2f7", // Light background for the track
          },
        }}
      >
        <VStack spacing={5}>
          <Text fontSize={["sm", "md", "3xl"]} fontWeight="bold">
            Create an EIP Template
          </Text>
          {steps.map((step, index) => (
            <Box key={index} w="100%">
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {step.label}
              </Text>
              {step.type === "input" && (
                <Input
                placeholder={
                  step.label === "Title"
                    ? "Enter title"
                    : step.label === "Description"
                    ? "Enter description"
                    : step.label === "Author"
                    ? "Enter author names, Ex: Sam Wilson(@SamWilsn)"
                    : step.label === "Discussions To"
                    ? "Enter discussion link, Ex: https://ethereum-magicians.org/t/eip-...."
                    : step.label === "Created"
                    ? "Enter date, Ex: 2024-01-18"
                    : step.label
                }
                  value={templateData[step.key] || ""}
                  onChange={(e) => handleInputChange(step.key, e.target.value)}
                  borderWidth="2px"
                />
              )}
              {step.type === "textarea" && (
                <Box>
                  <HStack spacing={2} mb={2} wrap="wrap">
  <Wrap spacing={2}>
    {/* Bold */}
    <WrapItem>
      <IconButton
        icon={<FaBold />}
        aria-label="Bold"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "**bold** ")}
      />
    </WrapItem>

    {/* Italic */}
    <WrapItem>
      <IconButton
        icon={<FaItalic />}
        aria-label="Italic"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "*italic* ")}
      />
    </WrapItem>

    {/* H1 */}
    <WrapItem>
      <IconButton
        icon={<FaHeading />}
        aria-label="H1"
        size="sm"
        fontSize="lg"
        onClick={() => handleMarkdownInsert(step.key, "# Heading 1\n")}
      />
    </WrapItem>

    {/* H2 */}
    <WrapItem>
      <IconButton
        icon={<FaHeading />}
        aria-label="H2"
        size="sm"
        fontSize="md"
        onClick={() => handleMarkdownInsert(step.key, "## Heading 2\n")}
      />
    </WrapItem>

    {/* H3 */}
    <WrapItem>
      <IconButton
        icon={<FaHeading />}
        aria-label="H3"
        size="sm"
        fontSize="sm"
        onClick={() => handleMarkdownInsert(step.key, "### Heading 3\n")}
      />
    </WrapItem>

    {/* Code */}
    <WrapItem>
      <IconButton
        icon={<FaCode />}
        aria-label="Code"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "`code` ")}
      />
    </WrapItem>

    {/* Quote */}
    <WrapItem>
      <IconButton
        icon={<FaQuoteLeft />}
        aria-label="Quote"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "> quote\n")}
      />
    </WrapItem>

    {/* Generic List */}
    <WrapItem>
      <IconButton
        icon={<FaListUl />}
        aria-label="Generic List"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "- item\n")}
      />
    </WrapItem>

    {/* Numbered List */}
    <WrapItem>
      <IconButton
        icon={<FaListOl />}
        aria-label="Numbered List"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "1. item\n")}
      />
    </WrapItem>

    {/* Checklist */}
    <WrapItem>
      <IconButton
        icon={<FaCheckSquare />}
        aria-label="Checklist"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "- [ ] item\n")}
      />
    </WrapItem>

    {/* Create Link */}
    <WrapItem>
      <IconButton
        icon={<FaLink />}
        aria-label="Create Link"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "[link](url) ")}
      />
    </WrapItem>

    {/* Insert Table */}
    <WrapItem>
      <IconButton
        icon={<FaTable />}
        aria-label="Insert Table"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "| Header | Header |\n|-------|-------|\n| Cell  | Cell  |\n")}
      />
    </WrapItem>

    {/* Horizontal Line */}
    <WrapItem>
      <IconButton
        icon={<FaMinus />}
        aria-label="Horizontal Line"
        size="sm"
        onClick={() => handleMarkdownInsert(step.key, "---\n")}
      />
    </WrapItem>

  </Wrap>
</HStack>

  
  

                  <Textarea
                    placeholder={step.label}
                    value={templateData[step.key] || ""}
                    onChange={(e) => handleInputChange(step.key, e.target.value)}
                    size="lg"
                    resize="vertical"
                    height="300px"
                    width="100%"
                    borderWidth="2px"
                  />
                </Box>
              )}
              {step.type === "select" && (
                <Select
                  placeholder={`Select ${step.label}`}
                  value={templateData[step.key] || ""}
                  onChange={(e) => handleInputChange(step.key, e.target.value)}
                  borderWidth="2px"
                >
                  {step.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
    )}
    {(viewMode === "output" || viewMode === "split") && (
      <Box
        flex="1"
        p={4}
        minWidth={["100%", "50%"]}
        bg="gray.100"
        _dark={{ bg: "gray.700" }}
        borderRadius="md"
        boxShadow="sm"
        overflowY="auto"
        whiteSpace="pre-wrap"
        fontSize={["sm", "md", "lg"]} // Adjust font size based on screen size
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px", // Width of the scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3182ce", // Color of the scrollbar thumb
            borderRadius: "4px", // Rounded edges for the thumb
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#2b6cb0", // Darker color on hover
          },
          "&::-webkit-scrollbar-track": {
            background: "#edf2f7", // Light background for the track
          },
        }}
      >
        {/* <Text fontFamily="monospace">{renderTemplate()}</Text> */}
        <Box p={6}  maxW="900px" mx="auto">
      <VStack spacing={4} align="start">
        <Box display="flex" justifyContent="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold">
            {preview ? "Markdown Preview" : "Markdown Code"}
          </Text>
          <HStack spacing={4} flexWrap="wrap">
    <Button
        // leftIcon={<BiColumns />}
        colorScheme="blue"
        variant={preview === false ? "solid" : "outline"}
        _hover={{ bg: preview !== false ? "blue.700" : undefined }}
        _dark={{
          bg: preview === false ? "blue.500" : "transparent",
          color: preview === false ? "white" : "blue.300",
          borderColor: "blue.300",
        }}
        onClick={() => setPreview(false)}
      >
        Code
      </Button>
      
      <Button
        // leftIcon={<ViewIcon />}
        colorScheme="blue"
        variant={preview === true ? "solid" : "outline"}
        _hover={{ bg: preview !== true ? "blue.700" : undefined }}
        _dark={{
          bg: preview === true ? "blue.500" : "transparent",
          color: preview === true ? "white" : "blue.300",
          borderColor: "blue.300",
        }}
        onClick={() => setPreview(true)}
      >
        Preview
      </Button>
      
    </HStack>
        </Box>
        <Box
          w="full"
          p={4}
          borderRadius="md"
          bg={preview ? "gray.100" : "gray.900"}
          color={preview ? "black" : "white"}
          _dark={{ bg: preview ? "gray.700" : "gray.800", color: preview ? "white" : "gray.300" }}
          overflow="auto"
          // maxH="600px"
        >
          {preview ? (
            <Box
            w="full"
            p={4}
            borderRadius="md"
            bg={"gray.900" }
            color={preview ? "black" : "white"}
            _dark={{ bg: "gray.900", color: preview ? "white" : "gray.300" }}
            overflow="auto"
          >
            {tableRows.length > 0 && (
            <TableContainer mt={4}>
            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th color="white">Field</Th>
                  <Th color="white">Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableRows.map((row, index) => (
                  <Tr key={index}>
                    <Td color="white">{row[0]}</Td>
                    <Td color="white">{row[1]}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>          
          )}
          <br/>
            <MarkdownViewer value={markdownValue} isDarkTheme={preview} />
          </Box>
          ) : (
            <Box as="pre" fontFamily="monospace" fontSize="sm">
              {renderTemplate()}
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
      </Box>
    )}
  </Box>
</Box>

  );
  
};  

export default EipTemplateEditor;
