"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import FeedbackWidget from "./FeedbackWidget";

interface EIPEntry {
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  repo: string;
  statusChanges: string;
  TypeChanges: string;
  CategoryChanges: string;
}

interface StatusChangeNode {
  eip: string;
  repo: string;
  from: string;
  to: string;
  date: string;
  index: number;
}

const statusColors: { [status: string]: string } = {
  Idea: "#f39c12",
  Draft: "#3498db",
  Accepted: "#2ecc71",
  Final: "#9b59b6",
  Active: "#e74c3c",
  Replaced: "#1abc9c",
  Superseded: "#e67e22",
  Withdrawn: "#95a5a6",
  "Last Call": "#34495e",
  Stagnant: "#7f8c8d",
  Review: "#e84393",
  unknown: "#bdc3c7",
};

const parseStatusChanges = (entry: EIPEntry): StatusChangeNode[] => {
  if (!entry.statusChanges || entry.statusChanges.trim() === "") return [];

  const statusChanges = entry.statusChanges.split(", ");
  const nodes: StatusChangeNode[] = [];
  const seenChanges = new Set<string>();

  statusChanges?.forEach((change, index) => {
    const match =
      change.match(/(.*?) -> (.*?)\((\d+)-(\d+)-(\d+)\)/) ||
      change.match(/(.*?)\((\d+)-(\d+)-(\d+)\)/);

    if (match) {
      let from, to, day, month, year;
      if (match?.length === 6) {
        [, from, to, day, month, year] = match;
      } else if (match?.length === 5) {
        [, to, day, month, year] = match;
        from = "unknown";
      }

      const changeKey = `${from}|${to}|${day}-${month}-${year}`;
      if (!seenChanges.has(changeKey)) {
        seenChanges.add(changeKey);
        nodes.push({
          eip: entry.eip,
          repo: entry.repo,
          from: from || "unknown",
          to: to || "unknown",
          date: `${day}-${month}-${year}`,
          index,
        });
      }
    }
  });

  return nodes.sort((a, b) => {
    const [aDay, aMonth, aYear] = a.date.split("-")?.map(Number);
    const [bDay, bMonth, bYear] = b.date.split("-")?.map(Number);
    if (aYear !== bYear) return aYear - bYear;
    if (aMonth !== bMonth) return aMonth - bMonth;
    return aDay - bDay;
  });
};

const StatusNode = ({
  node,
  position,
}: {
  node: StatusChangeNode;
  position: [number, number, number];
}) => {
  const color = statusColors[node.to] || "#ffffff";

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        {`${node.repo.toUpperCase()}-${node.eip}\n${node.from}→${node.to}\n${
          node.date
        }`}
      </Text>
    </group>
  );
};

const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
    <div className="text-white text-2xl flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p>Loading EIP Data...</p>
    </div>
  </div>
);

