// Improved version of NetworkUpgradesChart with refined styling, fixed color mapping, and better rendering
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Flex, Heading, HStack, IconButton, Text, VStack, Wrap, WrapItem,
  useColorModeValue,
  Badge,
  Collapse
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@chakra-ui/icons';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/router';
import CopyLink from './CopyLink'; // Ensure this component exists
import DateTime from "@/components/DateTime";


interface UpgradeData {
  date: string;
  upgrade: string;
  eips: string[];
  layer?: 'execution' | 'consensus';
  description?: string;
  blockNumber?: number;
  forkEpoch?: number;
  specsLink?: string;
  blogLink?: string;
}

interface EIPInfo {
  title: string;
  category: 'Core' | 'Meta' | 'Informational' | 'ERC' | 'Networking';
}

const eipTitles: Record<string, EIPInfo> = {
  '2537': { title: 'BLS12-381 curve operations', category: 'Core' },
  '2935': { title: 'Save historical block hashes in state', category: 'Core' },
  '6110': { title: 'Supply validator deposits on chain', category: 'Core' },
  '7002': { title: 'Execution layer triggerable exits', category: 'Core' },
  '7251': { title: 'Increase the MAX_EFFECTIVE_BALANCE', category: 'Core' },
  '7549': { title: 'Move committee index outside Attestation', category: 'Core' },
  '7623': { title: 'Increase calldata cost', category: 'Core' },
  '7685': { title: 'General purpose execution layer requests', category: 'Core' },
  '7691': { title: 'Blob throughput increase', category: 'Core' },
  '7702': { title: 'Set EOA account code', category: 'Core' },
  '7840': { title: 'Add blob schedule to EL config files', category: 'Core' },
  '7594': { title: 'PeerDAS - Peer Data Availability Sampling', category: 'Core' },
  '7823': { title: 'Contract Code Size Limit Increase', category: 'Core' },
  '7825': { title: 'Gas Limit Cap for Network Stability', category: 'Core' },
  '7883': { title: 'Blob Gas Target and Max', category: 'Core' },
  '7917': { title: 'Contract Storage Optimization', category: 'Core' },
  '7918': { title: 'Verkle Trees Integration', category: 'Core' },
  '7934': { title: 'Block Size Limit Increase', category: 'Core' },
  '7939': { title: 'Transaction Pool Improvements', category: 'Core' },
  '7951': { title: 'State Expiry Mechanism', category: 'Core' },
  '1153': { title: 'Transient storage opcodes', category: 'Core' },
  '4788': { title: 'Beacon block root in the EVM', category: 'Core' },
  '4844': { title: 'Shard Blob Transactions', category: 'Core' },
  '5656': { title: 'MCOPY - Memory copying instruction', category: 'Core' },
  '6780': { title: 'SELFDESTRUCT only in same transaction', category: 'Core' },
  '7044': { title: 'Perpetually Valid Signed Voluntary Exits', category: 'Core' },
  '7045': { title: 'Increase Max Attestation Inclusion Slot', category: 'Core' },
  '7514': { title: 'Add Max Epoch Churn Limit', category: 'Core' },
  '7516': { title: 'BLOBBASEFEE opcode', category: 'Core' },
  '3651': { title: 'Warm COINBASE', category: 'Core' },
  '3855': { title: 'PUSH0 instruction', category: 'Core' },
  '3860': { title: 'Limit and meter initcode', category: 'Core' },
  '4895': { title: 'Beacon chain push withdrawals', category: 'Core' },
  '6049': { title: 'Deprecate SELFDESTRUCT', category: 'Core' },
  '3675': { title: 'Upgrade consensus to Proof-of-Stake', category: 'Core' },
  '4399': { title: 'Supplant DIFFICULTY with PREVRANDAO', category: 'Core' },
  '5133': { title: 'Difficulty Bomb Delay to June 2022', category: 'Core' },
  '4345': { title: 'Difficulty Bomb Delay to June 2022', category: 'Core' },
  '1559': { title: 'Fee market change for ETH 1.0 chain', category: 'Core' },
  '3198': { title: 'BASEFEE opcode', category: 'Core' },
  '3529': { title: 'Reduction in refunds', category: 'Core' },
  '3541': { title: 'Reject new contract code starting with the 0xEF byte', category: 'Core' },
  '3554': { title: 'Difficulty Bomb Delay to December 2021', category: 'Core' },
  '2565': { title: 'ModExp Gas Cost', category: 'Core' },
  '2929': { title: 'Gas cost increases for state access opcodes', category: 'Core' },
  '2718': { title: 'Typed Transaction Envelope', category: 'Core' },
  '2930': { title: 'Optional access lists', category: 'Core' },
  '2384': { title: 'Muir Glacier Difficulty Bomb Delay', category: 'Core' },
  '152': { title: 'Add BLAKE2 compression function F precompile', category: 'Core' },
  '1108': { title: 'Reduce alt_bn128 precompile gas costs', category: 'Core' },
  '1344': { title: 'ChainID opcode', category: 'Core' },
  '1884': { title: 'Repricing for trie-size-dependent opcodes', category: 'Core' },
  '2028': { title: 'Transaction data gas cost reduction', category: 'Core' },
  '2200': { title: 'Structured Definitions for Net Gas Metering', category: 'Core' },
  '1283': { title: 'Net gas metering for SSTORE without dirty maps', category: 'Core' },
  '145': { title: 'Bitwise shifting instructions in EVM', category: 'Core' },
  '1014': { title: 'Skinny CREATE2', category: 'Core' },
  '1052': { title: 'EXTCODEHASH opcode', category: 'Core' },
  '1234': { title: 'Constantinople Difficulty Bomb Delay and Block Reward Adjustment', category: 'Core' },
  '1234-removed': { title: '[REMOVED] Constantinople Difficulty Bomb Delay', category: 'Core' },
  '100': { title: 'Change difficulty adjustment to target mean block time', category: 'Core' },
  '140': { title: 'REVERT instruction', category: 'Core' },
  '196': { title: 'Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128', category: 'Core' },
  '197': { title: 'Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128', category: 'Core' },
  '198': { title: 'Big integer modular exponentiation', category: 'Core' },
  '211': { title: 'New opcodes: RETURNDATASIZE and RETURNDATACOPY', category: 'Core' },
  '214': { title: 'New opcode STATICCALL', category: 'Core' },
  '649': { title: 'Metropolis Difficulty Bomb Delay and Block Reward Reduction', category: 'Core' },
  '658': { title: 'Embedding transaction status code in receipts', category: 'Core' },
  '155': { title: 'Simple replay attack protection', category: 'Core' },
  '160': { title: 'EXP cost increase', category: 'Core' },
  '161': { title: 'State trie clearing (invariant-preserving alternative)', category: 'Core' },
  '170': { title: 'Contract code size limit', category: 'Core' },
  '150': { title: 'Gas cost changes for IO-heavy operations', category: 'Core' },
  '2': { title: 'Homestead Hard-fork Changes', category: 'Core' },
  '7': { title: 'DELEGATECALL', category: 'Core' },
  '8': { title: 'devp2p Forward Compatibility Requirements for Homestead', category: 'Networking' },
};

