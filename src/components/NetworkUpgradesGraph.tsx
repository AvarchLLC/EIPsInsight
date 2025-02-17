import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Edge, Node } from 'vis-network';
import { Text, Select, Box, useColorModeValue, Button, Stack } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import { Filter } from "react-feather";

// Define the data structure
interface EIP {
  eip: number;
  requires: number[];
}

interface NetworkUpgrade {
  name: string;
  eips: EIP[];
}

interface NetworkUpgradesData {
  networkUpgrades: NetworkUpgrade[];
}

// Props for the component
interface NetworkGraphProps {
  data: NetworkUpgradesData;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  const menuBg = useColorModeValue("gray.800", "gray.800"); // Dark background
  const menuColor = useColorModeValue("white", "white"); // White text
  const buttonBg = useColorModeValue("gray.700", "gray.700"); // Dark button background
  const buttonColor = useColorModeValue("white", "white"); // White button text


  // Dark mode colors
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownColor = useColorModeValue('black', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    if (!graphRef.current) return;

    // Create nodes and edges for the graph
    const nodes = new DataSet<Node>([]);
    const edges = new DataSet<Edge>([]);

    // Define colors for each network upgrade
    const upgradeColors: { [key: string]: string } = {
      Homestead: '#FF6F61',
      'Spurious Dragon': '#6B5B95',
      'Tangerine Whistle': '#88B04B',
      Byzantium: '#FFA500',
      Petersburg: '#92A8D1',
      Istanbul: '#955251',
      'Muir Glacier': '#B565A7',
      Dencun: '#009B77',
      Pectra: '#DD4124',
      Berlin: '#D65076',
      London: '#45B8AC',
      'Arrow Glacier': '#EFC050',
      'Gray Glacier': '#5B5EA6',
      Paris: '#9B2335',
      Shapella: '#BC243C',
    };

    // Add network upgrades as nodes (only if selected)
    data.networkUpgrades.forEach((upgrade) => {
      if (selectedUpgrades.includes(upgrade.name)) {
        nodes.add({ id: upgrade.name, label: upgrade.name, group: 'upgrade' });

        // Add EIPs as nodes and edges to their required EIPs
        upgrade.eips.forEach((eip) => {
          const eipId = `EIP-${eip.eip}`;
          nodes.add({ id: eipId, label: eipId, group: 'eip' });

          // Add edges for EIP dependencies
          eip.requires.forEach((requiredEip) => {
            edges.add({
              from: eipId,
              to: `EIP-${requiredEip}`,
              arrows: 'to',
              color: upgradeColors[upgrade.name], // Use upgrade-specific color
            });
          });

          // Add edges from network upgrade to EIP
          edges.add({
            from: upgrade.name,
            to: eipId,
            arrows: 'to',
            color: upgradeColors[upgrade.name], // Use upgrade-specific color
          });
        });
      }
    });

    // Create the network graph
    const network = new Network(
      graphRef.current,
      { nodes, edges },
      {
        nodes: {
          shape: 'box',
          font: {
            size: 25, // Larger font size for labels
            color: '#000000', // Black text for better visibility
          },
          size: 30, // Larger node size
          color: {
            background: '#FFFFFF', // White background for nodes
            border: '#000000', // Black border for nodes
            highlight: {
              background: '#F0F0F0', // Light gray highlight
              border: '#000000',
            },
          },
        },
        edges: {
          color: '#cccccc',
          arrows: {
            to: { enabled: true, scaleFactor: 0.5 },
          },
        },
        groups: {
          upgrade: {
            color: {
              background: '#4CAF50', // Green background for upgrade nodes
              border: '#388E3C', // Darker green border for upgrade nodes
            },
            font: {
              color: '#000000', // White text for better contrast
            },
            highlight: {
              background: '#C8E6C9', // Light green highlight
              border: '#388E3C',
            },
          },
          eip: {
            color: {
              background: '#2196F3', // Blue background for EIP nodes
              border: '#1976D2', // Darker blue border for EIP nodes
            },
            font: {
              color: '#000000', // White text for better contrast
            },
            highlight: {
              background: '#BBDEFB', // Light blue highlight
              border: '#1976D2',
            },
          },
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD', // Up-Down layout
            sortMethod: 'directed',
            parentCentralization: false, // Prevent excessive centering
            levelSeparation: 150, // Increase spacing between levels
            nodeSpacing: 200, // Increase spacing between nodes
          },
        },
        physics: {
          enabled: false, // Disable physics for hierarchical layout
        },
        interaction: {
          zoomView: true, // Allow zooming
          dragView: true, // Allow dragging
        },
      }
    );

    // Set initial zoom level and position
    network.moveTo({
      scale: 0.5, // Zoom out initially
      position: { x: -10000, y: 0 }, // Ensure the left side is visible
    });

