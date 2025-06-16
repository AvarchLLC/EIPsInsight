---
title: "Enshrined Proposer Builder Separation (ePBS) (EIP-7732)"
date: 2025-06-16
author: Yash Kamal Chaturvedi
image: https://etherworld.co/content/images/2025/06/ePBS.jpg
---

Ethereum is getting ready for one of its most practical upgrades yet with ePBS, or Enshrined Proposer Builder Separation, under [EIP-7732](https://youtu.be/Wo7IEUCGRxU?si=fp955F0ZwLAiROix). This change rethinks how blocks are built and confirmed by separating the roles of proposing and executing blocks within the protocol itself. 

It is a move designed to make Ethereum more efficient, easier to scale, and less dependent on centralized relayers. In this blog, we walk through what ePBS actually does, how it changes validator duties, and why it matters for the future of the network. Whether you are deep in protocol development or just Ethereum curious, this guide will help you understand where things are headed.

* [What is ePBS?](#what-is-epbs)
* [Why Do We Need ePBS?](#why-do-we-need-epbs)
* [Key Architectural Changes Proposed in ePBS](#key-architectural-changes-proposed-in-epbs)
* [PBS Vs ePBS](#pbs-vs-epbs)
* [ePBS Advantages](#epbs-advantages)
* [Compatibility of ePBS with Other Ethereum Proposals](#compatibility-of-epbs-with-other-ethereum-proposals)
* [Challenges to ePBS](#challenges-to-epbs)

## What is ePBS?

Enshrined Proposer-Builder Separation (ePBS) is one of the most transformative upgrades currently being proposed in Ethereum. Defined in [EIP-7732](https://efdn.notion.site/ePBS-EIP-7732-tracker-9f85f7b086994bd79192bc72bae703a1) (currently in draft), this proposal restructures how Ethereum blocks are created by formally separating two critical roles in the block production process.

In the current system, the same validator is often responsible for both proposing the block and selecting the transactions that go into it. ePBS changes that. It splits these responsibilities into two distinct actors:

1. The **proposer** – a validator responsible for selecting and submitting the next block on the blockchain.
2. The **builder** – an entity that constructs the contents of the block by deciding which transactions to include and how to order them for maximum efficiency or value.

## Why Do We Need ePBS?

Before diving into how [ePBS](https://youtu.be/w-VwYHq1FA4?si=i32IVZWqgmzTvIC8) works, it is important to understand the problems it is designed to solve. The current setup introduces serious challenges around trust, performance, and centralization. ePBS addresses these issues directly.

### 1. Current System Issues (PBS via MEV-Boost)

Ethereum currently relies on an off-chain architecture for Proposer-Builder Separation, primarily implemented through MEV-Boost and a network of relays. While this setup enables block builders to submit payload bids, it introduces a significant trust assumption.

Validators must rely on third-party relays to pass these bids and payloads correctly. These relays are not secured by the Ethereum protocol. As a result, builders operate without native accountability, creating reliability and censorship issues that the protocol cannot detect or enforce.

### 2. Centralization Risks

The off-chain nature of MEV-Boost has led to a small number of relays and builders dominating block production. Entities such as Flashbots and Coinbase control a significant share of the network’s block building activity.

This concentration of power undermines Ethereum’s decentralized vision and creates systemic risks where a few actors influence which transactions are included or excluded from blocks. [ePBS]((https://www.youtube.com/playlist?list=PLJqWcTqh_zKHoz9dnQFGrWI_s1-8RwMhX)) addresses this by enabling builder participation directly within the protocol, reducing reliance on centralized intermediaries.

### 3. Performance Constraints

Currently, validators are expected to validate both the consensus data and the execution payload of a block in a very short window—often between one to two seconds. This places a heavy computational burden on validators, limiting scalability and the ability to increase block complexity.

This design constrains the protocol’s ability to support larger blocks or more sophisticated execution logic without risking delays or missed attestations.

### 4. Delayed Execution Benefits

ePBS introduces the ability to decouple consensus validation from execution payload validation. Validators can first validate a lightweight consensus block—which is fast to process—and handle the more resource-intensive execution payload later.

By doing so, the network improves responsiveness and scalability. Validators are no longer constrained by tight time windows for full block verification, making the protocol more resilient and performance-optimized.

## Key Architectural Changes Proposed in ePBS

Under Ethereum’s current architecture, the execution payload (which includes transaction data and state changes) is embedded directly into the consensus block. In contrast, ePBS proposes including only the **header** of the block within the consensus layer. The execution payload is revealed and validated later in the slot, which effectively separates **block building (execution)** from **block proposal (consensus)**. This mirrors the "blind block" concept used in MEV-Boost but now becomes native to Ethereum.

### 1. Slot Interval Redesign

Ethereum presently operates on a 12-second slot divided into three intervals: one for the block proposal, one for attestations, and one for aggregation. This structure is tightly packed, giving validators very limited time, often under 2 seconds to validate both consensus and execution components. 

The limited window increases the risk of missed attestations or delayed propagation under network stress. ePBS introduces a **four-interval design**:

| Time (s) | Activity |
|----------|----------|
| 0        | Slot begins |
| 3        | Beacon Attestation |
| 6        | Aggregated Attestation and Execution Payload Reveal |
| 9        | Payload Timeless Committee (PTC) Attestation |

![ePBS Timing Structure](https://etherworld.co/content/images/2025/06/Coinbase-s-6-Step-Crisis-Response.jpg)

This layout ensures the heavy lifting of execution validation is deferred, giving the network more time to handle complex data without compromising the overall slot time.

### 2. New Block Classifications

Today, Ethereum recognizes only two types of blocks:
1. Full blocks, where both the consensus and execution payload are included and valid
2. Skipped blocks, where no consensus block is proposed at all, meaning the entire block including execution is absent

This binary classification assumes that if a consensus block is valid, its execution payload must be present and valid too. If execution fails or is missing, the whole block is discarded. This tight coupling introduces fragility, especially when builders delay or fail to reveal their payloads.

ePBS introduces a third, more nuanced category: Empty blocks. These blocks contain a valid consensus header but no execution payload, either because the builder failed to reveal it on time, revealed something invalid, or chose to withhold it strategically (for example, anticipating a reorg). In such cases, the consensus part still propagates and can be finalized independently.

This change allows the chain to make forward progress even when execution data is delayed or unreliable, significantly improving network liveness and fault tolerance during high latency, network attacks, or builder failures.

### 3. Execution Pipelining and State Transition

In the current system, both consensus and execution are validated almost simultaneously, making the validator's task resource-intensive. With ePBS, these are split into two phases:

1. The consensus phase processes the block header and validates consensus rules.
2. The execution phase occurs after the payload is revealed, allowing the validator more time—up to six additional seconds—to process it.

This model improves efficiency and creates room to safely increase block complexity in the future.

### 4. Introduction of the Payload Timeless Committee (PTC)

A new committee called the **Payload Timeless Committee** is introduced. This group of validators assesses whether the execution payload was:

- Present (revealed and valid)
- Withheld (intentionally not revealed due to expected reorg)
- Absent (not submitted at all)

PTC members vote on the status of payloads and their votes are used to guide fork choice and validator rewards. These attestations are aggregated in the next block and included in the consensus data.

PTC members who vote honestly on payload status receive rewards, incentivizing their active and accurate participation. The rewards are processed similarly to beacon attesters today but are extended to reflect the extra complexity introduced in ePBS.

Two state roots are now tracked:
- Post-consensus state (after consensus block is processed)
- Post-execution state (after the execution payload is applied)

This dual-tracking ensures the correct sequence of block processing and enables finer-grained block state evaluation.

### 5. Multi-Dimensional Fork Choice Logic

The fork choice rule in Ethereum determines the canonical chain. Under ePBS, this logic is expanded from a single dimension to three:

- The block hash
- The slot number
- The reveal status of the execution payload

Attestations now include these dimensions, and the chain can differentiate between blocks that are "full" vs "empty." This more granular view helps the protocol better handle latency, withheld payloads, or invalid reveals.

## PBS Vs ePBS

PBS, or **Proposer-Builder Separation**, was originally designed to solve a growing centralization problem in Ethereum block production—especially related to MEV (Maximal Extractable Value).

Under the old system:
1. Validators had the power to both **propose a block** and **decide its transaction ordering**.
2. This gave large, well-resourced validators a **significant MEV advantage**, centralizing power and profits.
3. The outcome: validators with better infrastructure earned more, attracting more stake, increasing centralization risk.

PBS was introduced to break this coupling. The idea was simple:
- **Builders** would construct full blocks with optimized MEV strategies.
- **Proposers** (validators) would only **select from pre-built block headers**, choosing the one that offers the highest reward or benefit.

This model allowed specialized actors to focus on building, while proposers remained lightweight and impartial.

In practice, PBS was implemented **off-chain** through a system called **MEV-Boost**, developed and maintained by Flashbots.

Here’s how MEV-Boost works:
1. Validators use MEV-Boost to connect to a network of relays.
2. These relays act as intermediaries between builders and proposers.
3. Builders submit block headers and payloads to the relay.
4. Proposers select the most profitable header and submit it on-chain.

While functional, this system introduced new trust dependencies and points of failure.

By 2025, over [80% of Ethereum blocks were being proposed through MEV-Boost relays](https://ethresear.ch/t/decentralized-random-block-proposal-eliminating-mev-and-fully-democratizing-ethereum/21856). This starkly contrasted Ethereum's ethos of decentralization and neutrality.

[ePBS (Enshrined Proposer-Builder Separation)](https://ethresear.ch/t/why-enshrine-proposer-builder-separation-a-viable-path-to-epbs/15710), introduced in EIP-7732, is Ethereum’s answer to these limitations. It proposes enshrining the proposer-builder separation directly into the consensus protocol, eliminating reliance on off-chain infrastructure.

1. Builders are now first-class protocol participants.
2. Every block header contains a builder signature, public key, and payload commitment.
3. Validators no longer need to trust relays.
4. Payload visibility is enforced by the Payload Timeless Committee (PTC)—a new validator role that attests to whether a payload was correctly revealed.
5. The protocol supports block auctions (default) and can be extended to slot auctions.

![PBS Vs ePBS](https://etherworld.co/content/images/2025/06/Coinbase-s-6-Step-Crisis-Response--2-.jpg)

## ePBS Advantages

ePBS is not just a technical proposal. It reflects a deliberate shift in Ethereum’s architecture and its approach to decentralization, validator efficiency, and protocol neutrality.

First, ePBS eliminates the need for validators to trust third party relays. In the current MEV-Boost model, validators rely on external entities to deliver block headers and payloads, creating centralized choke points. ePBS addresses this by embedding builder public keys and signatures directly into the protocol, restoring Ethereum’s trust-minimized design principles.

Second, it enhances censorship resistance. By introducing payload attestations through the Payload Timeless Committee (PTC) and making builder actions auditable, ePBS allows the network to detect, report, and penalize censorship behavior. This provides the groundwork for mechanisms like inclusion lists that require the inclusion of valid but potentially censored transactions.

![ePBS-Advantages](https://etherworld.co/content/images/2025/06/ePBS-Advantages.jpg)

Third, [ePBS](https://docs.google.com/presentation/d/1-NMq36QRiCzBYK5inDiV6HQI9z2BQlGuDgUjSMwtwn4/edit?slide=id.g2f4f28a00ad_0_34#slide=id.g2f4f28a00ad_0_34) improves validator efficiency and scalability. Validators are no longer required to validate full blocks in a single step. Instead, they process consensus and execution in separate pipeline stages, giving them more time and reducing CPU bottlenecks. This enables support for larger blocks and lays the foundation for stateless execution in the future.

Finally, ePBS supports modular upgrades across Ethereum’s roadmap. Its structure is flexible enough to accommodate upcoming changes such as inclusion lists, slot auctions, data availability sampling, and the transition to a stateless architecture. By formally integrating previously off-chain logic, EPBS creates a more consistent and adaptable protocol layer.

## Compatibility of ePBS with Other Ethereum Proposals

EIP-7732, or Enshrined Proposer Builder Separation (ePBS), is designed not as a standalone change, but as a modular foundation that can support and interoperate with other major upgrades in Ethereum’s roadmap. 

### 1. Inclusion Lists (EIP 7547)

Inclusion lists enforce censorship resistance by requiring proposers to include certain transactions in a block.

**ePBS Compatibility:** Builders are now publicly identifiable and cryptographically accountable. Payload Timeless Committee (PTC) can validate whether required transactions were included. Inclusion list logic can be enforced without changing core consensus.

Inclusion lists can technically ship with ePBS, but tight integration may require builder coordination and execution layer logic refinements.

### 2. Slot Auctions vs. Block Auctions

[ePBS](https://ethresear.ch/t/a-note-on-equivocation-in-slot-auction-epbs/20331/1) is compatible with multiple builder auction models, allowing flexibility in how proposers and builders interact. There are two main types of auctions that may be used within this framework. 
- In a block auction, the proposer selects a specific block that has already been built and committed to by a builder. This model is simple and deterministic, with fixed payload commitments.
- In contrast, a slot auction allows the proposer to select a builder in advance, giving that builder the freedom to construct and reveal any valid block later in the slot. This offers more flexibility but introduces slightly more complexity in terms of timing and validation.

**ePBS Compatibility:** 
- Native support for block auctions (default behavior).
- Slot auctions are fully supported with minor spec adjustments.

### 3. Stateless Ethereum & DAS

[ePBS](https://eipsinsight.com/eips/eip-7732) aligns closely with Ethereum’s vision for stateless validation, where validators no longer need to maintain the full execution state. By decoupling execution from consensus, ePBS allows validators to process consensus blocks quickly while deferring execution, making it ideal for lightweight or resource-constrained nodes. 

This design also supports Data Availability Sampling (DAS), as the pipelined slot structure provides additional time for blob propagation and verification. As a result, delayed execution not only facilitates stateless processing but also makes DAS easier to implement within the existing consensus framework.

## Challenges to ePBS

While [EIP-7732](https://ethereum-magicians.org/t/eip-7732-enshrined-proposer-builder-separation-epbs/19634) brings architectural clarity and long-term benefits to Ethereum’s protocol, it comes with unresolved complexities. Several technical, economic, and strategic questions remain.

These challenges must be addressed before ePBS can be deployed confidently on mainnet. Below are the key areas under active discussion across client teams, researchers, and community stakeholders.

![Coinbase-s-6-Step-Crisis-Response--1--2](https://etherworld.co/content/images/2025/06/Coinbase-s-6-Step-Crisis-Response--1--2.jpg)

### 1. Block Auctions vs Slot Auctions

A major design debate is whether Ethereum should use a **block auction** or a **slot auction** model under ePBS.

In a block auction, the proposer commits to a specific block built by a builder before inclusion. This offers clarity and minimizes risk, but can be restrictive and exposes the builder’s block early.

In a slot auction, the proposer selects a builder without committing to a block. The builder then reveals the block shortly afterward. While this offers flexibility and minimizes last-second reorgs, it introduces new risks such as MEV games and builder manipulation.

The current ePBS draft supports block auctions but remains structurally compatible with slot auctions. The final model will depend on trade-offs between censorship resistance, safety, and complexity.

### 2. Inclusion List Integration: Merge or Separate?

Another debate is whether to ship **inclusion lists (EIP-7547)** alongside ePBS. Inclusion lists ensure censorship resistance by requiring certain pending transactions to be included in blocks.

ePBS is limited to the consensus layer, while inclusion lists require close coordination with the execution layer. Bundling both increases protocol complexity, stretches engineering resources, and risks delaying testnet readiness.

The community must weigh whether to ship ePBS independently or attempt a combined rollout.

### 3. Withholding Payloads: Economic Risks & Reorg Strategy

Builders under ePBS can withhold execution payloads if they believe a block is weak or likely to be reorged. While this adds flexibility, it also introduces strategic risks.

Builders may exploit this to gain economic advantage—intentionally delaying or omitting payloads, degrading block liveness, or manipulating incentives. Protocol designers must carefully define how such withholding affects rewards, fork choice, and future builder participation.

### 4. Fork Choice Complexity

ePBS expands Ethereum’s fork choice algorithm to consider not just consensus blocks, but also slot status and execution payload presence. This introduces a more sophisticated—yet more complex—fork choice system.

Scenarios like validator churn, delayed payloads, or network splits could result in inconsistent head selection. These behaviors must be tested thoroughly before mainnet deployment.

### 5. Limited Builder Feedback

Despite builders being central to [ePBS](https://hackmd.io/@potuz/rJ9GCnT1C), feedback from the builder ecosystem remains limited. Most design input has come from validators and researchers.

This risks overlooking real-world operational needs. MEV builders, Flashbots, and infrastructure operators need to review the spec and provide input on latency, signing, and bidding workflows.

### 6. Coordination Risk

Ethereum’s roadmap is highly interdependent. [ePBS](https://hackmd.io/@ttsao/H1ejTtfd3?print-pdf#/) interacts with inclusion lists, MEV mechanics, builder APIs, and fork choice logic. The temptation to bundle many features into one fork is high.

However, bundling increases implementation risk. It can delay testnet readiness, strain client resources, and obscure root causes of bugs. A modular rollout strategy may be safer and more efficient.

## Conclusion

[ePBS](https://ethresear.ch/t/epbs-design-constraints/18728) is one of Ethereum’s most technically ambitious upgrades since the Merge. It aims to decentralize block building, remove trust in off-chain relays, and optimize network performance. But the path to adoption involves trade-offs.

Key questions—around auction models, inclusion list integration, builder incentives, and fork choice behavior—must be resolved with care. The proposal is strong, but its success depends on open collaboration, cross-client implementation, and builder engagement.

The Ethereum core developer and researcher community has largely expressed strong support for ePBS. Developers view it as a technically elegant solution that directly addresses MEV centralization, execution latency, and dependence on external infrastructure. It aligns well with Ethereum’s long-term goals of decentralization and modularity.

From the validator perspective, [ePBS](https://ethresear.ch/t/the-role-of-the-p2p-market-in-epbs/20330) is also widely welcomed. Staking pools, solo stakers, and communities like ETHStaker recognize that ePBS improves auction transparency, enhances block selection autonomy, and strengthens censorship resistance—all of which benefit validator performance and neutrality.
