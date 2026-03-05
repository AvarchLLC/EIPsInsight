---
title: "Hegota Locks in Focil as Consensus Layer Headliner"
slug: "hegota-locks-in-focil-as-consensus-layer-headliner"
date: 2026-2-21
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Ethereum", "Hegota", "Focil", "Consensus Layer", "Client Teams", "MEV", "Protocol Upgrades", "Roadmap", "FOCIL"]
readTime: 5
featured: true
excerpt: "The focus for Hegota is now squarely on FOCIL, with client teams sharing steady progress updates."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/hegota-locks-in.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "The focus for Hegota is now squarely on FOCIL, with client teams sharing steady progress updates."
  - "Devnet 0 aims to validate multi-client interoperability for enshrined proposer-builder separation, not performance."
  - "While the ePBS spec is in alpha, teams are moving forward with Devnet 0 while refining edge cases in parallel."
  - "Enshrining PBS reduces the gap between protocol design and actual block production, moving away from external MEV Boost coordination." 

---

While development work on Glamsterdam continues, the spotlight during [ACDC #175](https://etherworld.co/highlights-from-the-all-core-developers-consensus-acdc-call-175/) also turned to [Hegotá](https://etherworld.co/hegota-should-complete-the-holy-trinity-of-censorship-resistance/) as client teams moved to formally select its Consensus Layer headliner. After weeks of discussion across calls and Ethereum Magicians threads, the process narrowed to a decision point and the direction for Hegotá is now clearer.

- [Headliner Selection Process](#headliner-selection-process)  
- [FOCIL Emerges as Preferred Proposal](#focil-emerges-as-preferred-proposal)  
- [Why FOCIL Matters for Censorship Resistance](#why-focil-matters-for-censorship-resistance)  
- [What Happens Next for Hegotá](#what-happens-next-for-hegotá)  

## Headliner Selection Process

Ethereum’s current upgrade framework distinguishes between headliner and non headliner proposals. The headliner defines the central theme of the fork, while other proposals are evaluated afterward within that scope.

For Hegotá, two proposals were competing for Consensus Layer headliner status. Discussions had already narrowed the field in prior calls, and ACDC #175 served as the moment to formally align.

The tone was not contentious. Instead, it reflected weeks of prior debate reaching closure.

## FOCIL Emerges as Preferred Proposal

[FOCIL](https://etherworld.co/focil-eip-7805-cfid-with-strong-developer-community-backing/), short for Fork Choice Enforced Inclusion Lists, emerged as the clear preference among client teams.

During the call, multiple clients reaffirmed support. Community sentiment had also leaned strongly toward FOCIL in preceding discussions. With no significant objections raised at the final stage, the proposal was effectively locked in as Hegotá’s Consensus Layer headliner.

## Why FOCIL Matters for Censorship Resistance

[FOCIL](https://eipsinsight.com/eips/eip-7805?ref=etherworld.co) introduces a mechanism that allows validators to enforce the inclusion of transactions that may have been excluded by block builders.

Today, censorship resistance largely depends on competition between builders and social pressure within the ecosystem. FOCIL formalizes part of that guarantee at the protocol level. If certain valid transactions are repeatedly excluded, validators gain structured leverage through fork choice rules.

The goal is not to eliminate all censorship risk, but to raise the cost of sustained exclusion and reduce reliance on informal coordination.

## What Happens Next for Hegotá

With the headliner now selected, attention shifts toward formalizing the proposal through the standard inclusion process and refining remaining details.

Non headliner proposals can still be evaluated, but the core identity of Hegotá is now set. That clarity helps with scope discipline and engineering focus, especially as parallel work on Glamsterdam continues.

Hegotá now has a clear anchor, and the upgrade can move forward with greater certainty.