    // Make the container scrollable
    graphRef.current.style.overflow = 'auto';
  }, [data, selectedUpgrades]);

  useEffect(() => {
    // Select all upgrades by default on mount
    setSelectedUpgrades(data.networkUpgrades.map((upgrade) => upgrade.name));
  }, [data.networkUpgrades]);

  // Handle dropdown changes
  // const handleUpgradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selected = Array.from(event.target.selectedOptions, (option) => option.value);
  //   setSelectedUpgrades(selected);
  // };
  
  const handleUpgradeToggle = (upgradeName:any) => {
    setSelectedUpgrades(prev => 
      prev.includes(upgradeName)
        ? prev.filter(name => name !== upgradeName)
        : [...prev, upgradeName]
    );
  };

  // Select all upgrades
  const selectAll = () => {
    setSelectedUpgrades(data.networkUpgrades.map((upgrade) => upgrade.name));
  };

  // Remove all upgrades
  const removeAll = () => {
    setSelectedUpgrades([]);
  };

  return (
    <Box>
     <Menu closeOnSelect={false}>
      <MenuButton as={Button} colorScheme="blue" leftIcon={<Filter />}>
        Filter Network Upgrades
      </MenuButton>
      <MenuList maxH="300px" overflowY="auto">
        <MenuItem onClick={selectAll} fontWeight="bold">
          Select All
        </MenuItem>
        <MenuItem onClick={removeAll} fontWeight="bold">
          Remove All
        </MenuItem>
        {data.networkUpgrades.map((upgrade) => (
          <MenuItem key={upgrade.name}>
            <Checkbox
              isChecked={selectedUpgrades.includes(upgrade.name)}
              onChange={() => handleUpgradeToggle(upgrade.name)}
              colorScheme="blue"
            >
              {upgrade.name}
            </Checkbox>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
    <br/>
    <div
  ref={graphRef}
  style={{
    marginTop:10,
    width: "100%",
    height: "800px",
    border: "1px solid #ccc",
    backgroundColor: "#FFFFFF",
  }}
></div>

    </Box>
  );
};

const networkUpgradesData = {
  networkUpgrades: [
    {
      name: 'Homestead',
      eips: [
        { eip: 2, requires: [] },
        { eip: 7, requires: [] },
        { eip: 8, requires: [] },
      ],
    },
    {
      name: 'Spurious Dragon',
      eips: [
        { eip: 155, requires: [] },
        { eip: 160, requires: [] },
        { eip: 161, requires: [] },
        { eip: 170, requires: [] },
      ],
    },
    {
      name: 'Tangerine Whistle',
      eips: [{ eip: 150, requires: [] }],
    },
    {
      name: 'Byzantium',
      eips: [
        { eip: 100, requires: [] },
        { eip: 140, requires: [] },
        { eip: 196, requires: [] },
        { eip: 197, requires: [] },
        { eip: 198, requires: [] },
        { eip: 211, requires: [] },
        { eip: 214, requires: [] },
        { eip: 649, requires: [] },
        { eip: 658, requires: [] },
      ],
    },
    {
      name: 'Petersburg',
      eips: [
        { eip: 145, requires: [] },
        { eip: 1014, requires: [] },
        { eip: 1052, requires: [161] },
        { eip: 1234, requires: [] },
        { eip: 1283, requires: [] },
      ],
    },
    {
      name: 'Istanbul',
      eips: [
        { eip: 152, requires: [] },
        { eip: 1108, requires: [196, 197] },
        { eip: 1344, requires: [155] },
        { eip: 1844, requires: [137, 165] },
        { eip: 2028, requires: [] },
        { eip: 2200, requires: [] },
      ],
    },
    {
      name: 'Muir Glacier',
      eips: [{ eip: 2384, requires: [] }],
    },
    {
      name: 'Dencun',
      eips: [
        { eip: 1153, requires: [22, 3, 529] },
        { eip: 4788, requires: [1559] },
        { eip: 4844, requires: [1559, 2718, 2930, 4895] },
        { eip: 5656, requires: [] },
        { eip: 6780, requires: [2681, 2929, 3529] },
        { eip: 7044, requires: [] },
        { eip: 7045, requires: [] },
        { eip: 7514, requires: [] },
        { eip: 7516, requires: [3198, 4844] },
      ],
    },
    {
      name: 'Pectra',
      eips: [
        { eip: 7691, requires: [] },
        { eip: 7623, requires: [] },
        { eip: 7840, requires: [] },
        { eip: 7702, requires: [2, 161, 1052, 2718, 2929, 2930, 3541, 3607, 4844] },
        { eip: 7685, requires: [] },
        { eip: 7549, requires: [] },
        { eip: 7251, requires: [7002, 7685] },
        { eip: 7002, requires: [7685] },
        { eip: 6110, requires: [7685] },
        { eip: 2935, requires: [] },
        { eip: 2537, requires: [] },
      ],
    },
    {
      name: 'Berlin',
      eips: [
        { eip: 2565, requires: [198] },
        { eip: 2929, requires: [] },
        { eip: 2718, requires: [] },
        { eip: 2930, requires: [2718, 2929] },
      ],
    },
    {
      name: 'London',
      eips: [
        { eip: 1559, requires: [2718, 2930] },
        { eip: 3198, requires: [1559] },
        { eip: 3529, requires: [2200, 2929, 2930] },
        { eip: 3541, requires: [] },
        { eip: 3554, requires: [] },
      ],
    },
    {
      name: 'Arrow Glacier',
      eips: [{ eip: 4345, requires: [] }],
    },
    {
      name: 'Gray Glacier',
      eips: [{ eip: 5133, requires: [] }],
    },
    {
      name: 'Paris',
      eips: [
        { eip: 3675, requires: [2124] },
        { eip: 4399, requires: [3675] },
      ],
    },
    {
      name: 'Shapella',
      eips: [
        { eip: 3651, requires: [2929] },
        { eip: 3855, requires: [] },
        { eip: 3860, requires: [170] },
        { eip: 4895, requires: [] },
        { eip: 6049, requires: [] },
      ],
    },
  ],
};

const App: React.FC = () => {
  return (
    <div>
      <Text
        fontSize={{ base: '2xl', md: '2xl', lg: '2xl' }}
        fontWeight="bold"
        color="#30A0E0"
        mt={2}
      >
        Network Upgrades and EIPs Relationship Graph
      </Text>
      <NetworkGraph data={networkUpgradesData} />
    </div>
  );
};

export default App;