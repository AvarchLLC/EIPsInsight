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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    useColorModeValue
} from "@chakra-ui/react";

import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, 
  AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";


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
import { DownloadIcon, CheckIcon, AddIcon, CopyIcon } from "@chakra-ui/icons";
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
  // Right pane view toggle (Code or Preview)
  const [preview, setPreview] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"eip" | "erc" | "rip">("eip");
  const [activeTab2, setActiveTab2] = useState<"new" | "import">("new");
  const [validated, setValidated] = useState<boolean>(false);
  const [searchNumber, setSearchNumber] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
type ValidationItem = { summary: string; detail?: string; code?: string };
const [validationErrors, setValidationErrors] = useState<ValidationItem[]>([]);
const cancelRef = useRef<HTMLButtonElement>(null);
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
    setIsLoading(false);
    toast({
      title: 'Invalid type',
      description: 'Please select a correct type (EIP/ERC/RIP)',
      status: 'error',
      duration: 2500,
      isClosable: true,
    });
    return;
  }

  try {
    const response = await axios.get(selectedURL);
    if (response.status === 200 && response.data && typeof response.data === "string") {
      const markdownContent = response.data;
      const extractedData = extractEIPData(markdownContent) || {};
      setTemplateData({ ...initialTemplateData, ...extractedData }); // set NEW state here
      toast({
        title: 'Loaded!',
        description: `Fetched ${activeTab.toUpperCase()}-${searchNumber}`,
        duration: 2000,
        status: "success",
        isClosable: true,
      });
    } else {
      // Show toast for not found
      toast({
        title: 'Not Found',
        description: `${activeTab.toUpperCase()}-${searchNumber} does not exist.`,
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
    }
  } catch (error: any) {
    // If error is axios error with 404, show not found toast
    if ((error as any)?.response?.status === 404) {
      toast({
        title: 'Not Found',
        description: `${activeTab.toUpperCase()}-${searchNumber} does not exist.`,
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Failed to fetch',
        description: `${activeTab.toUpperCase()}-${searchNumber} could not be loaded.`,
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
    }
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
  // Reset steps on tab switch
  setSteps(getInitialSteps(activeTab));
  // If switching to "new", reset all fields
  if (activeTab2 === "new") {
    setTemplateData({ ...initialTemplateData }); // NOT initialTemplateData, but a **new copy**
    setValidated(false); // Also reset validation state if needed
  } else if (activeTab2 === "import") {
    // Clear EIP number when switching to Import mode
    setTemplateData((prev) => ({ ...prev, eip: "" }));
    setValidated(false);
  }
  // Always clear search bar when tab or mode changes
  setSearchNumber("");
}, [activeTab, activeTab2]);


// Update templateData for a given key
const handleInputChange = (key: TemplateDataKeys, value: string) => {
  if (!key) return;

  setLastEdited("form");
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

  setLastEdited("form");
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
  setLastEdited("form");
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
  // requires block will be handled below
].filter(Boolean);

interface RequiresArray extends Array<string> {}

let requiresArr: RequiresArray = [];
if (typeof data.requires === "string") {
  requiresArr = data.requires
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v);
} else if (Array.isArray(data.requires)) {
  requiresArr = (data.requires as string[]).filter((v) => v);
}

if (requiresArr.length > 0) {
  headerLines.push('requires:');
  requiresArr.forEach(req => {
    headerLines.push(` - ${req}`);
  });
}

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

const generateEipWlintMarkdown = (data: TemplateData): string => {
  const headerLines = [
    `eip: ${data.eip}`,
    `title: ${data.title}`,
    `description: ${data.description}`,
    `author: ${data.author}`,
    `discussions-to: ${data.discussionsTo ? data.discussionsTo : 'null'}`,
    `status: ${data.status}`,
    data["last-call-deadline"] ? `last-call-deadline: ${data["last-call-deadline"]}` : null,
    `type: ${data.type}`,
    data.type === "Standards Track" && data.category ? `category: ${data.category}` : null,
    `created: ${data.created}`,
  ].filter(Boolean);

let requiresArr: string[] = [];
if (typeof data.requires === "string") {
  requiresArr = data.requires.split(",").map((v) => v.trim()).filter((v) => v);
} else if (Array.isArray(data.requires)) {
  requiresArr = (data.requires as string[]).filter((v) => v && typeof v === 'string');
}
if (requiresArr.length > 0) {
  if (requiresArr.length === 1) {
    headerLines.push(`requires: ${requiresArr[0]}`);
  } else {
    headerLines.push(`requires: ${requiresArr.join(', ')}`); // comma+space
  }
}


  const markdownSections = [
    { title: "Abstract", value: data.abstract },
    { title: "Motivation", value: data.motivation },
    { title: "Specification", value: data.specification },
    { title: "Rationale", value: data.rationale },
    { title: "Backwards Compatibility", value: data.backwardsCompatibility },
    { title: "Test Cases", value: data.testCases },
    { title: "Reference Implementation", value: data.referenceImplementation },
    { title: "Security Considerations", value: data.securityConsiderations },
  ];

  const sections = markdownSections
    .filter(section => section.value && section.value.trim())
    .map(section => `## ${section.title}\n\n${section.value.trim()}`)
    .join('\n\n');

  return [
    "---",
    ...headerLines,
    "---",
    "",
    sections,
    "",
    "## Copyright",
    "",
    "Copyright and related rights waived via [CC0](../LICENSE.md).",
    ""
  ].join('\n').replace(/\n{3,}/g, '\n\n');
};



// Markdown editor state: allow editing raw markdown code
const [markdownRaw, setMarkdownRaw] = useState<string>(() => generateEipWlintMarkdown(templateData));
// Track which side was edited last to avoid overwrite loops
const [lastEdited, setLastEdited] = useState<"form" | "code">("form");

// Keep markdownRaw in sync with form fields unless user edits it directly
useEffect(() => {
  if (lastEdited === "form") {
    setMarkdownRaw(generateEipWlintMarkdown(templateData));
  }
  // eslint-disable-next-line
}, [templateData, lastEdited]);

const markdownContent = markdownRaw;

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

  // Parse the right-hand markdown back into form fields when user edits code
  const parseMarkdownToTemplate = (md: string): Partial<TemplateData> => {
    const result: Partial<TemplateData> = {};

    // Extract front matter between --- and ---
    const fmMatch = md.match(/---\s*([\s\S]*?)\s*---/);
    const frontMatter = fmMatch ? fmMatch[1] : "";
    if (frontMatter) {
      const lines = frontMatter.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const m = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
        if (!m) continue;
        const key = m[1].toLowerCase();
        const val = m[2];
        switch (key) {
          case "eip": result.eip = val; break;
          case "title": result.title = val; break;
          case "description": result.description = val; break;
          case "author": result.author = val; break;
          case "discussions-to": result.discussionsTo = val === "null" ? "" : val; break;
          case "status": result.status = val; break;
          case "last-call-deadline": result["last-call-deadline"] = val; break;
          case "type": result.type = val; break;
          case "category": result.category = val; break;
          case "created": result.created = val; break;
          case "requires": result.requires = val; break; // keep raw; generator handles formatting
        }
      }
    }

    // Extract body sections
    const getSection = (title: string) => {
      const r = new RegExp(`##\\s+${title}\\s*\n([\\s\\S]*?)(?=\n##\\s|$)`, "i");
      const mm = md.match(r);
      return mm ? mm[1].trim() : "";
    };

    result.abstract = getSection("Abstract");
    result.motivation = getSection("Motivation");
    result.specification = getSection("Specification");
    result.rationale = getSection("Rationale");
    result.backwardsCompatibility = getSection("Backwards Compatibility");
    result.testCases = getSection("Test Cases");
    result.referenceImplementation = getSection("Reference Implementation");
    result.securityConsiderations = getSection("Security Considerations");

    return result;
  };

  // Debounced sync: code -> form
  const codeSyncTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (lastEdited !== "code") return;
    if (codeSyncTimer.current) window.clearTimeout(codeSyncTimer.current);
    codeSyncTimer.current = window.setTimeout(() => {
      const parsed = parseMarkdownToTemplate(markdownRaw);
      setTemplateData(prev => ({ ...prev, ...parsed }));
    }, 300);
    return () => {
      if (codeSyncTimer.current) window.clearTimeout(codeSyncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownRaw, lastEdited]);

  const handleValidate = async () => {
    setIsLoading(true);
  const errorItems: ValidationItem[] = [];

  const simplifyEipwMessage = (raw: string): string => {
      const codeMatch = raw.match(/error\[([^\]]+)\]/i);
      const code = codeMatch?.[1] || "";
      const mainPart = raw.split("]:").slice(1).join("]:") || raw;
      const trimmed = mainPart.split("-->")[0]?.trim() || mainPart.trim();

      const friendlyByCode: Record<string, (text: string) => string> = {
        "markdown-req-section": (text) => {
          const m = text.match(/missing section\(s\):\s*`([^`]+)`/i);
          const sections = m ? m[1] : "required sections";
          return `Missing required sections: ${sections}. Use level-2 headings (##).`;
        },
        "preamble-author": (text) => {
          if (/at least one GitHub username/i.test(raw)) {
            return "Author must include at least one GitHub username (e.g., Random J. User (@username)).";
          }
          return "Author format invalid. Try: Name (@username) <email@example.com>.";
        },
        "preamble-date-created": () => "Created date must be in YYYY-MM-DD format.",
        "preamble-discussions-to": () => "Discussions-to must be a valid URL.",
        "preamble-re-discussions-to": () => "Discussions-to must link to an ethereum-magicians.org thread (topic/id).",
        "preamble-enum-type": () => "Type must be one of: Standards Track, Meta, Informational.",
        "preamble-len-description": () => "Description is too short (minimum 2 characters).",
        "preamble-len-title": () => "Title is too short (minimum 2 characters).",
      };

      if (friendlyByCode[code]) return friendlyByCode[code](trimmed);

      // Fallback: remove file paths and help/info decorations
      let simple = trimmed
        .replace(/\s*\|\s*\d+\s*\|[\s\S]*/g, "")
        .replace(/=\s*help:[\s\S]*/gi, "")
        .replace(/=\s*info:[\s\S]*/gi, "")
        .trim();
      if (!simple) simple = raw.replace(/=\s*(help|info):[\s\S]*/gi, "").trim();
      return simple;
    };

    const parseEipwMessage = (raw: string): ValidationItem => {
      const summary = simplifyEipwMessage(raw);
      const codeMatch = raw.match(/error\[([^\]]+)\]/i);
      const code = codeMatch?.[1];
      // Keep raw as detail for maximum context; UI will show it collapsed
      const detail = raw;
      return { summary, detail, code };
    };

    try {
      const res = await fetch("/api/ValidateEip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdownContent }),
      });

      const data = await res.json();
      if (!data.success && data.messages) {
        for (const msg of data.messages) {
          // Only show actual format errors, skip noisy file-read/preamble file-name items
          if (
            msg.level === "Error" &&
            !msg.message.includes("unable to read file") &&
            !msg.message.includes("error[preamble-eip]") &&
            !msg.message.includes("error[preamble-file-name]")
          ) {
            const item = parseEipwMessage(msg.message || "");
            if (item.summary) errorItems.push(item);
          }
        }
      }
    } catch (err) {
      console.error("Validation error:", err);
      errorItems.push({
        summary: "Validation failed to run.",
        detail: String(err ?? "Unknown error"),
      });
    }
    setIsLoading(false);

