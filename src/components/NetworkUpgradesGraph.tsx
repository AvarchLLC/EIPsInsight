import { Cosmograph } from '@cosmograph/react';

// Define types for nodes and links
type Node = {
  id: string;
  label: string;
  color: string;
};

type Link = {
  source: string;
  target: string;
};

// Raw data
const rawData = [
  { date: "2021-12-09", upgrade: "Arrow Glacier", eip: "EIP-4345" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2565" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2929" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2718" },
  { date: "2021-04-15", upgrade: "Berlin", eip: "EIP-2930" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-100" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-140" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-196" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-197" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-198" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-211" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-214" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-649" },
  { date: "2017-10-16", upgrade: "Byzantium", eip: "EIP-658" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-1153" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4788" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-4844" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-5656" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-6780" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7044" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7045" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7514" },
  { date: "2024-03-13", upgrade: "Dencun", eip: "EIP-7516" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-145" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1014" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1052" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1234" },
  { date: "2019-02-28", upgrade: "Constantinople", eip: "EIP-1283" },
  { date: "2022-06-30", upgrade: "Gray Glacier", eip: "EIP-5133" },
  { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-2" },
  { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-7" },
  { date: "2016-03-14", upgrade: "Homestead", eip: "EIP-8" },
  { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-152" },
  { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1108" },
  { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1344" },
  { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-1884" },
  { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2028" },
  { date: "2019-12-07", upgrade: "Istanbul", eip: "EIP-2200" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-1559" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3198" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3529" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3541" },
  { date: "2021-08-05", upgrade: "London", eip: "EIP-3554" },
  { date: "2020-01-02", upgrade: "Muir Glacier", eip: "EIP-2384" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-145" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1014" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1052" },
  { date: "2019-02-28", upgrade: "Petersburg", eip: "EIP-1234" },
  { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3651" },
  { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3855" },
  { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-3860" },
  { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-4895" },
  { date: "2023-04-12", upgrade: "Shapella", eip: "EIP-6049" },
  { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-155" },
  { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-160" },
  { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-161" },
  { date: "2016-11-22", upgrade: "Spurious Dragon", eip: "EIP-170" },
  { date: "2016-10-18", upgrade: "Tangerine Whistle", eip: "EIP-150" },
  { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-4895" },
  { date: "2022-09-15", upgrade: "The Merge", eip: "EIP-6049" },
  { date: "2015-09-07", upgrade: "Frontier Thawing", eip: "" },
  { date: "2015-07-30", upgrade: "Frontier", eip: "" },
  { date: "2021-10-21", upgrade: "Altair", eip: "" },
];

// Create nodes and links
const nodes: Node[] = [];
const links: Link[] = [];
const upgradeMap = new Map<string, Node>();

rawData.forEach(({ upgrade, eip }) => {
  if (!upgradeMap.has(upgrade)) {
    const upgradeId = `upgrade:${upgrade}`;
    upgradeMap.set(upgrade, { id: upgradeId, label: upgrade, color: "#3498db" });
    nodes.push(upgradeMap.get(upgrade)!);
  }
  if (eip) {
    const eipId = `eip:${eip}`;
    const eipNode: Node = { id: eipId, label: eip, color: "#e74c3c" };
    nodes.push(eipNode);
    links.push({ source: `upgrade:${upgrade}`, target: eipId });
  }
});

// Graph component
const Graph = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Cosmograph
        nodes={nodes}
        links={links}
        nodeColor={(node: Node) => node.color}
        nodeSize={10}
        linkWidth={2}
        backgroundColor={"#1e1e1e"}
        // nodeLabel={(node: Node) => node.label}
      />
    </div>
  );
};

export default Graph;