const consensusSpecsLinks: Record<string, string> = {
  'Altair': 'https://github.com/ethereum/consensus-specs/tree/master/specs/altair',
  'Bellatrix': 'https://github.com/ethereum/consensus-specs/tree/master/specs/bellatrix',
  'Capella': 'https://github.com/ethereum/consensus-specs/tree/master/specs/capella',
  'Deneb': 'https://github.com/ethereum/consensus-specs/tree/master/specs/deneb',
  'Electra': 'https://github.com/ethereum/consensus-specs/tree/master/specs/electra',
  'Fulu': 'https://github.com/ethereum/consensus-specs/tree/master/specs/fulu',
};

const executionSpecsLinks: Record<string, string> = {
  'DAO Fork': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/dao-fork.md',
  'Homestead': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/homestead.md',
  'Tangerine Whistle': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/tangerine-whistle.md',
  'Spurious Dragon': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/spurious-dragon.md',
  'Byzantium': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/byzantium.md',
  'Constantinople': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/constantinople.md',
  'Petersburg': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/petersburg.md',
  'Istanbul': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/istanbul.md',
  'Muir Glacier': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/muir-glacier.md',
  'Berlin': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/berlin.md',
  'London': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/london.md',
  'Arrow Glacier': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/arrow-glacier.md',
  'Gray Glacier': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/gray-glacier.md',
  'Paris': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/paris.md',
  'Shapella': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/shanghai.md',
  'Dencun': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/cancun.md',
  'Pectra': 'https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/prague.md',
};

const upgradeMetaEIPs: Record<string, string> = {
  'Homestead': 'EIP-606',
  'Tangerine Whistle': 'EIP-608',
  'Spurious Dragon': 'EIP-607',
  'DAO Fork': 'EIP-779',
  'Byzantium': 'EIP-609',
  'Constantinople': 'EIP-1013',
  'Petersburg': 'EIP-1716',
  'Istanbul': 'EIP-1679',
  'Muir Glacier': 'EIP-2387',
  'Berlin': 'EIP-7568',
  'London': 'EIP-7568',
  'Arrow Glacier': 'EIP-7568',
  'Gray Glacier': 'EIP-7568',
  'Paris': 'EIP-7568',
  'Shapella': 'EIP-7568',
  'Dencun': 'EIP-7569',
  'Pectra': 'EIP-7600',
  'Fusaka': 'EIP-7607',
};

const upgradeDescriptions: Record<string, string> = {
  "Fusaka": "Fulu-Osaka: PeerDAS for blob scaling, gas limit increase to 60M",
  "Osaka": "Consensus layer: Future scaling improvements",
  "Pectra": "Prague-Electra: Account abstraction (EIP-7702), validator improvements",
  "Electra": "Consensus layer: Validator consolidation & staking enhancements",
  "Dencun": "Cancun-Deneb: Proto-danksharding (EIP-4844) for L2 scaling",
  "Deneb": "Consensus layer: Blob infrastructure support",
  "Shapella": "Shanghai-Capella: Staking withdrawals enabled",
  "Capella": "Consensus layer: Validator exit & withdrawal support",
  "Paris": "The Merge: Transition to Proof of Stake",
  "Bellatrix": "Consensus layer: Merge preparation",
  "Gray Glacier": "Difficulty bomb delay",
  "Arrow Glacier": "Difficulty bomb delay",
  "Altair": "First Beacon Chain upgrade: Sync committees",
  "London": "EIP-1559 fee market reform",
  "Berlin": "Gas cost optimizations",
  "Muir Glacier": "Difficulty bomb delay",
  "Istanbul": "Privacy & interoperability improvements",
  "Constantinople": "EVM improvements & efficiency",
  "Petersburg": "Constantinople hotfix",
  "Byzantium": "Privacy & security enhancements",
  "Spurious Dragon": "DoS attack mitigation",
  "Tangerine Whistle": "DoS attack response",
  "DAO Fork": "Irregular state change to recover DAO funds",
  "Homestead": "First planned protocol upgrade",
  "Frontier Thawing": "Ice Age begins: Difficulty adjustment",
};