if (errorItems.length > 0) {
  setValidated(false);
  setValidationErrors(errorItems); // Show as dialog
  setShowValidationAlert(true);
} else {
  setValidated(true);
  toast({ title: "Successfully Validated!", status: "success", duration: 2000 });
}

  };

  // 4. DOWNLOAD -- again, use only the canonical generator
  const handleDownload = () => {
    const markdown = generateEipWlintMarkdown(templateData)
      .replace(/\n{3,}/g, '\n\n'); // (optional: squeeze triples to doubles)
    const blob = new Blob([markdown], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eip_template.md`; // you can use eip-${data.eip}.md if you want
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "Template Downloaded", status: "success", duration: 2000 });
  };


  return (
    <>
    <FeedbackWidget/>
    <Box
      p={[3, 4, 8]}
      mx="auto"
      bg="gray.100"
      _dark={{ bg: "gray.900", color: "gray.200" }}
      color="black"
      borderRadius="2xl"
      boxShadow="xl"
      id="EipTemplateEditor"
      maxW="1200px"
      minH="90vh"
    >
      <Box
        p={[2, 4]}
        bg="gray.200"
        _dark={{ bg: "gray.800" }}
        borderRadius="lg"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        boxShadow="md"
        mb={2}
      >
  <HStack spacing={[2, 3, 4]} flexWrap="wrap" width="100%">
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
                maxW={["100%", "260px", "320px"]}
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
        flexDirection={["column", null, "row"]}
        height={viewMode === "split" ? { base: "auto", md: "75vh" } : "auto"}
        minHeight={viewMode === "split" ? { base: "auto", md: "75vh" } : "600px"}
        mt={4}
        gap={[3, 4, 8]}
        _dark={{
          bg: "gray.800",
          color: "gray.200",
        }}
        width="100%"
      >
        {(viewMode === "edit" || viewMode === "split") && (
          <Box
            flex="1"
            p={[3, 4, 6]}
            minWidth={["100%", "50%"]}
            height={viewMode === "split" ? { base: "auto", md: "100%" } : "auto"}
            overflowY="auto"
            bg="white"
            _dark={{ bg: "gray.700" }}
            borderRadius="xl"
            boxShadow="md"
            fontSize={["sm", "md", "lg"]}
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#3182ce",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#2b6cb0",
              },
              "&::-webkit-scrollbar-track": {
                background: "#edf2f7",
              },
            }}
            mb={[2, 0]}
          >
            <VStack spacing={[3, 4, 6]}>
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
                          height={["200px", "260px", "320px"]}
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
                          height={["140px", "180px", "220px"]}
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
            p={[3, 4, 6]}
            minWidth={{ base: "100%", md: viewMode === "output" ? "100%" : "50%" }}
            width={{ base: "100%", md: viewMode === "output" ? "100%" : "50%" }}
            maxWidth={{ base: "100%", md: viewMode === "output" ? "100%" : "100%" }}
            height={viewMode === "split" ? { base: "auto", md: "100%" } : "auto"}
            bg="white"
            _dark={{ bg: "gray.700" }}
            borderRadius="xl"
            boxShadow="md"
            overflowY="auto"
            whiteSpace="pre-wrap"
            fontSize={["sm", "md", "lg"]}
            display="flex"
            flexDirection="column"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#3182ce",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#2b6cb0",
              },
              "&::-webkit-scrollbar-track": {
                background: "#edf2f7",
              },
            }}
            mb={[2, 0]}
          >
            {/* Responsive and in sync with left editor: code/preview (read-only code) */}
            <Box flex="1" display="flex" flexDirection="column" justifyContent="flex-start" p={[3, 4, 6]} mx="auto" width="100%" minHeight={viewMode === "split" ? 0 : undefined}>
              <VStack spacing={[3, 4, 6]} align="start" width="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" w="full">
                  <Text fontSize="lg" fontWeight="bold">
                    {preview ? "Markdown Preview" : "Markdown Code"}
                  </Text>
                  <HStack spacing={3} flexWrap="wrap">
                    <Button
                      colorScheme="blue"
                      variant={preview === false ? "solid" : "outline"}
                      onClick={() => setPreview(false)}
                      size="sm"
                    >
                      Code
                    </Button>
                    <Button
                      colorScheme="blue"
                      variant={preview === true ? "solid" : "outline"}
                      onClick={() => setPreview(true)}
                      size="sm"
                    >
                      Preview
                    </Button>
                    {preview && (
                      <Button
                        leftIcon={<CopyIcon />}
                        colorScheme="teal"
                        variant="solid"
                        size="sm"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(markdownRaw);
                            toast({ title: "Markdown copied", status: "success", duration: 1500 });
                          } catch {
                            // Fallback
                            const ta = document.createElement('textarea');
                            ta.value = markdownRaw;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            document.body.removeChild(ta);
                            toast({ title: "Markdown copied", status: "success", duration: 1500 });
                          }
                        }}
                      >
                        Copy Markdown
                      </Button>
                    )}
                  </HStack>
                </Box>
                <Box
                  w="full"
                  p={[3, 4]}
                  borderRadius="md"
                  bg={preview ? "gray.900" : "gray.800"}
                  color={"white"}
                  _dark={{ bg: preview ? "gray.900" : "gray.800", color: "gray.200" }}
                  overflow="auto"
                  flex="1"
                  minHeight={viewMode === "split" ? 0 : ["320px", "480px", "640px"]}
                >
                  {preview ? (
                    <>
                      {tableRows?.length > 0 && (
                        <TableContainer mt={2}>
                          <Table
                            variant="striped"
                            colorScheme={useColorModeValue("gray", "blue")}
                            bg={useColorModeValue("white", "gray.700")}
                            borderRadius="md"
                          >
                            <Thead bg={useColorModeValue("gray.100", "gray.800")}>
                              <Tr>
                                <Th color={useColorModeValue("gray.700", "gray.200")}>Field</Th>
                                <Th color={useColorModeValue("gray.700", "gray.200")}>Value</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {tableRows?.map((row, index) => (
                                <Tr key={index}>
                                  <Td color={useColorModeValue("gray.700", "gray.200")}>{row[0]}</Td>
                                  <Td color={useColorModeValue("gray.700", "gray.200")}>{row[1]}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      )}
                      <Box mt={4} />
                      <Box
                        bg={useColorModeValue("white", "gray.900")}
                        color={useColorModeValue("gray.800", "gray.200")}
                        borderRadius="md"
                        p={4}
                        minHeight="320px"
                      >
                        <MarkdownViewer value={markdownValue} isDarkTheme={useColorModeValue(false, true)} />
                      </Box>
                    </>
                  ) : (
                    <Box
                      as="pre"
                      fontFamily="Fira Mono, Menlo, Monaco, Consolas, monospace"
                      fontSize={["sm", "sm", "md"]}
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {markdownRaw}
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
        p={[2, 4]}
        bg="gray.200"
        _dark={{ bg: "gray.800" }}
        borderRadius="lg"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        boxShadow="md"
        mt={4}
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
    <AlertDialog
  isOpen={showValidationAlert}
  leastDestructiveRef={cancelRef}
  onClose={() => setShowValidationAlert(false)}
  isCentered
  size="lg"
>
  <AlertDialogOverlay>
    <AlertDialogContent>
      <AlertDialogHeader fontSize="2xl" fontWeight="bold" color="red.500" display="flex" alignItems="center">
        <span style={{ display: "flex", alignItems: "center" }}>
          <CloseIcon boxSize={5} color="red.500" mr={3}/>
          Validation Error
        </span>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close Validation Errors"
          onClick={() => setShowValidationAlert(false)}
          variant="ghost"
          size="sm"
          position="absolute"
          right="12px"
          top="12px"
        />
      </AlertDialogHeader>
      <AlertDialogBody>
        <Accordion allowMultiple>
          {validationErrors.map((err, idx) => (
            <AccordionItem key={idx} border="none">
              <h2>
                <AccordionButton
                  px={3}
                  py={2}
                  borderRadius="md"
                  _expanded={{ bg: "red.50", _dark: { bg: "whiteAlpha.100" } }}
                  _hover={{ bg: "blackAlpha.50", _dark: { bg: "whiteAlpha.50" } }}
                >
                  <Box as="span" flex="1" textAlign="left" color="red.500" fontWeight="semibold">
                    {err.summary}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              {err.detail && (
                <AccordionPanel pb={4} fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                  {err.detail}
                </AccordionPanel>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={cancelRef} onClick={() => setShowValidationAlert(false)} colorScheme="red">
          Close
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialogOverlay>
</AlertDialog>

    </>
  )
}
export default ProposalEditor;
















