const StatusGraph = () => {
  const [data, setData] = useState<StatusChangeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEIP, setSearchEIP] = useState("");
  const [contentOffset, setContentOffset] = useState(0);
  const [cameraTarget, setCameraTarget] = useState<
    [number, number, number] | null
  >(null);
  // const contentGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/new/graphsv4");
        const rawData = await response.json();

        const getallEntries = (data: any): EIPEntry[] => {
          const allEntries: EIPEntry[] = [];
          const eipStatusChangesMap: { [eip: string]: string[] } = {};
          const eipTypeChangesMap: { [eip: string]: string[] } = {};
          const eipCategoryChangesMap: { [eip: string]: string[] } = {};

          if (data.eip && Array.isArray(data.eip)) {
            data.eip?.forEach((entry: any) => {
              const {
                eip,
                type,
                category,
                status,
                fromStatus,
                toStatus,
                changedDay,
                changedMonth,
                changedYear,
              } = entry;
              const statusChangeString =
                fromStatus && fromStatus !== "unknown"
                  ? `${fromStatus} -> ${toStatus}(${changedDay}-${changedMonth}-${changedYear})`
                  : `${toStatus}(${changedDay}-${changedMonth}-${changedYear})`;

              if (!eipStatusChangesMap[eip]) {
                eipStatusChangesMap[eip] = [];
                eipTypeChangesMap[eip] = [];
                eipCategoryChangesMap[eip] = [];
              }

              if (!eipStatusChangesMap[eip].includes(statusChangeString)) {
                eipStatusChangesMap[eip].push(statusChangeString);
              }
              if (!eipTypeChangesMap[eip].includes(type))
                eipTypeChangesMap[eip].push(type);
              if (!eipCategoryChangesMap[eip].includes(category))
                eipCategoryChangesMap[eip].push(category);
            });
          }

          if (data.eip && Array.isArray(data.eip)) {
            const seenEIPs = new Set();
            data.eip?.forEach((entry: any) => {
              const { eip, title, author, status, type, category, repo } =
                entry;

              if (!seenEIPs.has(eip)) {
                seenEIPs.add(eip);
                allEntries.push({
                  eip,
                  title,
                  author,
                  status,
                  type,
                  category,
                  repo,
                  statusChanges: eipStatusChangesMap[eip]?.join(", ") || "",
                  TypeChanges: eipTypeChangesMap[eip]?.join(" ") || "",
                  CategoryChanges: eipCategoryChangesMap[eip]?.join(" ") || "",
                });
              }
            });
          }

          return allEntries;
        };

        const allEntries = getallEntries(rawData);
        const parsedNodes = allEntries.flatMap(parseStatusChanges);
        setData(parsedNodes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchEIP) {
      setCameraTarget(null);
      return;
    }

    const found = data.find((n) => n.eip.startsWith(searchEIP));
    if (found) {
      const index = data.indexOf(found);
      const angle = (index / data?.length) * Math.PI * 2;
      const radius = 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (index % 3) * 2 - 2;
      setCameraTarget([x, y, z + 10]);
    }
  };

  const moveContentVertical = (direction: "up" | "down") => {
    setContentOffset((prev) => {
      const amount = direction === "up" ? 5 : -5;
      return prev + amount;
    });
  };

  const resetView = () => {
    setContentOffset(0);
    setCameraTarget(null);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // useFrame(() => {
  //   if (contentGroupRef.current) {
  //     contentGroupRef.current.position.y = THREE.MathUtils.lerp(
  //       contentGroupRef.current.position.y,
  //       contentOffset,
  //       0.1
  //     );
  //   }
  // });

  return (
    <>
      <FeedbackWidget />
      <div className="w-full h-screen bg-black text-white relative overflow-hidden">
        {loading && <Loader />}

        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <input
            type="text"
            placeholder="Search EIP"
            value={searchEIP}
            onChange={(e) => setSearchEIP(e.target.value)}
            className="p-2 text-black rounded"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-600 rounded text-white"
          >
            Go
          </button>
          {/* <button 
          onClick={resetView} 
          className="p-2 bg-green-600 rounded text-white"
        >
          Reset View
        </button> */}
        </div>

        {/* <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-4">
        <button
          onClick={() => moveContentVertical('up')}
          className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
        >
          ↑
        </button>
        <button
          onClick={() => moveContentVertical('down')}
          className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition"
        >
          ↓
        </button>
      </div> */}
        <div className="w-full h-full overflow-x-auto overflow-y-hidden">
          <div style={{ width: "2000px", height: "100%" }}>
            <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
              <ambientLight intensity={1.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.6}
                panSpeed={0.5}
                rotateSpeed={0.4}
                minDistance={5}
                maxDistance={100}
              />

              <group>
                {cameraTarget && (
                  <group>
                    <mesh position={cameraTarget}>
                      <sphereGeometry args={[0.5, 16, 16]} />
                      <meshBasicMaterial color="red" />
                    </mesh>
                  </group>
                )}

                {(() => {
                  const groupedByEIP: { [eip: string]: StatusChangeNode[] } =
                    {};

                  data?.forEach((node) => {
                    if (!groupedByEIP[node.eip]) {
                      groupedByEIP[node.eip] = [];
                    }
                    groupedByEIP[node.eip].push(node);
                  });

                  const filteredEIPs = searchEIP
                    ? Object.keys(groupedByEIP)?.filter((eip) =>
                        eip.startsWith(searchEIP)
                      )
                    : Object.keys(groupedByEIP);

                  return filteredEIPs.reverse().flatMap((eip, groupIndex) => {
                    const nodes = groupedByEIP[eip] || [];
                    return nodes?.map((node, index) => {
                      const x = index * 10;
                      const y = groupIndex * -5;
                      const z = 0;
                      return (
                        <StatusNode
                          key={`${eip}-${index}-${node.date}`}
                          node={node}
                          position={[x, y, z]}
                        />
                      );
                    });
                  });
                })()}
              </group>
            </Canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusGraph;
