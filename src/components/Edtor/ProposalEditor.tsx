import { useToast } from "@chakra-ui/react";
import { useState } from "react";

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

  return (
    <>
    </>
  )
}
export default ProposalEditor;
















































