---
title: "Top 10 EIPs That Defined Ethereum in 2025"
slug: "top-ten-eips-2025"
date: 2025-12-31
author: "Ayush Shetty"
category: "Ethereum Upgrades"
tags: ["Ethereum", "EIPs", "Pectra", "Fusaka", "Protocol Upgrades", "2025", "Roadmap", "Scaling"]
readTime: 12
featured: true
excerpt: "In 2025, Ethereum stopped rebuilding itself and started refining itself. Across Pectra and Fusaka upgrades, Ethereum shifted from heavy architectural work toward removing friction for users, developers, and operators through targeted improvements."
image: "https://github.com/user-attachments/assets/aec9e416-7f4d-4d16-8d86-50fd3567f881"
authorAvatar: "https://avatars.githubusercontent.com/u/126095015?v=4"
authorBio: "Intern at Avarch | Web3 | Software Engineer Aspirant | Senior year student at NMAMIT | Information Science Engineering"
authorTwitter: "https://x.com/_AyushShetty_"
authorLinkedin: "https://www.linkedin.com/in/ayush-shetty-88aa43247/"
authorGithub: "https://github.com/AyuShetty"
summaryPoints:
  - "Pectra (May 2025) focused on wallet UX, staking efficiency, and scaling preparation."
  - "Fusaka (December 2025) introduced PeerDAS and expanded execution capacity."
  - "EIP-7702 enabled smarter wallets without migration; EIP-7594 scaled data availability."
  - "Validator consolidation (EIP-7251) and higher gas limits (EIP-7935) improved operations."
  - "2025 marked Ethereum's shift from construction to refinement."
---

# Top 10 EIPs That Defined Ethereum in 2025

## TL;DR

In 2025, Ethereum stopped rebuilding itself and started refining itself. 

Across two major upgrades, Pectra in May and Fusaka in December, Ethereum shifted away from years of heavy architectural work and toward removing friction that users, developers and operators had learned to live with. Wallets became easier to use without changing addresses. Staking became simpler to operate at scale. Rollups became cheaper again without pushing node requirements out of reach.

All the Ethereum Improvement Proposals activated in 2025 focused on making existing ones work better together. Each change was modest in isolation, but together they reshaped how Ethereum feels to use and how safely it can grow.

This recap looks at what actually changed in 2025 how Pectra and Fusaka worked together to move Ethereum from experimentation toward dependable global infrastructure.

## The Pectra Upgrade: Laying the Foundation  
**Activated: May 7, 2025**