const professionalColorMap: Record<string, string> = {
  "Fusaka": "#10B981",            // Emerald 500 (2025-12-03)
  "Osaka": "#10B981",             // Emerald 500 (Consensus layer)
  "Pectra": "#DC2626",            // Red 600 (2025-05-07)
  "Electra": "#DC2626",           // Red 600 (Consensus layer)
  "Dencun": "#2563EB",            // Blue 600 (2024-03-13)
  "Deneb": "#2563EB",             // Blue 600 (Consensus layer)
  "Shapella": "#059669",          // Emerald 600 (2023-04-12)
  "Capella": "#059669",           // Emerald 600 (Consensus layer)
  "Paris": "#7C3AED",             // Violet 600 (2022-09-15)
  "Bellatrix": "#EA580C",         // Orange 600 (2022-09-06)
  "Gray Glacier": "#4F46E5",      // Indigo 600 (2022-06-30)
  "Arrow Glacier": "#BE123C",     // Rose 700 (2021-12-09)
  "Altair": "#0284C7",            // Sky 600 (2021-10-27)
  "London": "#C026D3",            // Fuchsia 600 (2021-08-05)
  "Berlin": "#D97706",            // Amber 600 (2021-04-15)
  "Muir Glacier": "#B91C1C",      // Red 700 (2020-01-02)
  "Istanbul": "#BE185D",          // Pink 700 (2019-12-08)
  "Constantinople": "#0891B2",    // Cyan 600 (2019-02-28)
  "Petersburg": "#0D9487",        // Teal 600 (2019-02-28)
  "Byzantium": "#047857",         // Emerald 700 (2017-10-16)
  "Spurious Dragon": "#0F766E",   // Teal 700 (2016-11-23)
  "Tangerine Whistle": "#CA8A04", // Yellow 600 (2016-10-18)
  "DAO Fork": "#C2410C",          // Orange 700 (2016-07-20)
  "Homestead": "#7C2D12",         // Orange 800 (2016-03-14)
  "Frontier Thawing": "#92400E",  // Amber 900 (2015-09-07)
};



