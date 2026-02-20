---
title: "After Devnet 2 Stabilizes, Ethereum Gears Up for Glamsterdam Devnet 3"
slug: "after-devnet-2-stabilizes-ethereum-gears-up-for-glamsterdam-devnet-3"
date: 2026-02-13
author: "Avarch Team"
category: "Ethereum Upgrades"
tags: ["Glamsterdam", "BAL Devnet", "eth/70", "EIP-8024", "Benchmarking", "Networking"]
readTime: 5
featured: false
excerpt: "ACDE #230 prioritized execution-layer readiness, disciplined scoping, and empirical benchmarking as Glamsterdam preparation moves into stress testing."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/after-devnet.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "BAL Devnet 2 has entered a stress phase with aggressive transaction patterns and EVM fuzzing."
  - "Parallel execution and empirical benchmarking are prioritized over adding new EIPs."
  - "eth/70 raises networking resilience questions if gas limits increase."
  - "EIP-8024 postfix encoding concerns favor incremental, branchless normalization approaches."
---

While the broader roadmap continues to evolve, the [Glamsterdam](https://etherworld.co/all-you-need-to-know-about-ethereum-glamsterdam-upgrade/) track dominated discussions in [ACDE #230](https://etherworld.co/all-you-need-to-know-about-ethereum-glamsterdam-upgrade/) with a strong emphasis on execution layer readiness, disciplined scope management, and performance validation under real-world conditions.

- [BAL Devnet 2 Enters Stress Phase](#bal-devnet-2-enters-stress-phase)  
- [Parallel Execution & Empirical Benchmarking](#parallel-execution--empirical-benchmarking)  
- [eth/70 & Networking Resilience](#eth70--networking-resilience)  
- [EIP-8024 & Encoding Caution](#eip-8024--encoding-caution)  

## BAL Devnet 2 Enters Stress Phase

[BAL Devnet 2](https://notes.ethereum.org/@ethpandaops/bal-devnet-2) recently went live as part of the [Glamsterdam](https://etherworld.co/tag/glamsterdam/) preparation process. As expected, the rollout was not entirely smooth. Some clients encountered issues tied to specific EIPs integrated into the configuration. Early devnets rarely launch perfectly, and this one was no exception.

But consensus across nodes is functioning properly, and cross-client coordination remains strong. Initial turbulence appears to be stabilizing as fixes roll out.

More importantly, [Devnet 2](https://eipsinsight.com/Blogs/el-eips-under-spotlight-as-glamsterdam-devnet-2-narrows-upgrade-scope) has moved into deliberate stress mode. Developers are aggressively spamming transactions to simulate realistic load. Uniswap-style transaction patterns are being injected to create meaningful state transitions. EVM fuzzing is being used to surface subtle opcode inconsistencies.

## Parallel Execution & Empirical Benchmarking

The most consistent theme throughout the [Glamsterdam](https://etherworld.co/glamsterdam-at-crossroads-whats-in-whats-out-whats-still-uncertain/) discussion was optimization. Parallel execution, parallel state root computation, and batched state reads have emerged as the primary engineering priorities. These optimizations directly influence how efficiently Ethereum processes blocks as activity increases.

What stands out is the experimental discipline. Client teams are running multiple configurations side by side. One baseline disables optimizations entirely. Another enables parallel execution without state prefetching. A third activates both.

This structured benchmarking allows teams to measure gains precisely. Instead of relying on projections, developers are demanding empirical evidence across implementations.

Several contributors made it clear that optimization work should take precedence over adding new EIPs to the [Glamsterdam](https://etherworld.co/2025/07/04/glamsterdam-timeline-extended-for-in-depth-eip-review/) scope.

Two EIPs were mentioned as possible additions to the [Glamsterdam](https://etherworld.co/2025/06/10/ethereum-gears-up-for-glamsterdam-with-these-proposals/) scope, including proposals adjusting state creation gas costs and increasing maximum contract size. Under different conditions, such changes might have advanced quickly.

<img width="1587" height="1706" alt="Image" src="https://github.com/user-attachments/assets/687c08a7-5ce4-4b38-9add-31946f4e0701" />

Behind the scenes, the Ethereum Foundation testing team is refactoring gas repricing infrastructure. The goal is to parameterize gas tests so repricing proposals can be evaluated more efficiently in the future. That work is substantial and time-intensive.

Expanding Devnet scope during this refactor risks slowing progress. Developers appeared aligned around keeping Devnet 3 lean.

## eth/70 & Networking Resilience

One of the most technically consequential discussions revolved around [eth/70](https://eips.ethereum.org/EIPS/eip-7975?ref=etherworld.co), a networking layer upgrade introducing partial block receipt lists. Under certain edge cases, blocks with extremely large receipt data can strain snap sync and DevP2P bandwidth limits.

These scenarios are rare today but become more relevant if gas limits increase. Technically, eth/70 does not require a hard fork. It is a networking layer change. However, including it within the [Glamsterdam](https://eipsinsight.com/Blogs/glamsterdam-scope-narrows-core-devs-confirm-cfi-dfi) coordination window ensures synchronized adoption across clients.

This coordination matters. Propagation health becomes more critical as blocks grow heavier. Some developers argued that the edge case risk is overstated. Others warned against raising gas limits before networking upgrades are widely deployed.

## EIP-8024 & Encoding Caution

[EIP-8024](https://eipsinsight.com/eips/eip-8024) also received attention. A proposed shift toward postfix encoding raised concerns about code size expansion and tooling ripple effects across the ecosystem.

The reaction leaned toward rejecting that direction. A separate proposal focused on simplifying decoding through branchless normalization received more favorable reactions. It reduces complexity without introducing broader disruption.

Ethereum’s approach here is clear. Incremental refinement is preferred over structural encoding changes during a stability-focused upgrade cycle.

---

Published Feb 13, 2026

