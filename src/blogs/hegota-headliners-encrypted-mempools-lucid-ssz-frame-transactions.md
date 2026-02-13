---
title: "Hegotá Headliners: Encrypted Mempools, LUCID, SSZ Execution Blocks & Frame Transactions"
slug: "hegota-headliners-encrypted-mempools-lucid-ssz-frame-transactions"
date: 2026-02-13
author: "Avarch Team"
category: "Ethereum Upgrades"
tags: ["Hegotá", "Encrypted Mempool", "LUCID", "SSZ", "Frame Transactions", "MEV", "Censorship Resistance"]
readTime: 7
featured: false
excerpt: "ACDE #230 closed the execution headliner window for Hegotá. Four contenders — Frame Transactions, SSZ Execution Blocks, Universal Enshrined Encrypted Mempool, and LUCID — each propose different trade-offs for transaction visibility and ordering."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/after-devnet.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "ACDE #230 closed the execution headliner window; Hegotá now has four execution contenders."
  - "Encrypted mempools shift transaction visibility timing to mitigate front-running."
  - "LUCID proposes a three-layer approach combining PBS, forced inclusion, and encrypted mempools."
  - "Frame Transactions are an incremental alternative focused on richer transaction semantics."
---

At [ACDE #230](https://etherworld.co/highlights-from-the-all-core-developers-execution-acde-call-230/), the proposal window for execution layer headliners officially closed. [Hegotá](https://etherworld.co/hegota-should-complete-the-holy-trinity-of-censorship-resistance/) now has four execution layer headliner contenders: Frame Transactions, [SSZ Execution Blocks](https://eipsinsight.com/eips/eip-7807), Universal Enshrined Encrypted Mempool, and LUCID Encrypted Mempool.

Each represents a different philosophy of change. Frame Transactions extend transaction capabilities. SSZ Execution Blocks modernize structural encoding. The encrypted mempool proposals aim to reshape transaction visibility itself.

Developers must now decide whether Hegotá should refine Ethereum’s structure or fundamentally adjust how ordering information flows through the network.

- [Encrypted Mempools Move from Research to Reality](#encrypted-mempools-move-from-research-to-reality)
- [LUCID & the Censorship Resistance Trinity](#lucid--the-censorship-resistance-trinity)
- [Universal Enshrined Encrypted Mempool](#universal-enshrined-encrypted-mempool)
- [Frame Transactions: An Incremental Alternative](#frame-transactions-an-incremental-alternative)

## Encrypted Mempools Move from Research to Reality

Ethereum’s public mempool has historically provided transparency and neutrality. Anyone can observe pending transactions before inclusion. However, that same transparency enables front running and sandwich attacks.

Encrypted mempool proposals attempt to eliminate that informational asymmetry. Instead of broadcasting transactions in plaintext, users would submit encrypted payloads. Builders would commit to transaction hashes without visibility into full transaction details.

Only after a defined consensus milestone, typically beacon block attestation, would decryption keys be released. At that moment, transactions would be revealed and ordered according to fee bids.

This approach changes the timing of visibility rather than eliminating openness entirely.

## LUCID & the Censorship Resistance Trinity

[LUCID](https://ethereum-magicians.org/t/hegota-headliner-lucid-encrypted-mempool/27658) has emerged as one of the most discussed encrypted mempool proposals. Its architecture is built around what supporters describe as a censorship resistance trinity.

The first layer is proposer builder separation, preserving competitive block construction. The second is forced inclusion lists, ensuring certain transactions cannot be indefinitely excluded. The third is encrypted mempool behavior, which hides transaction details until inclusion timing is secured.

Under LUCID, transactions are encrypted before entering the mempool. Builders commit to hashes. Once the beacon block is attested, symmetric keys are released, allowing transactions to be decrypted and ordered at the top of the next block.

Importantly, LUCID keeps decryption logic largely outside the core protocol. The encryption envelope is standardized, but key management remains flexible. Decryption could be handled by the sender, a threshold committee, or a specialized service.

Supporters argue this avoids excessive enshrinement. Critics warn that flexible key coordination may introduce operational complexity.

<img width="1899" height="1107" alt="Image" src="https://github.com/user-attachments/assets/e4b027ad-a5c4-436f-9c39-308fcbc5d558" />

## Universal Enshrined Encrypted Mempool

The [Universal Enshrined Encrypted Mempool](https://ethereum-magicians.org/t/hegota-headliner-proposal-eip-8105-universal-enshrined-encrypted-mempool-eem/27448) takes a more deeply integrated approach. Rather than leaving decryption mechanisms at the edges, it embeds encrypted ordering logic more directly within Ethereum’s protocol rules.

Proponents argue that enshrinement reduces ambiguity and ensures consistent implementation across clients. Critics caution that embedding cryptographic mechanisms into the protocol core could reduce long-term agility and increase upgrade complexity if standards evolve.

This debate reflects a broader Ethereum tension between minimal enshrinement and stronger protocol guarantees.

## Frame Transactions: An Incremental Alternative

[Frame Transactions](https://eipsinsight.com/eips/eip-8141) offer a more incremental path forward. Instead of altering transaction visibility, they extend transaction structure to support more expressive execution patterns.

Recent updates have focused on compatibility with proxy-based smart accounts and refinements to opcode access for transaction parameters. Implementation work is already underway in execution specifications, and test fixtures are being developed.

Compared to encrypted mempool proposals, Frame Transactions represent evolutionary improvement rather than systemic redesign.

Client teams have now been asked to submit ranked preferences across all four headliner options, including the possibility of selecting no headliner.

These rankings will guide the next phase of narrowing. The structured preference process signals that [Hegotá](https://eipsinsight.com/Blogs/ethereum-opens-hegota-proposal-window) is entering formal selection mode rather than continuing open-ended exploration.

The final choice will shape not only the upgrade itself, but Ethereum’s broader stance on transaction visibility, MEV mitigation, and censorship resistance.

---

Published Feb 13, 2026

