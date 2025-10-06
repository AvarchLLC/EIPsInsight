import { 
  SimpleGrid, 
  Box, 
  Button, 
  VStack, 
  Text, 
  useColorModeValue,
  Collapse,
  Flex,
  Badge,
  Divider
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import DeclinedEIPCard from "./DeclinedForInclusion";
import Header from "@/components/Header";

interface DeclinedEIP {
  id: string;
  title: string;
  description: string;
  eipsLink: string;
  discussionLink: string;
}

interface DeclinedEIPListPageProps {
  selectedUpgrade: 'fusaka' | 'glamsterdam';
  fusaka?: DeclinedEIP[];
  glamsterdam?: DeclinedEIP[];
}

// Default (fallback) data – kept in case props not supplied
const defaultFusaka: DeclinedEIP[] = [
  {
    id: "EIP-663",
    title: "EIP-663: SWAPN, DUPN and EXCHANGE instructions",
    description: "Introduce additional instructions for manipulating the stack which allow accessing the stack at higher depths",
    eipsLink: "/eips/eip-663",
    discussionLink: "https://ethereum-magicians.org/t/eip-663-swapn-dupn-and-exchange-instructions/3346",
  },
  {
    id: "EIP-3540",
    title: "EIP-3540: EOF - EVM Object Format v1",
    description: "EOF is an extensible and versioned container format for EVM bytecode with a once-off validation at deploy time.",
    eipsLink: "/eips/eip-3540",
    discussionLink: "https://ethereum-magicians.org/t/evm-object-format-eof/5727",
  },
  {
    id: "EIP-3670",
    title: "EIP-3670: EOF - Code Validation",
    description: "Validate EOF bytecode for correctness at the time of deployment.",
    eipsLink: "/eips/eip-3670",
    discussionLink: "https://ethereum-magicians.org/t/eip-3670-eof-code-validation/6693",
  },
  {
    id: "EIP-4200",
    title: "EIP-4200: EOF - Static relative jumps",
    description: "RJUMP, RJUMPI and RJUMPV instructions with a signed immediate encoding the jump destination",
    eipsLink: "/eips/eip-4200",
    discussionLink: "https://ethereum-magicians.org/t/eip-4200-eof-static-relative-jumps/7108",
  },
  {
    id: "EIP-4750",
    title: "EIP-4750: EOF - Functions",
    description: "Individual sections for functions with `CALLF` and `RETF` instructions",
    eipsLink: "/eips/eip-4750",
    discussionLink: "https://ethereum-magicians.org/t/eip-4750-eof-functions/8195",
  },
  {
    id: "EIP-5450",
    title: "EIP-5450: EOF - Stack Validation",
    description: "Deploy-time validation of stack usage for EOF functions.",
    eipsLink: "/eips/eip-5450",
    discussionLink: "https://ethereum-magicians.org/t/eip-5450-eof-stack-validation/10410",
  },
  {
    id: "EIP-5920",
    title: "EIP-5920: PAY opcode",
    description: "Introduces a new opcode, PAY, to send ether to an address without calling any of its functions",
    eipsLink: "/eips/eip-5920",
    discussionLink: "https://ethereum-magicians.org/t/eip-5920-pay-opcode/11717",
  },
  {
    id: "EIP-6206",
    title: "EIP-6206: EOF - JUMPF and non-returning functions",
    description: "Introduces instruction for chaining function calls.",
    eipsLink: "/eips/eip-6206",
    discussionLink: "https://ethereum-magicians.org/t/eip-4750-eof-functions/8195",
  },
  {
    id: "EIP-7069",
    title: "EIP-7069: Revamped CALL instructions",
    description: "Introduce EXTCALL, EXTDELEGATECALL and EXTSTATICCALL with simplified semantics",
    eipsLink: "/eips/eip-7069",
    discussionLink: "https://ethereum-magicians.org/t/eip-7069-revamped-call-instructions/14432",
  },
  {
    id: "EIP-7480",
    title: "EIP-7480: EOF - Data section access instructions",
    description: "Instructions to read data section of EOF container",
    eipsLink: "/eips/eip-7480",
    discussionLink: "https://ethereum-magicians.org/t/eip-7480-eof-data-section-access-instructions/15414",
  },
  {
    id: "EIP-7620",
    title: "EIP-7620: EOF Contract Creation",
    description: "Introduce `EOFCREATE` and `RETURNCODE` instructions",
    eipsLink: "/eips/eip-7620",
    discussionLink: "https://ethereum-magicians.org/t/eip-7620-eof-contract-creation/18590",
  },
  {
    id: "EIP-7666",
    title: "EIP-7666: EVM-ify the identity precompile",
    description: "Remove the identity precompile, and put into place a piece of EVM code that has equivalent functionality",
    eipsLink: "/eips/eip-7666",
    discussionLink: "https://ethereum-magicians.org/t/eip-7561-evm-ify-the-identity-precompile/19445",
  },
  {
    id: "EIP-7668",
    title: "EIP-7668: Remove bloom filters",
    description: "Remove bloom filters from the execution block",
    eipsLink: "/eips/eip-7668",
    discussionLink: "https://ethereum-magicians.org/t/eip-7653-remove-bloom-filters/19447",
  },
  {
    id: "EIP-7698",
    title: "EIP-7698: EOF - Creation transaction",
    description: "Deploy EOF contracts using creation transactions",
    eipsLink: "/eips/eip-7698",
    discussionLink: "https://ethereum-magicians.org/t/eip-7698-eof-creation-transaction/19784",
  },
  {
    id: "EIP-7732",
    title: "EIP-7732: enshrined Proposer-Builder separation (ePBS)",
    description: "Enshrines proposer-builder separation at the protocol level to improve MEV resistance and block production efficiency.",
    eipsLink: "/eips/eip-7732",
    discussionLink: "https://ethereum-magicians.org/t/eip-7732-enshrined-proposer-builder-separation-epbs/20329",
  },
  {
    id: "EIP-7761",
    title: "EIP-7761: EXTCODETYPE instruction",
    description: "Add EXTCODETYPE instruction to EOF to address common uses of EXTCODE* instructions",
    eipsLink: "/eips/eip-7761",
    discussionLink: "https://ethereum-magicians.org/t/eip-7761-is-contract-instruction/20936",
  },
  {
    id: "EIP-7762",
    title: "EIP-7762: Increase MIN_BASE_FEE_PER_BLOB_GAS",
    description: "Adjust the MIN_BASE_FEE_PER_BLOB_GAS to speed up price discovery on blob space",
    eipsLink: "/eips/eip-7762",
    discussionLink: "https://ethereum-magicians.org/t/eip-7762-increase-min-base-fee-per-blob-gas/20949",
  },
  {
    id: "EIP-7791",
    title: "EIP-7791: GAS2ETH opcode",
    description: "Introduces a new opcode, `GAS2ETH`, to convert gas to ETH",
    eipsLink: "/eips/eip-7791",
    discussionLink: "https://ethereum-magicians.org/t/eip-7791-gas2eth-opcode/21418",
  },
  {
    id: "EIP-7793",
    title: "EIP-7793: Conditional Transactions",
    description: "Transactions that only executes at a specific index and slot.",
    eipsLink: "/eips/eip-7793",
    discussionLink: "https://ethereum-magicians.org/t/eip-7793-asserttxindex-opcode/21513",
  },
  {
    id: "EIP-7805",
    title: "EIP-7805: Fork-Choice Inclusion Lists (FOCIL)",
    description: "Fork-Choice enforced Inclusion Lists improve improve censorship resistance by enable multiple proposer to force-include transactions in Ethereum blocks.",
    eipsLink: "/eips/eip-7805",
    discussionLink: "https://ethereum-magicians.org/t/eip-7805-committee-based-fork-choice-enforced-inclusion-lists-focil/21578",
  },
  {
    id: "EIP-7819",
    title: "EIP-7819: SETDELEGATE instruction",
    description: "Introduce a new instruction allowing contracts to create clones using EIP-7702 delegation designations",
    eipsLink: "/eips/eip-7819",
    discussionLink: "https://ethereum-magicians.org/t/eip-7819-create-delegate/21763",
  },
  {
    id: "EIP-7834",
    title: "EIP-7834: Separate Metadata Section for EOF",
    description: "Introduce a new separate metadata section to the EOF",
    eipsLink: "/eips/eip-7834",
    discussionLink: "https://ethereum-magicians.org/t/eip-7834-separate-metadata-section-for-eof/22138",
  },
  {
    id: "EIP-7843",
    title: "EIP-7843: SLOTNUM opcode",
    description: "Opcode to get the current slot number.",
    eipsLink: "/eips/eip-7843",
    discussionLink: "https://ethereum-magicians.org/t/eip-7843-slotnum-opcode/22234",
  },
  {
    id: "EIP-7873",
    title: "EIP-7873: EOF - TXCREATE and InitcodeTransaction type",
    description: "Adds a `TXCREATE` instruction to EOF and an accompanying transaction type allowing to create EOF contracts from transaction data",
    eipsLink: "/eips/eip-7873",
    discussionLink: "https://ethereum-magicians.org/t/eip-7873-eof-txcreate-instruction-and-initcodetransaction-type/22765",
  },
  {
    id: "EIP-7880",
    title: "EIP-7880: EOF - EXTCODEADDRESS instruction",
    description: "Add EXTCODEADDRESS instruction to EOF to address code delegation use cases",
    eipsLink: "/eips/eip-7880",
    discussionLink: "https://ethereum-magicians.org/t/eip-7880-eof-extcodeaddress-instruction/22845",
  },
  {
    id: "EIP-7889",
    title: "EIP-7889: Emit log on revert",
    description: "Top level reverts emit a log with revert message",
    eipsLink: "/eips/eip-7889",
    discussionLink: "https://ethereum-magicians.org/t/eip-7889-emit-log-on-revert/22918",
  },
  {
    id: "EIP-7898",
    title: "EIP-7898: Uncouple execution payload from beacon block",
    description: "Separates the execution payload from beacon block to independently transmit them",
    eipsLink: "/eips/eip-7898",
    discussionLink: "https://ethereum-magicians.org/t/uncouple-execution-payload-from-beacon-block/23029",
  },
  {
    id: "EIP-7903",
    title: "EIP-7903: Remove Initcode Size Limit",
    description: "Removes the initcode size limit introduced in EIP-3860",
    eipsLink: "/eips/eip-7903",
    discussionLink: "https://ethereum-magicians.org/t/remove-initcode-size-limit/23066",
  },
  {
    id: "EIP-7912",
    title: "EIP-7912: Pragmatic stack manipulation tools",
    description: "Add additional SWAP and DUP operations for deeper stack access",
    eipsLink: "/eips/eip-7912",
    discussionLink: "https://ethereum-magicians.org/t/eip-7912-pragmatic-expansion-of-stack-manipulation-tools/23826",
  },
  {
    id: "EIP-7919",
    title: "EIP-7919: Pureth - Provable RPC responses",
    description: "Enables provable RPC responses to eliminate trust requirements in data access and improve decentralization.",
    eipsLink: "/eips/eip-7919",
    discussionLink: "https://ethereum-magicians.org/t/eip-7919-pureth-meta/23273",
  },
  {
  id: "EIP-7688",
  title: "EIP-7688: Forward compatible consensus data structures",
  description: "Transition consensus SSZ data structures to ProgressiveContainer for forward compatibility.",
  eipsLink: "/eips/eip-7688",
  discussionLink: "https://ethereum-magicians.org/t/eip-7688-forward-compatible-consensus-data-structures/19673",
},
{
  id: "EIP-7783",
  title: "EIP-7783: Add Controlled Gas Limit Increase Strategy",
  description: "Adds a controlled gas limit increase strategy.",
  eipsLink: "/eips/eip-7783",
  discussionLink: "https://ethereum-magicians.org/t/eip-7783-add-controlled-gas-limit-increase-strategy/21282",
},

];

const defaultGlamsterdam: DeclinedEIP[] = [
  {
  id: "EIP-7782",
  title: "EIP-7782: Reduce Block Latency",
  description: "Reduce Ethereum's slot time from 12s to 6s to decrease latency by 50%, distribute bandwidth usage, and improve UX.",
  eipsLink: "/eips/eip-7782",
  discussionLink: "https://ethereum-magicians.org/t/eip-7782-reduce-block-latency/21271",
},
]

export default function DeclinedEIPListPage({
  selectedUpgrade,
  fusaka = defaultFusaka,
  glamsterdam = defaultGlamsterdam
}: DeclinedEIPListPageProps) {
  const [showAll, setShowAll] = useState(false);
  
  const data = selectedUpgrade === 'fusaka' ? fusaka : glamsterdam;
  const upgradeLabel = selectedUpgrade === 'fusaka' ? 'Fusaka' : 'Glamsterdam';
  
  // Color mode values
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  
  // Configure initial display count
  const INITIAL_COUNT = 6;
  const displayedData = showAll ? data : data.slice(0, INITIAL_COUNT);
  const hasMoreItems = data.length > INITIAL_COUNT;

  if (!data.length) return null;

  return (
    <Box id="dfi" mt={8}>
      {/* Compact Header Section */}
      <VStack spacing={3} mb={6} align="start">
        <Flex align="center" gap={3}>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Declined for Inclusion
          </Text>
          <Badge 
            colorScheme="red" 
            variant="subtle" 
            px={2} 
            py={1} 
            borderRadius="md"
            fontSize="sm"
          >
            {upgradeLabel}
          </Badge>
          <Badge 
            colorScheme="gray" 
            variant="outline" 
            px={2} 
            py={1} 
            borderRadius="md"
            fontSize="sm"
          >
            {data.length} EIPs
          </Badge>
        </Flex>
        
        <Text fontSize="sm" color={textColor} maxW="600px">
          EIPs considered for {upgradeLabel} but not included in the upgrade. 
          These proposals may be reconsidered in future upgrades.
        </Text>
        
        <Divider borderColor={borderColor} />
      </VStack>

      {/* Compact Grid Display */}
      <Box
        bg={sectionBg}
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
      >
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={3}
          mb={hasMoreItems ? 4 : 0}
        >
          {displayedData.map(eip => (
            <DeclinedEIPCard key={eip.id} eip={eip} />
          ))}
        </SimpleGrid>

        {/* Show More/Less Button */}
        {hasMoreItems && (
          <Flex justify="center" mt={4}>
            <Button
              variant="ghost"
              colorScheme="blue"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              leftIcon={showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
              _hover={{
                bg: useColorModeValue("blue.50", "blue.900"),
                transform: "translateY(-1px)"
              }}
              transition="all 0.2s"
            >
              {showAll 
                ? `Show Less` 
                : `Show ${data.length - INITIAL_COUNT} More EIPs`
              }
            </Button>
          </Flex>
        )}

        {/* Summary Footer */}
        <Flex 
          justify="space-between" 
          align="center" 
          mt={4} 
          pt={3} 
          borderTop="1px solid" 
          borderColor={borderColor}
          fontSize="xs"
          color={textColor}
        >
          <Text>
            Showing {displayedData.length} of {data.length} declined EIPs
          </Text>
          <Text>
            Updated for {upgradeLabel} upgrade
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