When [Pectra](https://eipsinsight.com/upgrade/pectra) went live in early May, it delivered the most user-focused improvements Ethereum had shipped in years. The upgrade centered on three priorities: reducing friction for everyday users, simplifying staking operations and preparing the network for the next phase of rollup scaling.

## Improving Wallet Experience

### 1. [EIP-7702: Smarter Wallets Without Migration](https://eipsinsight.com/eips/eip-7702)

EIP-7702 addressed one of Ethereum’s longest-standing usability problems:  Traditional wallets were secure but limited. This EIP allowed standard wallets to temporarily execute smart contract logic during a transaction, without requiring users to move funds or adopt new account types.

In practice, this enabled actions such as approving and swapping tokens in a single interaction, sponsoring gas fees for users and supporting more advanced wallet behavior by default. Adoption was rapid, with major wallets implementing support within weeks.

For a user, the change was subtle but important. Instead of learning how Ethereum works, the system started adapting to how people already expect apps to behave.

### 2. [EIP-2935: Onchain Access to Historical Block Data](https://eipsinsight.com/eips/eip-2935)

EIP-2935 solved another such limitation. Smart contracts could not easily verify older block hashes without relying on offchain data providers. By storing recent block hashes in a system contract, Ethereum enabled trustless historical verification, reducing complexity and cost for advanced DeFi and onchain verification use cases.


## Making Staking Operationally Efficient

### 3. [EIP-7251: Validator Consolidation](https://eipsinsight.com/eips/eip-7251)

EIP-7251 increased the maximum effective balance of a validator from 32 ETH to 2,048 ETH. This change reduced the need for large operators to manage thousands of individual validators and significantly lowered network messaging overhead.

Validator counts stopped growing uncontrollably, while total ETH staked continued to rise. Ethereum staking became easier to operate without changing its underlying security assumptions.

### 4. [EIP-7002: Programmatic Validator Exits](https://eipsinsight.com/eips/eip-7002)

EIP-7002 allowed withdrawal credentials to trigger validator exits directly. This enabled staking systems to enforce exits without relying on operator cooperation, making liquid staking and pooled staking far more robust.

This change quietly removed one of the last trust bottlenecks in staking infrastructure.

### 5. [EIP-6110: Faster Validator Activation](https://eipsinsight.com/eips/eip-6110)

Validator onboarding also became smoother. EIP-6110 moved deposit processing to the execution layer, reducing activation delays from many hours to minutes. New validators could join the network faster, and staking demand could be met without long queues.

## Preparing for Scaling

### 6. [EIP-7691: Increased Blob Throughput](https://eipsinsight.com/eips/eip-7691)

EIP-7691 expanded blob capacity as an interim scaling measure. By increasing blob targets and limits, Ethereum provided immediate relief to rollups and prevented Layer 2 fees from rising while longer-term solutions were still being finalized.

### 7. [EIP-7623: Calldata Cost Adjustment](https://eipsinsight.com/eips/eip-7623)

EIP-7623 increased calldata costs to discourage inefficient storage use and reduce worst-case block size risk. This nudged rollups toward blobs and made the network safer under high load.

### 8. [EIP-2537: BLS12-381 Precompile](https://eipsinsight.com/eips/eip-2537)

EIP-2537 added native support for BLS signature operations, aligning execution layer cryptography with the consensus layer. This reduced costs for zero-knowledge systems, bridges, and privacy-focused applications.

### Supporting Infrastructure EIPs

Several supporting EIPs improved protocol efficiency and flexibility. Cross-layer requests were standardized, blob parameters became configurable and validator messaging was made lighter. These changes reduced technical debt and made future upgrades easier to ship.


## The Fusaka Upgrade: Scaling With Confidence  
**Activated: December 3, 2025**

[Fusaka](https://eipsinsight.com/upgrade/fusaka) introduced Ethereum’s most meaningful scaling improvements since the introduction of blobs, pushing rollup capacity forward without raising the barrier to running a node.

## PeerDAS and Data Availability

### 9. [EIP-7594: Peer Data Availability Sampling](https://eipsinsight.com/eips/eip-7591)

PeerDAS changed how Ethereum verifies data availability. Nodes no longer needed to download all blob data. Instead, they sampled small portions to statistically verify availability. This shift allowed Ethereum to support far more data while keeping node requirements stable. Rollups gained substantial additional capacity, and Layer 2 fees dropped even during periods of heavy demand.

Scaling was no longer limited by what every node could download, but by what the network could safely verify.

### Blob Market Improvements

Fusaka refined blob economics and control. Blob capacity became dynamically adjustable. A minimum blob price ensured market stability. Future blob upgrades could be deployed without full hard forks.

These changes made scaling both more powerful and more adaptable.

## Expanding Execution Capacity

### 10. [EIP-7935: Higher Block Gas Limit](https://eipsinsight.com/eips/eip-7935)

The block gas limit was raised to 60 million, increasing Layer 1 execution capacity. This was made possible by earlier reductions in worst-case block risks, showing deliberate upgrade sequencing.

### Execution Safety Improvements

Limits on individual transaction gas usage and execution payload size ensured that higher throughput did not compromise network stability or block composability.


## Cryptography, Security and Developer Experience

### 11. [EIP-7951: Passkey-Based Signing](https://eipsinsight.com/eips/eip-7951)

Ethereum added native support for passkey-based transaction signing using device secure enclaves. Users could now sign transactions with familiar biometric flows, improving both usability and security, especially on mobile.

### Additional Improvements

Other changes improved cryptographic safety, added new EVM efficiency opcodes, reduced long-term storage requirements, improved block proposal coordination and simplified access to network configuration for developers.

Individually small, these changes collectively made Ethereum easier to operate and build on.


## What 2025 Changed for Ethereum

By the end of 2025, Ethereum was a noticeably smoother network.

The upgrades introduced through Pectra and Fusaka removed friction that had accumulated over years of growth. Wallet interactions became simpler, validator operations scaled without overwhelming the network & Rollups gained the data capacity they needed to remain affordable under real demand. What defines 2025 is not any single EIP, but how deliberately the changes were sequenced. Short-term improvements created room for long-term upgrades and each step reinforced the next.

Ethereum entered 2026 operating like a system designed for everyday use at scale, by people who do not need to understand its internals. That shift from construction to refinement is what makes 2025 one of the most important years in Ethereum’s evolution.