// Grouped data structure - each upgrade has its EIPs in an array
const rawData: UpgradeData[] = [
  // Fusaka (Fulu-Osaka) — December 3, 2025 (Execution layer)
  { 
    date: "2025-12-03", 
    upgrade: "Fusaka", 
    layer: "execution",
    eips: ["EIP-7594", "EIP-7823", "EIP-7825", "EIP-7883", "EIP-7917", "EIP-7918", "EIP-7934", "EIP-7939", "EIP-7951"]
  },

  // Fulu — December 3, 2025 (Consensus layer)
  { date: "2025-12-03", upgrade: "Fulu", layer: "consensus", forkEpoch: 411392, eips: ["CONSENSUS"] },

  // Pectra (Prague-Electra) — May 7, 2025 (Execution layer)
  { 
    date: "2025-05-07", 
    upgrade: "Pectra", 
    layer: "execution",
    blockNumber: 22431084,
    eips: ["EIP-2537", "EIP-2935", "EIP-6110", "EIP-7002", "EIP-7251", "EIP-7549", "EIP-7623", "EIP-7685", "EIP-7691", "EIP-7702"]
  },

  // Electra — May 7, 2025 (Consensus layer)
  { date: "2025-05-07", upgrade: "Electra", layer: "consensus", forkEpoch: 364032, eips: ["CONSENSUS"] },

  // Dencun (Cancun-Deneb) — March 13, 2024 (Execution layer)
  { 
    date: "2024-03-13", 
    upgrade: "Dencun", 
    layer: "execution",
    blockNumber: 19426587,
    eips: ["EIP-1153", "EIP-4788", "EIP-4844", "EIP-5656", "EIP-6780", "EIP-7516"]
  },

  // Deneb — March 13, 2024 (Consensus layer)
  { date: "2024-03-13", upgrade: "Deneb", layer: "consensus", forkEpoch: 269568, eips: ["CONSENSUS"] },

  // Shapella (Shanghai-Capella) — April 12, 2023 (Execution layer)
  { 
    date: "2023-04-12", 
    upgrade: "Shapella", 
    layer: "execution",
    blockNumber: 17034870,
    eips: ["EIP-3651", "EIP-3855", "EIP-3860", "EIP-4895"]
  },

  // Capella — April 12, 2023 (Consensus layer)
  { date: "2023-04-12", upgrade: "Capella", layer: "consensus", forkEpoch: 194048, eips: ["CONSENSUS"] },

  // Paris (The Merge) — September 15, 2022 (Execution layer)
  { date: "2022-09-15", upgrade: "Paris", layer: "execution", blockNumber: 15537394, eips: ["EIP-3675", "EIP-4399"] },

  // Bellatrix — September 6, 2022 (Consensus layer)
  { date: "2022-09-06", upgrade: "Bellatrix", layer: "consensus", forkEpoch: 144896, eips: ["CONSENSUS"] },

  // Gray Glacier — June 30, 2022 (Execution layer)
  { date: "2022-06-30", upgrade: "Gray Glacier", layer: "execution", blockNumber: 15050000, eips: ["EIP-5133"] },

  // Arrow Glacier — December 9, 2021 (Execution layer)
  { date: "2021-12-09", upgrade: "Arrow Glacier", layer: "execution", blockNumber: 13773000, eips: ["EIP-4345"] },

  // Altair — October 27, 2021 (Consensus layer)
  { date: "2021-10-27", upgrade: "Altair", layer: "consensus", forkEpoch: 74240, eips: ["CONSENSUS"] },

  // London — August 5, 2021 (Execution layer)
  { 
    date: "2021-08-05", 
    upgrade: "London", 
    layer: "execution",
    blockNumber: 12965000,
    eips: ["EIP-1559", "EIP-3198", "EIP-3529", "EIP-3541", "EIP-3554"]
  },

  // Berlin — April 15, 2021 (Execution layer)
  { 
    date: "2021-04-15", 
    upgrade: "Berlin", 
    layer: "execution",
    blockNumber: 12244000,
    eips: ["EIP-2565", "EIP-2929", "EIP-2718", "EIP-2930"]
  },

  // Muir Glacier — January 2, 2020 (Execution layer)
  { date: "2020-01-02", upgrade: "Muir Glacier", layer: "execution", blockNumber: 9200000, eips: ["EIP-2384"] },

  // Istanbul — December 7, 2019 (Execution layer)
  { 
    date: "2019-12-07", 
    upgrade: "Istanbul", 
    layer: "execution",
    blockNumber: 9069000,
    eips: ["EIP-152", "EIP-1108", "EIP-1344", "EIP-1884", "EIP-2028", "EIP-2200"]
  },

  // Petersburg — February 28, 2019 (Execution layer)
  { 
    date: "2019-02-28", 
    upgrade: "Petersburg", 
    layer: "execution",
    blockNumber: 7280000,
    eips: ["EIP-1234-removed"]
  },

  // Constantinople — February 28, 2019 (Execution layer)
  { 
    date: "2019-02-28", 
    upgrade: "Constantinople", 
    layer: "execution",
    blockNumber: 7280000,
    eips: ["EIP-145", "EIP-1014", "EIP-1052", "EIP-1234", "EIP-1283"]
  },

  // Byzantium — October 16, 2017 (Execution layer)
  { 
    date: "2017-10-16", 
    upgrade: "Byzantium", 
    layer: "execution",
    blockNumber: 4370000,
    eips: ["EIP-100", "EIP-140", "EIP-196", "EIP-197", "EIP-198", "EIP-211", "EIP-214", "EIP-649", "EIP-658"]
  },

  // Spurious Dragon — November 22, 2016 (Execution layer)
  { 
    date: "2016-11-22", 
    upgrade: "Spurious Dragon", 
    layer: "execution",
    blockNumber: 2675000,
    eips: ["EIP-155", "EIP-160", "EIP-161", "EIP-170"]
  },

  // Tangerine Whistle — October 18, 2016 (Execution layer)
  { date: "2016-10-18", upgrade: "Tangerine Whistle", layer: "execution", blockNumber: 2463000, eips: ["EIP-150"] },

  // DAO Fork — July 20, 2016 (Irregular state change)
  { date: "2016-07-20", upgrade: "DAO Fork", layer: "execution", blockNumber: 1920000, eips: ["NO-EIP"] },

  // Homestead — March 14, 2016 (Execution layer)
  { date: "2016-03-14", upgrade: "Homestead", layer: "execution", blockNumber: 1150000, eips: ["EIP-2", "EIP-7", "EIP-8"] },

  // Frontier Thawing — September 7, 2015 (Execution layer)
  { date: "2015-09-07", upgrade: "Frontier Thawing", layer: "execution", blockNumber: 200000, eips: ["NO-EIP"] },
];

