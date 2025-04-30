'use client';

import React, { useMemo, useRef, useState } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { Button, IconButton, VStack } from '@chakra-ui/react';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';

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

const EIP3DGraph = () => {
  const fgRef = useRef<ForceGraphMethods>();
  const [showResetZoom, setShowResetZoom] = useState(true);

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
  

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    const seen = new Set<number>();

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

    for (const upgrade of networkUpgradesData.networkUpgrades) {
      for (const { eip, requires } of upgrade.eips) {
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

    return { nodes, links };
  }, []);

  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>();
    graphData.nodes.forEach((node) => groups.add(node.group));
    return [...groups].filter((g) => g); // remove empty string group
  }, [graphData]);

  const colorScale = useMemo(() => {
    const scale = new Map<string, string>();
    const palette = [
      '#FF6B6B', '#4ECDC4', '#FFD93D', '#6A0572', '#1B9CFC',
      '#FF9F1C', '#2EC4B6', '#E71D36', '#A8DADC', '#457B9D',
    ];
    uniqueGroups.forEach((group, index) => {
      scale.set(group, palette[index % palette.length]);
    });
    return scale;
  }, [uniqueGroups]);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
  {/* Legend */}
  <div style={{
    position: 'absolute',
    top: 20,
    right: 20,
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    zIndex: 10,
    maxWidth: '200px',
    color: 'black' // Added this line to set all text to black
  }}>
    <strong style={{ color: 'black' }}>Network Upgrades</strong>
    <ul style={{ 
      listStyle: 'none', 
      padding: 0, 
      marginTop: 10,
      color: 'black' // Ensures list items inherit black color
    }}>
      {uniqueGroups.map((group) => (
        <li key={group} style={{ 
          marginBottom: 6,
          color: 'black' // Explicit black for list items
        }}>
          <span style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: colorScale.get(group),
            marginRight: 8,
          }} />
          {group}
        </li>
      ))}
    </ul>
  </div>


      {/* Zoom Controls */}
      <VStack position="absolute" bottom={4} right={4} zIndex={10} spacing={2}>
        {
          <>
            <IconButton
              aria-label="Zoom in"
              icon={<AddIcon />}
              onClick={handleZoomIn}
              size="sm"
              colorScheme="gray"
            />
            <IconButton
              aria-label="Zoom out"
              icon={<MinusIcon />}
              onClick={handleZoomOut}
              size="sm"
              colorScheme="gray"
            />
            <Button
              leftIcon={<RepeatIcon />}
              onClick={() => {
                fgRef.current?.zoomToFit(1000);
              }}
              size="xs"
              colorScheme="gray"
            >
              Reset
            </Button>
          </>
        }
      </VStack>

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeThreeObject={(node: any) => {
          const color = colorScale.get(node.group) || '#999';
        
          // Create sphere mesh
          const geometry = new THREE.SphereGeometry(6, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color });
          const sphere = new THREE.Mesh(geometry, material);
        
          // Create sprite label
          const sprite = new SpriteText(node.label);
          sprite.color = '#ffffff';
          sprite.backgroundColor = 'transparent';
          sprite.textHeight = 4;
          sprite.position.set(0, 10, 0);
        
          // Combine into a group
          const group = new THREE.Group();
          group.add(sphere);
          group.add(sprite);
        
          return group;
        }}
        
        nodeLabel={(node) => `${node.label} (Upgrade: ${node.upgradeName || 'N/A'})`}
        linkColor={() => '#999'}
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkOpacity={0.6}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={0.9}
        forceEngine="d3"
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        nodeResolution={32}
        warmupTicks={100}
        cooldownTicks={1000}
        // onZoom={() => setShowResetZoom(true)}
      />
    </div>
  );
};

export default EIP3DGraph;