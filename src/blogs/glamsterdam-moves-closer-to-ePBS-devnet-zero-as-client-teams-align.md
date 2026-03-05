---
title: "Glamsterdam Moves Closer to ePBS Devnet Zero as Client Teams Align"
slug: "glamsterdam-moves-closer-to-epbs-devnet-zero-as-client-teams-align"
date: 2026-2-21
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Ethereum", "Glamsterdam", "ePBS", "Devnet 0", "Client Teams", "MEV", "Protocol Upgrades", "Roadmap"]
readTime: 5
featured: true
excerpt: "The focus for Glamsterdam is now squarely on ePBS Devnet 0, with client teams sharing steady progress updates."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/glamsterdam-moves-closer.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "The focus for Glamsterdam is now squarely on ePBS Devnet 0, with client teams sharing steady progress updates."
  - "Devnet 0 aims to validate multi-client interoperability for enshrined proposer-builder separation, not performance."
  - "While the ePBS spec is in alpha, teams are moving forward with Devnet 0 while refining edge cases in parallel."
  - "Enshrining PBS reduces the gap between protocol design and actual block production, moving away from external MEV Boost coordination."

---

While the broader roadmap continues to evolve, the [Glamsterdam](https://etherworld.co/all-you-need-to-know-about-ethereum-glamsterdam-upgrade/) track dominated discussions in [ACDC #175](https://etherworld.co/highlights-from-the-all-core-developers-consensus-acdc-call-175/) with a focused push toward ePBS Devnet 0 and practical client readiness. Rather than debating, core developers concentrated on implementation progress, interoperability milestones, and remaining spec questions that stand between design and execution.

- [ePBS Devnet 0 Progress](#epbs-devnet-0-progress)  
- [Client Readiness & Interoperability](#client-readiness--interoperability)  
- [Spec Status & Variable Timing Discussion](#spec-status--variable-timing-discussion)  
- [Why Enshrining PBS Matters](#why-enshrining-pbs-matters)  

## ePBS Devnet 0 Progress

The central focus of [Glamsterdam](https://etherworld.co/all-you-need-to-know-about-ethereum-glamsterdam-upgrade/) right now is [ePBS](https://etherworld.co/eip-7732-epbs-selected-as-glamsterdam-headliner/), Enshrined Proposer Builder Separation. For years, Ethereum has relied on MEV Boost to separate block building from block proposing. Builders assemble blocks, and proposers select the most profitable one. The model works, but it lives outside the protocol and depends on relays and external coordination.

Devnet 0 is the first coordinated step toward making that vision real. This initial Devnet is not designed to test performance limits. Instead, its goal is toensure multiple clients can implement the enshrined builder logic and agree on blocks under real network conditions.

## Client Readiness & Interoperability

Client teams shared steady progress updates during the call. Lighthouse has already been running local tests and working through minor issues. Early blocks have been mostly empty, but these are considered implementation details rather than structural flaws.

Other clients are progressing through pull requests and final integration steps. The shared expectation is that once two or three clients are running stable builds, Devnet 0 can launch.

There is cautious confidence that this milestone is achievable within the targeted window.

Reaching a multi-client Devnet is widely viewed as the hardest early hurdle. Once interoperability is demonstrated, iteration becomes faster and less speculative.

## Spec Status & Variable Timing Discussion

The [ePBS](https://etherworld.co/epbs-trustless-payments-locked-for-glamsterdam-v1/) specification currently sits in alpha form within the consensus specs repository. Most of the core structure is defined, but a few open discussions remain.

One of the more notable conversations centers on a variable timing parameter that affects proposer deadlines. While the proposal is still under review, it is not considered a blocker for Devnet progress.

This reflects a broader shift in Ethereum’s development culture. Rather than waiting for every parameter to be finalized before implementation begins, teams are moving forward with Devnets while refining edge cases in parallel.

## Why Enshrining PBS Matters

MEV Boost improved efficiency and created a competitive builder market, but it also introduced new dependencies. Relays became key coordination points, and censorship concerns became harder to evaluate at the protocol level.

By enshrining proposer builder separation, Ethereum reduces the gap between how block production actually works and what consensus formally guarantees. Builder markets remain competitive, but their interaction model becomes protocol defined rather than externally coordinated.