// Process and format EIP display names, add meta EIP as separate entry
const upgradeRows = rawData
  .flatMap(item => {
    const metaEIP = upgradeMetaEIPs[item.upgrade];
    const processedEips = item.eips.map(eip => 
      eip === "NO-EIP" || eip === "CONSENSUS" ? eip : eip.replace("EIP-", "")
    );
    
    const rows = [];
    // Add main EIPs row
    if (processedEips.length > 0) {
      rows.push({
        ...item,
        eips: processedEips,
        isMeta: false
      });
    }
    // Add meta EIP row if exists
    if (metaEIP) {
      rows.push({
        ...item,
        eips: [metaEIP.replace("EIP-", "")],
        isMeta: true
      });
    }
    return rows;
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const uniqueUpgrades = [...new Set(upgradeRows.map(r => r.upgrade))];
const colorMap = uniqueUpgrades.reduce((map, upgrade) => {
  map[upgrade] = professionalColorMap[upgrade] || '#6B7280';
  return map;
}, {} as Record<string, string>);

const NetworkUpgradesChart: React.FC = () => {
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [hoveredData, setHoveredData] = useState<{ date: string; upgrade: string; eip: string } | null>(null);
  const [hoveredNetwork, setHoveredNetwork] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1400, height: 500 });
  const [showLayerInfo, setShowLayerInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const bg = useColorModeValue('gray.50', 'gray.800');
  const axisColor = useColorModeValue('#333', '#ccc');
  const tooltipBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        // Ensure minimum width to accommodate all dates - increased spacing
        const minWidth = Math.max(2800, allDates.length * 140);
        const width = Math.max(containerRef.current.clientWidth, minWidth);
        console.log('Chart dimensions:', { minWidth, width, totalDates: allDates.length });
        const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));
        const height = Math.max(400, maxEips * 35 + 150);
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const allDates = Array.from(new Set(upgradeRows.map(r => r.date))).sort();
  const maxEips = Math.max(...upgradeRows.map(r => r.eips.length || 1));
  const margin = { top: 60, right: 40, bottom: 140, left: 100 };
  const { width, height } = dimensions;

  // Create mapping from dates to upgrade names for x-axis labels
  // Handle multiple upgrades on same date by combining them
  const dateToUpgradeMap = upgradeRows.reduce((acc, row) => {
    if (!acc[row.date]) {
      acc[row.date] = row.upgrade;
    } else if (!acc[row.date].includes(row.upgrade)) {
      // If multiple upgrades on same date, combine them
      acc[row.date] = `${acc[row.date]} / ${row.upgrade}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const xScale = scaleBand({ domain: allDates, range: [margin.left, width - margin.right], padding: 0.1 });
  const yScale = scaleLinear({ domain: [0, maxEips + 1], range: [height - margin.bottom, margin.top] });

  const resetZoom = () => {
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newMousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setMousePos(newMousePos);
    
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x - dx / zoomLevel, y: prev.y - dy / zoomLevel }));
  };

  const downloadReport = () => {
    const headers = ['Date', 'Network Upgrade', 'EIPs'];
    const rows = upgradeRows.map(row => [row.date, row.upgrade, row.eips.join(', ')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'network_upgrade_timeline.csv');
  };

  const handleEipClick = (eip: string, upgrade: string) => {
    if (eip === 'CONSENSUS') {
      // Navigate to consensus specs for this upgrade
      const link = consensusSpecsLinks[upgrade];
      if (link) {
        window.open(link, '_blank');
      }
    } else if (eip === 'NO-EIP') {
      // Navigate to execution specs for this upgrade
      const link = executionSpecsLinks[upgrade];
      if (link) {
        window.open(link, '_blank');
      }
    } else {
      // Extract the EIP number from the EIP string (e.g., "EIP-1559" -> "1559", "3554" -> "3554")
      const eipNumber = eip.replace('EIP-', '').replace('EIP', '').replace('-removed', '');
      // Navigate to the EIP detail page
      router.push(`/eips/eip-${eipNumber}`);
    }
  };

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.900')} 
      borderRadius="2xl" 
      boxShadow={useColorModeValue('0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)')}
      ref={containerRef} 
      position="relative" 
      minWidth="100%" 
      width="100%"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      {/* Outer Container */}
      <Box p={8}>
        {/* Header Section */}
        <Box 
          mb={8} 
          pb={6} 
          borderBottom="1px solid" 
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" color={useColorModeValue('gray.900', 'white')} mb={3} fontWeight="600" letterSpacing="-0.025em">
                Ethereum Network Upgrade Timeline <CopyLink link="https://eipsinsight.com/upgrade#NetworkUpgrades" />
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} fontWeight="400" lineHeight="1.6">
                Comprehensive timeline of Ethereum network upgrades and their associated EIP implementations
              </Text>
            </Box>
            <HStack spacing={4}>
              <Box bg={useColorModeValue('white', 'gray.700')} p={2} borderRadius="lg" boxShadow="sm" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                <HStack spacing={2}>
                  <IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={() => setZoomLevel(z => Math.min(z * 1.2, 3))} variant="ghost" colorScheme="gray" />
                  <IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={() => setZoomLevel(z => Math.max(z / 1.2, 0.5))} variant="ghost" colorScheme="gray" />
                  <IconButton aria-label="Reset Zoom" icon={<RepeatIcon />} size="sm" onClick={resetZoom} variant="ghost" colorScheme="gray" />
                </HStack>
              </Box>
              <Button 
                size="md" 
                bg={useColorModeValue('blue.600', 'blue.500')}
                color="white"
                onClick={downloadReport}
                fontWeight="500"
                px={6}
                _hover={{ bg: useColorModeValue('blue.700', 'blue.600'), transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                boxShadow="sm"
              >
                Export Data
              </Button>
            </HStack>
          </Flex>

          {/* Collapsible Info Section */}
          <Box mt={4}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowLayerInfo(!showLayerInfo)}
              rightIcon={showLayerInfo ? <ChevronUpIcon /> : <ChevronDownIcon />}
              leftIcon={<InfoIcon />}
              colorScheme="blue"
              fontWeight="500"
            >
              {showLayerInfo ? 'Hide' : 'Show'} Layer Information
            </Button>
            
            <Collapse in={showLayerInfo} animateOpacity>
              <Box
                mt={3}
                p={5}
                bg={useColorModeValue('blue.50', 'gray.700')}
                borderRadius="lg"
                border="1px solid"
                borderColor={useColorModeValue('blue.200', 'blue.600')}
                boxShadow="sm"
              >
                <VStack align="start" spacing={4}>
                  <Box>
                    <Heading size="sm" mb={2} color={useColorModeValue('gray.900', 'white')}>
                      Understanding Layer Badges
                    </Heading>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.7">
                      Network upgrades are categorized by the layer of the Ethereum protocol they modify:
                    </Text>
                  </Box>

                  <HStack spacing={8} flexWrap="wrap">
                    <Box>
                      <HStack mb={2}>
                        <Badge colorScheme="teal" fontSize="sm" px={2} py={1}>⚙️ Execution Layer</Badge>
                      </HStack>
                      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} maxW="400px" lineHeight="1.7">
                        Protocol changes implemented through Ethereum Improvement Proposals (EIPs). These affect transaction execution, gas mechanics, smart contracts, and the Ethereum Virtual Machine (EVM).
                      </Text>
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mt={1} fontStyle="italic">
                        Examples: London (EIP-1559), Shanghai (EIP-3651, EIP-3855)
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>⛓️ Consensus Layer</Badge>
                      </HStack>
                      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} maxW="400px" lineHeight="1.7">
                        Beacon Chain upgrades that don't have formal EIP numbers. These affect proof-of-stake consensus, validators, attestations, and the beacon chain protocol.
                      </Text>
                      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mt={1} fontStyle="italic">
                        Examples: Altair (sync committees), Capella (withdrawals), Deneb (Proto-Danksharding)
                      </Text>
                    </Box>
                  </HStack>

                  <Box 
                    bg={useColorModeValue('yellow.50', 'gray.600')} 
                    p={3} 
                    borderRadius="md"
                    border="1px solid"
                    borderColor={useColorModeValue('yellow.200', 'yellow.700')}
                  >
                    <Text fontSize="xs" color={useColorModeValue('gray.700', 'gray.200')} lineHeight="1.6">
                      <strong>Note:</strong> Some network upgrades like Shanghai and Cancun contain changes to both layers, coordinated at the same activation time. The badge indicates the primary layer affected by each specific EIP or upgrade component.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Collapse>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Flex gap={8} align="flex-start">
          {/* Chart Container */}
          <Box 
            bg={useColorModeValue('gray.50', 'gray.800')} 
            borderRadius="xl" 
            p={6} 
            position="relative"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            boxShadow={useColorModeValue('inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)')}
            flex="1"
            overflowX="auto" 
            overflowY="hidden"
          >
          <svg
        width={width}
        height={height}
        viewBox={`${offset.x} ${offset.y} ${width / zoomLevel} ${height / zoomLevel}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          minWidth: `${width}px`,
          display: 'block'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={(e) => {
          handleMouseUp();
          setHoveredData(null);
        }}
      >
        <Group>
          <AxisBottom
            top={height - margin.bottom + 20}
            scale={xScale}
            tickFormat={(date) => {
              // Show upgrade names instead of dates
              return dateToUpgradeMap[date as string] || date as string;
            }}
            tickLabelProps={(value, index) => ({ 
              fontSize: 10, 
              textAnchor: 'middle', 
              fill: useColorModeValue('#374151', '#9CA3AF'), 
              fontWeight: '600',
              dy: '0.33em',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            })}
            numTicks={allDates.length}
          />
          
          {/* Add floating date badges for each upgrade */}
          {allDates.map((date) => {
            const x = xScale(date);
            const upgradeName = dateToUpgradeMap[date];
            if (x == null) return null;
            
            return (
              <g key={`date-badge-${date}`}>
                <rect
                  x={x + xScale.bandwidth() / 2 - 35}
                  y={height - margin.bottom + 75}
                  width={70}
                  height={16}
                  fill={useColorModeValue('white', '#1A202C')}
                  stroke={useColorModeValue('#E2E8F0', '#4A5568')}
                  strokeWidth={0.5}
                  rx={4}
                  opacity={0.95}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={x + xScale.bandwidth() / 2}
                  y={height - margin.bottom + 85}
                  textAnchor="middle"
                  fontSize="8"
                  fill={useColorModeValue('#4A5568', '#CBD5E0')}
                  fontWeight="600"
                  style={{ cursor: 'pointer' }}
                >
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </text>
              </g>
            );
          })}
          <AxisLeft
            left={margin.left}
            scale={yScale}
            tickLabelProps={() => ({ fontSize: 10, textAnchor: 'end', fill: axisColor })}
          />

          {(() => {
            // Calculate totals for each upgrade - only Core category EIPs
            const upgradeTotals: Record<string, { core: number; meta: number }> = {};
            rawData.forEach(item => {
              const metaEIP = upgradeMetaEIPs[item.upgrade];
              const coreCount = item.eips.filter(eip => {
                if (eip === 'NO-EIP' || eip === 'CONSENSUS') return false;
                const eipNumber = eip.replace('EIP-', '').replace('-removed', '');
                const eipInfo = eipTitles[eipNumber];
                return eipInfo && eipInfo.category === 'Core';
              }).length;
              upgradeTotals[item.upgrade] = {
                core: coreCount,
                meta: metaEIP ? 1 : 0
              };
            });
            
            return upgradeRows.map(({ date, upgrade, eips, isMeta }, i) => {
              const x = xScale(date);
              if (x == null) return null;
              
              // Get the base row for this upgrade (non-meta rows)
              const baseRows = upgradeRows.filter(r => r.date === date && r.upgrade === upgrade && !r.isMeta);
              const baseEipCount = baseRows.reduce((sum, r) => sum + r.eips.length, 0);
              
              return eips.map((eip, j) => {
                // Calculate y position: if meta, place at top; otherwise stack normally
                const yPosition = isMeta ? 0 : j + 1;
                const y = yScale(yPosition);
                const isRemoved = eip.includes('-removed');
                
                const hoverHandlers = {
                  onMouseEnter: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setHoveredData({ date, upgrade, eip });
                  },
                  onMouseLeave: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setHoveredData(null);
                  },
                  onClick: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleEipClick(eip, upgrade);
                  }
                };
                
                return (
                  <Group key={`${date}-${upgrade}-${eip}-${j}-${isMeta}`}>
                    {/* Show total count at the top of each stack - Core EIPs only */}
                    {!isMeta && j === 0 && upgradeTotals[upgrade] && upgradeTotals[upgrade].core > 0 && (
                      <text
                        x={x + xScale.bandwidth() / 2}
                        y={yScale(baseEipCount + 1.5)}
                        textAnchor="middle"
                        fill={useColorModeValue('#4B5563', '#9CA3AF')}
                        fontSize={8}
                        fontWeight="700"
                        style={{ 
                          pointerEvents: 'none',
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                      >
                        {upgradeTotals[upgrade].core} Core
                      </text>
                    )}
                    <rect
                      x={x}
                      y={y}
                      width={xScale.bandwidth()}
                      height={18}
                      fill={isRemoved ? '#EF4444' : (isMeta ? '#8B5CF6' : colorMap[upgrade])}
                      rx={2}
                      stroke={isRemoved ? '#B91C1C' : (isMeta ? '#6D28D9' : 'none')}
                      strokeWidth={isRemoved ? 2 : (isMeta ? 1.5 : 0)}
                      strokeDasharray={isMeta ? '3,2' : 'none'}
                      style={{ 
                        cursor: 'pointer',
                        opacity: hoveredData?.eip === eip ? 1 : (isRemoved ? 0.75 : (isMeta ? 0.85 : 0.9))
                      }}
                      {...hoverHandlers}
                    />
                    {isRemoved && (
                      <line
                        x1={x + 2}
                        y1={y + 9}
                        x2={x + xScale.bandwidth() - 2}
                        y2={y + 9}
                        stroke="#FCA5A5"
                        strokeWidth={2}
                        style={{ pointerEvents: 'none' }}
                      />
                    )}
                    <text
                      x={x + xScale.bandwidth() / 2}
                      y={y + 13}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={isMeta ? 8 : 9}
                      fontWeight="600"
                      fontStyle={isMeta ? 'italic' : 'normal'}
                      textDecoration={isRemoved ? 'line-through' : 'none'}
                      style={{ 
                        pointerEvents: 'none',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      {eip.replace('-removed', '')}
                    </text>
                  </Group>
                );
              });
            });
          })()}
        </Group>
      </svg>

      {hoveredData && (() => {
        const currentUpgradeData = upgradeRows.find(r => r.upgrade === hoveredData.upgrade && !r.isMeta);
        const cleanEipNumber = hoveredData.eip.replace('-removed', '');
        const isRemoved = hoveredData.eip.includes('-removed');
        const eipInfo = hoveredData.eip !== 'CONSENSUS' && hoveredData.eip !== 'NO-EIP' ? eipTitles[cleanEipNumber] : null;
        const upgradeData = rawData.find(r => r.upgrade === hoveredData.upgrade);
        const coreEipsCount = upgradeData?.eips.filter(eip => {
          if (eip === 'NO-EIP' || eip === 'CONSENSUS') return false;
          const eipNumber = eip.replace('EIP-', '').replace('-removed', '');
          const eipInfo = eipTitles[eipNumber];
          return eipInfo && eipInfo.category === 'Core';
        }).length || 0;
        const metaEIP = upgradeMetaEIPs[hoveredData.upgrade];
        const isMetaEIP = metaEIP && hoveredData.eip === metaEIP.replace('EIP-', '');
        
        // Better positioning logic to keep tooltip in frame
        const tooltipWidth = 320;
        const tooltipHeight = 280;
        let tooltipX = mousePos.x + 15;
        let tooltipY = mousePos.y + 15;
        
        // Adjust horizontal position if going off right edge
        if (tooltipX + tooltipWidth > width) {
          tooltipX = mousePos.x - tooltipWidth - 15;
        }
        
        // Adjust vertical position if going off bottom edge
        if (tooltipY + tooltipHeight > height) {
          tooltipY = height - tooltipHeight - 10;
        }
        
        // Ensure tooltip doesn't go off top edge
        if (tooltipY < 10) {
          tooltipY = 10;
        }
        
        return (
          <Box
            position="absolute"
            top={`${tooltipY}px`}
            left={`${tooltipX}px`}
            bg={useColorModeValue('white', 'gray.800')}
            color={useColorModeValue('gray.800', 'white')}
            px={4}
            py={3}
            borderRadius="lg"
            boxShadow={useColorModeValue('0 10px 40px rgba(0,0,0,0.2)', '0 10px 40px rgba(0,0,0,0.6)')}
            zIndex={20}
            border="2px solid"
            borderColor={colorMap[hoveredData.upgrade]}
            pointerEvents="none"
            width="320px"
            maxHeight="280px"
            overflow="auto"
          >
            <VStack align="start" spacing={1} width="100%">
              {/* EIP Badge and Layer - Compact */}
              <HStack spacing={1} align="center" wrap="wrap">
                <Box
                  bg={isRemoved ? "red.500" : (hoveredData.eip === "CONSENSUS" ? "purple.500" : hoveredData.eip === "NO-EIP" ? "orange.500" : "teal.500")}
                  color="white"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {isRemoved ? `⚠️ REMOVED: EIP-${cleanEipNumber}` : (hoveredData.eip === "CONSENSUS" ? "🔗 Consensus" : hoveredData.eip === "NO-EIP" ? "⚠️ Irregular" : `EIP-${hoveredData.eip}`)}
                </Box>
                {currentUpgradeData?.layer && (
                  <Badge
                    colorScheme={currentUpgradeData.layer === "consensus" ? "purple" : "blue"}
                    fontSize="2xs"
                    px={1.5}
                    py={0.5}
                    borderRadius="sm"
                  >
                    {currentUpgradeData.layer === "consensus" ? "⛓️ Consensus" : "⚙️ Execution"}
                  </Badge>
                )}
                {eipInfo && (
                  <Badge
                    colorScheme="green"
                    fontSize="2xs"
                    px={1.5}
                    py={0.5}
                    borderRadius="sm"
                  >
                    {eipInfo.category}
                  </Badge>
                )}
              </HStack>
              
              {/* EIP Title - Compact */}
              {eipInfo && (
                <Box
                  w="100%"
                  p={1.5}
                  bg={useColorModeValue('blue.50', 'gray.700')}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={useColorModeValue('blue.200', 'blue.600')}
                >
                  <Text 
                    fontSize="xs" 
                    fontWeight="600"
                    color={useColorModeValue('gray.900', 'white')}
                    lineHeight="1.2"
                    noOfLines={2}
                  >
                    {eipInfo.title}
                  </Text>
                </Box>
              )}
              
              {/* Meta EIP Badge - Show after title */}
              {isMetaEIP && (
                <HStack spacing={1} fontSize="2xs">
                  <Badge colorScheme="purple" fontSize="2xs" px={1.5} py={0.5}>📋 Hardfork Meta EIP</Badge>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>Documentation & coordination</Text>
                </HStack>
              )}

              {/* Upgrade Information - Compact */}
              <Box w="100%">
                <Text 
                  fontSize="sm" 
                  fontWeight="bold" 
                  color={useColorModeValue('gray.900', 'white')}
                  lineHeight="1.2"
                >
                  {hoveredData.upgrade}
                </Text>
                {upgradeDescriptions[hoveredData.upgrade] && (
                  <Text 
                    fontSize="2xs" 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    lineHeight="1.2"
                    mt={0.5}
                    noOfLines={2}
                  >
                    {upgradeDescriptions[hoveredData.upgrade]}
                  </Text>
                )}
              </Box>

              {/* Metadata Grid - Compact */}
              <Box
                w="100%"
                pt={1}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <HStack spacing={2} wrap="wrap" fontSize="2xs">
                  <HStack spacing={0.5}>
                    <Text fontWeight="600" color={useColorModeValue('gray.700', 'gray.300')}>📅</Text>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      {new Date(hoveredData.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric' 
                      })}
                    </Text>
                  </HStack>
                  
                  {currentUpgradeData?.blockNumber && (
                    <HStack spacing={0.5}>
                      <Text fontWeight="600" color={useColorModeValue('gray.700', 'gray.300')}>🧱</Text>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        {currentUpgradeData.blockNumber.toLocaleString()}
                      </Text>
                    </HStack>
                  )}
                  
                  {currentUpgradeData?.forkEpoch && (
                    <HStack spacing={0.5}>
                      <Text fontWeight="600" color={useColorModeValue('gray.700', 'gray.300')}>🔱</Text>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        {currentUpgradeData.forkEpoch.toLocaleString()}
                      </Text>
                    </HStack>
                  )}
                  
                  <HStack spacing={0.5}>
                    <Text fontWeight="600" color={useColorModeValue('gray.700', 'gray.300')}>📊</Text>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      {coreEipsCount} Core
                    </Text>
                  </HStack>
                </HStack>
              </Box>

              {/* Action hint - Compact */}
              <Box
                w="100%"
                pt={1}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <Text 
                  fontSize="2xs" 
                  color={useColorModeValue('blue.600', 'blue.400')}
                  fontWeight="medium"
                >
                  {hoveredData.eip === "CONSENSUS" || hoveredData.eip === "NO-EIP" 
                    ? '💡 Click for GitHub specs'
                    : '💡 Click for full details'}
                </Text>
              </Box>
            </VStack>
          </Box>
        );
      })()}
          </Box>

          {/* Network Legend Sidebar */}
          
        </Flex>
        
        {/* DateTime Component - Outside scrollable area */}
        <Box mt={4}>
          <DateTime/>
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkUpgradesChart;
