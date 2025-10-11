'use client';

import React, { useMemo, useRef, useState } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { Button, IconButton, HStack, Box, useColorModeValue, Text, Input } from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const networkUpgradesData = {
  networkUpgrades: [
    {
      name: 'Frontier',
      eips: [
        // Original Ethereum launch - no formal EIPs
      ],
    },
    {
      name: 'Frontier Thawing',
      eips: [
        // Lifted gas limit - no formal EIPs
      ],
    },
    {
      name: 'Homestead',
      eips: [
        { eip: 2, requires: [] },
        { eip: 7, requires: [] },
        { eip: 8, requires: [] },
      ],
    },
    {
      name: 'DAO Fork',
      eips: [
        // Irregular state change - no formal EIPs
      ],
    },
    {
      name: 'Tangerine Whistle',
      eips: [{ eip: 150, requires: [] }],
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
      name: 'Constantinople',
      eips: [
        { eip: 145, requires: [] },
        { eip: 1014, requires: [] },
        { eip: 1052, requires: [161] },
        { eip: 1234, requires: [] },
        { eip: 1283, requires: [] },
      ],
    },
    {
      name: 'Petersburg',
      eips: [
        // Petersburg removed EIP-1283 from Constantinople
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
      name: 'Altair',
      eips: [
        // Consensus layer upgrade - no execution EIPs
      ],
    },
    {
      name: 'Gray Glacier',
      eips: [{ eip: 5133, requires: [] }],
    },
    {
      name: 'Bellatrix',
      eips: [
        // Consensus layer upgrade - no execution EIPs
      ],
    },
    {
      name: 'Paris',
      eips: [
        { eip: 3675, requires: [2124] },
        { eip: 4399, requires: [3675] },
      ],
    },
    {
      name: 'Shanghai',
      eips: [
        { eip: 3651, requires: [2929] },
        { eip: 3855, requires: [] },
        { eip: 3860, requires: [170] },
        { eip: 4895, requires: [] },
        { eip: 6049, requires: [] },
      ],
    },
    {
      name: 'Fusaka',
      eips: [
        { eip: 7594, requires: [4844] },
        { eip: 7642, requires: [5793] },
        { eip: 7823, requires: [198] },
        { eip: 7825, requires: [] },
        { eip: 7883, requires: [] },
        { eip: 7892, requires: [] },
        { eip: 7918, requires: [4844, 7840] },
        { eip: 7935, requires: [] },
        { eip: 5920, requires: [] },
        { eip: 7901, requires: [] },
        { eip: 7917, requires: [] },
        { eip: 7934, requires: [] }
      ]
    },
  ],
};

const EIP3DGraph = () => {
  const router = useRouter();
  const fgRef = React.useRef<ForceGraphMethods<any, any> | undefined>(undefined);
  const [showResetZoom, setShowResetZoom] = useState(true);
  const [hoveredNetwork, setHoveredNetwork] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [showTransitiveDeps, setShowTransitiveDeps] = useState(false);

  // Theme-aware colors
  const legendBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)');
  const legendText = useColorModeValue('black', 'white');
  const legendShadow = useColorModeValue('0 2px 10px rgba(0,0,0,0.2)', '0 2px 10px rgba(0,0,0,0.5)');

  const handleZoomIn = () => {
    if (fgRef.current) {
      const distance = fgRef.current.camera().position.length();
      fgRef.current.camera().position.setLength(distance * 0.8); // zoom in
      setShowResetZoom(true);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      const distance = fgRef.current.camera().position.length();
      fgRef.current.camera().position.setLength(distance * 1.2); // zoom out
      setShowResetZoom(true);
    }
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Search for matching EIP numbers or upgrade names
    const results: number[] = [];
    const searchLower = query.toLowerCase().trim();
    
    // Search through all network upgrades
    for (const upgrade of networkUpgradesData.networkUpgrades) {
      // Match by upgrade name
      if (upgrade.name.toLowerCase().includes(searchLower)) {
        upgrade.eips.forEach(({ eip }) => results.push(eip));
      } else {
        // Match by EIP number
        upgrade.eips.forEach(({ eip }) => {
          if (eip.toString().includes(searchLower)) {
            results.push(eip);
          }
        });
      }
    }
    
    setSearchResults(results);
    
    // Focus camera on first result if found
    if (results.length > 0 && fgRef.current) {
      const firstNode = graphData.nodes.find((n: any) => n.id === results[0]);
      if (firstNode) {
        // Calculate camera position at a distance from the node
        const distance = 200; // Distance from the node
        const nodePos = { 
          x: firstNode.x ?? 0, 
          y: firstNode.y ?? 0, 
          z: firstNode.z ?? 0 
        };
        
        // Position camera at an angle from the node
        fgRef.current.cameraPosition(
          { 
            x: nodePos.x + distance * 0.5, 
            y: nodePos.y + distance * 0.3, 
            z: nodePos.z + distance * 0.8 
          }, // camera position
          nodePos, // look at target (the node)
          1000 // transition duration
        );
      }
    }
  };

  // Function to compute all transitive dependencies for an EIP
  const getTransitiveDependencies = (eipId: number, visited = new Set<number>()): Set<number> => {
    if (visited.has(eipId)) return new Set(); // Avoid circular dependencies
    visited.add(eipId);
    
    const dependencies = new Set<number>();
    
    // Find the EIP in the network upgrades data
    for (const upgrade of networkUpgradesData.networkUpgrades) {
      for (const { eip, requires } of upgrade.eips) {
        if (eip === eipId) {
          // Add direct dependencies
          requires.forEach(reqEip => {
            dependencies.add(reqEip);
            // Recursively get transitive dependencies
            const transitive = getTransitiveDependencies(reqEip, new Set(visited));
            transitive.forEach(dep => dependencies.add(dep));
          });
          break;
        }
      }
    }
    
    return dependencies;
  };

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    const seen = new Set<number>();

    // First pass: Create nodes for all EIPs
    for (const upgrade of networkUpgradesData.networkUpgrades) {
      for (const { eip } of upgrade.eips) {
        if (!seen.has(eip)) {
          nodes.push({
            id: eip,
            label: `${eip}`,
            group: upgrade.name,
            upgradeName: upgrade.name,
          });
          seen.add(eip);
        }
      }
    }

    // Ensure all network upgrades appear in legend (even those with no EIPs)
    const networksWithNodes = new Set(nodes.map(node => node.group));
    for (const upgrade of networkUpgradesData.networkUpgrades) {
      if (!networksWithNodes.has(upgrade.name) && upgrade.eips.length === 0) {
        // Create a placeholder node for networks without EIPs
        const placeholderId = `placeholder-${upgrade.name}`;
        nodes.push({
          id: placeholderId,
          label: `${upgrade.name}`,
          group: upgrade.name,
          upgradeName: upgrade.name,
        });
      }
    }

    // Second pass: Create links between EIPs
    for (const upgrade of networkUpgradesData.networkUpgrades) {
      for (const { eip, requires } of upgrade.eips) {
        if (showTransitiveDeps) {
          // Show all transitive dependencies
          const allDeps = getTransitiveDependencies(eip);
          allDeps.forEach(req => {
            links.push({ source: eip, target: req });
            if (!seen.has(req)) {
              nodes.push({
                id: req,
                label: `${req}`,
                group: '',
                upgradeName: '',
              });
              seen.add(req);
            }
          });
        } else {
          // Show only direct dependencies (original behavior)
          for (const req of requires) {
            links.push({ source: eip, target: req });
            if (!seen.has(req)) {
              nodes.push({
                id: req,
                label: `${req}`,
                group: '',
                upgradeName: '',
              });
              seen.add(req);
            }
          }
        }
      }
    }

    return { nodes, links };
  }, [showTransitiveDeps]);

  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>();
    graphData.nodes.forEach((node) => groups.add(node.group));
    
    // Define chronological order (latest to oldest) - network upgrades
    const chronologicalOrder = [
      'Fusaka',           // Future upgrade 
      'Pectra',           // May 2025 
      'Dencun',           // March 2024
      'Shanghai',         // April 2023
      'Paris',            // September 2022
      'Bellatrix',        // August 2022
      'Gray Glacier',     // June 2022
      'Arrow Glacier',    // December 2021
      'Altair',           // October 2021
      'London',           // August 2021
      'Berlin',           // April 2021
      'Muir Glacier',     // January 2020
      'Istanbul',         // December 2019
      'Petersburg',       // February 2019
      'Constantinople',   // January 2019
      'Byzantium',        // October 2017
      'Spurious Dragon',  // November 2016
      'Tangerine Whistle', // October 2016
      'DAO Fork',         // July 2016
      'Homestead',        // March 2016
      'Frontier Thawing', // September 2015
      'Frontier'          // July 2015
    ];
    
    // Sort groups by chronological order, with unknown groups at the end
    const groupArray = [...groups].filter((g) => g);
    const sorted = groupArray.sort((a, b) => {
      const indexA = chronologicalOrder.indexOf(a);
      const indexB = chronologicalOrder.indexOf(b);
      
      // If both are in the chronological order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only one is in the chronological order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      // If neither is in the chronological order, sort alphabetically
      return a.localeCompare(b);
    });
    
    return sorted;
  }, [graphData]);

  const colorScale = useMemo(() => {
    const scale = new Map<string, string>();
    const palette = [
      '#FF6B6B', // Fusaka - Red
      '#4ECDC4', // Pectra - Teal  
      '#FFD93D', // Dencun - Yellow
      '#6A0572', // Shapella - Purple
      '#1B9CFC', // Paris - Blue (fixed typo)
      '#FF9F1C', // Gray Glacier - Orange
      '#2EC4B6', // Arrow Glacier - Cyan
      '#E71D36', // London - Red
      '#A8DADC', // Berlin - Light Blue  
      '#457B9D', // Muir Glacier - Dark Blue
      '#F72585', // Istanbul - Pink
      '#7209B7', // Petersburg - Violet
      '#560BAD', // Byzantium - Dark Purple
      '#2D1B69', // Spurious Dragon - Navy
      '#0F3460', // Tangerine Whistle - Dark Blue
      '#16537E', // DAO Fork - Steel Blue
      '#1A759F', // Homestead - Ocean Blue
      '#168AAD', // Frontier Thawing - Light Ocean
      '#34A0A4', // Frontier - Teal Blue
    ];
    
    uniqueGroups.forEach((group, index) => {
      scale.set(group, palette[index % palette.length]);
    });
    
    return scale;
  }, [uniqueGroups]);

  // Function to get EIP count for a network upgrade
  const getEIPCount = (networkName: string): number => {
    const upgrade = networkUpgradesData.networkUpgrades.find(u => u.name === networkName);
    return upgrade ? upgrade.eips.length : 0;
  };

  return (
    <div style={{ position: 'relative', height: '550px' }}>
      {/* Search Box */}
      <Box
        position="absolute"
        top="20px"
        left="20px"
        bg={legendBg}
        p="12px"
        borderRadius="10px"
        boxShadow={legendShadow}
        zIndex={10}
        width="280px"
      >
        <Input
          placeholder="Search EIP/ERC number or title"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          size="sm"
          bg={useColorModeValue('white', 'gray.700')}
          borderColor={useColorModeValue('gray.300', 'gray.600')}
          _focus={{
            borderColor: useColorModeValue('blue.400', 'blue.500'),
            boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
          }}
        />
        {searchResults.length > 0 && (
          <Text fontSize="0.65rem" color={useColorModeValue('green.600', 'green.400')} mt={1}>
            Found {searchResults.length} result{searchResults.length > 1 ? 's' : ''}
          </Text>
        )}
        {searchQuery && searchResults.length === 0 && (
          <Text fontSize="0.65rem" color={useColorModeValue('red.600', 'red.400')} mt={1}>
            No results found
          </Text>
        )}
      </Box>
      
      {/* Legend */}
      <Box
        position="absolute"
        top="20px"
        right="20px"
        bg={legendBg}
        p="12px"
        borderRadius="10px"
        fontSize="0.9rem"
        boxShadow={legendShadow}
        zIndex={10}
        minW="240px"
        maxW="260px"
        maxH="480px"
        overflowY="auto"
      >
        <Text fontWeight="bold" color={legendText} mb={1}>Network Upgrades</Text>
        <Text fontSize="0.7rem" color={useColorModeValue('gray.600', 'gray.400')} mb={2}>
          Hover to highlight • Click EIP to visit • Shift+click to pin
        </Text>
        <Button 
          size="xs" 
          variant={showTransitiveDeps ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setShowTransitiveDeps(!showTransitiveDeps)}
          mb={2}
          fontSize="0.6rem"
          h="18px"
        >
          {showTransitiveDeps ? "Hide" : "Show"} All Dependencies
        </Button>
        {selectedNetwork && (
          <Button 
            size="xs" 
            variant="ghost" 
            onClick={() => setSelectedNetwork(null)}
            mb={2}
            fontSize="0.65rem"
            h="20px"
          >
            Clear Selection
          </Button>
        )}
        <Box
          as="div"
          listStyleType="none"
          p={0}
          mt="8px"
          maxH="350px"
          overflowY="auto"
          pr="8px"
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
          {uniqueGroups.map((group) => (
            <Box 
              as="div" 
              key={group} 
              mb={1.5} 
              color={legendText}
              cursor="pointer"
              p={2}
              borderRadius="md"
              bg={hoveredNetwork === group || selectedNetwork === group ? 
                useColorModeValue('gray.100', 'gray.700') : 'transparent'}
              transition="all 0.2s ease"
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                transform: 'scale(1.02)'
              }}
              onMouseEnter={() => setHoveredNetwork(group)}
              onMouseLeave={() => setHoveredNetwork(null)}
              onClick={() => setSelectedNetwork(selectedNetwork === group ? null : group)}
            >
              <Box
                as="span"
                display="inline-block"
                w="12px"
                h="12px"
                borderRadius="50%"
                bg={colorScale.get(group)}
                mr={2}
                boxShadow={hoveredNetwork === group || selectedNetwork === group ? 
                  `0 0 8px ${colorScale.get(group)}` : 'none'}
                transform={hoveredNetwork === group || selectedNetwork === group ? 'scale(1.2)' : 'scale(1)'}
                transition="all 0.2s ease"
                border={selectedNetwork === group ? `2px solid ${colorScale.get(group)}` : 'none'}
              />
              {group}
              <Text 
                as="span" 
                fontSize="0.65rem" 
                color={useColorModeValue('gray.500', 'gray.400')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                px={1.5}
                py={0.5}
                ml={2}
                borderRadius="md"
                fontWeight="medium"
              >
                {getEIPCount(group)}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>


        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeThreeObject={(node: any) => {
            const baseColor = colorScale.get(node.group) || '#999';
            const isSearchResult = searchResults.includes(node.id);
            const isHighlighted = hoveredNetwork === node.group || selectedNetwork === node.group || isSearchResult;
            const isOtherNetwork = ((hoveredNetwork && hoveredNetwork !== node.group) || 
                                 (selectedNetwork && selectedNetwork !== node.group && !hoveredNetwork)) && !isSearchResult;
            
            // Adjust sphere properties based on hover/selection/search state
            const sphereRadius = isHighlighted ? 8 : 6;
            const sphereColor = isOtherNetwork ? '#666' : baseColor;
            const sphereOpacity = isOtherNetwork ? 0.3 : 1;

            // Create sphere mesh
            const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
            const material = new THREE.MeshBasicMaterial({ 
              color: sphereColor, 
              transparent: true, 
              opacity: sphereOpacity 
            });
            const sphere = new THREE.Mesh(geometry, material);

            // Add glow effect for highlighted nodes
            if (isHighlighted) {
              const glowGeometry = new THREE.SphereGeometry(sphereRadius * 1.3, 16, 16);
              const glowMaterial = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.3
              });
              const glow = new THREE.Mesh(glowGeometry, glowMaterial);
              sphere.add(glow);
            }

            // Create sprite label
            const sprite = new SpriteText(node.label);
            sprite.color = isOtherNetwork ? '#888' : '#ffffff';
            sprite.backgroundColor = isSearchResult ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
            sprite.borderColor = isSearchResult ? '#ffff00' : 'transparent';
            sprite.borderWidth = isSearchResult ? 1 : 0;
            sprite.textHeight = isHighlighted ? 6 : 4;
            sprite.fontWeight = isSearchResult ? 'bold' : 'normal';
            // Position label higher for highlighted nodes to avoid overlap with enlarged spheres
            sprite.position.set(0, isHighlighted ? 15 : 10, 0);

            // Combine into a group
            const group = new THREE.Group();
            group.add(sphere);
            group.add(sprite);

            return group;
          }}

          nodeLabel={(node) => `EIP-${node.label} (Network: ${node.upgradeName || 'N/A'})`}
          linkColor={(link) => {
            const sourceNode = graphData.nodes.find(n => n.id === link.source);
            const targetNode = graphData.nodes.find(n => n.id === link.target);
            const activeNetwork = hoveredNetwork || selectedNetwork;
            const isRelatedToActive = activeNetwork && (
              sourceNode?.group === activeNetwork || 
              targetNode?.group === activeNetwork
            );
            
            if (showTransitiveDeps && isRelatedToActive) {
              // Check if this is a direct dependency
              const sourceEip = typeof link.source === 'object' ? link.source.id : link.source;
              const targetEip = typeof link.target === 'object' ? link.target.id : link.target;
              
              // Find if this is a direct dependency
              let isDirect = false;
              for (const upgrade of networkUpgradesData.networkUpgrades) {
                for (const { eip, requires } of upgrade.eips) {
                  if (eip === sourceEip && requires.includes(targetEip)) {
                    isDirect = true;
                    break;
                  }
                }
                if (isDirect) break;
              }
              
              // Use different colors for direct vs transitive dependencies
              return isDirect ? colorScale.get(activeNetwork as string) || '#aaa' : '#888';
            }
            
            // Color links related to the active network, otherwise gray
            return isRelatedToActive ? colorScale.get(activeNetwork as string) || '#aaa' : '#bbb';
          }}
          linkWidth={(link) => {
            const sourceNode = graphData.nodes.find(n => n.id === link.source);
            const targetNode = graphData.nodes.find(n => n.id === link.target);
            const activeNetwork = hoveredNetwork || selectedNetwork;
            const isRelatedToActive = activeNetwork && (
              sourceNode?.group === activeNetwork || 
              targetNode?.group === activeNetwork
            );
            
            if (showTransitiveDeps && isRelatedToActive) {
              // Check if this is a direct dependency
              const sourceEip = typeof link.source === 'object' ? link.source.id : link.source;
              const targetEip = typeof link.target === 'object' ? link.target.id : link.target;
              
              let isDirect = false;
              for (const upgrade of networkUpgradesData.networkUpgrades) {
                for (const { eip, requires } of upgrade.eips) {
                  if (eip === sourceEip && requires.includes(targetEip)) {
                    isDirect = true;
                    break;
                  }
                }
                if (isDirect) break;
              }
              
              // Make direct dependencies thicker than transitive ones
              return isDirect ? 3 : 1;
            }
            
            return isRelatedToActive ? 2 : 1;
          }}
          nodeResolution={32}
          warmupTicks={100}
          cooldownTicks={1000}
          onNodeClick={(node: any, event: any) => {
            // Check if Shift key is pressed for selection, otherwise navigate
            if (event?.shiftKey) {
              // Toggle selection when Shift+click
              setSelectedNetwork(selectedNetwork === node.group ? null : node.group);
            } else {
              // Navigate to EIP page on regular click
              const eipNumber = node.label; // The EIP number from the node
              router.push(`/eips/eip-${eipNumber}`);
            }
          }}
          onBackgroundClick={() => {
            // Clear selection when clicking on empty space
            setSelectedNetwork(null);
          }}
        // onZoom={() => setShowResetZoom(true)}
        />
    </div>
  );
};

export default EIP3DGraph;