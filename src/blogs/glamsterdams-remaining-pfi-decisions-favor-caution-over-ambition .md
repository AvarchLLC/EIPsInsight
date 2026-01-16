
---
title: "Glamsterdam's Remaining PFI Decisions Favor Caution Over Ambition"
slug: "glamsterdams-remaining-pfi-decisions-favor-caution-over-ambition"
date: 2026-01-16
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Ethereum", "Glamsterdam", "PFI", "Protocol Upgrades", "Governance", "Execution Layer", "State Growth"]
readTime: 6
featured: true
excerpt: "As the Glamsterdam upgrade approaches finalization, the remaining PFI (Proposed for Inclusion) decisions highlight a shift toward scope discipline, with developers prioritizing client readiness, maintainability, and execution safety over late-stage feature expansion."
image: "/blogs/glamsterdams-remaining-pfi-decisions-favor-caution-over-ambition.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
	- "PFI decisions mark the last checkpoint before Glamsterdam's final scope."
	- "Developers favored caution, client readiness, and maintainability over ambition."
	- "Key proposals deferred: EIP-8037 (state growth), EIP-7793 (conditional tx), EIP-8051 (PQ signatures)."
	- "Preference for simple, low-risk changes over complex or unproven ideas."
---

# Glamsterdam's Remaining PFI Decisions Favor Caution Over Ambition

As the [Glamsterdam](https://etherworld.co/tag/glamsterdam/) upgrade approaches finalization, the remaining PFI (Proposed for Inclusion) decisions have become the last meaningful checkpoint between exploratory design and hard fork commitment. Recent discussions show a clear shift toward scope discipline, with developers prioritizing client readiness, long-term maintainability, and execution safety over late-stage feature expansion.

These discussions mark the point where early ideas give way to firm commitments, forcing developers to weigh ambition against delivery risk.

- [EIP-8037 & the State Growth Dilemma](#eip-8037--the-state-growth-dilemma)
- [Execution Risk Pushes Conditional & Opcode Changes Out](#execution-risk-pushes-conditional--opcode-changes-out)
- [Long-Term Ideas Deemed Too Early for Glamsterdam](#long-term-ideas-deemed-too-early-for-glamsterdam)

## EIP-8037 & the State Growth Dilemma

The most consequential unresolved proposal for Glamsterdam remains [EIP-8037](https://eipsinsight.com/eips/eip-8037), which proposes increasing gas costs for state creation. Supporters argue the change is necessary to curb long-term state growth, warning that unchecked expansion could approach nearly one terabyte per year.

From this perspective, higher costs are seen as a sustainability measure rather than a performance optimization. Critics, however, cautioned that the proposal may be too aggressive or insufficiently refined for a production fork.

Concerns centered on deploying such a significant economic change without extensive mainnet validation. Parameter tuning was discussed as a potential compromise, but no alignment emerged.

Given its sensitivity and far-reaching impact, the decision was deferred to a deeper technical forum rather than finalized during the call.

## Execution Risk Pushes Conditional & Opcode Changes Out

A clear pattern emerged around proposals that modify core execution behavior. [EIP-7793](https://eipsinsight.com/eips/eip-7793), which introduces conditional transactions, was marked Deferred for Inclusion after developers raised concerns about client readiness. While the concept enables more expressive transaction flows and advanced account abstraction use cases, implementations were not mature enough to ship safely within the Glamsterdam timeline.

Similarly, [EIP-5920](https://eipsinsight.com/eips/eip-5920), proposing a PAY opcode for simplified ETH transfers, failed to gain traction. The issue was not strong opposition but lack of consensus around its urgency, semantics, and real-world value. In an upgrade cycle where scope discipline matters, proposals without strong alignment were deprioritized and removed from consideration.

<img width="1512" height="1372" alt="Image" src="https://github.com/user-attachments/assets/ab01de9c-2b41-47ec-b2e9-b5e1f1a93080" />

## Long-Term Ideas Deemed Too Early for Glamsterdam

Several proposals were deferred not due to flaws, but because they represent long-term strategic decisions. [EIP-8051](https://eipsinsight.com/eips/eip-8051), which proposes a precompile for post-quantum signature verification using ML-DSA, sparked extensive discussion around cryptographic trade-offs and future-proofing.

Despite acknowledging the importance of post-quantum readiness, developers raised concerns about prematurely locking Ethereum into a specific cryptographic standard, increasing long-term maintenance burden, and reducing cryptographic agility. Given mixed client sentiment and low urgency for Glamsterdam, the proposal was marked Deferred for Inclusion, with plans for focused future discussion outside the constraints of a production fork timeline.

Additional proposals were deferred due to lack of momentum or unresolved complexity. These included hard limits for transient storage, size-based storage gas pricing, expanded contract code size metering, and removal of initcode size limits.

In each case, the absence of new data, benchmarks, or urgency made continued inclusion difficult to justify. One notable exception was the preference for simpler alternatives where available.

In the case of contract code size limits, a straightforward parameter adjustment was favored over a more complex metering system, reinforcing the broader theme of minimizing risk. Taken together, the remaining PFI decisions reveal a clear direction.

[Glamsterdam](https://etherworld.co/tag/glamsterdam/) is being shaped less by ambition and more by restraint. The upgrade reflects a growing emphasis on stability, client readiness, and long-term maintainability, signaling a mature governance approach where choosing what not to include is as important as selecting what moves forward.