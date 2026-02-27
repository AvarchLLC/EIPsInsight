---
title: "Hegotá Execution Layer Headliner Decision Remains Open"
slug: "hegota-execution-layer-headliner-decision-remains-open"
date: 2026-02-27
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Hegotá", "Frame Transactions", "LUCID", "Execution Layer", "Headliner"]
readTime: 5
featured: false
excerpt: "ACDE #231 left Hegotá’s execution layer headliner undecided, with Frame Transactions, LUCID, and the option of no EL headliner all still on the table."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/hegota-execution-layer-headliner.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "ACDE #231 confirmed that Hegotá’s execution layer headliner is still unsettled."
  - "Frame Transactions gained structural support but raised timing and complexity concerns."
  - "LUCID remains attractive conceptually, but many see it as immature for a headliner slot."
  - "Some client teams favor shipping Hegotá without an execution layer headliner at all."
---

While the broader roadmap continues to evolve, the [Hegotá](https://etherworld.co/tag/hegota/) track dominated discussions in [ACDE #231](https://etherworld.co/highlights-from-the-all-core-developers-execution-acde-call-231/). Client teams spent the call weighing whether the fork should carry an execution layer headliner at all, or whether architectural ambition should yield to delivery risk for this cycle.

[Hegotá](https://etherworld.co/tag/hegota/) discussions at ACDE #231 made one thing clear: the execution layer headliner is still unsettled. With Frame Transactions, LUCID, and the option of no EL headliner on the table, client teams spent the call weighing architectural ambition against delivery risk. No final decision was made, but positions are starting to harden ahead of the next milestone.

- [Frame Transactions Gain Structural Support](#frame-transactions-gain-structural-support)  
- [LUCID Faces Readiness Questions](#lucid-faces-readiness-questions)  
- [The Case for No EL Headliner](#the-case-for-no-el-headliner)  

## Frame Transactions Gain Structural Support

[EIP-8141](https://eipsinsight.com/eips/eip-8141), commonly referred to as Frame Transactions, continues to attract serious consideration. The proposal removes enshrined ECDSA signature assumptions and introduces a more flexible transaction structure built around validation and execution frames.

Supporters argue this is not just about enabling new signature schemes. It is about cleaning up long standing protocol constraints. By removing signature logic from the protocol itself and delegating validation to contracts, Ethereum could gain post quantum flexibility and more native account abstraction.

Some clients see this as overdue architectural work. Instead of adding another transaction type for every new feature, Frame Transactions aim to generalize the structure once and avoid future patchwork. For them, this is a long term move that aligns with Ethereum’s design philosophy.

At the same time, concerns remain. Several teams questioned the added complexity, especially around dev tooling and signature size. Post quantum signatures can be significantly larger, raising questions about aggregation and block design. While the proposal acknowledges these tradeoffs, not everyone is convinced the timing is right.

## LUCID Faces Readiness Questions

LUCID, the encrypted mempool proposal, remains in contention after [EIP-8141](https://eipsinsight.com/eips/eip-8141) formally withdrew in its favor. Its goal is straightforward: reduce front running and improve transaction privacy by encrypting mempool contents before inclusion.

Supporters argue this addresses a real and persistent issue in Ethereum’s execution layer. In their view, encrypted mempools would complement inclusion mechanisms like [FOCIL](https://eipsinsight.com/Blogs/why-ethereum-core-devs-removed-focil-from-glamsterdam-upgrade) and restore stronger trust assumptions around transaction ordering.

However, several client teams expressed hesitation. The concern is less about the idea itself and more about maturity. Questions around metadata exposure, implementation complexity, and ecosystem readiness continue to surface. For many, LUCID feels like a direction worth pursuing, but not necessarily one ready to anchor [Hegotá](https://etherworld.co/hegota-should-complete-the-holy-trinity-of-censorship-resistance/) today.

## The Case for No EL Headliner

A third position has gained quiet momentum, i.e., selecting no execution layer headliner at all. This option does not mean doing nothing. Smaller execution layer EIPs could still be included. It simply means that no single EL feature would justify delaying the fork if it is not ready.

Some client teams prefer this conservative route. With FOCIL already selected as the consensus layer headliner, adding a complex execution layer anchor could increase coordination risk. In their view, Hegotá does not need to carry ambitious EL changes if those changes are not yet clearly aligned.

No final call was made at ACDE #231. A breakout discussion on Frame Transactions is expected, and the next two weeks will likely determine whether [Hegotá](https://etherworld.co/all-you-need-to-know-about-ethereum-hegota-upgrade/) takes a bold architectural step or opts for a lighter execution path.

For now, the fork remains open ended, and the direction Ethereum chooses will signal how aggressively it wants to evolve its execution layer in the coming cycle.

---

Published Feb 20, 2026
