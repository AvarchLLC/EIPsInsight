import { useToast } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Text,
  VStack,
  HStack,
  Textarea,
  Select,
  IconButton,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  InputGroup,
  InputRightElement,
  Thead,
  Tr,
  Flex,
  Wrap,
  WrapItem,
  Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
} from "@chakra-ui/react";


var initialTemplateData = {
  eip: "<TBD>",
  title: "",
  description: "",
  author: "",
  discussionsTo: "",
  status: "Draft",
  "last-call-deadline": "",
  type: "",
  category: "",
  created: "",
  requires: "",
  abstract: "",
  motivation: "",
  specification: "",
  rationale: "TBD",
  backwardsCompatibility: "No backward compatibility issues found.",
  testCases: "",
  referenceImplementation: "",
  securityConsiderations: "Needs discussion.",
};

import { InfoOutlineIcon, SearchIcon } from "@chakra-ui/icons";
import { DownloadIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import { ViewIcon, EditIcon, ViewOffIcon } from "@chakra-ui/icons";
import { BiColumns } from "react-icons/bi";
import {
  FaBold,
  FaItalic,
  FaLink,
  FaListUl,
  FaListOl,
  FaCheckSquare,
  FaCode,
  FaQuoteLeft,
  FaHeading,
  FaTable,
  FaMinus,
  FaImage,
} from "react-icons/fa";
// import { IconButton, Text, HStack } from '@chakra-ui/react';
import { MarkdownViewer } from "react-github-markdown";
import { ErrorList } from "../ErrorToast";
import axios from "axios";
import FeedbackWidget from "../FeedbackWidget";


type TemplateData = typeof initialTemplateData;
type TemplateDataKeys = keyof TemplateData;

const instructions: Record<string, string> = {
  EIP: "EIP number",
  Title: "The EIP title is a few words, not a complete sentence",
  Description: "Description is one full (short) sentence",
  Author:
    "The list of the author's or authors' name(s) and/or username(s), or name(s) and email(s). Examples: <a comma separated list of the author's or authors' name + GitHub username (in parenthesis), or name and email (in angle brackets).  Example: FirstName LastName (@GitHubUsername), FirstName LastName <foo@bar.com>, FirstName (@GitHubUsername) and GitHubUsername (@GitHubUsername)>",
  "Discussions To": "The URL pointing to the official discussion thread",
  Status: "Draft, Review, Last Call, Final, Stagnant, Withdrawn, Living",
  "last-call-deadline":
    "The date last call period ends on (Optional field, only needed when status is Last Call)",
  Type: "One of Standards Track, Meta, or Informational",
  Category:
    "One of Core, Networking, Interface, or ERC (Optional field, only needed for Standards Track EIPs)",
  Created: "Date the EIP was created on",
  Requires: "EIP number(s) (Optional field)",
  Abstract:
    "Abstract is a multi-sentence (short paragraph) technical summary. This should be a very terse and human-readable version of the specification section. Someone should be able to read only the abstract to get the gist of what this specification does.",
  Motivation:
    "(optional) A motivation section is critical for EIPs that want to change the Ethereum protocol. It should clearly explain why the existing protocol specification is inadequate to address the problem that the EIP solves. This section may be omitted if the motivation is evident.",
  Specification:
    "The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Ethereum platforms (besu, erigon, ethereumjs, go-ethereum, nethermind, or others).",
  Rationale:
    "The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages. The rationale should discuss important objections or concerns raised during discussion around the EIP.",
  "Backwards Compatibility":
    "(optional) All EIPs that introduce backwards incompatibilities must include a section describing these incompatibilities and their consequences. The EIP must explain how the author proposes to deal with these incompatibilities. This section may be omitted if the proposal does not introduce any backwards incompatibilities, but this section must be included if backward incompatibilities exist.",
  "Test Cases":
    "(optional) Test cases for an implementation are mandatory for EIPs that are affecting consensus changes. Tests should either be inlined in the EIP as data (such as input/expected output pairs, or included in ../assets/eip-###/<filename>. This section may be omitted for non-Core proposals.",
  "Reference Implementation":
    "(optional) An optional section that contains a reference/example implementation that people can use to assist in understanding or implementing this specification. This section may be omitted for all EIPs.",
  "Security Considerations":
    "All EIPs must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life-cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed. EIP submissions missing the Security Considerations section will be rejected. An EIP cannot proceed to status Final without a Security Considerations discussion deemed sufficient by the reviewers.",
};

type Step = {
  label: string;
  key: TemplateDataKeys;
  type: "input" | "textarea" | "select";
  options?: string[];
};


const ProposalEditor = () => {
  const [viewMode, setViewMode] = useState<"edit" | "output" | "split">(
    "split"
  );
  const [preview, setPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"eip" | "erc" | "rip">("eip");
  const [activeTab2, setActiveTab2] = useState<"new" | "import">("new");
  const [validated, setValidated] = useState<boolean>(false);
  const [searchNumber, setSearchNumber] = useState("");

  const toast = useToast();

    useEffect(() => {
      // Get the hash from the URL (e.g., "#split#eip#import#1234")
      const hash = window.location.hash;
  
      // Split the hash into parts
      const parts = hash.split("#")?.filter(Boolean); // Remove empty strings
  
      // Assign values from the URL hash to state variables
      if (parts?.length > 0) {
        setViewMode(parts[0] as "edit" | "output" | "split");
      }
      if (parts?.length > 1) {
        setActiveTab(parts[1] as "eip" | "erc" | "rip");
      }
      if (parts?.length > 2) {
        setActiveTab2(parts[2] as "new" | "import");
      }
      if (parts?.length > 3) {
        setSearchNumber(parts[3]);
      }
    }, []);

      useEffect(() => {
        // Construct the new hash based on the current state
        const newHash = `#${viewMode}#${activeTab}#${activeTab2}${
          searchNumber ? `#${searchNumber}` : ""
        }`;
    
        // Update the URL hash
        window.location.hash = newHash;
      }, [viewMode, activeTab, activeTab2, searchNumber]);

      
  

      const handleImport = async () => {
  if (!searchNumber) return;

  setIsLoading(true);

  const urls = {
    eip: `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${searchNumber}.md`,
    erc: `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${searchNumber}.md`,
    rip: `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${searchNumber}.md`,
  };

  const selectedURL = urls[activeTab];



  if (!selectedURL) {
    console.error("Invalid tab selected");
    setIsLoading(false);
    return;
  }

  try {
    const response = await axios.get(selectedURL);

    if (response.status === 200) {
      const markdownContent = response.data;
      const extractedData = extractEIPData(markdownContent) || {};

      Object.assign(initialTemplateData, extractedData);
      console.log("Updated initialTemplateData:", initialTemplateData);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    setIsLoading(false);
  }
};

const extractEIPData = (markdownContent: string) => {
  const extractedData: any = {};

  const patterns = {
    eip: /eip:\s*(\d+)/i,
    title: /title:\s*["']?(.*?)["']?$/im,
    description: /description:\s*(.*)/i,
    author: /author:\s*(.*)/i,
    discussionsTo: /discussions-to:\s*(.*)/i,
    status: /status:\s*(.*)/i,
    "last-call-deadline": /last-call-deadline:\s*(.*)/i,
    type: /type:\s*(.*)/i,
    category: /category:\s*(.*)/i,
    created: /created:\s*(.*)/i,
    requires: /requires:\s*(.*)/i,
    abstract: /## Abstract\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    motivation: /## Motivation\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    specification: /## Specification\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    rationale: /## Rationale\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    backwardsCompatibility:
      /## Backwards Compatibility\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    testCases: /## Test Cases\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    referenceImplementation:
      /## Reference Implementation\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    securityConsiderations:
      /## Security Considerations\s*\n([\s\S]*?)(?=\n##\s|$)/i,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = markdownContent.match(pattern);
    if (match) {
      let value = match[1].trim();

      if (key === "title") {
        value = value.replace(/^["']|["']$/g, "").trim();
      }

      if (key === "requires") {
        extractedData[key] = value
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v !== "");
      } else {
        extractedData[key] = value;
      }
    } else {
      extractedData[key] = key === "requires" ? [] : "";
    }
  }

  return extractedData;
};

type EipType = "eip" | "erc" | "rip";

const getInitialSteps = (type: EipType): Step[] => {
  const commonStepsBeforeStatus: Step[] = [
    { label: "EIP", key: "eip", type: "input" },
    { label: "Title", key: "title", type: "input" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Author", key: "author", type: "input" },
    { label: "Discussions To", key: "discussionsTo", type: "input" },
    {
      label: "Status",
      key: "status",
      type: "select",
      options: [
        "Draft",
        "Review",
        "Last Call",
        "Final",
        "Stagnant",
        "Withdrawn",
        "Living",
      ],
    },
    {
      label: "Last Call Deadline",
      key: "last-call-deadline",
      type: "input",
    },
  ];

  const typeOptions: Record<EipType, { type: string[]; category: string[] }> = {
    eip: {
      type: ["Standards Track", "Meta", "Informational", "TBD"],
      category: ["Core", "Networking", "Interface", "TBD"],
    },
    erc: {
      type: ["Standards Track", "Meta", "TBD"],
      category: ["ERC", "Interface", "TBD"],
    },
    rip: {
      type: ["Standards Track", "Meta", "TBD"],
      category: ["Core", "RRC", "Others", "TBD"],
    },
  };

  const typeSpecificSteps: Step[] = [
    {
      label: "Type",
      key: "type",
      type: "select",
      options: typeOptions[type].type,
    },
    {
      label: "Category",
      key: "category",
      type: "select",
      options: typeOptions[type].category,
    },
  ];

  const commonStepsAfterStatus: Step[] = [
    { label: "Created", key: "created", type: "input" },
    { label: "Requires", key: "requires", type: "input" },
    { label: "Abstract", key: "abstract", type: "textarea" },
    { label: "Motivation", key: "motivation", type: "textarea" },
    { label: "Specification", key: "specification", type: "textarea" },
    { label: "Rationale", key: "rationale", type: "textarea" },
    {
      label: "Backwards Compatibility",
      key: "backwardsCompatibility",
      type: "textarea",
    },
    { label: "Test Cases", key: "testCases", type: "textarea" },
    {
      label: "Reference Implementation",
      key: "referenceImplementation",
      type: "textarea",
    },
    {
      label: "Security Considerations",
      key: "securityConsiderations",
      type: "textarea",
    },
  ];

  return [
    ...commonStepsBeforeStatus,
    ...typeSpecificSteps,
    ...commonStepsAfterStatus,
  ];
};

const [steps, setSteps] = useState<Step[]>(() => getInitialSteps(activeTab));
const [templateData, setTemplateData] = useState<TemplateData>(initialTemplateData);

// Optional: map of refs if you want cursor-based markdown insert
const inputRefs = useRef<Record<TemplateDataKeys, HTMLTextAreaElement | null>>({} as any);

// Reset steps when tab changes
useEffect(() => {
  setSteps(getInitialSteps(activeTab));
}, [activeTab]);

// Update templateData for a given key
const handleInputChange = (key: TemplateDataKeys, value: string) => {
  if (!key) return;

  setTemplateData((prev) => ({
    ...prev,
    [key]: value,
  }));
};

// Append markdown syntax at the current cursor position OR end (fallback)
const handleMarkdownInsert = (key: TemplateDataKeys, syntax: string) => {
  if (!key) return;

  const ref = inputRefs.current[key];
  if (ref && ref.selectionStart !== undefined) {
    const start = ref.selectionStart;
    const end = ref.selectionEnd;
    const current = templateData[key] || "";

    const newValue =
      current.substring(0, start) + syntax + current.substring(end);

    setTemplateData((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    // Move cursor after inserted text
    requestAnimationFrame(() => {
      ref.selectionStart = ref.selectionEnd = start + syntax.length;
      ref.focus();
    });
  } else {
    // Fallback if no ref found (append at end)
    setTemplateData((prev) => ({
      ...prev,
      [key]: `${prev[key] || ""}${syntax}`,
    }));
  }
};

const generateMarkdownTemplate = (data: TemplateData): string => {
  const headerLines = [
    `eip: ${data.eip}`,
    `title: ${data.title}`,
    `description: ${data.description}`,
    `author: ${data.author}`,
    `discussions-to: ${data.discussionsTo}`,
    `status: ${data.status}`,
    data["last-call-deadline"]
      ? `last-call-deadline: ${data["last-call-deadline"]}`
      : null,
    `type: ${data.type}`,
    data.type === "Standards Track" && data.category
      ? `category: ${data.category}`
      : null,
    `created: ${data.created}`,
    data.requires ? `requires: ${data.requires}` : null,
  ].filter(Boolean);

  const markdownSections = [
    { title: "Abstract", value: data.abstract },
    { title: "Motivation", value: data.motivation },
    { title: "Specification", value: data.specification },
    { title: "Rationale", value: data.rationale },
    {
      title: "Backwards Compatibility",
      value: data.backwardsCompatibility,
    },
    { title: "Test Cases", value: data.testCases },
    { title: "Reference Implementation", value: data.referenceImplementation },
    {
      title: "Security Considerations",
      value: data.securityConsiderations,
    },
  ];

  const sections = markdownSections
    .filter((section) => section.value?.trim())
    .map((section) => `## ${section.title}\n${section.value.trim()}`)
    .join("\n\n");

  const fullTemplate = `---
${headerLines.join("\n")}
---

${sections}

## Copyright
Copyright and related rights waived via [CC0](../LICENSE.md).
`;

  // Clean double blank lines
  return fullTemplate
    .split("\n")
    .filter((line, idx, arr) => !(line.trim() === "" && arr[idx - 1]?.trim() === ""))
    .join("\n");
};

const markdownContent = generateMarkdownTemplate(templateData);

const splitContent = markdownContent.split(/---\n/);
const tableContent = splitContent[1]?.trim() || "";
const markdownValue =
  splitContent?.length > 2 ? splitContent.slice(2).join("---\n").trim() : "";


  const tableRows = tableContent
  .split("\n")
  .filter((line) => line.trim())
  .map((row) => {
    const match = row.match(/^([^:]+):\s*(.+)$/);
    return match ? [match[1].trim(), match[2].trim()] : [row.trim(), ""];
  });

const handleValidate = async () => {
  const requiredHeaders = [
    "title",
    "description",
    "author",
    "status",
    "type",
    "created",
  ];

  const missingHeaders: string[] = [];
  const unrecognizedHeaders : string[] = [];
  const errorMessages = [];
  setIsLoading(true);

  requiredHeaders.forEach((header) => {
    const key = header as TemplateDataKeys;
    if (!templateData[key] || templateData[key].trim() === "") {
      missingHeaders.push(header);
    }
  });

  const buildTemplate = () => {
    return `---
${requiredHeaders
      .map((header) => `${header}: ${templateData[header as TemplateDataKeys] || ""}`)
      .join("\n")}
${
        templateData["last-call-deadline"]
          ? `last-call-deadline: ${templateData["last-call-deadline"]}`
          : ""
      }
${
        templateData.type === "Standards Track" && templateData.category
          ? `category: ${templateData.category}`
          : ""
      }
${
        templateData.requires ? `requires: ${templateData.requires}` : ""
      }
---

${([
  "abstract",
  "motivation",
  "specification",
  "rationale",
  "backwardsCompatibility",
  "testCases",
  "referenceImplementation",
  "securityConsiderations",
] as TemplateDataKeys[])
  .filter((key) => templateData[key])
  .map(
    (key) =>
      `## ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}\n${templateData[key]}`
  )
  .join("\n\n")}

## Copyright
Copyright and related rights waived via [CC0](../LICENSE.md).
    `;
  };

  const cleanedContent = buildTemplate()
    .replace(/---\n([\s\S]*?)\n---/, (match, content) => {
      return `---\n${content
        .split("\n")
        .filter((line: string) => line.trim())
        .join("\n")}\n---`;
    })
    .split("\n")
    .filter((line, i, arr) => !(line.trim() === "" && arr[i - 1]?.trim() === ""))
    .join("\n");

  try {
    const res = await fetch("/api/ValidateEip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdownContent: cleanedContent }),
    });

    const data = await res.json();
    if (!data.success && data.messages) {
      for (const msg of data.messages) {
        if (msg.level === "Error" &&
          !msg.message.includes("unable to read file") &&
          !msg.message.includes("error[preamble-eip]") &&
          !msg.message.includes("error[preamble-file-name]")
        ) {
          const clean = msg.message
            .replace(/-->.*$/, "")
            .replace(/C:\\.*\.md/, "")
            .replace(/\s+/g, " ")
            .trim();
          errorMessages.push(clean);
        }
      }
    }
  } catch (err) {
    console.error("Validation error:", err);
  }

  // Additional validations (e.g., 'requires') ...

  const errors = [
    ...missingHeaders.map((h, i) => `${i + 1}. Missing Header: ${h}`),
    ...unrecognizedHeaders.map((h, i) => `${missingHeaders.length + i + 1}. Unrecognized Header: ${h}`),
    ...errorMessages.map((msg, i) => `${missingHeaders.length + unrecognizedHeaders.length + i + 1}. ${msg}`),
  ];

  if (errors.length > 0) {
    toast({
      title: "Error in Template",
      description: (
        <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ),
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    setValidated(false);
  } else {
    setValidated(true);
    toast({ title: "Successfully Validated!", status: "success", duration: 2000 });
  }

  setIsLoading(false);
};

const handleDownload = () => {
  const markdown = generateMarkdownTemplate(templateData)
      .replace(/---\n([\s\S]*?)\n---/, (match, content) => `---\n${content.split("\n").filter(Boolean).join("\n")}\n---`)
    .split("\n")
    .filter((line, i, arr) => !(line.trim() === "" && arr[i - 1]?.trim() === ""))
    .join("\n");


  const blob = new Blob([markdown], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "eip_template.md";
  link.click();
  URL.revokeObjectURL(url);

  toast({ title: "Template Downloaded", status: "success", duration: 2000 });
};

  return (
    <>
    <FeedbackWidget/>
    <Box
      p={5}
      mx="auto"
      bg="gray.200"
      _dark={{ bg: "gray.900", color: "gray.200" }}
      color="black"
      borderRadius="lg"
      id="EipTemplateEditor"
    >
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
          <Flex align="center" justify="space-between">
            <ButtonGroup size="md" isAttached>
              <Button
                colorScheme="green"
                variant={activeTab2 === "new" ? "solid" : "outline"}
                onClick={() => setActiveTab2("new")}
                flex="1" // Equal size buttons
              >
                {activeTab === "eip"
                  ? "New EIP"
                  : activeTab === "erc"
                  ? "New ERC"
                  : activeTab === "rip"
                  ? "New RIP"
                  : "New"}
              </Button>
              <Button
                colorScheme="green"
                variant={activeTab2 === "import" ? "solid" : "outline"}
                onClick={() => setActiveTab2("import")}
                flex="1" // Equal size buttons
              >
                {activeTab === "eip"
                  ? "Import an EIP"
                  : activeTab === "erc"
                  ? "Import an ERC"
                  : activeTab === "rip"
                  ? "Import an RIP"
                  : "Import"}
              </Button>
            </ButtonGroup>
          </Flex>

          <Flex align="center" justify="space-between">
            {activeTab2 === "import" && (
              <InputGroup
                maxW="300px"
                // minW="200px"
                colorScheme="green"
              >
                <Input
                  placeholder={`Enter ${activeTab.toUpperCase()} number`}
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  _placeholder={{ color: "blue.500" }}
                  borderColor="blue.500"
                  _hover={{ borderColor: "blue.600" }}
                  _focus={{
                    borderColor: "blue.700",
                    boxShadow: "0 0 0 1px blue.700",
                  }}
                  width="100%" // Ensures it takes full width inside its container
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    icon={<SearchIcon />}
                    colorScheme="blue"
                    onClick={handleImport}
                    isLoading={isLoading}
                  />
                </InputRightElement>
              </InputGroup>
            )}
          </Flex>

          <ButtonGroup size="md" isAttached pl={2}>
            <Button
              colorScheme="blue"
              variant={activeTab === "eip" ? "solid" : "outline"}
              onClick={() => setActiveTab("eip")}
              flex="1" // Equal size buttons
            >
              EIPs
            </Button>
            <Button
              colorScheme="blue"
              variant={activeTab === "erc" ? "solid" : "outline"}
              onClick={() => setActiveTab("erc")}
              flex="1" // Equal size buttons
            >
              ERCs
            </Button>
            <Button
              colorScheme="blue"
              variant={activeTab === "rip" ? "solid" : "outline"}
              onClick={() => setActiveTab("rip")}
              flex="1" // Equal size buttons
            >
              RIPs
            </Button>
          </ButtonGroup>

          {/* Popover for instructions */}
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="More info"
                icon={<InfoOutlineIcon />}
                size="md"
                colorScheme="blue"
                variant="ghost"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Instructions</PopoverHeader>
              <PopoverBody>
                This form is for EIPs and ERCs and not for RIPs.
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <ButtonGroup paddingLeft={2} size="md" isAttached>
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
          </ButtonGroup>
        </HStack>
      </Box>

      <Box
        display="flex"
        flexDirection={["column", "column", "row"]} // Stacks vertically on small screens
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
                {activeTab === "eip"
                  ? "Document an EIP"
                  : activeTab === "erc"
                  ? "Document an ERC"
                  : activeTab === "rip"
                  ? "Document an RIP"
                  : "Document a Template"}
              </Text>

              {steps?.map((step, index) => (
                <Box key={index} w="100%">
                  <Box mb={4}>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      display="inline-block"
                      mr={2}
                    >
                      {step.label}
                    </Text>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          aria-label="More info"
                          icon={<InfoOutlineIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>{step.label} Instruction</PopoverHeader>
                        <PopoverBody fontSize="xs">
                          {instructions[step.label] ||
                            "No instructions available for this label."}
                          {step.label === "Test Cases" && (
                            <>
                              <br />
                              <br />
                              For linking external resources properly, visit:{" "}
                              <a
                                href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1.md#linking-to-external-resources"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                Link
                              </a>
                            </>
                          )}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                  {step.type === "input" && (
                    <Input
                      disabled={
                        step.key === "last-call-deadline" &&
                        templateData["status"] !== "Last Call"
                      }
                      placeholder={
                        step.label === "Title"
                          ? "Enter title"
                          : step.label === "Description"
                          ? "Enter description"
                          : step.label === "Author"
                          ? "FirstName LastName (@GitHubUsername), FirstName LastName <foo@bar.com>"
                          : step.label === "Discussions To"
                          ? "https://ethereum-magicians.org/t/eip-7600-hardfork-meta-prague-electra/18205"
                          : step.label === "Created"
                          ? "YYYY-MM-DD"
                          : step.label === "Requires"
                          ? "2537, 2935, 6110, 7002, 7251, 7549, 7594, 7685, 7702"
                          : step.label
                      }
                      value={templateData[step.key] || ""}
                      onChange={(e) =>
                        handleInputChange(step.key, e.target.value)
                      }
                      borderWidth="2px"
                    />
                  )}
                  {step.type === "textarea" && (
                    <Box>
                      {step.label !== "Description" && (
                        <HStack spacing={2} mb={2} wrap="wrap">
                          <Wrap spacing={2}>
                            {/* Bold */}
                            <WrapItem>
                              <IconButton
                                icon={<FaBold />}
                                aria-label="Bold"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "**bold** ")
                                }
                              />
                            </WrapItem>

                            {/* Italic */}
                            <WrapItem>
                              <IconButton
                                icon={<FaItalic />}
                                aria-label="Italic"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "*italic* ")
                                }
                              />
                            </WrapItem>

                            {/* H1 */}
                            <WrapItem>
                              <IconButton
                                icon={<FaHeading />}
                                aria-label="H1"
                                size="sm"
                                fontSize="lg"
                                onClick={() =>
                                  handleMarkdownInsert(
                                    step.key,
                                    "# Heading 1\n"
                                  )
                                }
                              />
                            </WrapItem>

                            {/* H2 */}
                            <WrapItem>
                              <IconButton
                                icon={<FaHeading />}
                                aria-label="H2"
                                size="sm"
                                fontSize="md"
                                onClick={() =>
                                  handleMarkdownInsert(
                                    step.key,
                                    "## Heading 2\n"
                                  )
                                }
                              />
                            </WrapItem>

                            {/* H3 */}
                            <WrapItem>
                              <IconButton
                                icon={<FaHeading />}
                                aria-label="H3"
                                size="sm"
                                fontSize="sm"
                                onClick={() =>
                                  handleMarkdownInsert(
                                    step.key,
                                    "### Heading 3\n"
                                  )
                                }
                              />
                            </WrapItem>

                            {/* Code */}
                            <WrapItem>
                              <IconButton
                                icon={<FaCode />}
                                aria-label="Code"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "`code` ")
                                }
                              />
                            </WrapItem>

                            {/* Quote */}
                            <WrapItem>
                              <IconButton
                                icon={<FaQuoteLeft />}
                                aria-label="Quote"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "> quote\n")
                                }
                              />
                            </WrapItem>

                            {/* Generic List */}
                            <WrapItem>
                              <IconButton
                                icon={<FaListUl />}
                                aria-label="Generic List"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "- \n")
                                }
                              />
                            </WrapItem>

                            {/* Numbered List */}
                            <WrapItem>
                              <IconButton
                                icon={<FaListOl />}
                                aria-label="Numbered List"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "1. \n")
                                }
                              />
                            </WrapItem>

                            {/* Checklist */}
                            <WrapItem>
                              <IconButton
                                icon={<FaCheckSquare />}
                                aria-label="Checklist"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "- [ ] item\n")
                                }
                              />
                            </WrapItem>

                            {/* Create Link */}
                            <WrapItem>
                              <IconButton
                                icon={<FaLink />}
                                aria-label="Create Link"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "[link](url) ")
                                }
                              />
                            </WrapItem>

                            {/* Insert Table */}
                            <WrapItem>
                              <IconButton
                                icon={<FaTable />}
                                aria-label="Insert Table"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(
                                    step.key,
                                    "| Header | Header |\n|-------|-------|\n| Cell  | Cell  |\n"
                                  )
                                }
                              />
                            </WrapItem>

                            {/* Horizontal Line */}
                            <WrapItem>
                              <IconButton
                                icon={<FaMinus />}
                                aria-label="Horizontal Line"
                                size="sm"
                                onClick={() =>
                                  handleMarkdownInsert(step.key, "---\n")
                                }
                              />
                            </WrapItem>
                          </Wrap>
                        </HStack>
                      )}

                      {step.label !== "Description" && (
                        <Textarea
                          placeholder={
                            step.label === "Abstract"
                              ? "Provide a short, technical summary of the EIP"
                              : step.label === "Motivation"
                              ? "Explain why the current protocol is inadequate and the problem this EIP solves"
                              : step.label === "Specification"
                              ? "Describe the syntax and semantics of the proposed change in detail"
                              : step.label === "Rationale"
                              ? "Describe why design decisions were made and any alternatives considered"
                              : step.label === "Backwards Compatibility"
                              ? "Explain any incompatibilities and how they are addressed"
                              : step.label === "Test Cases"
                              ? "Include input/expected output pairs or refer to test files"
                              : step.label === "Reference Implementation"
                              ? "Provide an example or reference implementation"
                              : step.label === "Security Considerations"
                              ? "Discuss security implications, risks, and how they are addressed"
                              : step.label
                          }
                          value={templateData[step.key] || ""}
                          onKeyDown={(e) => {
                            const inputValue = (e.target as HTMLTextAreaElement)
                              .value;

                            if (
                              e.key === " " ||
                              e.key === "." ||
                              e.key === "Tab"
                            ) {
                              if (activeTab === "eip") {
                                // For 'eip'
                                let plainValue = inputValue.replace(
                                  /\[EIP-(\d+)\]\(.*?eip-(\d+)\.md\)/gi,
                                  "EIP-$1"
                                );

                                const updatedValue = plainValue.replace(
                                  /\b(EIP-(\d+))\b(?!\]\(.*?\))/gi,
                                  (_, fullMatch, number) =>
                                    `[EIP-${number}](./eip-${number}.md)`
                                );

                                handleInputChange(step.key, updatedValue);
                              } else if (activeTab === "erc") {
                                let newvalue = inputValue;
                                if (inputValue.match(/\b(EIP-\d+)\b/i)) {
                                  // Match 'EIP-xxxx' or 'eip-xxxx' but ignore cases where it is already in square brackets '[EIP-xxxx]' or './eip-xxxx'
                                  let updatedValue = inputValue.replace(
                                    /(^|[^./\[\]])\b(EIP-(\d+))\b(?!\]\(.*?\))/gi, // Refined regex to handle './eip-xxxx' and '[EIP-xxxx]'
                                    (match, prefix, fullMatch, number) =>
                                      `${prefix}[EIP-${number}]` // Add brackets around EIP-xxxx
                                  );
                                  newvalue = updatedValue;
                                }
                                let plainValue = newvalue.replace(
                                  /\[ERC-(\d+)\]\(.*?eip-(\d+)\.md\)/gi,
                                  "ERC-$1"
                                );

                                const updatedValue = plainValue.replace(
                                  /\b(ERC-(\d+))\b(?!\]\(.*?\))/gi,
                                  (_, fullMatch, number) =>
                                    `[ERC-${number}](./eip-${number}.md)`
                                );
                                handleInputChange(step.key, updatedValue);
                              } else {
                                let newvalue = inputValue;
                                if (inputValue.match(/\b(EIP-\d+)\b/i)) {
                                  // Match 'EIP-xxxx' or 'eip-xxxx' but ignore cases where it is already in square brackets '[EIP-xxxx]' or '/eip-xxxx'
                                  newvalue = inputValue.replace(
                                    /(^|[^./\[\]])\b(EIP-(\d+))\b(?!\]\(.*?\))(?!\/eip-\d+)/gi, // Refined regex to handle './eip-xxxx', '[EIP-xxxx]' and '/eip-xxxx'
                                    (match, prefix, fullMatch, number) =>
                                      `${prefix}[EIP-${number}](https://eips.ethereum.org/EIPS/eip-${number})` // Convert to link format
                                  );
                                }

                                if (newvalue.match(/\b(ERC-\d+)\b/i)) {
                                  // Match 'ERC-xxxx' or 'erc-xxxx' but ignore cases where it is already in square brackets '[ERC-xxxx]' or '/erc-xxxx'
                                  newvalue = newvalue.replace(
                                    /(^|[^./\[\]])\b(ERC-(\d+))\b(?!\]\(.*?\))(?!\/erc-\d+)/gi, // Refined regex to handle './erc-xxxx', '[ERC-xxxx]' and '/erc-xxxx'
                                    (match, prefix, fullMatch, number) =>
                                      `${prefix}[ERC-${number}](https://eips.ethereum.org/ERCS/erc-${number})` // Convert to link format
                                  );
                                }
                                let plainValue = newvalue.replace(
                                  /\[RIP-(\d+)\]\(.*?Rip-(\d+)\.md\)/gi,
                                  "RIP-$1"
                                );

                                const updatedValue = plainValue.replace(
                                  /\b(RIP-(\d+))\b(?!\]\(.*?\))/gi,
                                  (_, fullMatch, number) =>
                                    `[RIP-${number}](./Rip-${number}.md)`
                                );
                                handleInputChange(step.key, updatedValue);
                              }
                            }
                          }}
                          onChange={(e) =>
                            handleInputChange(step.key, e.target.value)
                          } // Normal change handling
                          size="lg"
                          resize="vertical"
                          height="300px"
                          width="100%"
                          borderWidth="2px"
                        />
                      )}

                      {step.label === "Description" && (
                        <Textarea
                          placeholder={
                            "Provide a simple summary of your proposal in one sentence"
                          }
                          value={templateData[step.key] || ""}
                          onChange={(e) =>
                            handleInputChange(step.key, e.target.value)
                          } // Normal change handling
                          size="lg"
                          resize="vertical"
                          height="200px"
                          width="100%"
                          borderWidth="2px"
                        />
                      )}
                    </Box>
                  )}

                  {step.type === "select" && (
                    <Select
                      placeholder={`Select ${step.label}`}
                      value={templateData[step.key] || ""}
                      onChange={(e) =>
                        handleInputChange(step.key, e.target.value)
                      }
                      borderWidth="2px"
                      disabled={
                        step.key === "category" &&
                        templateData["type"] !== "Standards Track"
                      }
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
            <Box p={6} maxW="900px" mx="auto">
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
                      _hover={{
                        bg: preview !== false ? "blue.700" : undefined,
                      }}
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
                  _dark={{
                    bg: preview ? "gray.700" : "gray.800",
                    color: preview ? "white" : "gray.300",
                  }}
                  overflow="auto"
                  // maxH="600px"
                >
                  {preview ? (
                    <Box
                      w="full"
                      p={4}
                      borderRadius="md"
                      bg={"gray.900"}
                      color={preview ? "black" : "white"}
                      _dark={{
                        bg: "gray.900",
                        color: preview ? "white" : "gray.300",
                      }}
                      overflow="auto"
                    >
                      {tableRows?.length > 0 && (
                        <TableContainer mt={4}>
                          <Table variant="striped" colorScheme="blue">
                            <Thead>
                              <Tr>
                                <Th color="white">Field</Th>
                                <Th color="white">Value</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {tableRows?.map((row, index) => (
                                <Tr key={index}>
                                  <Td color="white">{row[0]}</Td>
                                  <Td color="white">{row[1]}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      )}
                      <br />
                      <MarkdownViewer
                        value={markdownValue}
                        isDarkTheme={preview}
                      />
                    </Box>
                  ) : (
                    <Box as="pre" fontFamily="monospace" fontSize="sm">
                      {generateMarkdownTemplate(templateData)}
                    </Box>
                  )}
                </Box>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
      <br />
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
          <Flex align="center" justify="space-between"></Flex>
        </HStack>
        <HStack spacing={4} flexWrap="wrap">
          <Button
            rightIcon={isLoading ? <Spinner size="sm" /> : <CheckIcon />}
            colorScheme="blue"
            mt={[4, 0]} // Adds spacing for smaller screens
            _dark={{
              bg: "blue.600",
              color: "white",
              _hover: { bg: "blue.700" },
            }}
            onClick={handleValidate}
            isDisabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Validating..." : "Validate"}
          </Button>
          <Button
            rightIcon={<DownloadIcon />}
            colorScheme="blue"
            mt={[4, 0]} // Adds spacing for smaller screens
            _dark={{
              bg: "blue.600",
              color: "white",
              _hover: { bg: "blue.700" },
            }}
            onClick={handleDownload}
            isDisabled={!validated} // Disable button while loading
          >
            {"Download"}
          </Button>
        </HStack>
      </Box>
    </Box>
    </>
  )
}
export default ProposalEditor;
















































