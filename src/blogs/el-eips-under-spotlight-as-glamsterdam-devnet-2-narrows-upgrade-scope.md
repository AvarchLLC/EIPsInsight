---
title: "EL EIPs Under Spotlight as Glamsterdam Devnet 2 Narrows Upgrade Scope"
slug: "el-eips-under-spotlight-as-glamsterdam-devnet-2-narrows-upgrade-scope"
date: 2026-01-16
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Ethereum","Glamsterdam","Devnet","EIPs","Execution Layer","Protocol Upgrades","Governance"]
readTime: 6
featured: true
excerpt: "A significant portion of recent developer discussions focused on refining the scope of Glamsterdam Devnet 2, with attention centered on execution layer EIPs already under testing or partial implementation. No proposal was fast-tracked, reinforcing a preference for disciplined scope control over feature expansion."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/el-eips-under-spotlight.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
---

# EL EIPs Under Spotlight as Glamsterdam Devnet 2 Narrows Upgrade Scope

A significant portion of recent developer discussions focused on refining the scope of [Glamsterdam](https://etherworld.co/tag/glamsterdam/) Devnet 2, with attention centered on execution layer EIPs already under testing or partial implementation. Developers repeatedly emphasized that even seemingly modest execution changes can have wide-ranging implications across client codebases, tooling, and analytics infrastructure.

As a result, no proposal was fast-tracked, reinforcing a preference for disciplined scope control over feature expansion.

- [EL EIPs Under Spotlight as Glamsterdam Devnet 2 Narrows Upgrade Scope](#el-eips-under-spotlight-as-glamsterdam-devnet-2-narrows-upgrade-scope)
	- [EIP-7778: Block Gas Accounting without Refunds](#eip-7778-block-gas-accounting-without-refunds)
	- [EIP-8024: Backward compatible SWAPN, DUPN, EXCHANGE](#eip-8024-backward-compatible-swapn-dupn-exchange)
	- [EIP-7708: ETH transfers emit a log](#eip-7708-eth-transfers-emit-a-log)
	- [EIP-7843: SLOTNUM Opcode](#eip-7843-slotnum-opcode)

## EIP-7778: Block Gas Accounting without Refunds

One of the most technically dense discussions centered on [EIP-7778](https://eipsinsight.com/eips/eip-7778), which proposes removing gas refund mechanics from block gas accounting. While the concept appears straightforward, developers highlighted that refund logic is deeply embedded in execution-layer assumptions.

Concerns focused on how values such as `cumulativeGasUsed` are calculated and how gas used for block limits differs from gas used for transaction payment accounting. Altering these mechanics would require coordinated updates across clients and downstream systems, increasing the risk of unintended side effects.

Given the complexity and lack of immediate urgency, the group chose not to take a decision during the call, leaving the proposal open for further analysis and testing.

## EIP-8024: Backward compatible SWAPN, DUPN, EXCHANGE

Opcode-level changes again proved difficult to resolve during discussion of [EIP-8024](https://eipsinsight.com/eips/eip-8024), which introduces backward compatible versions of `SWAPN`, `DUPN`, and `EXCHANGE`. The proposal aims to improve EVM ergonomics, particularly for compiler developers and advanced contract patterns.

However, developers flagged underspecified behavior when bytecode ends before an immediate operand is fully consumed. This raised concerns about inconsistent execution behavior across clients.

Two approaches emerged:
1. One favors a simplified semantics model that aggressively constrains edge cases.
2. The other preserves existing behavior by relying on deeper jump destination analysis.

Rather than forcing consensus, the core developers agreed to revisit this EIP in the next ACDT.

<img width="1652" height="2238" alt="Image" src="https://github.com/user-attachments/assets/d70a2546-9b96-41c6-bd2e-eae267ab7691" />

## EIP-7708: ETH transfers emit a log

By contrast, [EIP-7708](https://eipsinsight.com/eips/eip-7708) received relatively broad conceptual support. The proposal introduces logs for ETH transfers, improving observability for wallets, indexers, and analytics platforms without changing core execution semantics.

Developers agreed that logging native ETH transfers aligns better with developer expectations and existing token standards. However, open questions remain in the associated pull request, and the proposal remains formally pending.

While not fast-tracked, [EIP-7708](https://eipsinsight.com/eips/eip-7708) currently stands out as one of the stronger candidates for Glamsterdam inclusion, subject to final technical review.

## EIP-7843: SLOTNUM Opcode

[EIP-7843](https://eipsinsight.com/eips/eip-7843) introduces a SLOTNUM opcode designed to expose the current storage slot index. The proposal was broadly acknowledged as small and well-defined, with limited execution risk.

That said, developers raised concerns about the cross-layer coordination required to support a new opcode, particularly given its relatively low urgency. Supporting the change would require updates across clients, tooling, and testing frameworks.

As a result, the discussion was moved to asynchronous pull request review, allowing client teams to reason through edge cases without the pressure of real-time consensus.

---

Taken together, the [Glamsterdam](https://etherworld.co/tag/glamsterdam/) Devnet-2 discussions highlighted a clear pattern of deliberate containment. Rather than maximizing feature inclusion, developers prioritized long-term safety, clarity, and operational stability.

As Glamsterdam continues to take shape, this cautious approach is likely to define which EL EIPs ultimately make it into the upgrade.