---
title: "Blob Parameter Only (BPO) Forks (EIP-7892)"
date: 2025-06-07
author: Yash Kamal Chaturvedi
image: https://etherworld.co/content/images/2025/06/Your-paragraph-text--1-.jpg
---


Ethereum is at a critical inflection point. With [Layer 2](https://etherworld.co/2021/09/20/ethereum-layer-2-projects-an-overview/) networks growing rapidly and blob capacity already saturated, the network must scale its data availability infrastructure urgently. Traditional hard forks are too slow and heavyweight to keep pace with real-time demand. 

That’s where Blob Parameter Only (BPO) Forks come in. By modifying only the blob target and blob limit, BPO forks enable faster, more responsive scaling while preserving decentralization and validator inclusivity. This blog explores why BPO forks are essential before Fusaka, how they work, and what paths Ethereum can take to deploy them safely and effectively.

* [Overview of BPO Forks](#overview-of-bpo-forks)
* [Why do we need BPO Forks?](#why-do-we-need-bpo-forks?)
* [Limitations of Traditional Ethereum Hard Forks](#limitations-of-traditional-ethereum-hard-forks)
* [BPO Forks Design](#bpo-forks-design)
* [Bandwidth Constraints & the Role of Solo Stakers in Blob Growth](#bandwidth-constraints-&-the-role-of-solo-stakers-in-blob-growth)
* [Why BPO Forks Are Needed Before Fusaka?](#why-bpo-forks-are-needed-before-fusaka?)
* [Proposed Upgrade Paths to BPO Forks](#proposed-upgrade-paths-to-bpo-forks)

## Overview of BPO Forks

**Blob Parameter Only (BPO) Forks** are a class of minimal, low risk hard forks designed specifically to scale Ethereum’s data availability (DA) layer by modifying only two parameters:

- **Blob Target**: The average number of blobs per block that Ethereum aims to include  
- **Blob Limit**: The maximum number of blobs allowed in a single block  

BPO forks do not alter core consensus logic, execution layer rules, or introduce new features. Instead, they provide a narrowly scoped mechanism to adjust Ethereum’s blob capacity in small, frequent, and data driven increments. This stands in contrast to traditional Ethereum hard forks, which are complex and infrequent.

The primary purpose of BPO forks is to increase the flexibility and responsiveness of the Ethereum protocol to the rapidly growing demands of [Layer 2 networks](https://etherworld.co/2022/12/07/how-layer-3-in-future-will-look-like/), without the typical operational burden associated with full protocol upgrades.

A [blob](https://etherworld.co/2024/01/22/understanding-the-blob-gas/) in Ethereum is a temporary, large data container introduced to help scale the network, especially for [Layer 2 rollups](https://etherworld.co/2023/11/02/vitalik-buterin-unveils-comprehensive-analysis-of-ethereums-diverse-layer-2-landscape-in-recent-blog-post/). Unlike regular transaction data (calldata), blobs are not executed by the Ethereum Virtual Machine and are pruned after about two weeks. They provide a cheaper and more efficient way to store data for rollups, enabling higher throughput without burdening the network's long-term storage.

## Why do we need BPO Forks? 

The need for BPO forks arises from a pressing demand to scale Ethereum's data availability layer in response to L2 growth trends. Several key factors highlight this urgency:

### 1. Explosive Growth in L2 Blob Usage

In 2024, data posted to Ethereum L1 by L2s [increased](https://dune.com/hildobby/blobs) by **183 percent**, with a significant spike in Q4. During the same period, Celestia, an alternative DA network, grew its daily posted data from **approximately 0.05 GB to over 8 GB**. This discrepancy signals that Ethereum L1 DA capacity is not keeping pace with market demand.

![g1](https://etherworld.co/content/images/2025/06/Screenshot-2025-06-04-at-9.35.04-PM.png)

![g2](https://etherworld.co/content/images/2025/06/Screenshot-2025-06-04-at-9.35.21-PM.png)

### b. Risk of Ecosystem Fragmentation

Without timely blob capacity increases, Ethereum risks losing L2s to **alternative DA layers (Alt DA)**. Developers and rollup teams have expressed concern about Ethereum’s DA congestion, which drives **higher blob fees** and limits throughput.

### c. Urgency of Continued Momentum

Vitalik Buterin and others have emphasized that delaying further [blob](https://etherworld.co/2024/01/25/eip-7516-blobbasefee-opcode/) capacity upgrades risks losing the momentum of L2 adoption. A slower upgrade cadence would inhibit new rollups like **Unichain** from launching with Ethereum native DA.  

Thus, BPO forks offer a practical mechanism to match Ethereum’s capacity with its usage needs in a timely and adaptive fashion.

## Limitations of Traditional Ethereum Hard Forks

Ethereum’s traditional approach to network upgrades is based on large, multi-feature hard forks such as [Dencun](https://etherworld.co/2024/01/18/ethereums-dencun-upgrade-successfully-deployed-2/) and [Pectra](https://etherworld.co/2025/03/05/pectra-upgrade-is-live-on-sepolia/). These major protocol changes typically occur on a cycle of 6 to 12 months and require extensive planning and coordination. 
- Every upgrade involves rigorous testing across both the consensus and execution layers, careful alignment between client teams, Layer 2 developers, node operators, and the broader ecosystem, as well as the integration of multiple features into a single release. 

_This bundling often leads to delays, scope creep, and compromises in prioritization._

![Traditional-Ethereum-Fork-Vs-BPO-Fork](https://etherworld.co/content/images/2025/06/Traditional-Ethereum-Fork-Vs-BPO-Fork.png)

While this model is effective for shipping substantial protocol improvements, it lacks agility. It is not well suited for timely, parameter-specific adjustments such as increasing blob targets or limits in response to real-time congestion or usage spikes. The long lead time between upgrades makes it difficult for Ethereum to adapt to fast-changing Layer 2 demands.

Blob Parameter Only (BPO) forks offer a sharp contrast to this model. 
- These forks minimize the surface area of change, focusing only on specific blob parameters. This reduces coordination complexity and risk. 
- More importantly, BPO forks allow Layer 2 stakeholders like [OP Labs](https://etherworld.co/2023/10/04/optimism-networks-fault-proof-testnet-advances-decentralization-goals/) and [Base](https://etherworld.co/2023/04/27/bases-first-hardfork-is-coming-up/) to actively participate in testing and advancing blob capacity upgrades. 
_Their limited scope also makes them easier to simulate on testnets and validate through devnets._

Because of these characteristics, BPO forks present an efficient and low-overhead solution for safe, iterative scaling. They enable Ethereum to remain responsive without disrupting the stability and momentum of the broader protocol roadmap.

## BPO Forks Design

The BPO model is designed with two complementary goals:
1. Support Layer 2 scaling demands by increasing [blob](https://etherworld.co/2023/02/21/0-blob-txns-omitted-from-eip-4844-in-cancun-upgrade/) throughput to ensure that transaction costs remain low and throughput remains high for rollups.
2. Preserve decentralization by ensuring [solo stakers](https://etherworld.co/2025/02/28/how-solo-stakers-focil-strengthen-censorhip-resistance-on-ethereum/) and home validators can continue to participate in the network, even as bandwidth requirements grow.

This dual priority ensures that scaling does not come at the cost of accessibility or validator diversity.

![BPO-Fork-Framework-for-Ethereum](https://etherworld.co/content/images/2025/06/BPO-Fork-Framework-for-Ethereum.png)

BPO forks are not intended to replace full hard forks. Rather, they function as an additional tool for incremental, parameter-specific tuning. They offer Ethereum the flexibility to adapt in real time to congestion patterns and L2 growth, while maintaining protocol stability and stakeholder alignment.

To ensure that [BPO forks](https://eipsinsight.com/eips/eip-7892) are applied safely and responsibly, a three-part framework is proposed:

### 1. Agreement on Solo Staker Bandwidth Requirements

There is growing consensus that [solo stakers](https://etherworld.co/2017/04/14/proof-of-stake-casper-the-friendly-ghost/) should be able to participate with at least 50 Mbps upload and download bandwidth if they are not using [MEV Boost](https://etherworld.co/2023/05/12/all-you-need-to-know-about-mev/). These figures are considered a reasonable baseline for block propagation and blob distribution.

However, this threshold is subject to ongoing debate. Critics argue that bandwidth availability varies widely across regions, with many solo stakers in major urban centers having access to less than 50 Mbps. Thus, each proposed BPO fork must take into account real-world bandwidth distribution to avoid unintentionally excluding home validators.

### 2. Proven Safety Against Reorganizations

Any increase in blob parameters must be validated through empirical analysis to ensure that it does not increase the rate of block reorganizations, particularly for solo stakers. The most relevant risk arises when bandwidth constraints prevent timely block propagation, causing solo-built blocks to be orphaned or replaced.

To assess safety, developers analyze the p999 block size (99.9th percentile) from recent mainnet activity and combine it with projected blob sizes. The result must remain within the safe bandwidth envelope for solo stakers. This modeling ensures that proposed increases do not overload the network under worst-case conditions.

### 3. Sustained Blob Congestion
A BPO fork is only justified when blobs are persistently congested, meaning demand consistently meets or exceeds the current blob target. This condition ensures that increases are data driven and necessary, not speculative.

Historical congestion analysis is typically conducted using metrics like average blob count per block. For instance, since November 2024, the network has regularly hit the 6 blob per block ceiling, indicating sustained congestion and justifying parameter increases.

## Bandwidth Constraints & the Role of Solo Stakers in Blob Growth

Solo stakers are independent Ethereum validators who typically operate their nodes from home setups. They play a foundational role in preserving Ethereum’s decentralization by ensuring that consensus power is not concentrated among institutional players. 

These stakers help maintain geographic distribution, resist censorship, and uphold the neutrality of the network. As Ethereum introduces blob-based scaling, it becomes crucial to ensure that these individuals are not excluded due to rising hardware or bandwidth requirements.

In the context of blob propagation, upload bandwidth is the main constraint for solo stakers, not download bandwidth.

A solo staker proposing a block must:
1. Receive a proposal notification from the Consensus Layer (CL).
2. Use the Execution Layer (EL) to build a block with transactions and blobs.
3. Broadcast the full block and associated blob data to peers across the network.
4. Ensure that this broadcasting completes within 4 seconds, to allow time for attestation and inclusion.

If a block is not propagated in time due to bandwidth constraints, it risks being excluded from the canonical chain, resulting in a reorganization (reorg) and missed rewards. Recent community analysis, including data from the Base team and Ethereum researchers, offers the following benchmarks:
1. Download bandwidth is typically not the issue, as most home connections support over 100 Mbps download.
2. Upload bandwidth is the bottleneck, especially when broadcasting blobs.

A frequently referenced benchmark is 50 Mbps upload bandwidth for solo stakers not using [MEV Boost](https://etherworld.co/2022/11/19/mev-boost-updates-by-flashbots/). This is based on conservative estimates that consider block size, blob count, and required propagation speed.

However, real-world measurements from Ookla’s Speedtest Global Index show that many urban regions fall below this threshold.

Montreal leads the listed cities with a median upload speed of 51.18 Mbps, followed closely by Dublin at 47.30 Mbps. New York City records a median upload speed of 36.14 Mbps, while Brussels and Berlin report lower speeds at 27.77 Mbps and 22.65 Mbps respectively. This comparison highlights significant differences in internet upload performance across major global cities.

This data suggests that relying on a 50 Mbps baseline could marginalize a significant number of solo stakers worldwide, especially in bandwidth-constrained geographies.

## Why BPO Forks Are Needed Before Fusaka?

Ethereum is facing rising pressure to scale its data availability layer, driven by the explosive growth of Layer 2 networks. While the upcoming [Fusaka](https://etherworld.co/2025/03/05/will-fusaka-be-ready-in-time-vitaliks-2025-vision/) upgrade promises long term solutions like [PeerDAS](https://etherworld.co/2025/01/21/the-state-of-peerdas-testing-progress-challenges-next-steps/), the ecosystem cannot afford to wait another year. 

Blob Parameter Only (BPO) forks offer a lightweight, immediate path to scale safely, bridging the gap between today's needs and tomorrow's architecture.

### 1. The Urgency to Scale Now

Ethereum is currently under significant pressure to scale its data availability (DA) capacity due to the rapid growth of Layer 2 (L2) networks like Base, OP Mainnet, and Unichain. These rollups rely heavily on blobs. 

However, the existing blob limit of 6 per block is already saturated, leading to rising blob fees and reduced throughput for rollups. The inability to meet this demand risks pushing L2s to explore alternative data availability solutions, weakening Ethereum's position as the primary DA layer.

### 2. Fusaka Is Not an Instant Fix

Although Fusaka will introduce PeerDAS and potentially allow a 4 to 8 times increase in blob capacity, it is not a one-click solution. Even after Fusaka goes live, developers anticipate a gradual ramp-up period, where blob parameters will be tuned based on observed network behavior. 

This means Ethereum’s scaling benefits will not materialize immediately with the release of Fusaka. In other words, the full impact of Fusaka will unfold over several months after its launch. 

### 3. Supporting Decentralization & L2 Roadmaps

An incremental [BPO-based approach](https://ethereum-magicians.org/t/blob-parameter-only-bpo-forks/22623) also helps Ethereum maintain its commitment to decentralization. By tuning blob limits carefully and verifying network behavior, Ethereum ensures that solo stakers are not excluded due to bandwidth constraints. 

It also builds confidence among rollups, who can plan their growth knowing that Ethereum’s DA layer is scaling in step with their needs. Teams like Base, OP Labs, and ETHPandaOps are already contributing to devnets, proposing EIPs, and validating changes. 

### 4. A Two-Stage Strategy for Sustainable Scaling

The ideal path forward is a two-stage scaling strategy:
- Stage 1: Use BPO forks to incrementally increase blob capacity in the short term (post-Pectra, pre-Fusaka).
- Stage 2: Introduce PeerDAS in Fusaka, then slowly raise blob parameters based on live performance.

This approach offers several benefits. It keeps blob fees low and rollup activity high, buys developers time to refine PeerDAS, and establishes a scalable governance model where Ethereum can respond to demand without waiting a full year between hard forks. 

## Proposed Upgrade Paths to BPO Forks

As Ethereum pushes forward with its rollup-centric roadmap, scaling the network’s data availability (DA) layer is no longer optional, it’s urgent. Blobs introduced via [EIP-4844 (proto-danksharding)](https://etherworld.co/2023/04/14/eip-4844-ready-for-multi-client-devnets/) are already hitting usage limits. 

Layer 2 networks, the intended consumers of blobs, are scaling faster than the base layer can currently accommodate. Ethereum developers face the challenge of increasing blob capacity without harming solo stakers or destabilizing the network. 

To address the blob capacity crunch before Fusaka and PeerDAS arrive, three distinct upgrade paths are currently under discussion for inclusion in the **Pectra hard fork**. Each option represents a different trade-off between capacity, engineering effort, safety, and rollout speed.

### Option 1: Recommended Path — 5 Target / 8 Max Blobs (with Optimizations)

This is the most ambitious but still considered safe by the Base team and other researchers. It raises the blob target to 5 and the maximum per block to 8. 

### Option 2: Minimal Safe Increase — 4 Target / 6 Max Blobs

This option raises the blob limits modestly without requiring aggressive optimizations. It could be deployed with relatively low engineering effort and carries minimal risk for solo stakers.

### Option 3: Status Quo — No Blob Parameter Change in Pectra

This option sticks with the current 3 target / 6 max configuration and defers blob scaling until Fusaka and PeerDAS are ready.

Each upgrade path must be evaluated based on the following:
1. **Network Safety** – Impact on solo staker performance and reorg risk.
2. **Engineering Complexity** – Level of implementation effort required.
3. **L2 Scalability** – Ability to support growing rollup demands.
4. **Deployment Timeline** – Readiness for the Pectra upgrade window.
5. **Community Confidence** – Degree of stakeholder consensus.

Current evidence from devnets and analysis suggests **Option 1** as the most effective, while **Option 2** is a cautious alternative. **Option 3** is considered a missed opportunity.

## Conclusion

Ethereum's long-term vision depends on its ability to act swiftly without compromising its values. Blobs have become essential infrastructure for rollups, yet current capacity is lagging behind real-world usage. Waiting for Fusaka alone is no longer an option. By aligning technical safeguards with community coordination and offering upgrade paths tailored to risk tolerance, Ethereum can meet immediate needs and stay future-ready. 
